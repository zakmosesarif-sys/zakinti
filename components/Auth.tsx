import React, { useState } from 'react';
import { User, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: (username: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6 font-fredoka">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-indigo-600 mb-2 flex items-center justify-center gap-2">
              HabitHatch <span className="text-4xl">🥚</span>
            </h1>
            <p className="text-gray-500 font-medium">Create a personal account to save your progress!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Username</label>
                <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all bg-gray-50 focus:bg-white"
                        placeholder="Enter your name..."
                        required
                        autoFocus
                    />
                </div>
            </div>
            
            <button 
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center text-lg"
            >
                Start Adventure <ArrowRight className="ml-2" />
            </button>
        </form>
        <div className="mt-8 pt-6 border-t border-gray-100">
           <p className="text-center text-xs text-gray-400">
              Your progress is automatically saved to this device for this username.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;