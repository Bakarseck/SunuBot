from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil
from transcript import *
from summarize import summerize
import os


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

    # Vérification du type de fichier
    valid_content_types = [
        "text/plain",
        "application/pdf",
        "audio/mpeg",
        "audio/wav",
        "video/mp4",
    ]

    if file.content_type not in valid_content_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only .txt, .pdf, .mp3, .wav, .mp4, and .mkv are allowed."
        )

    # Définition du chemin de sauvegarde
    file_path = upload_dir / file.filename

    # Enregistrement du fichier
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error saving file.")

    # Traitement en fonction du type de fichier
    try:
        if file.content_type == "application/pdf":
            transcribed_file = pdf_to_text(file_path)
        elif file.content_type in ["audio/mpeg", "audio/wav"]:
            transcribed_file = audio_to_text(file_path)
        elif file.content_type in ["video/mp4", "video/x-matroska"]:
            audio_file = extract_audio_from_video(str(file_path))
            transcribed_file = audio_to_text(audio_file)
        elif file.content_type == "text/plain":
            _transcribed_file = transcribe_dir / file.filename
            shutil.copy(file_path, _transcribed_file)
            transcribed_file = read_text_file(_transcribed_file)
            print(transcribed_file)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type.")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error processing file.")

    # Génération du résumé
    try:
        summarized_text = summerize(str(transcribed_file))
    except Exception as e:
        
        raise HTTPException(status_code=500, detail="Error summarizing text.")

    return {
        "filename": file.filename,
        "message": "File uploaded and processed successfully",
        "transcribed_text_file": str(transcribed_file),
        "summarized_text": summarized_text
    }


