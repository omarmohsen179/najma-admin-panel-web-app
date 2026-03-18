import { ImageBaseUrl } from "app/services/config";

// Helper function to build full file URL with backend endpoint
export const buildFileUrl = (path) => {
  if (!path || path === 'N/A') return null;
  
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Ensure ImageBaseUrl has trailing slash
  const baseUrl = ImageBaseUrl.endsWith('/') ? ImageBaseUrl : ImageBaseUrl + '/';
  
  // Remove leading slash from path if present (to avoid double slashes)
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Construct full URL: http://localhost:5000/Uplode/...
  return baseUrl + cleanPath;
};

// Full-screen image viewer
export const showFullScreenImage = (imageSrc) => {
  // Create modal overlay
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    cursor: pointer;
  `;
  
  // Create image container
  const imageContainer = document.createElement("div");
  imageContainer.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    position: relative;
  `;
  
  // Create image element
  const img = document.createElement("img");
  img.style.cssText = `
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  `;
  img.src = imageSrc;
  img.alt = "Document image";
  
  // Create close button
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "×";
  closeButton.style.cssText = `
    position: absolute;
    top: -15px;
    right: -15px;
    width: 40px;
    height: 40px;
    background: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    z-index: 10001;
  `;
  
  // Close modal function
  const closeModal = () => {
    document.body.removeChild(modal);
    document.body.style.overflow = "";
  };
  
  // Event listeners
  modal.addEventListener("click", closeModal);
  closeButton.addEventListener("click", (e) => {
    e.stopPropagation();
    closeModal();
  });
  
  // Prevent closing when clicking on image
  imageContainer.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  
  // ESC key to close
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", handleKeyDown);
    }
  };
  document.addEventListener("keydown", handleKeyDown);
  
  // Assemble modal
  imageContainer.appendChild(img);
  imageContainer.appendChild(closeButton);
  modal.appendChild(imageContainer);
  
  // Prevent body scroll
  document.body.style.overflow = "hidden";
  
  // Add to page
  document.body.appendChild(modal);
};

export const getStatusColor = (status) => {
  switch (status) {
    case 0: return "warning"; // Pending
    case 1: return "success"; // Confirmed
    case 2: return "info";    // Purchased
    case 3: return "error";   // Cancelled
    default: return "default";
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 0: return "Pending";
    case 1: return "Confirmed";
    case 2: return "Purchased";
    case 3: return "Cancelled";
    default: return "Unknown";
  }
};

export const getTransactionTypeText = (type) => {
  switch (type) {
    case 0: return "Cash";
    case 1: return "Installment";
    default: return "Unknown";
  }
};

export const getClientSexText = (sex) => {
  switch (sex) {
    case 0:
      return "Male";
    case 1:
      return "Female";
    default:
      return "Unknown";
  }
};

export const getPackageTypeText = (type) => {
  switch (type) {
    case 0:
      return "Silver";
    case 1:
      return "Gold";
    default:
      return "Unknown";
  }
};

export const formatClientMonthlyIncome = (income) => {
  if (income === null || income === undefined || income === "") {
    return "N/A";
  }

  const numericIncome = Number(income);
  if (Number.isNaN(numericIncome)) {
    return income;
  }

  return numericIncome.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

// Get current user's AdminType from localStorage
export const getCurrentUserAdminType = () => {
  try {
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    if (accessToken && accessToken.user) {
      return accessToken.user.AdminType;
    }
    return null;
  } catch (error) {
    console.error("Error getting user AdminType:", error);
    return null;
  }
};
