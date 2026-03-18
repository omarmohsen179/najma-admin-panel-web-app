import { createQueryString } from "app/services/SharedData";
import REQUEST from "../../services/Request";

export const GET_UNITS = async (data) => {
  console.log(data);
  return await REQUEST({
    method: "GET",
    url: "unit?" + createQueryString(data),
  });
};
export const EDIT_UNIT = async (data) => {
  console.log("EDIT_UNIT API called with data:", data);
  
  // Backend expects IFormFile (multipart/form-data) for both insert and update
  // Always use FormData, even if there are no files
  const formData = new FormData();
  
  // Remove navigation properties that shouldn't be sent to API
  const cleanData = { ...data };
  delete cleanData.Project;
  delete cleanData.Reservations;
  delete cleanData.PaymentPlans;
  
  // Append all fields to FormData with proper type conversion
  Object.keys(cleanData).forEach(key => {
    const value = cleanData[key];
    
    // Skip Files field - we'll handle it separately
    if (key === 'Files') {
      return;
    }
    
    // Handle null/undefined values
    if (value === null || value === undefined) {
      formData.append(key, '');
    }
    // Handle File objects (shouldn't happen here, but just in case)
    else if (value instanceof File) {
      formData.append(key, value);
    }
    // Handle Date objects
    else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    }
    // Handle arrays (but not File arrays - those are handled separately)
    else if (Array.isArray(value)) {
      // Skip arrays of strings (like server file paths)
      if (value.length > 0 && typeof value[0] === 'string') {
        // Don't append server file paths
        return;
      }
      // For other arrays, stringify them
      formData.append(key, JSON.stringify(value));
    }
    // Handle objects (but not File objects)
    else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    }
    // Handle primitive values (numbers, strings, booleans)
    else {
      // Convert to string for FormData (numbers will be converted back by backend)
      formData.append(key, String(value));
    }
  });
  
  // Append files if they exist and are File objects
  if (cleanData.Files && Array.isArray(cleanData.Files) && cleanData.Files.length > 0) {
    cleanData.Files.forEach((file) => {
      if (file instanceof File) {
        formData.append('Files', file);
      }
    });
  }
  
  // Log FormData contents for debugging
  console.log("Sending FormData with fields:");
  for (let pair of formData.entries()) {
    if (pair[1] instanceof File) {
      console.log(`${pair[0]}: [File] ${pair[1].name}`);
    } else {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  }
  
  return await REQUEST({
    method: data.Id > 0 ? "PUT" : "POST",
    url: "unit",
    data: formData,
    // Don't set Content-Type header - let axios set it automatically with boundary
  });
};

export const DELETE_UNIT = async (id) => {
  return await REQUEST({
    method: "DELETE",
    url: "unit/" + id,
  });
};

export const UPLOAD_UNIT_IMAGES = async (unitId, files) => {
  console.log("UPLOAD_UNIT_IMAGES API called with unitId:", unitId, "files:", files);
  
  // Create FormData for file upload
  const formData = new FormData();
  
  // Append files
  files.forEach((file) => {
    formData.append(`Files`, file);
  });
  
  return await REQUEST({
    method: "POST",
    url: `unit/${unitId}/upload-images`,
    data: formData,
    // Don't set Content-Type header - let axios set it automatically with boundary
  });
};

export const BLOCK_UNIT = async (unitId, blockedUntilUtc) => {
  console.log("BLOCK_UNIT API called with unitId:", unitId, "blockedUntilUtc:", blockedUntilUtc);
  
  return await REQUEST({
    method: "POST",
    url: `Unit/${unitId}/block`,
    data: {
      blockedUntilUtc: blockedUntilUtc
    }
  });
};
