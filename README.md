# University Queries Chatbot: End-to-End NLP System

### An automated intelligent response system designed to streamline university student support. This project features a Deep Learning backend using LSTMs for intent recognition, served via a high-performance FastAPI layer, and a modern, responsive React conversational interface.

## 🌟 Key Features

### Deep Learning Intent Recognition: Utilizes a Long Short-Term Memory (LSTM) network to understand student queries and map them to appropriate university departments/responses.

### High-Performance API: Leverages FastAPI for asynchronous request handling, ensuring low-latency communication between the UI and the ML model.

### Real-Time Conversational UI: A React-based frontend providing a smooth, "human-like" chat experience with instant feedback.

### Automated Preprocessing: Custom NLP pipeline for tokenization, lemmatization, and padding to prepare raw student text for model inference.

## 🛠 Tech Stack

### Frontend: React.js, Tailwind CSS, Axios

### Backend: FastAPI (Python), Uvicorn

### Machine Learning: TensorFlow, Keras, NLTK, NumPy, Scikit-learn

### Deployment: Vercel (Frontend), Render/Railway (Backend)

### 🏗 System Architecture

### Preprocessing Layer: Raw text is cleaned using NLTK, tokenized, and converted into sequences.

### Inference Layer: The trained .h5 LSTM model predicts the intent category based on the input sequence.

### API Layer: FastAPI receives JSON payloads from React, triggers the inference, and returns the categorized response.

### UI Layer: React manages the message state and renders the conversation thread in real-time.

## 📊 Model Performance

### Architecture: Embedding Layer -> LSTM (128 units) -> Dropout (0.5) -> Dense (Softmax).

### Optimizer: Adam

### Loss Function: Categorical Crossentropy

### Accuracy: Achieved 85% on the intent classification dataset.

## 🚀 Getting Started

### 1. Backend Setup (FastAPI)

### cd backend
### pip install -r requirements.txt
### uvicorn main:app --reload


### 2. Frontend Setup (React)

### cd frontend
### npm install
### npm run dev


### 📸 Technical Demo

### Live Link: [Your Vercel/Live Link Here]

### API Endpoint: POST /chat - Accepts {"message": "string"} and returns {"response": "string", "intent": "string"}.

## 🧠 Challenges Overcome

## Cold Starts: Optimized model loading in FastAPI to ensure the first query doesn't time out.

## State Management: Handled complex message arrays in React to maintain conversation history without performance lag.
