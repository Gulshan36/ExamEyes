// Cloudinary configuration from environment variables
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
export const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

// Validate environment variables
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  console.error('❌ Missing required Cloudinary environment variables. Please check your .env file.');
  console.error('Required variables: VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET');
  console.error('📖 See ENV_SETUP.md for detailed setup instructions');
} else {
  console.log('✅ Cloudinary configured with cloud:', CLOUDINARY_CLOUD_NAME);
}

// Cloudinary upload URL
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Default profile image
export const DEFAULT_PROFILE_IMAGE = '/src/assets/images/profile/user-1.jpg';

// Helper function to get user's profile image
export const getUserProfileImage = (userInfo) => {
  if (userInfo?.profileImage) {
    return userInfo.profileImage;
  }
  
  // Try to get from localStorage as fallback
  const savedImage = localStorage.getItem(`profileImage_${userInfo?._id}`);
  if (savedImage) {
    return savedImage;
  }
  
  return DEFAULT_PROFILE_IMAGE;
};

// Helper function to save profile image
export const saveProfileImage = (userId, imageUrl) => {
  localStorage.setItem(`profileImage_${userId}`, imageUrl);
};

// Helper function to remove profile image
export const removeProfileImage = (userId) => {
  localStorage.removeItem(`profileImage_${userId}`);
};
