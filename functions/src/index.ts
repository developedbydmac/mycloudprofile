import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

/**
 * Cloud Function to save user profile data to Firestore
 * Secured with Firebase Auth - only authenticated users can save their own profiles
 */
export const saveUserProfile = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to save profile."
    );
  }

  const userId = context.auth.uid;
  const profileData = data.profileData;

  // Validate required fields
  if (!profileData || typeof profileData !== "object") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Profile data is required and must be an object."
    );
  }

  try {
    // Add server timestamp and user ID
    const profileWithMetadata = {
      ...profileData,
      userId: userId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastModified: new Date().toISOString(),
    };

    // Save to Firestore
    await db.collection("profiles").doc(userId).set(profileWithMetadata, {
      merge: true,
    });

    functions.logger.info(`Profile saved for user: ${userId}`);

    return {
      success: true,
      message: "Profile saved successfully",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    functions.logger.error("Error saving profile:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to save profile. Please try again."
    );
  }
});

/**
 * Cloud Function to get user profile data from Firestore
 * Secured with Firebase Auth - users can only get their own profiles
 */
export const getUserProfile = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to get profile."
    );
  }

  const userId = context.auth.uid;

  try {
    const profileDoc = await db.collection("profiles").doc(userId).get();

    if (profileDoc.exists) {
      const profileData = profileDoc.data();
      functions.logger.info(`Profile retrieved for user: ${userId}`);
      
      return {
        success: true,
        data: profileData,
        exists: true,
      };
    } else {
      functions.logger.info(`No profile found for user: ${userId}`);
      
      return {
        success: true,
        data: null,
        exists: false,
        message: "No profile found",
      };
    }
  } catch (error) {
    functions.logger.error("Error getting profile:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to get profile. Please try again."
    );
  }
});

/**
 * Cloud Function to save a public profile for sharing
 * Creates a shareable version of the profile with a unique ID
 */
export const createPublicProfile = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to create public profile."
    );
  }

  const userId = context.auth.uid;
  const profileData = data.profileData;

  if (!profileData || typeof profileData !== "object") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Profile data is required and must be an object."
    );
  }

  try {
    // Create public profile with metadata
    const publicProfile = {
      ...profileData,
      userId: userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isPublic: true,
      views: 0,
    };

    // Add to public_profiles collection
    const docRef = await db.collection("public_profiles").add(publicProfile);

    functions.logger.info(`Public profile created with ID: ${docRef.id} for user: ${userId}`);

    return {
      success: true,
      publicProfileId: docRef.id,
      message: "Public profile created successfully",
      shareUrl: `${data.baseUrl || "https://mycloudprofile.web.app"}/profile/${docRef.id}`,
    };
  } catch (error) {
    functions.logger.error("Error creating public profile:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to create public profile. Please try again."
    );
  }
});

/**
 * Cloud Function to get a public profile by ID
 * Anyone can view public profiles (no authentication required)
 */
export const getPublicProfile = functions.https.onCall(async (data, context) => {
  const profileId = data.profileId;

  if (!profileId || typeof profileId !== "string") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Profile ID is required and must be a string."
    );
  }

  try {
    const profileDoc = await db.collection("public_profiles").doc(profileId).get();

    if (profileDoc.exists) {
      const profileData = profileDoc.data();
      
      // Increment view count
      await db.collection("public_profiles").doc(profileId).update({
        views: admin.firestore.FieldValue.increment(1),
        lastViewed: admin.firestore.FieldValue.serverTimestamp(),
      });

      functions.logger.info(`Public profile viewed: ${profileId}`);

      return {
        success: true,
        data: profileData,
        exists: true,
      };
    } else {
      functions.logger.info(`Public profile not found: ${profileId}`);
      
      return {
        success: false,
        data: null,
        exists: false,
        message: "Profile not found",
      };
    }
  } catch (error) {
    functions.logger.error("Error getting public profile:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to get public profile. Please try again."
    );
  }
});

/**
 * Cloud Function to delete user profile
 * Users can only delete their own profiles
 */
export const deleteUserProfile = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to delete profile."
    );
  }

  const userId = context.auth.uid;

  try {
    // Delete user profile
    await db.collection("profiles").doc(userId).delete();

    // Also delete any public profiles created by this user
    const publicProfilesQuery = db.collection("public_profiles").where("userId", "==", userId);
    const publicProfilesSnapshot = await publicProfilesQuery.get();
    
    const batch = db.batch();
    publicProfilesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    functions.logger.info(`Profile deleted for user: ${userId}`);

    return {
      success: true,
      message: "Profile and all public profiles deleted successfully",
    };
  } catch (error) {
    functions.logger.error("Error deleting profile:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to delete profile. Please try again."
    );
  }
});

/**
 * Cloud Function triggered when a user is deleted
 * Automatically cleans up user data
 */
export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  const userId = user.uid;

  try {
    // Delete user profile
    await db.collection("profiles").doc(userId).delete();

    // Delete public profiles
    const publicProfilesQuery = db.collection("public_profiles").where("userId", "==", userId);
    const publicProfilesSnapshot = await publicProfilesQuery.get();
    
    const batch = db.batch();
    publicProfilesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    functions.logger.info(`User data cleaned up for deleted user: ${userId}`);
  } catch (error) {
    functions.logger.error("Error cleaning up user data:", error);
  }
});
