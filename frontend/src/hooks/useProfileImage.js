import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setCredentials } from '../slices/authSlice';
import { useUpdateUserMutation } from '../slices/usersApiSlice';
import { 
  CLOUDINARY_UPLOAD_URL, 
  CLOUDINARY_UPLOAD_PRESET, 
  CLOUDINARY_CLOUD_NAME,
  getUserProfileImage,
  saveProfileImage,
  DEFAULT_PROFILE_IMAGE
} from '../config/cloudinary';

export const useProfileImage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [updateProfile] = useUpdateUserMutation();
  
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [uploading, setUploading] = useState(false);

  // Load profile image on component mount
  useEffect(() => {
    if (userInfo) {
      const image = getUserProfileImage(userInfo);
      setProfileImage(image);
    }
  }, [userInfo]);

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  // Update profile image in backend
  const updateProfileImageInBackend = async (imageUrl) => {
    try {
      const updatedUser = await updateProfile({
        _id: userInfo._id,
        profileImage: imageUrl,
      }).unwrap();
      
      dispatch(setCredentials(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Backend update error:', error);
      throw error;
    }
  };

  // Handle profile image change
  const handleImageChange = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file);
      
      // Update in backend
      await updateProfileImageInBackend(imageUrl);
      
      // Update local state
      setProfileImage(imageUrl);
      
      // Save to localStorage for persistence
      saveProfileImage(userInfo._id, imageUrl);
      
      toast.success('Profile image updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile image. Please try again.');
      console.error('Profile image update error:', error);
    } finally {
      setUploading(false);
    }
  };

  // Handle file input change
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImageChange(file);
    }
  };

  return {
    profileImage,
    uploading,
    handleFileInputChange,
    handleImageChange,
  };
};
