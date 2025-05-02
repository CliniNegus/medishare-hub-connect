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
      // Update bucket public access if needed
      await supabase.storage.updateBucket('equipment_images', {
        public: true
      });
      return true;
    }
    
    console.log("Creating equipment_images bucket...");
    const { error } = await supabase.storage.createBucket('equipment_images', {
      public: true,
      fileSizeLimit: 5242880 // 5MB
    });
    
    if (error) {
      console.error("Error creating bucket:", error);
      return false;
    }
    
    console.log("Equipment images bucket created successfully.");
    return true;
  } catch (error) {
    console.error("Error in createEquipmentImagesBucket:", error);
    return false;
  }
};
