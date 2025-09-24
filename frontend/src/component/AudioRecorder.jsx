import { useState, useRef } from "react";
import { FiMic, FiStopCircle } from "react-icons/fi";

const AudioRecorder = ({ onAudioReady }) => {
    const [enregistrement, setEnregistrement] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [audioConfirme, setAudioConfirme] = useState(false);
    const [canStop, setCanStop] = useState(false);

    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    const demarrerEnregistrement = async () => {
        try {
            setIsLoading(true);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                setIsLoading(false);

                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                }

                mediaRecorderRef.current = null;
                setEnregistrement(false);
            };

            mediaRecorderRef.current.start();
            setEnregistrement(true);
            setCanStop(false);

            timerRef.current = setTimeout(() => setCanStop(true), 1000);
        } catch (error) {
            console.error("Erreur lors du démarrage de l'enregistrement:", error);
            setIsLoading(false);
        }
    };

    const arreterEnregistrement = () => {
        if (!canStop) return;
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
    };

    const confirmerAudio = async () => {
        if (audioUrl && !audioConfirme) {
            const response = await fetch(audioUrl);
            const blob = await response.blob();
            onAudioReady(blob);
            setAudioConfirme(true);
        }
    };

    const annulerAudio = () => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            setAudioUrl(null);
            setAudioConfirme(false);
            chunksRef.current = [];
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center">
                {enregistrement ? (
                    <button
                        type="button"
                        onClick={arreterEnregistrement}
                        className="text-white flex items-center gap-2 rounded-full bg-red-600 p-2 hover:bg-red-700 transition-colors"
                        disabled={!canStop}
                    >
                        <FiStopCircle size={20} /> Stop
                    </button>
                ) : !audioUrl ? (
                    <button
                        type="button"

                        onClick={demarrerEnregistrement}
                        className="text-white flex items-center gap-2 rounded-full bg-red-600 p-2 hover:bg-red-700 transition-colors"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        ) : (
                            <FiMic size={20} />
                        )}
                        <span>{isLoading ? "Chargement..." : "Record"}</span>
                    </button>
                ) : null}
            </div>

            {audioUrl && (
                <div className="space-y-4">
                    <audio controls src={audioUrl} className="w-full" />
                    <div className="flex justify-center gap-4">
                        <button
                        type="button"

                            onClick={confirmerAudio}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            disabled={audioConfirme}
                        >
                            {audioConfirme ? "Audio enregistré" : "Confirmer"}
                        </button>
                        <button
                        type="button"

                            onClick={annulerAudio}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            disabled={audioConfirme}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
