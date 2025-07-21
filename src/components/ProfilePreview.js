import React from 'react';
import { getThemeStyles } from '../themes/themes';
import './ProfilePreview.css';

const ProfilePreview = ({ profile, onBack, isLivePreview = false }) => {
  const themeStyles = getThemeStyles(profile.theme);
  
  const profileStyle = {
    ...themeStyles.containerStyle,
    color: profile.textColor,
    fontFamily: profile.fontFamily,
    fontSize: `${profile.fontSize}px`,
    minHeight: isLivePreview ? '300px' : '100vh'
  };

  const buttonStyle = {
    ...themeStyles.buttonStyle,
    margin: '10px 5px'
  };

  const handleMusicClick = () => {
    if (profile.musicLink) {
      window.open(profile.musicLink, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name}'s Profile`,
          text: profile.bio,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Profile URL copied to clipboard!');
    }
  };

  return (
    <div className="profile-preview" style={profileStyle}>
      <div className="profile-container">
        {!isLivePreview && (
          <button className="back-button" onClick={onBack}>
            ← Back to Editor
          </button>
        )}
        
        <div className="profile-header">
          <div className="avatar-container">
            <span className="avatar" style={{ fontSize: `${parseInt(profile.fontSize) * 3}px` }}>
              {profile.avatar}
            </span>
          </div>
          
          <h1 className="profile-name" style={{ color: profile.textColor }}>
            {profile.name}
          </h1>
          
          <p className="profile-bio" style={{ color: profile.textColor }}>
            {profile.bio}
          </p>
        </div>

        <div className="profile-actions">
          {profile.musicLink && (
            <button 
              style={buttonStyle}
              onClick={handleMusicClick}
              className="action-button music-button"
            >
              🎵 Play My Music
            </button>
          )}
          
          {!isLivePreview && (
            <button 
              style={buttonStyle}
              onClick={handleShare}
              className="action-button share-button"
            >
              📱 Share Profile
            </button>
          )}
        </div>

        <div className="profile-footer">
          <p style={{ color: profile.textColor, opacity: 0.7 }}>
            Theme: {profile.theme}
          </p>
          {!isLivePreview && (
            <p style={{ color: profile.textColor, opacity: 0.5 }}>
              Created with ❤️ using MyCloudProfile
            </p>
          )}
        </div>

        {/* Theme-specific decorative elements */}
        {profile.theme === 'Vaporwave' && (
          <div className="vaporwave-grid">
            <div className="grid-line horizontal" style={{ top: '25%' }}></div>
            <div className="grid-line horizontal" style={{ top: '50%' }}></div>
            <div className="grid-line horizontal" style={{ top: '75%' }}></div>
            <div className="grid-line vertical" style={{ left: '25%' }}></div>
            <div className="grid-line vertical" style={{ left: '50%' }}></div>
            <div className="grid-line vertical" style={{ left: '75%' }}></div>
          </div>
        )}

        {profile.theme === 'Minecraft Pixel' && (
          <div className="minecraft-decorations">
            <div className="pixel-block" style={{ top: '10%', left: '10%' }}>⬛</div>
            <div className="pixel-block" style={{ top: '15%', right: '10%' }}>🟫</div>
            <div className="pixel-block" style={{ bottom: '10%', left: '15%' }}>🟩</div>
            <div className="pixel-block" style={{ bottom: '15%', right: '15%' }}>🟦</div>
          </div>
        )}

        {profile.theme === 'MySpace Dark' && (
          <div className="myspace-decorations">
            <div className="glitter" style={{ top: '20%', left: '20%' }}>✨</div>
            <div className="glitter" style={{ top: '70%', right: '20%' }}>⭐</div>
            <div className="glitter" style={{ bottom: '20%', left: '30%' }}>💫</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePreview;
