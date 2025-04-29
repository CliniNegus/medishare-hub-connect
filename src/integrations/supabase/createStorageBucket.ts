
import { supabase } from "./client";

export const createEquipmentImagesBucket = async () => {
  try {
    // Check if bucket exists first
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'equipment_images');
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { data, error } = await supabase.storage.createBucket('equipment_images', {
        public: true, // Make it publicly accessible
        fileSizeLimit: 5 * 1024 * 1024, // 5MB limit
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      });
      
      if (error) {
        console.error("Error creating bucket:", error);
        return false;
      }
      
      console.log("Bucket created successfully:", data);
      return true;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking/creating bucket:", error);
    return false;
  }
};
