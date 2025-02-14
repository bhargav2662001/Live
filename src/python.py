from flask import Flask, Response
from flask_socketio import SocketIO, emit
import cv2
import pyaudio
import wave
import json
import vosk
import threading
import queue
import base64

# Flask and SocketIO setup
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow all origins for development

# Vosk Model - Make sure you download and set the correct path
MODEL_PATH = r"C:\Users\bhargav.masimukku\Downloads\vosk-model-en-in-0.5\vosk-model-en-in-0.5"  # Update with your model path

# Initialize speech recognition model
model = vosk.Model(MODEL_PATH)
recognizer = vosk.KaldiRecognizer(model, 16000)

# Audio recording settings
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000  # Sample rate (must match Vosk)
CHUNK = 1024  # Buffer size

# Thread communication queue
audio_queue = queue.Queue()

# OpenCV - Capture Live Video
cap = cv2.VideoCapture(0)

# Function to capture audio and process speech-to-text
def audio_recognition():
    audio = pyaudio.PyAudio()
    stream = audio.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)

    print("Listening for speech...")

    while True:
        try:
            data = stream.read(CHUNK, exception_on_overflow=False)
            audio_queue.put(data)

            # Process audio in real-time
            if recognizer.AcceptWaveform(data):
                result = json.loads(recognizer.Result())
                print("Recognized:", result['text'])
                # Emit recognized text to the frontend
                socketio.emit('speech_text', {'text': result['text']})

        except KeyboardInterrupt:
            break

    stream.stop_stream()
    stream.close()
    audio.terminate()

# Function to stream video frames
def video_stream():
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Encode the frame to JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = base64.b64encode(buffer).decode('utf-8')  # Convert to base64

        # Emit the frame to the frontend
        socketio.emit('video_frame', {'frame': frame})

        # Add a small delay to control the frame rate
        socketio.sleep(0.1)

# Start audio recognition in a separate thread
audio_thread = threading.Thread(target=audio_recognition, daemon=True)
audio_thread.start()

# Start video streaming in a separate thread
video_thread = threading.Thread(target=video_stream, daemon=True)
video_thread.start()

# Flask route for testing
@app.route('/')
def index():
    return "OpenCV and Vosk Streaming Server"

# Run the Flask app with SocketIO
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)