import React, { useState } from 'react';
import Microphone from './Microphone';
import { transcribeAudio } from './deepgram';

const App = () => {
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleAudioCaptured = async (audioBlob) => {
    try {
      setIsTranscribing(true);
      setTranscription('');
      const text = await transcribeAudio(audioBlob);
      setTranscription(text);
    } catch (error) {
      console.error('Error during transcription:', error);
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-indigo-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-8">🎙️ Audio Transcription</h1>
      <Microphone onAudioCaptured={handleAudioCaptured} />
      {isTranscribing && (
        <div className="loading-container mt-8">
          <div className="loading-circle"></div>
          <p className="mt-4 text-lg">Transcribing...</p>
        </div>
      )}
      {transcription && (
        <div className="transcription-box mt-8 p-6 bg-white rounded-lg shadow-lg text-black w-3/4">
          <h2 className="text-2xl font-semibold mb-4">Transcription:</h2>
          <p className="text-lg">{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default App;
