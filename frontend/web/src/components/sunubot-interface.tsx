'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, Send, Mic, Video, FileText, Image, PlayCircle, StopCircle, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion';


export function SunubotInterface() {
  const [inputText, setInputText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [summary, setSummary] = useState('')
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [showDiscussion, setShowDiscussion] = useState(false)
  const [isAudioOrVideo, setIsAudioOrVideo] = useState(false)
  const [showTranscriptionOption, setShowTranscriptionOption] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [loading, setLoading] = useState(false);

  const handleTextSubmit = async () => {
    if (!inputText.trim()) return;

    setLoading(true);

    // Créer un fichier Blob avec le texte
    const textBlob = new Blob([inputText], { type: 'text/plain' });
    const textFile = new File([textBlob], 'text_input.txt', { type: 'text/plain' });

    const formData = new FormData();
    formData.append('file', textFile);

    try {
      const response = await fetch('https://e-ceddo.com/model/upload/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erreur réseau : ${response.statusText}`);
      }

      const data = await response.json();
      setSummary(data.summarized_text);
      console.log('Text sent successfully:', data);
    } catch (error) {
      console.error('Error sending text to API:', error);
    } finally {
      setLoading(false);
      setInputText('');
    }
  };

  // const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const uploadedFile = event.target.files?.[0]
  //   if (uploadedFile) {
  //     setFile(uploadedFile)
  //     setIsAudioOrVideo(uploadedFile.type.startsWith('audio/') || uploadedFile.type.startsWith('video/'))
  //     processSummary(uploadedFile)
  //   }
  // }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];

    setLoading(true);

    if (uploadedFile) {
      setFile(uploadedFile);
      setIsAudioOrVideo(uploadedFile.type.startsWith('audio/') || uploadedFile.type.startsWith('video/'));

      // Créer un FormData pour envoyer le fichier
      const formData = new FormData();
      formData.append('file', uploadedFile);

      try {
        const response = await fetch('https://e-ceddo.com/model/upload/', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Erreur réseau : ${response.statusText}`);
        }

        const data = await response.json();
        setLoading(false);
        setSummary(data.summarized_text || `Résumé du fichier : ${uploadedFile.name} - Contenu analysé avec succès.`);
        console.log('File sent successfully:', data);

        // Montrer les options de transcription si le fichier est audio ou vidéo
        setShowDiscussion(true);
        if (isAudioOrVideo) {
          setShowTranscriptionOption(true);
        }
      } catch (error) {
        console.error('Error sending file to API:', error);
      } finally {
        setFile(null); // Réinitialiser le fichier après l'envoi
      }
    }
  };


  const processSummary = (uploadedFile: File) => {
    setSummary(`Analyse en cours du fichier : ${uploadedFile.name}`)
    setTimeout(() => {
      setSummary(`Résumé du fichier : ${uploadedFile.name} - Contenu analysé avec succès.`)
      setShowDiscussion(true)
      if (isAudioOrVideo) {
        setShowTranscriptionOption(true)
      }
    }, 2000)
  }

  const handleChatSubmit = async () => {
    if (chatInput.trim()) {
      const newMessage = { role: 'user' as const, content: chatInput }
      setChatMessages(prev => [...prev, newMessage])
      setChatInput('')
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'bot', content: `Voici ma réponse à "${chatInput}" : Lorem ipsum dolor sit amet, consectetur adipiscing elit.` }])
      }, 1000)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      const audioChunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioUrl(audioUrl)
        setFile(new File([audioBlob], "recorded_audio.wav", { type: 'audio/wav' }))
        setIsAudioOrVideo(true)
        processSummary(new File([audioBlob], "recorded_audio.wav", { type: 'audio/wav' }))
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleDownloadTranscription = () => {
    const transcription = "Ceci est une transcription simulée du fichier audio/vidéo."
    const blob = new Blob([transcription], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transcription.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const fileTypes = [
    { icon: <FileText className="h-8 w-8" />, label: 'Texte' },
    { icon: <Image className="h-8 w-8" />, label: 'PDF' },
    { icon: <Mic className="h-8 w-8" />, label: 'Audio' },
    { icon: <Video className="h-8 w-8" />, label: 'Vidéo' },
  ]

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full h-full max-w-5xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white flex  flex-row items-center space-x-2">
          <img src="sunubot_logo.png" alt="Logo" className="h-20 w-40" />
          <CardTitle className="text-3xl font-bold">Sunubot</CardTitle>
        </CardHeader>

        <CardContent className="p-6 h-full flex flex-col">
          <Tabs defaultValue="text" className="relative w-full h-full flex flex-col bg-gray-200 rounded-lg">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="text">Texte</TabsTrigger>
              <TabsTrigger value="file">Fichier</TabsTrigger>
              <TabsTrigger value="record">Enregistrer</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="flex-grow flex flex-col">
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="animate-spin h-6 w-6 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    <p>Chargement...</p>
                  </div>
                ) : summary ? (
                  <p>Voici votre résumé : {summary}</p>
                ) : (
                  <p>Entrez votre texte pour obtenir un résumé.</p>
                )}
              </div>

              <div className="absolute bottom-[100px] left-0 right-0 p-4 bg-white dark:bg-gray-800 flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Entrez votre texte ici"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={handleTextSubmit} disabled={!inputText}>
                  <Send className="mr-2 h-6 w-6" /> Envoyer
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="file" className="flex-grow flex flex-col items-center relative">
              <div className="space-y-4 w-full flex-grow">
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="animate-spin h-6 w-6 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      <p>Chargement...</p>
                    </div>
                  ) : summary ? (
                    <p>Voici votre résumé : {summary}</p>
                  ) : (
                    <p className='align-right'>Veuillez uploader votre fichier pour obtenir un resume.</p>
                  )}
                </div>
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".txt,.pdf,.mp3,.mp4,.wav,.png,.jpg,.jpeg"
                />
                {file && (
                  <p className="text-sm text-muted-foreground text-center">
                    Fichier sélectionné : {file.name}
                  </p>
                )}
              </div>

              {/* Icônes en bas de la fenêtre */}
              <div className="fixed bottom-5 w-full p-4 flex justify-center space-x-4">
                {fileTypes.map((type, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="flex-col h-20 w-20"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {type.icon}
                    <span className="mt-2 text-xs">{type.label}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>


            <TabsContent value="record" className="flex-grow flex flex-col items-center">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                className="w-32 h-32 rounded-full flex flex-col items-center justify-center"
              >
                {isRecording ? (
                  <>
                    <StopCircle className="h-12 w-12 mb-2" />
                    <span>Arrêter</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-12 w-12 mb-2" />
                    <span>Enregistrer</span>
                  </>
                )}
              </Button>
              {audioUrl && (
                <audio src={audioUrl} controls className="w-full mt-4" />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
