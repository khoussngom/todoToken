import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const navigate = useNavigate();

    const handleSubmitForm = (e) => {
        e.preventDefault();
        authService.login({ email, password })
            .then((data) => {
                console.log("Login successful:", data);
                setEmail("");
                setPassword("");
                setError("");
                // Rediriger vers la page des tâches
                navigate("/taches");
            })
            .catch((err) => {
                setError(err.message || "Login failed");
            });
    
    };

    return <>
        <div className="App flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Connexion</h1>
            <form onSubmit={handleSubmitForm} className='flex flex-col gap-4 bg-white p-6 rounded shadow-md w-full max-w-md'>
                <div>
                <label htmlFor="email" className='block text-gray-700 mb-2'>Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                    name="email"
                    required
                />
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
                    required
                />
                </div>
                <button
                type="submit"
                className='w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                Se connecter
                </button>
                {error && (
                <div className="text-red-500 text-center mt-2">{error}</div>
                )}
                <h4 className="text-center mt-4 text-black">Vous n'avez pas de compte? <a href="/inscription" className="text-blue-500">S'inscrire</a></h4>
            </form>
        </div>
    </>;
    }

export default Login;