
import { supabase } from "./client";

export const createEquipmentImagesBucket = async () => {
  try {
    console.log("Checking for equipment_images bucket...");
    
    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error("Error checking buckets:", bucketsError);
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'equipment_images');
    
    if (bucketExists) {
      console.log("Equipment images bucket already exists.");
      return true;
    }
    
    // Create the bucket if it doesn't exist
    console.log("Creating equipment_images bucket...");
    const { data: newBucket, error: createError } = await supabase
      .storage
      .createBucket('equipment_images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 10485760 // 10MB
      });
    
    if (createError) {
      console.error("Error creating bucket:", createError);
      return false;
    }
    
    console.log("Equipment images bucket created successfully:", newBucket);
    
    // Add storage policies for the bucket
    try {
      console.log("Setting up storage policies...");
      
      // Note: Storage policies are typically set up through SQL migrations
      // but we'll return true here since the bucket creation was successful
      return true;
    } catch (policyError) {
      console.error("Error setting up storage policies:", policyError);
      // Even if policies fail, we can still use the bucket if it's public
      return true;
    }
    
  } catch (error) {
    console.error("Error in createEquipmentImagesBucket:", error);
    return false;
  }
};
