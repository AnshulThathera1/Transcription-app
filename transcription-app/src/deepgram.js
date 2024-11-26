import axios from 'axios';

/**
 * Function to send audio Blob to Deepgram API for transcription.
 * @param {Blob} audioBlob - The recorded audio blob.
 * @returns {Promise<string>} - The transcription text from Deepgram API.
 */
export const transcribeAudio = async (audioBlob) => {
  const formData = new FormData();

  // Append the audio blob to the FormData
  formData.append('audio', audioBlob);

  try {
    console.log('Sending audio blob to Deepgram...');
    console.log('Audio Blob Details:', {
      size: audioBlob.size,
      type: audioBlob.type,
    });

    // Send POST request to Deepgram API
    const response = await axios.post(
      'https://api.deepgram.com/v1/listen',
      formData,
      {
        headers: {
          Authorization: `Token ${process.env.REACT_APP_DEEPGRAM_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('Deepgram Response:', response.data);

    // Check if transcription exists
    if (
      response.data.results &&
      response.data.results.channels[0].alternatives[0].transcript
    ) {
      return response.data.results.channels[0].alternatives[0].transcript;
    } else {
      throw new Error('No transcription data returned by Deepgram.');
    }
  } catch (error) {
    console.error('Deepgram API Error Details:', error.response?.data || error.message);

    // Provide a user-friendly error message
    alert(
      `Error: ${error.response?.data?.err_msg || 'Unknown error occurred while processing audio.'}`
    );

    throw new Error('Error during transcription. Please try again.');
  }
};