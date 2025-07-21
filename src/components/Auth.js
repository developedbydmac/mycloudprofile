import React from 'react';
import { signInWithGoogle, signInWithGithub } from '../services/auth';
import './Auth.css';

const Auth = () => {
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
