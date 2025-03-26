/**
 * Format service name for display
 */
export const formatServiceName = (serviceId: string): string => {
  const serviceMap: { [key: string]: string } = {
    prosthetic_limbs: "Prosthetic Limbs",
    orthotic_insoles: "Orthotic Insoles for Flat Feet",
    orthopedic_footwear: "Orthopedic Footwear",
    corrective_shoes: "Corrective Shoes",
    diabetic_footwear: "Diabetic Footwear",
    custom_braces: "Custom Braces",
  };

  return serviceMap[serviceId] || serviceId;
};

/**
 * Format appointment time for display
 */
export const formatAppointmentTime = (timeId: string): string => {
  const timeMap: { [key: string]: string } = {
    morning: "Morning (8:00 AM - 12:00 PM)",
    afternoon: "Afternoon (12:00 PM - 4:00 PM)",
    evening: "Evening (4:00 PM - 6:00 PM)",
  };

  return timeMap[timeId] || timeId;
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format timestamp for display
 */
export const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) return "N/A";

  try {
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Invalid date";
  }
};

/**
 * Get status badge class based on status
 */
export const getStatusClass = (status: string): string => {
  const statusClasses: { [key: string]: string } = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
  };

  return statusClasses[status] || "bg-gray-100 text-gray-800";
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + "...";
};

/**
 * Generate a random avatar color for a user
 */
export const getAvatarColor = (name: string): string => {
  const colors = [
    "#34bdf2", // primary color
    "#2193c9",
    "#f44336", // red
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
  ];

  // Simple hash function to consistently pick a color based on name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};

/**
 * Check if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  
  // Format: (XXX) XXX-XXXX or international format
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
  }
  
  // Return original if can't format properly
  return phone;
};
