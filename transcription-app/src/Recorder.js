import Recorder from 'recorder-js';

const recorder = new Recorder(audioContext, {
  onAnalysed: data => console.log(data), // Optional
});

recorder.init(stream).then(() => {
  recorder.start().then(() => {
    console.log('Recording...');
  });
});

// Stop recording and generate WAV blob
recorder.stop().then(({ blob }) => {
  onAudioCaptured(blob);
});
