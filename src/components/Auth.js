import React, { useState } from 'react';
import { signInWithGoogle, signInWithGitHub, signOut, auth } from '../firebase/firebase';
import ProfilePreview from './ProfilePreview';
import { useAuthState } from 'react-firebase-hooks/auth';
import './Auth.css';

const Auth = () => {
  const [user, loading] = useAuthState(auth);
  const [showDemo, setShowDemo] = useState(false);
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);

  const demoProfiles = [
    {
      name: "Alex 💫",
      avatar: "🎸",
      bio: "Music is my life! Check out my latest tracks and let's jam together! Currently working on my debut album. 🎵✨",
      theme: "MySpace Dark",
      textColor: "#ffffff",
      fontFamily: "Arial",
      fontSize: 16,
      musicLink: "https://spotify.com",
      mood: "🎵 rockin' out",
      location: "Nashville, TN",
      lastLogin: "2 mins ago",
      topFriends: [
        { name: "Sarah", avatar: "💋", status: "online now ✨" },
        { name: "Mike", avatar: "🏄‍♂️", status: "surfing 🌊" },
        { name: "Jessica", avatar: "📚", status: "studying 📖" },
        { name: "Tom", avatar: "🎮", status: "gaming 🎯" },
        { name: "Lisa", avatar: "🎨", status: "creating art 🖌️" },
        { name: "Jake", avatar: "⚽", status: "at practice ⚽" },
        { name: "Emma", avatar: "🌸", status: "in the garden 🌻" },
        { name: "Chris", avatar: "🎭", status: "rehearsing 🎪" }
      ]
    },
    {
      name: "PixelMaster",
      avatar: "⬛",
      bio: "Welcome to my blocky world! I build amazing structures and explore infinite worlds. Join me on epic adventures! 🏗️⛏️",
      theme: "Minecraft Pixel",
      textColor: "#00ff00",
      fontFamily: "Courier New",
      fontSize: 14,
      musicLink: "https://youtube.com"
    },
    {
      name: "NeonDreamer",
      avatar: "🌸",
      bio: "Living in the aesthetic of tomorrow 🌈 Synthwave vibes and retro futures ✨ Welcome to my digital paradise! 💿🕶️",
      theme: "Vaporwave",
      textColor: "#ff00ff",
      fontFamily: "Arial",
      fontSize: 18,
      musicLink: "https://soundcloud.com"
    }
  ];

  const handleNextDemo = () => {
    setCurrentDemoIndex((prev) => (prev + 1) % demoProfiles.length);
  };

  const handlePrevDemo = () => {
    setCurrentDemoIndex((prev) => (prev - 1 + demoProfiles.length) % demoProfiles.length);
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (showDemo) {
    return (
      <div className="demo-container">
        <div className="demo-header">
          <button 
            onClick={() => setShowDemo(false)} 
            className="back-to-auth-btn"
          >
            ← Back to Login
          </button>
          <h2>Profile Demo</h2>
          <div className="demo-navigation">
            <button onClick={handlePrevDemo} className="demo-nav-btn">← Previous</button>
            <span className="demo-counter">
              {currentDemoIndex + 1} of {demoProfiles.length}
            </span>
            <button onClick={handleNextDemo} className="demo-nav-btn">Next →</button>
          </div>
        </div>
        <div className="demo-content">
          <ProfilePreview 
            profile={demoProfiles[currentDemoIndex]} 
            onBack={() => setShowDemo(false)}
            isLivePreview={false}
          />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="app-title">🌟 MyCloudProfile</h1>
          <p className="app-subtitle">Create your perfect digital persona</p>
          
          <div className="demo-section">
            <h3>✨ See What's Possible</h3>
            <p>Explore different themes and styles before you start!</p>
            <button 
              onClick={() => setShowDemo(true)}
              className="demo-button"
            >
              🎭 View Demo Profiles
            </button>
          </div>

          <div className="auth-divider">
            <span>or sign in to create your own</span>
          </div>

          <div className="auth-buttons">
            <button onClick={signInWithGoogle} className="auth-button google">
              <span className="auth-icon">🔗</span>
              Continue with Google
            </button>
            
            <button onClick={signInWithGitHub} className="auth-button github">
              <span className="auth-icon">🐙</span>
              Continue with GitHub
            </button>
          </div>

          <div className="features-list">
            <h3>🚀 Features</h3>
            <ul>
              <li>🎨 Multiple themes (MySpace, Minecraft, Vaporwave)</li>
              <li>🔗 Music integration</li>
              <li>📱 Social sharing</li>
              <li>☁️ Cloud sync</li>
              <li>📁 Import/Export profiles</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="user-info">
        <img src={user.photoURL} alt="Profile" className="user-avatar" />
        <h2>Welcome, {user.displayName}!</h2>
        <button onClick={signOut} className="sign-out-button">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Auth;