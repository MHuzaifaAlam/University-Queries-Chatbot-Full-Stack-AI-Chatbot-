from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import tensorflow as tf
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk
from nltk.corpus import stopwords

#


# Initialize FastAPI
app = FastAPI()

# Allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load Model and Data ---
model = tf.keras.models.load_model('chatbot_model.h5')

with open('tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)

with open('label_encoder.pickle', 'rb') as handle:
    le = pickle.load(handle)

df = pd.read_csv('cleaned_data.csv')
intent_responses = dict(zip(df['Intents'], df['response1']))

lemmatizer = WordNetLemmatizer()
lemmatizer = WordNetLemmatizer()

# ✅ Safe fallback to ensure NLTK data is available
try:
    stop_words = set(stopwords.words('english'))
except LookupError:
    nltk.download('stopwords')
    nltk.download('wordnet')
    stop_words = set(stopwords.words('english'))


# --- Functions ---
def preprocess_input(text):
    tokens = text.split()
    tokens = [lemmatizer.lemmatize(word.lower()) for word in tokens if word.lower() not in stop_words]
    return " ".join(tokens)

def predict_intent(query):
    processed_text = preprocess_input(query)
    sequence = tokenizer.texts_to_sequences([processed_text])
    padded_sequence = pad_sequences(sequence, maxlen=model.input_shape[1], padding='post')
    prediction = model.predict(padded_sequence)
    predicted_label = np.argmax(prediction)
    return le.inverse_transform([predicted_label])[0]

def get_response(intent):
    return intent_responses.get(intent, "I'm sorry, I didn't understand that.")

# --- Routes ---
@app.get("/")
def home():
    return {"message": "Chatbot API is running!"}

@app.post("/chat/")
def chat(query: str):
    intent = predict_intent(query)
    response = get_response(intent)
    return {"intent": intent, "response": response}
