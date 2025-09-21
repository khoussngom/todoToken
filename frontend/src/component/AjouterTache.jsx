import { useState } from "react";
import serviceTache from "../services/serviceTache";
import { 
    FiPlus, 
    FiImage, 
    FiX, 
    FiSave, 
    FiArrowLeft,
    FiUpload,
    FiCheck,
    FiAlertCircle
} from "react-icons/fi";

function AjouterTache({ onTacheCreee, onAnnuler }) {
    const [titre, setTitre] = useState("");
    const [description, setDescription] = useState("");
    const [fichierPhoto, setFichierPhoto] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState(null);
    const [chargement, setChargement] = useState(false);
    const [erreurs, setErreurs] = useState({});
    const [erreurGenerale, setErreurGenerale] = useState("");


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


    const supprimerPhoto = () => {
        setFichierPhoto(null);
        setPreviewPhoto(null);
        document.getElementById('photo-input').value = '';
    };


    const soumettreFormulaire = async (e) => {
        e.preventDefault();
        

        setErreurs({});
        setErreurGenerale("");
        setChargement(true);

        try {
            let urlPhoto = null;


            if (fichierPhoto) {
                const resultatUpload = await serviceTache.uploaderPhoto(fichierPhoto);
                if (resultatUpload.success) {
                    urlPhoto = resultatUpload.data.url;
                } else {
                    throw new Error(resultatUpload.error || "Erreur lors de l'upload de la photo");
                }
            }


            const utilisateur = localStorage.getItem("user");
            const donneeUtilisateur = JSON.parse(utilisateur);
            const idUtilisateur = donneeUtilisateur?.token?.user?.id;

            if (!idUtilisateur) {
                throw new Error("Utilisateur non connecté");
            }


            const donneesToche = {
                title: titre,
                description: description || null,
                photoUrl: urlPhoto,
                userId: idUtilisateur
            };

            const resultat = await serviceTache.creerTache(donneesToche);

            if (resultat.success) {

                setTitre("");
                setDescription("");
                setFichierPhoto(null);
                setPreviewPhoto(null);
                document.getElementById('photo-input').value = '';
                

                if (onTacheCreee) {
                    onTacheCreee(resultat.data);
                }
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
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-full">
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
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg transition-all duration-200"
                        placeholder="Entrez le titre de la tâche"
                        required
                    />
                    {erreurs.title && (
                        <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                            <FiAlertCircle size={16} />
                            {erreurs.title}
                        </div>
                    )}
                </div>


                <div>
                    <label htmlFor="description" className="block text-gray-700 mb-3 font-semibold text-lg">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg transition-all duration-200"
                        placeholder="Entrez la description (optionnel)"
                        rows="4"
                    />
                    {erreurs.description && (
                        <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                            <FiAlertCircle size={16} />
                            {erreurs.description}
                        </div>
                    )}
                </div>


                <div>
                    <label htmlFor="photo-input" className="block text-gray-700 mb-3 font-semibold text-lg">
                        <div className="flex items-center gap-2">
                            <FiImage size={20} />
                            Photo (optionnel)
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
                        <label 
                            htmlFor="photo-input" 
                            className="cursor-pointer flex flex-col items-center gap-3"
                        >
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
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                        } text-white`}
                    >
                        {chargement ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                Création...
                            </>
                        ) : (
                            <>
                                <FiCheck size={22} />
                                Créer la tâche
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
                            <FiArrowLeft size={20} />
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

export default AjouterTache;
