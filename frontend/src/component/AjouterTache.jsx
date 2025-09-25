import { useState } from "react";
import serviceTache from "../services/serviceTache";
import { FiPlus, FiImage, FiX, FiCheck, FiArrowLeft, FiUpload, FiAlertCircle } from "react-icons/fi";
import AudioRecorder from "./AudioRecorder";

function AjouterTache({ onTacheCreee, onAnnuler }) {
    const [titre, setTitre] = useState("");
    const [description, setDescription] = useState("");
    const [fichierPhoto, setFichierPhoto] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [audioConfirme, setAudioConfirme] = useState(false);
    const [chargement, setChargement] = useState(false);
    const [erreurs, setErreurs] = useState({});
    const [erreurGenerale, setErreurGenerale] = useState("");

    // Garder uniquement les états pour date et heure combinés
    const [dateHeureDebut, setDateHeureDebut] = useState("");
    const [dateHeureFin, setDateHeureFin] = useState("");

    const gererSelectionPhoto = (e) => {
        const fichier = e.target.files[0];
        if (fichier) {
            setFichierPhoto(fichier);
            const lecteur = new FileReader();
            lecteur.onload = (event) => setPreviewPhoto(event.target.result);
            lecteur.readAsDataURL(fichier);
        }
    };

    const supprimerPhoto = () => {
        setFichierPhoto(null);
        setPreviewPhoto(null);
        document.getElementById("photo-input").value = "";
    };


    const handleAudioReady = (blob) => {
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setAudioConfirme(false);
    };

    const annulerAudio = () => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            setAudioBlob(null);
            setAudioUrl(null);
            setAudioConfirme(false);
        }
    };

    const confirmerAudio = () => {
        if (audioUrl) setAudioConfirme(true);
    };


    const soumettreFormulaire = async (e) => {
        e.preventDefault();
        setErreurs({});
        setErreurGenerale("");
        setChargement(true);

        try {
            let urlPhoto = null;
            let urlAudio = null;

            if (fichierPhoto) {
                const resultatUploadPhoto = await serviceTache.uploaderPhoto(fichierPhoto);
                if (resultatUploadPhoto.success) urlPhoto = resultatUploadPhoto.data.url;
                else throw new Error(resultatUploadPhoto.error || "Erreur lors de l'upload de la photo");
            }

            if (audioBlob) {
                urlAudio = await serviceTache.uploaderAudio(audioBlob);
            }

            const utilisateur = localStorage.getItem("user");
            const donneeUtilisateur = JSON.parse(utilisateur);
            const idUtilisateur = donneeUtilisateur?.token?.user?.id;

            if (!idUtilisateur) throw new Error("Utilisateur non connecté");

            const donneesTache = {
                title: titre,
                description: description || null,
                photoUrl: urlPhoto,
                audioUrl: urlAudio,
                userId: idUtilisateur,
                dateHeureDebut: dateHeureDebut || null,
                dateHeureFin: dateHeureFin || null
            };

            // Validation des dates
            if (dateHeureDebut && dateHeureFin) {
                const debut = new Date(dateHeureDebut);
                const fin = new Date(dateHeureFin);
                
                if (fin < debut) {
                    throw {
                        details: [{
                            path: ['dateHeureFin'],
                            message: "La date de fin doit être postérieure à la date de début"
                        }]
                    };
                }
            }

            const resultat = await serviceTache.creerTache(donneesTache);

            if (resultat.success) {
                setTitre("");
                setDescription("");
                setFichierPhoto(null);
                setPreviewPhoto(null);
                setAudioBlob(null);
                setAudioUrl(null);
                setAudioConfirme(false);
                setDateHeureDebut("");  // Réinitialiser la date/heure de début
                setDateHeureFin("");    // Réinitialiser la date/heure de fin
                document.getElementById("photo-input").value = "";
                if (onTacheCreee) onTacheCreee(resultat.data);
            } else {
                setErreurGenerale(resultat.error || "Erreur lors de la création de la tâche");
            }

        } catch (err) {
            console.error("Erreur:", err);
            if (err.details && Array.isArray(err.details)) {
                const erreursChamps = {};
                err.details.forEach(detail => {
                    if (detail.path && detail.path.length > 0) {
                        const nomChamp = detail.path[0];
                        erreursChamps[nomChamp] = detail.message;
                    }
                });
                setErreurs(erreursChamps);
                setErreurGenerale(err.error || "Erreur de validation");
            } else {
                setErreurGenerale(err.message || err.error || "Erreur lors de la création de la tâche");
            }
        } finally {
            setChargement(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-600 p-3 rounded-full">
                    <FiPlus size={24} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Ajouter une tâche</h2>
            </div>

            <form onSubmit={soumettreFormulaire} className="space-y-6">

                <div>
                    <label htmlFor="titre" className="block text-gray-700 mb-3 font-semibold text-lg">
                        Titre <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="titre"
                        value={titre}
                        onChange={(e) => setTitre(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-black text-lg transition-all duration-200"
                        placeholder="Entrez le titre de la tâche"
                    />
                    {erreurs.title && (
                        <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                            <FiAlertCircle size={16} /> {erreurs.title}
                        </div>
                    )}
                </div>


                <div>
                    <label htmlFor="description" className="block text-gray-700 mb-3 font-semibold text-lg">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg text-black transition-all duration-200"
                        placeholder="Entrez la description"
                        rows="4"
                    />
                    {erreurs.description && (
                        <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                            <FiAlertCircle size={16} /> {erreurs.description}
                        </div>
                    )}
                </div>


                <div>
                    <label htmlFor="photo-input" className="block text-gray-700 mb-3 font-semibold text-lg">
                        <div className="flex items-center gap-2">
                            <FiImage size={20} /> Photo (optionnel)
                        </div>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-cyan-400 transition-colors duration-200">
                        <input
                            type="file"
                            id="photo-input"
                            accept="image/*"
                            onChange={gererSelectionPhoto}
                            className="hidden"
                        />
                        <label htmlFor="photo-input" className="cursor-pointer flex flex-col items-center gap-3">
                            <div className="bg-cyan-100 p-4 rounded-full">
                                <FiUpload size={24} className="text-cyan-600" />
                            </div>
                            <div>
                                <p className="text-gray-700 font-medium">Cliquez pour ajouter une photo</p>
                                <p className="text-gray-500 text-sm">PNG, JPG, JPEG jusqu'à 5MB</p>
                            </div>
                        </label>
                    </div>
                    {previewPhoto && (
                        <div className="mt-4 relative">
                            <img
                                src={previewPhoto}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={supprimerPhoto}
                                className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                    )}
                </div>


                <div>
                    <label className="block text-gray-700 mb-3 font-semibold text-lg">Audio (optionnel)</label>
                    <AudioRecorder onAudioReady={handleAudioReady} disabled={chargement} />
                    {audioUrl && (
                        <div className="flex flex-col items-center mt-3 gap-2">
                            <audio controls src={audioUrl} className="w-full" />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={confirmerAudio}
                                    disabled={audioConfirme}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    {audioConfirme ? "Audio enregistré" : "Confirmer"}
                                </button>
                                <button
                                    type="button"
                                    onClick={annulerAudio}
                                    disabled={audioConfirme}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    )}
                </div>


                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="dateHeureDebut" className="block text-gray-700 mb-3 font-semibold text-lg">
                            Date et heure de début
                        </label>
                        <input
                            type="datetime-local"
                            id="dateHeureDebut"
                            value={dateHeureDebut}
                            onChange={(e) => setDateHeureDebut(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-black text-lg transition-all duration-200"
                        />
                        {erreurs.dateHeureDebut && (
                            <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                                <FiAlertCircle size={16} /> {erreurs.dateHeureDebut}
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="dateHeureFin" className="block text-gray-700 mb-3 font-semibold text-lg">
                            Date et heure de fin
                        </label>
                        <input
                            type="datetime-local"
                            id="dateHeureFin"
                            value={dateHeureFin}
                            onChange={(e) => setDateHeureFin(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-black text-lg transition-all duration-200"
                        />
                        {erreurs.dateHeureFin && (
                            <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                                <FiAlertCircle size={16} /> {erreurs.dateHeureFin}
                            </div>
                        )}
                    </div>
                </div>


                {erreurGenerale && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                            <FiAlertCircle className="text-red-500" size={18} />
                            <span className="text-red-700 font-medium">{erreurGenerale}</span>
                        </div>
                    </div>
                )}

                <div className="flex gap-4 pt-6">
                    <button
                        type="submit"
                        disabled={chargement || !titre.trim()}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-full font-semibold text-lg transition-all duration-200 ${
                            chargement || !titre.trim()
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                        } text-white`}
                    >
                        {chargement ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                Création...
                            </>
                        ) : (
                            <>
                                <FiCheck size={22} /> Créer la tâche
                            </>
                        )}
                    </button>
                    {onAnnuler && (
                        <button
                            type="button"
                            onClick={onAnnuler}
                            disabled={chargement}
                            className="flex items-center justify-center gap-3 py-4 px-6 bg-gray-500 text-white rounded-full hover:bg-gray-600 font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <FiArrowLeft size={20} /> Annuler
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default AjouterTache;
