from moviepy.editor import VideoFileClip
from dotenv import load_dotenv
import openai
import os
import fitz  

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def extract_audio_from_video(video_file):
    clip = VideoFileClip(video_file)
    file = get_file_name(video_file, "mp3")
    clip.audio.write_audiofile(file)
    print(f"Audio extracted and saved in {file}")
    return file

def read_text_file(file_path):
    """Lit le contenu d'un fichier texte et le retourne sous forme de chaîne de caractères."""
    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()
    return content

def audio_to_text(audio_file):
    with open(audio_file, "rb") as file:
        transcription = openai.Audio.transcribe("whisper-1", file)    
    file_name = get_file_name(audio_file, "txt")
    with open(file_name, 'w', encoding='utf-8') as file:
        file.write(transcription.text)
        print(f"text of audio is extracted and saved in {file_name}")

    return transcription

def pdf_to_text(file_pdf):
    doc = fitz.open(file_pdf)  
    file_name = get_file_name(file_pdf, "txt")
    texte_final = ""
    with open(file_name, "w", encoding="utf-8") as file:
        for page_num in range(doc.page_count):
            page = doc.load_page(page_num)
            texte = page.get_text("text")
            texte_final += texte + "\n\n"
            file.write(texte)
            file.write("\n\n") 
            
    doc.close()
    print(f"text of pdf is extracted and saved in {file_name}")
    return texte_final

def get_file_name(path, ext):
    print(path, os.path.basename(path))
    base_name = os.path.basename(path).replace(os.path.splitext(path)[1], f".{ext}") 
    file_name = "file_transcribed/" + base_name
    return file_name



