import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Game from './components/Game';

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
      const savedUser = localStorage.getItem('hh_current_user');
      if (savedUser) {
          setUser(savedUser);
      }
  }, []);

  const handleLogin = (username: string) => {
      // Simple auth: just sets the username. In a real app, this would verify credentials.
      localStorage.setItem('hh_current_user', username);
      setUser(username);
  };

  const handleLogout = () => {
      localStorage.removeItem('hh_current_user');
      setUser(null);
  };

  // If no user is logged in, show the Auth screen
  if (!user) {
      return <Auth onLogin={handleLogin} />;
  }

  // If user is logged in, show the Game screen, passing the username
  return <Game username={user} onLogout={handleLogout} />;
};

export default App;