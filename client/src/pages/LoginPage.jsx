import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUser } = useContext(UserContext);

    async function loginUser(ev) {
        ev.preventDefault();
        const { data } = await axios.post('/login', { username, password });
        setUser(data.user);
        setRedirect(true);
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={loginUser}>
                    <input type="text" placeholder="username" value={username} onChange={ev => setUsername(ev.target.value)} />
                    <input type="password" placeholder="password" value={password} onChange={ev => setPassword(ev.target.value)} />
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don&apos;t have an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}