import React from 'react';
import { useAuth } from './hooks/useAuth';
import Auth from './components/Auth';
import ProfileEditor from './components/ProfileEditor';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">🌟</div>
        <p>Loading MyCloudProfile...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        <ProfileEditor user={user} />
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;
