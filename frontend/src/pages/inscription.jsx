import { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";


function Inscription() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("USER");
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmitForm = (e) => {
        e.preventDefault();
        
        setErrors({});
        setGeneralError("");
        setLoading(true);
        
        if (password !== confirmPassword) {
            setGeneralError("Les mots de passe ne correspondent pas");
            setLoading(false);
            return;
        }
        
        authService.inscription({ email, password, name, role })
            .then((data) => {
                console.log("Inscription successful:", data);
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setName("");
                setRole("USER");
                setErrors({});
                setGeneralError("");
                navigate("/login");
            })
            .catch((err) => {
                console.log("Error response:", err);
                if (err.details && Array.isArray(err.details)) {
                    const fieldErrors = {};
                    err.details.forEach(detail => {
                        if (detail.path && detail.path.length > 0) {
                            const fieldName = detail.path[0];
                            fieldErrors[fieldName] = detail.message;
                        }
                    });
                    setErrors(fieldErrors);
                    setGeneralError(err.error || "Erreur de validation");
                } else {
                    setGeneralError(err.message || err.error || "Inscription échouée");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleGoogleSignup = () => {
        setLoading(true);
        setGeneralError("");
        
        authService.loginWithGoogle()
            .then((data) => {
                console.log("Google signup successful:", data);
                navigate("/taches");
            })
            .catch((err) => {
                setGeneralError(err.message || "Échec de l'inscription avec Google");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    
    return <>
        <div className="App flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Inscription</h1>
            <form onSubmit={handleSubmitForm} className='flex flex-col gap-4 bg-white p-6 rounded shadow-md w-full max-w-md'>
                <div>
                <label htmlFor="name" className='block text-gray-700 mb-2'>Nom complet:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                    name="name"
                />
                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                </div>
                <div>
                <label htmlFor="email" className='block text-gray-700 mb-2'>Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                    name="email"    
                    
                />
                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                </div>
                <div>
                <label htmlFor="password" className='block text-gray-700 mb-2'>Mot de passe:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                    name="password"
                    
                />
                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                </div>
                <div>
                <label htmlFor="confirmPassword" className='block text-gray-700 mb-2'>Confirmer le mot de passe:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                    name="confirmPassword"
                    
                />
                </div>
                <div>
                <label htmlFor="role" className='block text-gray-700 mb-2'>Rôle:</label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className='w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                    name="role"
                    
                >
                    <option value="USER">Utilisateur</option>
                    <option value="ADMIN">Administrateur</option>
                </select>
                {errors.role && <div className="text-red-500 text-sm mt-1">{errors.role}</div>}
                </div>
                <button
                type="submit"
                disabled={loading}
                className='w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed'
                >
                {loading ? "Inscription..." : "S'inscrire"}
                </button>
                
                <div className="flex items-center justify-center my-4">
                    <hr className="flex-grow border-gray-300" />
                    <span className="px-3 text-gray-500 text-sm">ou</span>
                    <hr className="flex-grow border-gray-300" />
                </div>
                
                <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={loading}
                className='w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? "Inscription..." : "Continuer avec Google"}
                </button>
                {generalError && (
                <div className="text-red-500 text-center mt-2">{generalError}</div>
                )}
            </form>
        </div>
    </>;
}

export default Inscription;