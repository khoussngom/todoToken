import { useState } from "react";
import ListerTaches from "../component/listerTaches";
import AjouterTache from "../component/AjouterTache";
import ModifierTache from "../component/ModifierTache";
import AfficherTache from "../component/AfficherTache";
import AssignerPermission from "../component/AssignerPermission";
import { useNavigate } from "react-router-dom";

function AccueilTaches() {
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

    const gererSuppressionTache = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {

            setVueActuelle("liste");
        }
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
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Gestionnaire de Tâches
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Bienvenue, {utilisateur.name || utilisateur.email}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-4">

                            {vueActuelle !== "liste" && (
                                <button
                                    onClick={retournerALaListe}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                                >
                                    ← Retour à la liste
                                </button>
                            )}
                            

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>ID: {utilisateur.id}</span>
                                <span>•</span>
                                <span>{utilisateur.role}</span>
                            </div>
                            
                            <button
                                onClick={seDeconnecter}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </header>


            <main className="max-w-6xl mx-auto px-6 py-8">
                {vueActuelle === "liste" && (
                    <ListerTaches
                        onSelectionnerTache={gererSelectionTache}
                        onCreerTache={gererCreationTache}
                    />
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
                            onSupprimer={gererSuppressionTache}
                            onFermer={retournerALaListe}
                        />
                        

                        <div className="text-center">
                            <button
                                onClick={() => gererPermissions(tacheSelectionnee)}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                            >
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

export default AccueilTaches;
