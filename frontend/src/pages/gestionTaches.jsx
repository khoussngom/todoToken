import { useState } from "react";
import ListerTaches from "../component/listerTaches";
import AjouterTache from "../component/AjouterTache";
import ModifierTache from "../component/ModifierTache";
import AfficherTache from "../component/AfficherTache";
import AssignerPermission from "../component/AssignerPermission";
import ActivitesRecentes from "../component/ActivitesRecentes";
import Historique from "../component/Historique";
import { useNavigate } from "react-router-dom";
import { 
    FiList, 
    FiPlus, 
    FiEdit, 
    FiEye, 
    FiUsers, 
    FiLogOut,
    FiArrowLeft,
    FiActivity 
} from "react-icons/fi";

function Taches() {
    const [vueActuelle, setVueActuelle] = useState("liste");
    const [tacheSelectionnee, setTacheSelectionnee] = useState(null);
    const navigate = useNavigate();

    const obtenirUtilisateur = () => {
        const utilisateur = localStorage.getItem("user");
        if (utilisateur) {
            const donneeUtilisateur = JSON.parse(utilisateur);
            return donneeUtilisateur.token?.user || null;
        }
        return null;
    };

    const utilisateur = obtenirUtilisateur();

    const seDeconnecter = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const gererSelectionTache = (tache) => {
        setTacheSelectionnee(tache);
        setVueActuelle("afficher");
    };

    const gererCreationTache = () => {
        setTacheSelectionnee(null);
        setVueActuelle("ajouter");
    };

    const gererModificationTache = (tache) => {
        setTacheSelectionnee(tache);
        setVueActuelle("modifier");
    };

    const gererPermissions = (tache) => {
        setTacheSelectionnee(tache);
        setVueActuelle("permissions");
    };

    const retournerALaListe = () => {
        setTacheSelectionnee(null);
        setVueActuelle("liste");
    };

    const gererSucces = () => {
        retournerALaListe();
    };

    if (!utilisateur) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Non connecté</h2>
                    <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder à vos tâches.</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                        Se connecter
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
            <header className="bg-white shadow-lg border-b-2 border-cyan-200">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold bg-blue-600 bg-clip-text text-transparent">
                                Marakhib ToDo
                            </h1>
                            <p className="text-gray-600 mt-2 text-lg">
                                Bienvenue, {utilisateur.name || utilisateur.email}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-4">

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setVueActuelle("historique")}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                                    vueActuelle === "historique"
                                        ? "bg-cyan-500 text-white shadow-md"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                <FiActivity size={18} />
                                Historique
                            </button>

                            {vueActuelle !== "liste" && vueActuelle !== "historique" && (
                                <button
                                    onClick={retournerALaListe}
                                    className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    <FiArrowLeft size={20} />
                                    Retour
                                </button>
                            )}
                        </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                                <span className="font-bold">Role</span>
                                <span>:</span>
                                <span className="capitalize">{utilisateur.role}</span>
                            </div>

                            {vueActuelle === "historique" && (                                <button
                                    onClick={retournerALaListe}
                                    className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    <FiArrowLeft size={20} />
                                    Retour
                                </button>
                            )}
                            
                            <button
                                onClick={seDeconnecter}
                                className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                                <FiLogOut size={18} />
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </header>


            <main className="max-w-6xl mx-auto px-6 py-8">
                {vueActuelle === "liste" && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3">
                            <ListerTaches
                                onSelectionnerTache={gererSelectionTache}
                                onCreerTache={gererCreationTache}
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <ActivitesRecentes limit={8} />
                        </div>
                    </div>
                )}

                {vueActuelle === "historique" && (
                    <Historique />
                )}

                {vueActuelle === "ajouter" && (
                    <AjouterTache
                        onTacheCreee={gererSucces}
                        onAnnuler={retournerALaListe}
                    />
                )}

                {vueActuelle === "modifier" && tacheSelectionnee && (
                    <ModifierTache
                        tache={tacheSelectionnee}
                        onTacheModifiee={gererSucces}
                        onAnnuler={retournerALaListe}
                    />
                )}

                {vueActuelle === "afficher" && tacheSelectionnee && (
                    <div className="space-y-6">
                        <AfficherTache
                            tache={tacheSelectionnee}
                            onModifier={gererModificationTache}
                            onSupprimer={() => retournerALaListe()}
                            onFermer={retournerALaListe}
                        />
                        

                        <div className="text-center">
                            <button
                                onClick={() => gererPermissions(tacheSelectionnee)}
                                className="flex items-center gap-3 mx-auto bg-blue-600 text-white px-8 py-4 rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <FiUsers size={22} />
                                Assigner des permissions
                            </button>
                        </div>
                    </div>
                )}

                {vueActuelle === "permissions" && tacheSelectionnee && (
                    <AssignerPermission
                        tache={tacheSelectionnee}
                        onPermissionAssignee={gererSucces}
                        onAnnuler={retournerALaListe}
                    />
                )}
            </main>
        </div>
    );
}

export default Taches;
