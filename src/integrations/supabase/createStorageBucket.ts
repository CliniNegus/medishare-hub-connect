
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
    
    console.log("Equipment images bucket does not exist, but this should not happen since it was created via SQL.");
    return false;
  } catch (error) {
    console.error("Error in createEquipmentImagesBucket:", error);
    return false;
  }
};
