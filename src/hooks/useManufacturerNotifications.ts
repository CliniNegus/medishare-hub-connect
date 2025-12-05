import { supabase } from '@/integrations/supabase/client';

/**
 * Helper functions to create notifications for manufacturer-related events
 * All notifications are tied to the specific equipment owner (manufacturer)
 */

// Create a notification for a specific user
export const createNotificationForUser = async (
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  actionUrl?: string
) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        action_url: actionUrl,
        read: false
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error };
  }
};

// Get equipment owner ID from equipment ID
export const getEquipmentOwnerId = async (equipmentId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .select('owner_id')
      .eq('id', equipmentId)
      .single();

    if (error) throw error;
    return data?.owner_id || null;
  } catch (error) {
    console.error('Error getting equipment owner:', error);
    return null;
  }
};

// Get equipment details for notification messages
export const getEquipmentDetails = async (equipmentId: string) => {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .select('id, name, owner_id, manufacturer')
      .eq('id', equipmentId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting equipment details:', error);
    return null;
  }
};

// ==========================================
// HOSPITAL → MANUFACTURER NOTIFICATIONS
// ==========================================

/**
 * Notify manufacturer when a hospital places an order for their equipment
 */
export const notifyManufacturerNewOrder = async (
  equipmentId: string,
  orderAmount: number,
  hospitalName?: string
) => {
  const equipment = await getEquipmentDetails(equipmentId);
  if (!equipment?.owner_id) return;

  await createNotificationForUser(
    equipment.owner_id,
    'New Order Received',
    `${hospitalName || 'A hospital'} has placed an order for ${equipment.name} - KES ${orderAmount.toLocaleString()}`,
    'success',
    '/manufacturer/orders'
  );
};

/**
 * Notify manufacturer when a hospital cancels an order
 */
export const notifyManufacturerOrderCancelled = async (
  equipmentId: string,
  orderAmount: number,
  hospitalName?: string,
  reason?: string
) => {
  const equipment = await getEquipmentDetails(equipmentId);
  if (!equipment?.owner_id) return;

  const message = reason 
    ? `${hospitalName || 'A hospital'} cancelled their order for ${equipment.name}. Reason: ${reason}`
    : `${hospitalName || 'A hospital'} cancelled their order for ${equipment.name} - KES ${orderAmount.toLocaleString()}`;

  await createNotificationForUser(
    equipment.owner_id,
    'Order Cancelled',
    message,
    'warning',
    '/manufacturer/orders'
  );
};

/**
 * Notify manufacturer when payment is confirmed for an order
 */
export const notifyManufacturerPaymentConfirmed = async (
  equipmentId: string,
  orderAmount: number,
  orderId: string
) => {
  const equipment = await getEquipmentDetails(equipmentId);
  if (!equipment?.owner_id) return;

  await createNotificationForUser(
    equipment.owner_id,
    'Payment Confirmed',
    `Payment of KES ${orderAmount.toLocaleString()} has been confirmed for ${equipment.name}`,
    'success',
    '/manufacturer/orders'
  );
};

/**
 * Notify manufacturer when a hospital sends a support request (optional)
 */
export const notifyManufacturerSupportRequest = async (
  manufacturerId: string,
  subject: string,
  hospitalName?: string
) => {
  await createNotificationForUser(
    manufacturerId,
    'New Support Request',
    `${hospitalName || 'A hospital'} has submitted a support request: ${subject}`,
    'info',
    '/help-support'
  );
};

// ==========================================
// MANUFACTURER → HOSPITAL NOTIFICATIONS
// ==========================================

/**
 * Notify hospital when manufacturer accepts their order
 */
export const notifyHospitalOrderAccepted = async (
  hospitalUserId: string,
  equipmentName: string,
  manufacturerName?: string
) => {
  await createNotificationForUser(
    hospitalUserId,
    'Order Accepted',
    `Your order for ${equipmentName} has been accepted by ${manufacturerName || 'the manufacturer'}. Processing will begin shortly.`,
    'success',
    '/orders'
  );
};

/**
 * Notify hospital when manufacturer rejects their order
 */
export const notifyHospitalOrderRejected = async (
  hospitalUserId: string,
  equipmentName: string,
  reason?: string,
  manufacturerName?: string
) => {
  const message = reason
    ? `Your order for ${equipmentName} has been declined. Reason: ${reason}`
    : `Your order for ${equipmentName} has been declined by ${manufacturerName || 'the manufacturer'}.`;

  await createNotificationForUser(
    hospitalUserId,
    'Order Declined',
    message,
    'error',
    '/orders'
  );
};

/**
 * Notify hospital when order is shipped or ready for pickup
 */
export const notifyHospitalOrderShipped = async (
  hospitalUserId: string,
  equipmentName: string,
  isPickup: boolean = false
) => {
  const title = isPickup ? 'Order Ready for Pickup' : 'Order Shipped';
  const message = isPickup
    ? `Your order for ${equipmentName} is ready for pickup.`
    : `Your order for ${equipmentName} has been shipped and is on its way.`;

  await createNotificationForUser(
    hospitalUserId,
    title,
    message,
    'info',
    '/orders'
  );
};

/**
 * Notify hospital when order is completed/delivered
 */
export const notifyHospitalOrderCompleted = async (
  hospitalUserId: string,
  equipmentName: string
) => {
  await createNotificationForUser(
    hospitalUserId,
    'Order Completed',
    `Your order for ${equipmentName} has been completed successfully. Thank you for your business!`,
    'success',
    '/orders'
  );
};

/**
 * Notify hospital when order status changes to processing
 */
export const notifyHospitalOrderProcessing = async (
  hospitalUserId: string,
  equipmentName: string
) => {
  await createNotificationForUser(
    hospitalUserId,
    'Order Processing',
    `Your order for ${equipmentName} is now being processed.`,
    'info',
    '/orders'
  );
};
