import axios from 'axios';

const baseUrl = 'https://us-central1-friendgroupgame-97a07.cloudfunctions.net'; // Replace with your Firebase Functions endpoint URL

// Create a group
export const createGroup = async (userId) => {
  try {
    const response = await axios.post(`${baseUrl}/createGroup`, { userId });
    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error creating group:', error);
    throw error;
  }
};

// Join a group
export const joinGroup = async (roomCode) => {
  try {
    const response = await axios.post(`${baseUrl}/joinGroup`, { roomCode });
    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error joining group:', error);
    throw error;
  }
};

// Update ratings
export const updateRatings = async (groupId, ratings) => {
  try {
    const response = await axios.post(`${baseUrl}/updateRatings`, { groupId, ratings });
    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error updating ratings:', error);
    throw error;
  }
};
