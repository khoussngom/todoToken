import { useState } from "react";
import servicePermissionTache from "../services/servicePermissionTache";

function AfficherTache({ tache, onModifier, onSupprimer, onFermer }) {
    const [permissions, setPermissions] = useState([]);
    const [chargementPermissions, setChargementPermissions] = useState(false);
    const [afficherPermissions, setAfficherPermissions] = useState(false);


    const chargerPermissions = async () => {
        if (!tache || afficherPermissions) return;

        setChargementPermissions(true);
        try {
            const resultat = await servicePermissionTache.obtenirPermissions(tache.id);
            if (resultat.success) {
                setPermissions(resultat.data || []);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des permissions:", error);
        } finally {
            setChargementPermissions(false);
        }
    };

    const basculerPermissions = () => {
        if (!afficherPermissions) {
            chargerPermissions();
        }
        setAfficherPermissions(!afficherPermissions);
    };

    const formaterDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!tache) {
        return <div className="text-center">Tâche non trouvée</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">

            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{tache.title}</h2>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        tache.completed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {tache.completed ? '✓ Terminée' : '○ En cours'}
                    </div>
                </div>
                

                <div className="flex gap-2 ml-4">
                    {onModifier && (
                        <button
                            onClick={() => onModifier(tache)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Modifier
                        </button>
                    )}
                    {onSupprimer && (
                        <button
                            onClick={() => onSupprimer(tache.id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Supprimer
                        </button>
                    )}
                    {onFermer && (
                        <button
                            onClick={onFermer}
                            className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Fermer
                        </button>
                    )}
                </div>
            </div>


            {tache.description && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                        {tache.description}
                    </p>
                </div>
            )}


            {tache.photoUrl && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Photo</h3>
                    <img
                        src={tache.photoUrl}
                        alt="Photo de la tâche"
                        className="w-full max-w-md h-auto rounded-md border shadow-sm"
                    />
                </div>
            )}


            <div className="mb-4 bg-gray-50 p-3 rounded-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Informations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                        <span className="font-medium">Créée le:</span>{' '}
                        {formaterDate(tache.createdAt)}
                    </div>
                    <div>
                        <span className="font-medium">Modifiée le:</span>{' '}
                        {formaterDate(tache.updatedAt)}
                    </div>
                    <div>
                        <span className="font-medium">ID utilisateur:</span> {tache.userId}
                    </div>
                    <div>
                        <span className="font-medium">ID tâche:</span> {tache.id}
                    </div>
                </div>
            </div>


            <div className="mb-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-700">Permissions partagées</h3>
                    <button
                        onClick={basculerPermissions}
                        className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {afficherPermissions ? 'Masquer' : 'Voir'}
                    </button>
                </div>

                {afficherPermissions && (
                    <div className="mt-3 bg-indigo-50 p-3 rounded-md">
                        {chargementPermissions ? (
                            <p className="text-indigo-600">Chargement des permissions...</p>
                        ) : permissions.length > 0 ? (
                            <div className="space-y-2">
                                {permissions.map((permission) => (
                                    <div
                                        key={`${permission.todoId}-${permission.userId}`}
                                        className="bg-white p-2 rounded border text-sm"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-700">
                                                Utilisateur ID: {permission.userId}
                                            </span>
                                            <div className="flex gap-2">
                                                {permission.canEdit && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                                        Peut modifier
                                                    </span>
                                                )}
                                                {permission.canDelete && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                                                        Peut supprimer
                                                    </span>
                                                )}
                                                {!permission.canEdit && !permission.canDelete && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                                                        Lecture seule
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Accordée le: {formaterDate(permission.createdAt)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-indigo-600">Aucune permission partagée pour cette tâche.</p>
                        )}
                    </div>
                )}
            </div>


            <div className="border-t pt-4">
                <p className="text-sm text-gray-500 text-center">
                    Cette tâche peut être partagée avec d'autres utilisateurs via les permissions.
                </p>
            </div>
        </div>
    );
}

export default AfficherTache;
