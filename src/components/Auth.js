import React, { useState } from 'react';
import { signInWithGoogle, signInWithGithub } from '../services/auth';
import ProfilePreview from './ProfilePreview';
import { getDefaultProfile } from '../services/profileService';
import './Auth.css';

const Auth = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);

  // Sample demo profiles for each theme
  const demoProfiles = [
    {
      ...getDefaultProfile(),
      name: "Sarah's Space ♪",
      avatar: "�",
      bio: "♫ Music is my life ♫ Dance like nobody's watching ♫ Living for the weekend! Thanks for visiting my space! xoxo",
      theme: "MySpace Dark",
      backgroundColor: "#000000",
      textColor: "#ffffff",
      fontSize: "16",
      fontFamily: "Arial, sans-serif",
      musicLink: "https://open.spotify.com/playlist/example",
      topFriends: [
        { name: "Jessica", avatar: "👸", status: "BFF 4ever!" },
        { name: "Mike", avatar: "🎸", status: "Band buddy" },
        { name: "Emma", avatar: "🌟", status: "Party girl!" },
        { name: "Jake", avatar: "😎", status: "Cool dude" },
        { name: "Ashley", avatar: "💕", status: "Bestie" },
        { name: "Ryan", avatar: "🎮", status: "Gamer bro" },
        { name: "Chloe", avatar: "🦄", status: "Unicorn queen" },
        { name: "Tyler", avatar: "🏀", status: "Sports guy" }
      ],
      mood: "🎵 jamming to my playlist",
      location: "Cyber Space",
      lastLogin: "Online now!"
    },
    {
      ...getDefaultProfile(),
      name: "BlockMaster Alex",
      avatar: "🧱",
      bio: "Welcome to my pixel world! I love building, crafting, and creating. Every block tells a story! 🏗️⛏️",
      theme: "Minecraft Pixel",
      backgroundColor: "#8B4513",
      textColor: "#ffffff",
      fontSize: "18",
      fontFamily: "monospace",
      musicLink: "https://youtube.com/watch?v=minecraft-music"
    },
    {
      ...getDefaultProfile(),
      name: "Neon Dreams Luna",
      avatar: "🌙",
      bio: "Aesthetic vibes only! Lost in the synthwave and loving every pixel of it. Welcome to my digital dreamscape! 💜🌈",
      theme: "Vaporwave",
      backgroundColor: "#ff00ff",
      textColor: "#00ffff",
      fontSize: "20",
      fontFamily: '"Courier New", monospace',
      musicLink: "https://soundcloud.com/synthwave-vibes"
    }
  ];

  const handleNextDemo = () => {
    setCurrentDemoIndex((prev) => (prev + 1) % demoProfiles.length);
  };

  const handlePrevDemo = () => {
    setCurrentDemoIndex((prev) => (prev - 1 + demoProfiles.length) % demoProfiles.length);
  };
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      alert('Error signing in with Google: ' + error.message);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithGithub();
    } catch (error) {
      alert('Error signing in with GitHub: ' + error.message);
    }
  };

  if (showDemo) {
    return (
      <div className="demo-container">
        <div className="demo-header">
          <button 
            className="back-to-auth-btn"
            onClick={() => setShowDemo(false)}
          >
            ← Back to Login
          </button>
          <h2>Profile Demo - {demoProfiles[currentDemoIndex].theme}</h2>
          <div className="demo-navigation">
            <button className="demo-nav-btn" onClick={handlePrevDemo}>
              ← Previous
            </button>
            <span className="demo-counter">
              {currentDemoIndex + 1} of {demoProfiles.length}
            </span>
            <button className="demo-nav-btn" onClick={handleNextDemo}>
              Next →
            </button>
          </div>
        </div>
        <ProfilePreview 
          profile={demoProfiles[currentDemoIndex]} 
          isLivePreview={false}
        />
        <div className="demo-footer">
          <p>This is what your profile could look like! Sign up to create your own.</p>
          <button 
            className="cta-button"
            onClick={() => setShowDemo(false)}
          >
            🚀 Create My Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">🌟 MyCloudProfile</h1>
        <p className="auth-subtitle">
          Create your unique profile in the cloud! 
          Design, customize, and share your creative identity.
        </p>
        
        <div className="auth-features">
          <div className="feature">
            <span className="feature-icon">🎨</span>
            <span>Custom Themes</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎵</span>
            <span>Music Integration</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📱</span>
            <span>Export & Share</span>
          </div>
          <div className="feature">
            <span className="feature-icon">☁️</span>
            <span>Cloud Saved</span>
          </div>
        </div>

        <div className="auth-buttons">
          <button 
            className="auth-button google-button" 
            onClick={handleGoogleSignIn}
          >
            <span className="button-icon">🔍</span>
            Sign in with Google
          </button>
          
          <button 
            className="auth-button github-button" 
            onClick={handleGithubSignIn}
          >
            <span className="button-icon">🐙</span>
            Sign in with GitHub
          </button>

          <div className="divider">
            <span>or</span>
          </div>
          
          <button 
            className="auth-button demo-button" 
            onClick={() => setShowDemo(true)}
          >
            <span className="button-icon">👀</span>
            Try Demo First
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Perfect for kids, creators, and anyone who loves to express their creativity!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
