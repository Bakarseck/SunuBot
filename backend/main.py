from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil
from transcript import *
from summarize import summerize
import os


app = FastAPI()

# Allow all origins for CORS (configure as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories for uploaded and transcribed files
upload_dir = Path("upload_files")
transcribe_dir = Path("file_transcribed")
upload_dir.mkdir(exist_ok=True)
transcribe_dir.mkdir(exist_ok=True)

@app.get("/model/test/")
async def test_endpoint():
    return {"message": "FastAPI fonctionne bien !"}

@app.post("/model/upload/")
async def upload_file(file: UploadFile = File(...)):
    # Check the file type (optional validation, customize as needed)
    valid_content_types = [
        "text/plain",         # Text files
        "application/pdf",    # PDF files
        "audio/mpeg",         # MP3 audio
        "audio/wav",          # WAV audio
        "video/mp4",          # MP4 video
    ]

    if file.content_type not in valid_content_types:
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Only .txt, .pdf, .mp3, .wav, .mp4, and .mkv are allowed."
        )

    # Define the file path
    file_path = upload_dir / file.filename

    # Save the file to the upload directory
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Process file based on content type
    if file.content_type == "application/pdf":
        # Call pdf_to_text for PDF files
        transcribed_file = pdf_to_text(file_path)
    elif file.content_type in ["audio/mpeg", "audio/wav"]:
        # Call audio_to_text for audio files
        transcribed_file = audio_to_text(file_path)
    elif file.content_type in ["video/mp4", "video/x-matroska"]:
        # Extract audio and then transcribe it for video files
        audio_file = extract_audio_from_video(str(file_path))
        transcribed_file = audio_to_text(audio_file)
    elif file.content_type == "text/plain":
        # If it's a plain text file, save it directly to file_transcribed
        transcribed_file = transcribe_dir / file.filename
        shutil.copy(file_path, transcribed_file)
        print(f"Text file saved directly in {transcribed_file}")
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only .pdf, .mp3, .wav, .mp4, .mkv, and .txt are supported."
        )
    summarized_text = summerize(str(transcribed_file))
    return {
        "filename": file.filename,
        "message": "File uploaded and processed successfully",
        "transcribed_text_file": str(transcribed_file),
        "summarized_text": summarized_text
    }


#audio = extract_audio_from_video("upload_files/video.mp4")
#content = audio_to_text("file_transcribed/video.mp3")
#content = pdf_to_text("upload_files/fi_dew.pdf")
# audio = extraire_audio("audio/video.mp4", "audio/audio_t.mp3")
#text = transcrire_audio("audio/hymne_SN.mp3")
#print("traytuwd: ", text.text)
#summ = summerize(text.text)
#print(summ)

