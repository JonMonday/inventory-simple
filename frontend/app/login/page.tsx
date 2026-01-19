'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Package } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            router.push('/');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <div className="max-w-md w-full space-y-8 bg-card p-8 border rounded-2xl shadow-lg">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Package className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Antigravity INV</h2>
                    <p className="mt-2 text-muted-foreground">Sign in to manage your inventory</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Username</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-destructive text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Sign In
                    </button>
                </form>

                <div className="pt-4 text-center text-xs text-muted-foreground">
                    <p>Demo accounts: admin / password, jon / password</p>
                </div>
            </div>
        </div>
    );
}
