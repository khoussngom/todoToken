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

    const navigate = useNavigate();

    const handleSubmitForm = (e) => {
        e.preventDefault();
        
        setErrors({});
        setGeneralError("");
        
        if (password !== confirmPassword) {
            setGeneralError("Les mots de passe ne correspondent pas");
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
                className='w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                S'inscrire
                </button>
                {generalError && (
                <div className="text-red-500 text-center mt-2">{generalError}</div>
                )}
            </form>
        </div>
    </>;
}

export default Inscription;