# Sunubot

## Description  
Sunubot is an innovative platform that enables users to work with videos, audio files, and PDF documents. It allows for the extraction of transcriptions, the generation of summaries, and interaction with the content through questions. Designed for journalists, students, and teachers, Sunubot makes accessing information quick and efficient.

## Features  
- **Transcription**: Extracts transcriptions from videos and audio files using OpenAI Whisper API.  
- **Summarization**: Generates concise summaries from lengthy texts or documents using OpenAI GPT.  
- **Interactive Q&A**: Allows users to ask questions and get relevant answers based on the uploaded content.  
- **Translation**: Translates text content into multiple languages using AI-powered translation tools.  
- **Multi-Platform Access**: Available on the web, mobile devices, and WhatsApp via a bot.

## Tech Stack  
### Backend  
- **FastAPI (Python)**: Used for building the API.  
- **OpenAI Whisper API**: For transcription services.  
- **OpenAI GPT**: For content summarization, translation, and answering user questions.

### Frontend  
- **JavaScript**: For the WhatsApp bot.  
- **Next.js**: For building the website.  
- **Flutter**: For the mobile application.

## Resources

### Whisper (OpenAI)  
Whisper is a robust automatic speech recognition (ASR) system with the following capabilities:  
- **Noise Tolerance**: Whisper performs well in noisy environments, ensuring accurate transcription even with background noise.  
- **Robustness**: It can handle diverse accents, dialects, and languages, making it versatile for global use.  
- **Model Size**: Whisper offers multiple model sizes (tiny, base, small, medium, large) to balance between speed and accuracy.  
- **Documentation**: For more details, visit the [Whisper documentation](https://platform.openai.com/docs/guides/speech-to-text).  

### ChatGPT (OpenAI)  
ChatGPT provides advanced natural language processing (NLP) capabilities, including:  
- **Summarization**: It can generate concise summaries from large volumes of text.  
- **Interactive Q&A**: Users can ask context-specific questions and get detailed responses.  
- **Versatility**: ChatGPT supports various languages and can adapt to different tones and styles.  
- **Documentation**: For more information, visit the [ChatGPT documentation](https://platform.openai.com/docs/guides/text-generation).  

## Prerequisites  
- **Python** (version 3.10 or higher)  
- **Node.js** (version 16 or higher)  
- **Flutter** (latest stable version)  
- **FastAPI** (latest version)  

## Installation  

### Backend Setup  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/Bakarseck/SunuBot.git
  
