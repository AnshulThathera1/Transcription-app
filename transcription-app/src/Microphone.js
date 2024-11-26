import React, { useState } from 'react';

const Microphone = ({ onAudioCaptured }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('getUserMedia is not supported in this browser.');
        return;
    }

    try {
        // Reset previous states
        setAudioChunks([]); // Clear previous audio data
        if (mediaRecorder) {
            mediaRecorder.onstop = null; // Remove old event listeners
            mediaRecorder.ondataavailable = null;
            setMediaRecorder(null); // Clear the previous recorder
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const options = { mimeType: 'audio/webm' };
        const recorder = new MediaRecorder(stream, options);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                setAudioChunks((prev) => [...prev, e.data]);
            }
        };

        recorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

            if (audioBlob.size === 0) {
                alert('Recording failed: Audio blob is empty. Please try again.');
                return;
            }

            onAudioCaptured(audioBlob); // Pass the Blob to the parent component
            setAudioChunks([]); // Clear audio data for the next recording
        };

        recorder.start();
        setIsRecording(true);
    } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Could not access your microphone. Please check your permissions.');
    }
  };



  const stopRecording = () => {
    if (!mediaRecorder) {
        console.error('No active recording to stop.');
        alert('Recording is not active. Please start recording first.');
        return;
    }

    try {
        mediaRecorder.stop(); // Stop the MediaRecorder
        setIsRecording(false); // Update recording state
    } catch (error) {
        console.error('Error stopping the recorder:', error);
        alert('An error occurred while stopping the recording. Please try again.');
    } finally {
        setMediaRecorder(null); // Clear the recorder instance
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`${
          isRecording ? 'bg-red-600' : 'bg-green-600'
        } px-8 py-4 rounded-full text-white font-bold text-xl shadow-lg transition-transform transform hover:scale-110`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {isRecording && (
        <div className="mt-4 animate-pulse text-sm">
          <div className="record-indicator text-center">
            🎤 Recording in progress...
          </div>
        </div>
      )}
    </div>
  );
};

export default Microphone;