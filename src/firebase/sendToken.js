// src/firebase/sendToken.js
import axios from 'axios';

export const sendTokenToBackend = async (userId, deviceToken, jwtToken) => {
  try {
    await axios.post('https://localhost:7068/api/user/device-token', {
      userId,
      token: deviceToken
    });
    console.log('FCM token sent to backend');
  } catch (error) {
    console.error('Failed to send FCM token:', error);
  }
};
