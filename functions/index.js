/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();

function generateRoomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Allowed characters for the room code
    const codeLength = 6; // Length of the room code
  
    let roomCode = '';
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      roomCode += characters[randomIndex];
    }
  
    return roomCode;
}
  

// Create a group
exports.createGroup = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User is not authenticated.');
  }

  // Get the group creator's user ID
  const userId = context.auth.uid;

  // Create a new group document in Firestore
  const groupRef = await firestore.collection('groups').add({
    creator: userId,
    // Add any other group details you need
  });

  // Generate a room code
  const roomCode = generateRoomCode(); // Implement your own room code generation logic

  // Update the group document with the room code
  await groupRef.update({ roomCode });

  // Return the room code to the group creator
  return { roomCode };
});



// Join a group
exports.joinGroup = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User is not authenticated.');
  }

  const { roomCode } = data;

  // Check if the provided room code exists in Firestore
  const querySnapshot = await firestore.collection('groups').where('roomCode', '==', roomCode).get();

  if (querySnapshot.empty) {
    throw new functions.https.HttpsError('not-found', 'Group not found.');
  }

  const group = querySnapshot.docs[0];

  // Add the user to the group members
  await group.ref.collection('members').doc(context.auth.uid).set({
    // Add any other member details you need
  });

  // Return success message
  return { message: 'Successfully joined the group.' };
});

// Update ratings
exports.updateRatings = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User is not authenticated.');
  }

  const { groupId, ratings } = data;

  // Update the ratings in the group document
  await firestore.collection('groups').doc(groupId).update({ ratings });

  // Return success message
  return { message: 'Ratings updated successfully.' };
});

// Add other backend functions as needed

