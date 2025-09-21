import { useState } from "react";
import servicePermissionTache from "../services/servicePermissionTache";

function AssignerPermission({ tache, onPermissionAssignee, onAnnuler }) {
    const [idUtilisateur, setIdUtilisateur] = useState("");
    const [peutModifier, setPeutModifier] = useState(false);
    const [peutSupprimer, setPeutSupprimer] = useState(false);
    const [chargement, setChargement] = useState(false);
    const [erreurs, setErreurs] = useState({});
    const [erreurGenerale, setErreurGenerale] = useState("");


    const soumettreFormulaire = async (e) => {
        e.preventDefault();
        

        if (!idUtilisateur.trim()) {
            setErreurGenerale("L'ID utilisateur est requis");
            return;
        }

        const idUtilisateurNum = parseInt(idUtilisateur.trim());
        if (isNaN(idUtilisateurNum) || idUtilisateurNum <= 0) {
            setErreurGenerale("L'ID utilisateur doit être un nombre positif");
            return;
        }


        setErreurs({});
        setErreurGenerale("");
        setChargement(true);

        try {
            const donneesPermission = {
                todoId: tache.id,
                userId: idUtilisateurNum,
                canEdit: peutModifier,
                canDelete: peutSupprimer
            };

            const resultat = await servicePermissionTache.assignerPermission(donneesPermission);

            if (resultat.success) {

                setIdUtilisateur("");
                setPeutModifier(false);
                setPeutSupprimer(false);
                

                if (onPermissionAssignee) {
                    onPermissionAssignee(resultat.data);
                }
            } else {
                setErreurGenerale(resultat.error || "Erreur lors de l'assignation de la permission");
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
                setErreurGenerale(err.message || err.error || "Erreur lors de l'assignation de la permission");
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
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Assigner une permission</h2>
            
            <div className="mb-4 bg-blue-50 p-3 rounded-md">
                <p className="text-blue-800 font-medium">Tâche: {tache.title}</p>
                <p className="text-blue-600 text-sm">ID: {tache.id}</p>
            </div>
            
            <form onSubmit={soumettreFormulaire} className="space-y-4">

                <div>
                    <label htmlFor="idUtilisateur" className="block text-gray-700 mb-2 font-medium">
                        ID de l'utilisateur <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="idUtilisateur"
                        value={idUtilisateur}
                        onChange={(e) => setIdUtilisateur(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Entrez l'ID de l'utilisateur"
                        min="1"
                        required
                    />
                    {erreurs.userId && <div className="text-red-500 text-sm mt-1">{erreurs.userId}</div>}
                </div>


                <div>
                    <label className="block text-gray-700 mb-3 font-medium">Permissions</label>
                    
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={peutModifier}
                                onChange={(e) => setPeutModifier(e.target.checked)}
                                className="rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-gray-700 font-medium">Peut modifier</span>
                                <p className="text-sm text-gray-500">L'utilisateur peut modifier le titre, la description et le statut de la tâche</p>
                            </div>
                        </label>
                        
                        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={peutSupprimer}
                                onChange={(e) => setPeutSupprimer(e.target.checked)}
                                className="rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <div>
                                <span className="text-gray-700 font-medium">Peut supprimer</span>
                                <p className="text-sm text-gray-500">L'utilisateur peut supprimer définitivement cette tâche</p>
                            </div>
                        </label>
                    </div>
                    
                    {!peutModifier && !peutSupprimer && (
                        <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                            💡 Si aucune permission n'est cochée, l'utilisateur aura uniquement accès en lecture seule.
                        </p>
                    )}
                </div>


                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={chargement || !idUtilisateur.trim()}
                        className={`flex-1 py-2 px-4 rounded-md font-medium ${
                            chargement || !idUtilisateur.trim()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                        {chargement ? 'Assignation...' : 'Assigner la permission'}
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


            <div className="mt-6 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                <p className="font-medium mb-1">💡 Comment trouver l'ID d'un utilisateur ?</p>
                <p>L'ID utilisateur est un nombre unique assigné à chaque utilisateur lors de son inscription. Demandez à l'utilisateur son ID ou consultez la liste des utilisateurs si vous êtes administrateur.</p>
            </div>
        </div>
    );
}

export default AssignerPermission;
