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
    FiLock,
    FiFileText
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
        itemsPerPage: 4,
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
                // Rafraîchir les notifications
                if (window.refreshNotifications) {
                    window.refreshNotifications();
                }
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

    const getGradientByStatus = (tache, estTacheUtilisateur) => {
        if (tache.completed) {
            return "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600";
        }
        if (estTacheUtilisateur) {
            return "bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600";
        }
        return "bg-gradient-to-br from-gray-400 via-slate-500 to-gray-600";
    };

    const getWavePattern = () => (
        <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                    d="M20,20 Q30,10 40,20 T60,20 T80,20 Q90,30 80,40 T60,40 T40,40 Q30,50 40,60 T60,60 T80,60"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="0.5"
                    fill="none"
                />
                <path
                    d="M10,30 Q20,20 30,30 T50,30 T70,30 Q80,40 70,50 T50,50 T30,50 Q20,60 30,70 T50,70 T70,70"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.3"
                    fill="none"
                />
            </svg>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Mes Tâches</h2>
                <button
                    onClick={onCreerTache}
                    className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                            >
                                <div className={`relative h-32 ${getGradientByStatus(tache, estTacheUtilisateur)} overflow-hidden`}>
                                    {getWavePattern()}
                                    
                                    <div className="absolute top-3 right-3">
                                        {tache.completed ? (
                                            <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
                                                ✓ Terminé
                                            </div>
                                        ) : estTacheUtilisateur ? (
                                            <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30 group-hover:opacity-0 transition-opacity duration-200 ">
                                                Ma tâche
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="absolute bottom-4 left-4">
                                        {tache.photoUrl ? (
                                            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/50 bg-white/10 backdrop-blur-sm">
                                                <img 
                                                    src={tache.photoUrl} 
                                                    alt="Photo de la tâche"
                                                    className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300"
                                                    onClick={() => window.open(tache.photoUrl, '_blank')}
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-xl border-2 border-white/50 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                                <FiFileText size={24} className="text-white/80" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                                        <button
                                            onClick={() => onSelectionnerTache(tache)}
                                            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                                            title="Voir détails"
                                        >
                                            <FiEye size={14} />
                                        </button>
                                        <button
                                            onClick={() => onSelectionnerTache(tache, true)}
                                            disabled={!peutModifier}
                                            className={`p-2 rounded-lg border border-white/30 backdrop-blur-sm transition-colors ${
                                                peutModifier 
                                                    ? "bg-white/20 text-white hover:bg-white/30" 
                                                    : "bg-black/20 text-white/50 cursor-not-allowed"
                                            }`}
                                            title={peutModifier ? "Modifier" : "Modification non autorisée"}
                                        >
                                            {peutModifier ? <FiEdit size={14} /> : <FiLock size={14} />}
                                        </button>
                                        <button
                                            onClick={() => supprimerTache(tache.id)}
                                            disabled={!peutSupprimer}
                                            className={`p-2 rounded-lg border border-white/30 backdrop-blur-sm transition-colors ${
                                                peutSupprimer 
                                                    ? "bg-white/20 text-white hover:bg-red-400/50" 
                                                    : "bg-black/20 text-white/50 cursor-not-allowed"
                                            }`}
                                            title={peutSupprimer ? "Supprimer" : "Suppression non autorisée"}
                                        >
                                            {peutSupprimer ? <FiTrash2 size={14} /> : <FiLock size={14} />}
                                        </button>
                                    </div>
                                </div>


                                <div className="p-6">

                                    <div className="flex items-start gap-3 mb-3">
                                        <input
                                            type="checkbox"
                                            checked={tache.completed}
                                            onChange={(e) => changerStatutTache(tache.id, e.target.checked)}
                                            disabled={!peutModifier}
                                        className={`mt-1 w-3 h-3  text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition-all ${
                                                !peutModifier ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                                            }`}
                                        />
                                        <h3 className={`text-lg font-bold leading-tight ${
                                            tache.completed ? "line-through text-gray-500" : "text-gray-800"
                                        }`}>
                                            {tache.title}
                                        </h3>
                                    </div>


                                    {tache.description && (
                                        <p className={`text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed ${
                                            tache.completed ? "line-through" : ""
                                        }`}>
                                            {tache.description}
                                        </p>
                                    )}


                                    <div className="flex flex-col  items-start justify-arround gap-3 text-xs text-gray-500 pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-1">
                                            <FiCalendar size={12} />
                                            <span>{new Date(tache.createdAt).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                        <div className="flex items-center gap-2">

                                            {/* <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                                estTacheUtilisateur ? 'bg-blue-500' : 'bg-gray-400'
                                            }`}>
                                                {estTacheUtilisateur ? 'V' : (tache.user?.name?.charAt(0) || '?')}
                                            </div> */}
                                            <span className="truncate max-w-20" title={tache.user?.name || 'Utilisateur inconnu'}>
                                                {estTacheUtilisateur ? 'Vous' : (tache.user?.name || 'Inconnu')}
                                            </span>
                                        </div>
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
                                className="px-3 py-1 text-black border border-gray-300
                                            rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={8}>8</option>
                                <option value={12}>12</option>
                                <option value={20}>20</option>
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
                                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg"
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
                                                        ? "bg-blue-600 text-white shadow-md"
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
                                        ? "bg-blue-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg"
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