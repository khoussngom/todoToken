import { useState, useEffect } from "react";
import serviceTache from "../services/serviceTache";

function ModifierTache({ tache, onTacheModifiee, onAnnuler }) {
    const [titre, setTitre] = useState("");
    const [description, setDescription] = useState("");
    const [termine, setTermine] = useState(false);
    const [fichierPhoto, setFichierPhoto] = useState(null);
    const [photoActuelle, setPhotoActuelle] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState(null);
    const [chargement, setChargement] = useState(false);
    const [erreurs, setErreurs] = useState({});
    const [erreurGenerale, setErreurGenerale] = useState("");


    useEffect(() => {
        if (tache) {
            setTitre(tache.title || "");
            setDescription(tache.description || "");
            setTermine(tache.completed || false);
            setPhotoActuelle(tache.photoUrl);
        }
    }, [tache]);


    const gererSelectionPhoto = (e) => {
        const fichier = e.target.files[0];
        if (fichier) {
            setFichierPhoto(fichier);
            const lecteur = new FileReader();
            lecteur.onload = (event) => {
                setPreviewPhoto(event.target.result);
            };
            lecteur.readAsDataURL(fichier);
        }
    };


    const supprimerNouvellePhoto = () => {
        setFichierPhoto(null);
        setPreviewPhoto(null);
        document.getElementById('photo-input').value = '';
    };


    const supprimerPhotoActuelle = () => {
        setPhotoActuelle(null);
    };


    const soumettreFormulaire = async (e) => {
        e.preventDefault();
        

        setErreurs({});
        setErreurGenerale("");
        setChargement(true);

        try {
            let urlPhoto = photoActuelle;


            if (fichierPhoto) {
                const resultatUpload = await serviceTache.uploaderPhoto(fichierPhoto);
                if (resultatUpload.success) {
                    urlPhoto = resultatUpload.data.url;
                } else {
                    throw new Error(resultatUpload.error || "Erreur lors de l'upload de la photo");
                }
            }


            const donneesToche = {
                title: titre,
                description: description || null,
                completed: termine
            };


            if (urlPhoto !== tache.photoUrl) {
                donneesToche.photoUrl = urlPhoto;
            }

            const resultat = await serviceTache.modifierTache(tache.id, donneesToche);

            if (resultat.success) {

                if (onTacheModifiee) {
                    onTacheModifiee(resultat.data);
                }
            } else {
                setErreurGenerale(resultat.error || "Erreur lors de la modification de la tâche");
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
                setErreurGenerale(err.message || err.error || "Erreur lors de la modification de la tâche");
            }
        } finally {
            setChargement(false);
        }
    };

    if (!tache) {
        return <div className="text-center">Tâche non trouvée</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Modifier la tâche</h2>
            
            <form onSubmit={soumettreFormulaire} className="space-y-4">

                <div>
                    <label htmlFor="titre" className="block text-gray-700 mb-2 font-medium">
                        Titre <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="titre"
                        value={titre}
                        onChange={(e) => setTitre(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Entrez le titre de la tâche"
                        required
                    />
                    {erreurs.title && <div className="text-red-500 text-sm mt-1">{erreurs.title}</div>}
                </div>


                <div>
                    <label htmlFor="description" className="block text-gray-700 mb-2 font-medium">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Entrez la description (optionnel)"
                        rows="3"
                    />
                    {erreurs.description && <div className="text-red-500 text-sm mt-1">{erreurs.description}</div>}
                </div>


                <div>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={termine}
                            onChange={(e) => setTermine(e.target.checked)}
                            className="rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 font-medium">Tâche terminée</span>
                    </label>
                </div>


                {photoActuelle && (
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Photo actuelle</label>
                        <div className="relative">
                            <img
                                src={photoActuelle}
                                alt="Photo actuelle"
                                className="w-full h-32 object-cover rounded-md border"
                            />
                            <button
                                type="button"
                                onClick={supprimerPhotoActuelle}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}


                <div>
                    <label htmlFor="photo-input" className="block text-gray-700 mb-2 font-medium">
                        {photoActuelle ? 'Remplacer la photo' : 'Ajouter une photo'}
                    </label>
                    <input
                        type="file"
                        id="photo-input"
                        accept="image/*"
                        onChange={gererSelectionPhoto}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    

                    {previewPhoto && (
                        <div className="mt-3 relative">
                            <img
                                src={previewPhoto}
                                alt="Nouvelle photo"
                                className="w-full h-32 object-cover rounded-md border"
                            />
                            <button
                                type="button"
                                onClick={supprimerNouvellePhoto}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                            >
                                ×
                            </button>
                        </div>
                    )}
                </div>


                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={chargement || !titre.trim()}
                        className={`flex-1 py-2 px-4 rounded-md font-medium ${
                            chargement || !titre.trim()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                        } text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
                    >
                        {chargement ? 'Modification...' : 'Modifier la tâche'}
                    </button>
                    
                    {onAnnuler && (
                        <button
                            type="button"
                            onClick={onAnnuler}
                            disabled={chargement}
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Annuler
                        </button>
                    )}
                </div>


                {erreurGenerale && (
                    <div className="text-red-500 text-center mt-3 p-2 bg-red-50 rounded-md">
                        {erreurGenerale}
                    </div>
                )}
            </form>
        </div>
    );
}

export default ModifierTache;
