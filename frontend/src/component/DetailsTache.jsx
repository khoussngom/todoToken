import { useState, useEffect } from "react";
import tacheService from "../services/tacheService";
import permissionService from "../services/permissionService";

function DetailsTache({ tache, onFermer, onModifier }) {
    const [tacheComplete, setTacheComplete] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState("");
    
    // État pour l'ajout de permissions
    const [afficherFormulairePermission, setAfficherFormulairePermission] = useState(false);
    const [emailUtilisateur, setEmailUtilisateur] = useState("");
    const [peutModifier, setPeutModifier] = useState(false);
    const [peutSupprimer, setPeutSupprimer] = useState(false);

    useEffect(() => {
        if (tache) {
            chargerDetailsTache();
        }
    }, [tache]);

    const chargerDetailsTache = async () => {
        try {
            setChargement(true);
            setErreur("");
            
            // Charger les détails de la tâche
            const resultatTache = await tacheService.obtenirTacheParId(tache.id);
            if (resultatTache.success) {
                setTacheComplete(resultatTache.data);
            }

            // Charger les permissions
            try {
                const resultatPermissions = await permissionService.obtenirPermissionsTache(tache.id);
                if (resultatPermissions.success) {
                    setPermissions(resultatPermissions.data || []);
                }
            } catch (err) {
                // Les permissions peuvent ne pas être accessibles selon les droits
                console.log("Impossible de charger les permissions:", err);
            }
            
        } catch (err) {
            setErreur(err.message || "Erreur lors du chargement des détails");
        } finally {
            setChargement(false);
        }
    };

    const changerStatutTache = async (termine) => {
        try {
            const resultat = await tacheService.mettreAJourTache(tache.id, { completed: termine });
            if (resultat.success) {
                setTacheComplete({ ...tacheComplete, completed: termine });
            } else {
                setErreur(resultat.error || "Erreur lors de la mise à jour");
            }
        } catch (err) {
            setErreur(err.message || "Erreur lors de la mise à jour");
        }
    };

    const ajouterPermission = async (e) => {
        e.preventDefault();
        if (!emailUtilisateur.trim()) {
            setErreur("L'email est requis");
            return;
        }

        try {
            // Note: Dans un vrai système, il faudrait d'abord récupérer l'ID utilisateur à partir de l'email
            // Pour cet exemple, on suppose que l'email est en fait l'ID utilisateur
            const resultat = await permissionService.assignerPermission({
                todoId: tache.id,
                userId: parseInt(emailUtilisateur), // Conversion temporaire
                canEdit: peutModifier,
                canDelete: peutSupprimer
            });

            if (resultat.success) {
                setEmailUtilisateur("");
                setPeutModifier(false);
                setPeutSupprimer(false);
                setAfficherFormulairePermission(false);
                chargerDetailsTache(); // Recharger les permissions
            } else {
                setErreur(resultat.error || "Erreur lors de l'ajout de la permission");
            }
        } catch (err) {
            setErreur(err.message || "Erreur lors de l'ajout de la permission");
        }
    };

    const supprimerPermission = async (utilisateurId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette permission ?")) {
            return;
        }

        try {
            await permissionService.revoquerPermission(tache.id, utilisateurId);
            chargerDetailsTache(); // Recharger les permissions
        } catch (err) {
            setErreur(err.message || "Erreur lors de la suppression de la permission");
        }
    };

    if (!tache) return null;

    const tacheAffichee = tacheComplete || tache;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Détails de la tâche
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

                    {chargement ? (
                        <div className="text-center py-8">
                            <div className="text-gray-500">Chargement...</div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Statut et titre */}
                            <div className="flex items-start gap-4">
                                <input
                                    type="checkbox"
                                    checked={tacheAffichee.completed}
                                    onChange={(e) => changerStatutTache(e.target.checked)}
                                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                    <h3 className={`text-xl font-semibold ${
                                        tacheAffichee.completed ? "line-through text-gray-500" : "text-gray-800"
                                    }`}>
                                        {tacheAffichee.title}
                                    </h3>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                                        tacheAffichee.completed 
                                            ? "bg-green-100 text-green-800" 
                                            : "bg-orange-100 text-orange-800"
                                    }`}>
                                        {tacheAffichee.completed ? "Terminée" : "En cours"}
                                    </span>
                                </div>
                                <button
                                    onClick={() => onModifier(tacheAffichee)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Modifier
                                </button>
                            </div>

                            {/* Description */}
                            {tacheAffichee.description && (
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                                    <p className={`text-gray-600 bg-gray-50 p-3 rounded-lg ${
                                        tacheAffichee.completed ? "line-through" : ""
                                    }`}>
                                        {tacheAffichee.description}
                                    </p>
                                </div>
                            )}

                            {/* Photo */}
                            {tacheAffichee.photoUrl && (
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Photo</h4>
                                    <img 
                                        src={tacheAffichee.photoUrl} 
                                        alt="Photo de la tâche"
                                        className="w-full max-w-md h-64 object-cover rounded-lg cursor-pointer hover:opacity-80"
                                        onClick={() => window.open(tacheAffichee.photoUrl, '_blank')}
                                    />
                                </div>
                            )}

                            {/* Informations */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-700 mb-3">Informations</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Créée le:</span>
                                        <div className="font-medium">
                                            {new Date(tacheAffichee.createdAt).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    {tacheAffichee.updatedAt && tacheAffichee.updatedAt !== tacheAffichee.createdAt && (
                                        <div>
                                            <span className="text-gray-500">Modifiée le:</span>
                                            <div className="font-medium">
                                                {new Date(tacheAffichee.updatedAt).toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    {tacheAffichee.user && (
                                        <div>
                                            <span className="text-gray-500">Créateur:</span>
                                            <div className="font-medium">{tacheAffichee.user.name}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Permissions */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-700">Permissions</h4>
                                    <button
                                        onClick={() => setAfficherFormulairePermission(!afficherFormulairePermission)}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        + Ajouter une permission
                                    </button>
                                </div>

                                {afficherFormulairePermission && (
                                    <form onSubmit={ajouterPermission} className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="ID utilisateur (temporaire)"
                                                value={emailUtilisateur}
                                                onChange={(e) => setEmailUtilisateur(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <div className="flex gap-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={peutModifier}
                                                        onChange={(e) => setPeutModifier(e.target.checked)}
                                                        className="mr-2"
                                                    />
                                                    Peut modifier
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={peutSupprimer}
                                                        onChange={(e) => setPeutSupprimer(e.target.checked)}
                                                        className="mr-2"
                                                    />
                                                    Peut supprimer
                                                </label>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                                >
                                                    Ajouter
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setAfficherFormulairePermission(false)}
                                                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                {permissions.length > 0 ? (
                                    <div className="space-y-2">
                                        {permissions.map((permission) => (
                                            <div key={permission.userId} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                                <div>
                                                    <div className="font-medium">
                                                        {permission.user ? permission.user.name : `Utilisateur #${permission.userId}`}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {permission.canEdit && permission.canDelete 
                                                            ? "Peut modifier et supprimer"
                                                            : permission.canEdit 
                                                                ? "Peut modifier"
                                                                : permission.canDelete 
                                                                    ? "Peut supprimer"
                                                                    : "Lecture seule"
                                                        }
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => supprimerPermission(permission.userId)}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-sm text-center py-4">
                                        Aucune permission partagée
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DetailsTache;
