import { useState, useEffect } from "react";
import tacheService from "../services/tacheService";
import photoService from "../services/photoService";

function FormulaireTohe({ tache, modeModification = false, onFermer, onSauvegarder }) {
    const [titre, setTitre] = useState("");
    const [description, setDescription] = useState("");
    const [termine, setTermine] = useState(false);
    const [photoUrl, setPhotoUrl] = useState("");
    const [fichierPhoto, setFichierPhoto] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState("");
    
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState("");
    const [uploadEnCours, setUploadEnCours] = useState(false);

    useEffect(() => {
        if (modeModification && tache) {
            setTitre(tache.title || "");
            setDescription(tache.description || "");
            setTermine(tache.completed || false);
            setPhotoUrl(tache.photoUrl || "");
            setPreviewPhoto(tache.photoUrl || "");
        }
    }, [modeModification, tache]);

    const gererChangementFichier = (event) => {
        const fichier = event.target.files[0];
        if (fichier) {
            // Vérifier le type de fichier
            if (!fichier.type.startsWith('image/')) {
                setErreur("Veuillez sélectionner un fichier image");
                return;
            }
            
            // Vérifier la taille (max 10MB)
            if (fichier.size > 10 * 1024 * 1024) {
                setErreur("La taille du fichier ne peut pas dépasser 10MB");
                return;
            }

            setFichierPhoto(fichier);
            

            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewPhoto(e.target.result);
            };
            reader.readAsDataURL(fichier);
            setErreur("");
        }
    };

    const uploaderPhoto = async () => {
        if (!fichierPhoto) return photoUrl;

        try {
            setUploadEnCours(true);
            const resultat = await photoService.uploaderFichier(fichierPhoto, "todos");
            
            if (resultat.success) {
                return resultat.data.url;
            } else {
                throw new Error(resultat.error || "Erreur lors de l'upload");
            }
        } catch (error) {
            throw new Error(error.message || "Erreur lors de l'upload de la photo");
        } finally {
            setUploadEnCours(false);
        }
    };

    const supprimerPhoto = () => {
        setFichierPhoto(null);
        setPreviewPhoto("");
        setPhotoUrl("");
    };

    const gererSoumission = async (e) => {
        e.preventDefault();
        setErreur("");
        
        if (!titre.trim()) {
            setErreur("Le titre est requis");
            return;
        }

        try {
            setChargement(true);


            let urlPhotoFinale = photoUrl;
            if (fichierPhoto) {
                urlPhotoFinale = await uploaderPhoto();
            }

            const donneesToche = {
                title: titre.trim(),
                description: description.trim(),
                completed: termine,
                photoUrl: urlPhotoFinale || null
            };


            if (!modeModification) {
                const utilisateur = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
                if (utilisateur && utilisateur.user && utilisateur.user.id) {
                    donneesToche.userId = utilisateur.user.id;
                } else {
                    throw new Error("Impossible de récupérer l'ID utilisateur");
                }
            }

            let resultat;
            if (modeModification) {
                resultat = await tacheService.mettreAJourTache(tache.id, donneesToche);
            } else {
                resultat = await tacheService.creerTache(donneesToche);
            }

            if (resultat.success) {
                onSauvegarder && onSauvegarder(resultat.data);
                onFermer && onFermer();
            } else {
                setErreur(resultat.error || "Erreur lors de la sauvegarde");
            }
        } catch (err) {
            setErreur(err.message || "Erreur lors de la sauvegarde");
        } finally {
            setChargement(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            {modeModification ? "Modifier la tâche" : "Nouvelle tâche"}
                        </h2>
                        <button
                            onClick={onFermer}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {erreur && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {erreur}
                        </div>
                    )}

                    <form onSubmit={gererSoumission} className="space-y-4">

                        <div>
                            <label htmlFor="titre" className="block text-gray-700 font-medium mb-2">
                                Titre *
                            </label>
                            <input
                                type="text"
                                id="titre"
                                value={titre}
                                onChange={(e) => setTitre(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Entrez le titre de la tâche"
                                required
                            />
                        </div>


                        <div>
                            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Description de la tâche (optionnel)"
                            />
                        </div>


                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Photo
                            </label>
                            
                            {previewPhoto ? (
                                <div className="mb-3">
                                    <img 
                                        src={previewPhoto} 
                                        alt="Aperçu" 
                                        className="w-32 h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={supprimerPhoto}
                                        className="mt-2 text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Supprimer la photo
                                    </button>
                                </div>
                            ) : null}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={gererChangementFichier}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Formats supportés: JPG, PNG, GIF (max 10MB)
                            </p>
                        </div>


                        {modeModification && (
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="termine"
                                    checked={termine}
                                    onChange={(e) => setTermine(e.target.checked)}
                                    className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="termine" className="text-gray-700 font-medium">
                                    Tâche terminée
                                </label>
                            </div>
                        )}


                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onFermer}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={chargement || uploadEnCours}
                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                                {chargement || uploadEnCours
                                    ? uploadEnCours 
                                        ? "Upload..." 
                                        : "Sauvegarde..."
                                    : modeModification 
                                        ? "Modifier" 
                                        : "Créer"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FormulaireTohe;
