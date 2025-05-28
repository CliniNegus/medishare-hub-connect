
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
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });
    
    if (createError) {
      console.error("Error creating bucket:", createError);
      return false;
    }
    
    console.log("Equipment images bucket created successfully:", newBucket);
    return true;
  } catch (error) {
    console.error("Error in createEquipmentImagesBucket:", error);
    return false;
  }
};
