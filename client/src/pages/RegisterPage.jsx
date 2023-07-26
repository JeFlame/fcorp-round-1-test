import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function registerUser(ev) {
        ev.preventDefault();
        try {
            await axios.post('/register', { username, password });
            alert('Registration successful. Now you can log in');
            setRedirect(true);
        } catch (e) {
            alert('Registration failed. Please try again');
        }
    }

    if (redirect) {
        return <Navigate to={'/login'} />
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text" placeholder="username" value={username} onChange={ev => setUsername(ev.target.value)} />
                    <input type="password" placeholder="password" value={password} onChange={ev => setPassword(ev.target.value)} />
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already have account? <Link className="underline text-black" to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}