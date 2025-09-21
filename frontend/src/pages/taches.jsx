import { useState } from "react";
import ListerTaches from "../component/listerTaches";
import FormulaireTohe from "../component/FormulaireTohe";
import DetailsTache from "../component/DetailsTache";

function Taches() {
    const [tacheSelectionnee, setTacheSelectionnee] = useState(null);
    const [modeModification, setModeModification] = useState(false);
    const [afficherFormulaire, setAfficherFormulaire] = useState(false);
    const [afficherDetails, setAfficherDetails] = useState(false);
    const [actualisationListe, setActualisationListe] = useState(0); 


    const gererSelectionTache = (tache, modeEdition = false) => {
        setTacheSelectionnee(tache);
        if (modeEdition) {
            setModeModification(true);
            setAfficherFormulaire(true);
            setAfficherDetails(false);
        } else {
            setAfficherDetails(true);
            setAfficherFormulaire(false);
            setModeModification(false);
        }
    };


    const gererCreationTache = () => {
        setTacheSelectionnee(null);
        setModeModification(false);
        setAfficherFormulaire(true);
        setAfficherDetails(false);
    };


    const gererModificationDepuisDetails = (tache) => {
        setTacheSelectionnee(tache);
        setModeModification(true);
        setAfficherFormulaire(true);
        setAfficherDetails(false);
    };


    const fermerModals = () => {
        setAfficherFormulaire(false);
        setAfficherDetails(false);
        setTacheSelectionnee(null);
        setModeModification(false);
    };


    const gererSauvegarde = () => {
        fermerModals();

        setActualisationListe(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gray-100">

            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-blue-600">
                            Marakhib ToDo
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600">
                                Bonjour, {
                                    localStorage.getItem("user") 
                                        ? JSON.parse(localStorage.getItem("user")).user?.name || "Utilisateur"
                                        : "Utilisateur"
                                }
                            </span>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("user");
                                    window.location.href = "/";
                                }}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </header>


            <main className="max-w-7xl mx-auto px-4 py-8">
                <ListerTaches 
                    key={actualisationListe}
                    onSelectionnerTache={gererSelectionTache}
                    onCreerTache={gererCreationTache}
                />
            </main>


            {afficherFormulaire && (
                <FormulaireTohe
                    tache={tacheSelectionnee}
                    modeModification={modeModification}
                    onFermer={fermerModals}
                    onSauvegarder={gererSauvegarde}
                />
            )}


            {afficherDetails && tacheSelectionnee && (
                <DetailsTache
                    tache={tacheSelectionnee}
                    onFermer={fermerModals}
                    onModifier={gererModificationDepuisDetails}
                />
            )}
        </div>
    );
}

export default Taches;