import { useState, useEffect } from "react";
import serviceTache from "../services/serviceTache";
import { 
    FiPlus, 
    FiEdit, 
    FiEye, 
    FiTrash2, 
    FiCheck, 
    FiX,
    FiClock,
    FiFilter,
    FiRefreshCw,
    FiImage,
    FiCalendar,
    FiChevronLeft,
    FiChevronRight,
    FiUser,
    FiLock
} from "react-icons/fi";

function ListerTaches({ onSelectionnerTache, onCreerTache }) {
    const [taches, setTaches] = useState([]);
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState("");
    const [filtreTache, setFiltreTache] = useState("toutes");
    const [utilisateurConnecte, setUtilisateurConnecte] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 5,
        hasNextPage: false,
        hasPrevPage: false
    });

    useEffect(() => {
        const utilisateur = localStorage.getItem("user");
        if (utilisateur) {
            const donneeUtilisateur = JSON.parse(utilisateur);
            setUtilisateurConnecte(donneeUtilisateur.token?.user || null);
        }
    }, []);

    useEffect(() => {
        const charger = async () => {
            try {
                setChargement(true);
                setErreur("");
                
                const filtres = {};
                if (filtreTache === "terminees") {
                    filtres.completed = true;
                } else if (filtreTache === "encours") {
                    filtres.completed = false;
                }

                const paginationOptions = {
                    page: pagination.currentPage,
                    limit: pagination.itemsPerPage
                };

                const resultat = await serviceTache.obtenirToutesLesTaches(filtres, paginationOptions);
                
                if (resultat.success) {
                    setTaches(resultat.data || []);
                    if (resultat.pagination) {
                        setPagination(resultat.pagination);
                    }
                } else {
                    setErreur(resultat.error || "Erreur lors du chargement des tâches");
                }
            } catch (err) {
                setErreur(err.message || "Erreur lors du chargement des tâches");
            } finally {
                setChargement(false);
            }
        };
        
        charger();
    }, [filtreTache, pagination.currentPage, pagination.itemsPerPage]);

    const chargerTaches = async () => {
        try {
            setChargement(true);
            setErreur("");
            
            const filtres = {};
            if (filtreTache === "terminees") {
                filtres.completed = true;
            } else if (filtreTache === "encours") {
                filtres.completed = false;
            }

            const paginationOptions = {
                page: pagination.currentPage,
                limit: pagination.itemsPerPage
            };

            const resultat = await serviceTache.obtenirToutesLesTaches(filtres, paginationOptions);
            
            if (resultat.success) {
                setTaches(resultat.data || []);
                if (resultat.pagination) {
                    setPagination(resultat.pagination);
                }
            } else {
                setErreur(resultat.error || "Erreur lors du chargement des tâches");
            }
        } catch (err) {
            setErreur(err.message || "Erreur lors du chargement des tâches");
        } finally {
            setChargement(false);
        }
    };

    const changerStatutTache = async (tacheId, termine) => {
        try {
            const resultat = await serviceTache.modifierTache(tacheId, { completed: termine });
            if (resultat.success) {
                chargerTaches();
            } else {
                setErreur(resultat.error || "Erreur lors de la mise à jour");
            }
        } catch (err) {
            setErreur(err.message || "Erreur lors de la mise à jour");
        }
    };

    const supprimerTache = async (tacheId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
            return;
        }

        try {
            const resultat = await serviceTache.supprimerTache(tacheId);
            if (resultat.success) {
                chargerTaches();
            } else {
                setErreur(resultat.error || "Erreur lors de la suppression");
            }
        } catch (err) {
            setErreur(err.message || "Erreur lors de la suppression");
        }
    };

    const allerALaPage = (numeroPage) => {
        if (numeroPage >= 1 && numeroPage <= pagination.totalPages) {
            setPagination(prev => ({
                ...prev,
                currentPage: numeroPage
            }));
        }
    };

    const pageSuivante = () => {
        if (pagination.hasNextPage) {
            allerALaPage(pagination.currentPage + 1);
        }
    };

    const pagePrecedente = () => {
        if (pagination.hasPrevPage) {
            allerALaPage(pagination.currentPage - 1);
        }
    };

    const changerFiltre = (nouveauFiltre) => {
        setFiltreTache(nouveauFiltre);
        setPagination(prev => ({
            ...prev,
            currentPage: 1
        }));
    };

    const changerLimiteParPage = (nouvelleLimite) => {
        setPagination(prev => ({
            ...prev,
            itemsPerPage: nouvelleLimite,
            currentPage: 1
        }));
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Mes Tâches</h2>
                <button
                    onClick={onCreerTache}
                    className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                >
                    <FiPlus size={24} />
                    Créer une tâche
                </button>
            </div>


            <div className="mb-8">
                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-md">
                    <FiFilter className="text-gray-500" size={20} />
                    <span className="text-gray-700 font-medium">Filtrer :</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => changerFiltre("toutes")}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${ 
                                filtreTache === "toutes" 
                                    ? "bg-cyan-500 text-white shadow-md" 
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            Toutes
                        </button>
                        <button
                            onClick={() => changerFiltre("encours")}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${ 
                                filtreTache === "encours" 
                                    ? "bg-orange-500 text-white shadow-md" 
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <FiClock size={16} />
                                En Cours
                            </div>
                        </button>
                        <button
                            onClick={() => changerFiltre("terminees")}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${ 
                                filtreTache === "terminees" 
                                    ? "bg-green-500 text-white shadow-md" 
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <FiCheck size={16} />
                                Terminées
                            </div>
                        </button>
                    </div>
                    {/* <button
                        onClick={chargerTaches}
                        className="ml-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Actualiser"
                    >
                        <FiRefreshCw size={18} className="text-gray-600" />
                    </button> */}
                </div>
            </div>

            {erreur && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {erreur}
                </div>
            )}

            {chargement ? (
                <div className="text-center py-8">
                    <div className="text-gray-500">Chargement des tâches...</div>
                </div>
            ) : taches.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-500 text-lg mb-4">
                        {filtreTache === "toutes" 
                            ? "Aucune tâche trouvée" 
                            : `Aucune tâche ${filtreTache === "terminees" ? "terminée" : "en cours"}`}
                    </div>
                    <button
                        onClick={onCreerTache}
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg transform hover:scale-105"
                    >
                        <FiPlus size={20} />
                        Créer votre première tâche
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {taches.map((tache) => {
                        const estTacheUtilisateur = utilisateurConnecte && tache.userId === utilisateurConnecte.id;
                        
                        const permissionUtilisateur = tache.permissions?.find(
                            perm => perm.userId === utilisateurConnecte?.id
                        );
                        
                        const peutModifier = estTacheUtilisateur || (permissionUtilisateur && permissionUtilisateur.canEdit);
                        const peutSupprimer = estTacheUtilisateur || (permissionUtilisateur && permissionUtilisateur.canDelete);

                        return (
                        <div 
                            key={tache.id} 
                            className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 hover:shadow-xl transition-all duration-200 ${
                                tache.completed ? "border-green-500 bg-green-50/30" : 
                                estTacheUtilisateur ? "border-cyan-500 bg-cyan-50/20" : "border-gray-400"
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-3">
                                        <input
                                            type="checkbox"
                                            checked={tache.completed}
                                            onChange={(e) => changerStatutTache(tache.id, e.target.checked)}
                                            disabled={!peutModifier}
                                            className={`mr-4 w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500 transform scale-125 ${
                                                !peutModifier ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        />
                                        <h3 
                                            className={`text-xl font-semibold ${
                                                tache.completed ? "line-through text-gray-500" : "text-gray-800"
                                            }`}
                                        >
                                            {tache.title}
                                        </h3>
                                        {estTacheUtilisateur && (
                                            <span className="ml-3 px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded-full font-medium">
                                                Ma tâche
                                            </span>
                                        )}
                                    </div>
                                    
                                    {tache.description && (
                                        <p className={`text-gray-600 mb-4 ml-9 ${
                                            tache.completed ? "line-through" : ""
                                        }`}>
                                            {tache.description}
                                        </p>
                                    )}

                                    {tache.photoUrl && (
                                        <div className="ml-9 mb-4">
                                            <div className="relative inline-block">
                                                <img 
                                                    src={tache.photoUrl} 
                                                    alt="Photo de la tâche"
                                                    className="w-24 h-24 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity shadow-md"
                                                    onClick={() => window.open(tache.photoUrl, '_blank')}
                                                />
                                                <div className="absolute -top-2 -right-2 bg-cyan-500 p-1 rounded-full">
                                                    <FiImage size={12} className="text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="ml-9 text-sm text-gray-500 flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <FiCalendar size={14} />
                                            Créée le {new Date(tache.createdAt).toLocaleDateString('fr-FR')}
                                        </div>
                                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                                            <FiUser size={14} className="text-blue-600" />
                                            <span className="font-medium text-gray-700">
                                                {tache.user?.name || 'Utilisateur inconnu'}
                                            </span>
                                            {estTacheUtilisateur && (
                                                <span className="ml-1 text-xs bg-cyan-500 text-white px-1 rounded">
                                                    Vous
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => onSelectionnerTache(tache)}
                                        className="flex items-center justify-center w-10 h-10 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-all duration-200"
                                        title="Voir détails"
                                    >
                                        <FiEye size={18} />
                                    </button>
                                    <button
                                        onClick={() => onSelectionnerTache(tache, true)}
                                        disabled={!peutModifier}
                                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                                            peutModifier 
                                                ? "text-green-600 hover:text-green-800 hover:bg-green-50" 
                                                : "text-gray-400 cursor-not-allowed"
                                        }`}
                                        title={peutModifier ? "Modifier" : "Modification non autorisée"}
                                    >
                                        {peutModifier ? <FiEdit size={18} /> : <FiLock size={18} />}
                                    </button>
                                    <button
                                        onClick={() => supprimerTache(tache.id)}
                                        disabled={!peutSupprimer}
                                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                                            peutSupprimer 
                                                ? "text-red-600 hover:text-red-800 hover:bg-red-50" 
                                                : "text-gray-400 cursor-not-allowed"
                                        }`}
                                        title={peutSupprimer ? "Supprimer" : "Suppression non autorisée"}
                                    >
                                        {peutSupprimer ? <FiTrash2 size={18} /> : <FiLock size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            )}

            {!chargement && taches.length > 0 && (
                <div className="mt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-md">
                        <div className="flex items-center gap-3">
                            <span className="text-gray-700 text-sm">Éléments par page :</span>
                            <select
                                value={pagination.itemsPerPage}
                                onChange={(e) => changerLimiteParPage(parseInt(e.target.value))}
                                className="px-3 py-1 text-black border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value={3}>3</option>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        <div className="text-sm text-gray-600">
                            Affichage {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} à {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} sur {pagination.totalItems} tâches
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={pagePrecedente}
                                disabled={!pagination.hasPrevPage}
                                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                                    pagination.hasPrevPage
                                        ? "bg-cyan-500 text-white hover:bg-cyan-600 shadow-md hover:shadow-lg"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                                title="Page précédente"
                            >
                                <FiChevronLeft size={20} />
                            </button>


                            <div className="flex gap-1">
                                {(() => {
                                    const pages = [];
                                    const totalPages = pagination.totalPages;
                                    const currentPage = pagination.currentPage;
                                    

                                    let startPage = Math.max(1, currentPage - 2);
                                    let endPage = Math.min(totalPages, startPage + 4);
                                    
                                    if (endPage - startPage < 4) {
                                        startPage = Math.max(1, endPage - 4);
                                    }
                                    
                                    for (let i = startPage; i <= endPage; i++) {
                                        pages.push(
                                            <button
                                                key={i}
                                                onClick={() => allerALaPage(i)}
                                                className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${
                                                    i === currentPage
                                                        ? "bg-cyan-500 text-white shadow-md"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                            >
                                                {i}
                                            </button>
                                        );
                                    }
                                    
                                    return pages;
                                })()}
                            </div>

                            <button
                                onClick={pageSuivante}
                                disabled={!pagination.hasNextPage}
                                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                                    pagination.hasNextPage
                                        ? "bg-cyan-500 text-white hover:bg-cyan-600 shadow-md hover:shadow-lg"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                                title="Page suivante"
                            >
                                <FiChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListerTaches;