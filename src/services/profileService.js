import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './auth';

// Save user profile to Firestore
export const saveProfile = async (userId, profileData) => {
  try {
    const profileRef = doc(db, 'profiles', userId);
    const profileWithTimestamp = {
      ...profileData,
      updatedAt: serverTimestamp(),
      userId
    };
    
    await setDoc(profileRef, profileWithTimestamp, { merge: true });
    return { success: true, data: profileWithTimestamp };
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

// Get user profile from Firestore
export const getProfile = async (userId) => {
  try {
    const profileRef = doc(db, 'profiles', userId);
    const profileSnap = await getDoc(profileRef);
    
    if (profileSnap.exists()) {
      return { success: true, data: profileSnap.data() };
    } else {
      // Return default profile if none exists
      return { 
        success: true, 
        data: getDefaultProfile() 
      };
    }
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
};

// Save profile as public (for sharing)
export const savePublicProfile = async (userId, profileData) => {
  try {
    const publicProfilesRef = collection(db, 'public_profiles');
    const publicProfile = {
      ...profileData,
      userId,
      createdAt: serverTimestamp(),
      isPublic: true
    };
    
    const docRef = await addDoc(publicProfilesRef, publicProfile);
    return { success: true, id: docRef.id, data: publicProfile };
  } catch (error) {
    console.error('Error saving public profile:', error);
    throw error;
  }
};

// Get default profile structure
export const getDefaultProfile = () => ({
  name: 'My Awesome Profile',
  avatar: '😎',
  backgroundColor: '#6366f1',
  textColor: '#ffffff',
  fontSize: '16',
  fontFamily: 'Arial, sans-serif',
  musicLink: '',
  bio: 'Welcome to my profile!',
  theme: 'MySpace Dark',
  customStyles: {},
  createdAt: new Date().toISOString()
});

// Export profile as JSON
export const exportProfileAsJSON = (profileData) => {
  const exportData = {
    ...profileData,
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `mycloudprofile-${profileData.name || 'profile'}-${Date.now()}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

// Import profile from JSON
export const importProfileFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const profileData = JSON.parse(e.target.result);
        // Remove timestamp fields that shouldn't be imported
        delete profileData.createdAt;
        delete profileData.updatedAt;
        delete profileData.exportedAt;
        delete profileData.userId;
        
        resolve(profileData);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};
