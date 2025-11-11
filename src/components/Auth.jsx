import React, { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import { LogIn, UserPlus } from 'lucide-react';

function Auth() {
	const supabase = getSupabase();
	const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [info, setInfo] = useState('');

	useEffect(() => {
		setError('');
		setInfo('');
	}, [mode]);

	if (!supabase) {
		return (
			<div className="flex h-screen items-center justify-center bg-background">
				<div className="p-6 rounded-2xl border border-border glass-effect max-w-md w-full text-center">
					<h2 className="text-xl font-semibold mb-2">Supabase not configured</h2>
					<p className="text-text-secondary">
						Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local and restart dev server.
					</p>
				</div>
			</div>
		);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setInfo('');
		try {
			if (mode === 'signin') {
				const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
				if (signInError) throw signInError;
			} else {
				const { error: signUpError } = await supabase.auth.signUp({ email, password });
				if (signUpError) throw signUpError;
				setInfo('Account created. Check your email for verification if required, then sign in.');
			}
		} catch (err) {
			setError(err?.message || 'Authentication failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex h-screen items-center justify-center bg-background">
			<div className="p-6 rounded-2xl border border-border glass-effect max-w-md w-full">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-gradient">AI Messenger</h1>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => setMode('signin')}
							className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${mode === 'signin' ? 'bg-primary text-black' : 'hover:bg-surface-light'}`}
						>
							<LogIn className="w-4 h-4" />
							Sign in
						</button>
						<button
							type="button"
							onClick={() => setMode('signup')}
							className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${mode === 'signup' ? 'bg-primary text-black' : 'hover:bg-surface-light'}`}
						>
							<UserPlus className="w-4 h-4" />
							Sign up
						</button>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm mb-1 text-text-secondary">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-4 py-2 bg-surface-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
							placeholder="you@example.com"
						/>
					</div>
					<div>
						<label className="block text-sm mb-1 text-text-secondary">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={6}
							className="w-full px-4 py-2 bg-surface-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
							placeholder="••••••••"
						/>
					</div>

					{error ? (
						<div className="text-sm text-red-400">{error}</div>
					) : info ? (
						<div className="text-sm text-green-400">{info}</div>
					) : null}

					<button
						type="submit"
						disabled={loading}
						className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-black font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
					>
						{mode === 'signin' ? 'Sign in' : 'Create account'}
					</button>
				</form>
			</div>
		</div>
	);
}

export default Auth;


