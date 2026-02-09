
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (success: boolean) => void;
  onCancel: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onCancel }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Specific credentials provided by user
    if (userId === '123456' && password === '8520') {
      onLogin(true);
      setError('');
    } else {
      setError('Invalid User ID or Password. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            🔐
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Authentication</h2>
          <p className="text-slate-500 text-sm mt-2">Please enter your credentials to access management tools.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">User ID</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">👤</span>
              <input 
                type="text" 
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">🔑</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-lg border border-red-100 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
            >
              Login to Admin Panel
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full text-slate-500 font-semibold py-2 hover:text-slate-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </form>
      </div>
      
      <p className="mt-8 text-xs text-slate-400 font-medium">
        Forgot password? Contact system administrator.
      </p>
    </div>
  );
};

export default Login;
