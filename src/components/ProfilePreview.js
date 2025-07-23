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
    minHeight: isLivePreview ? '300px' : '100%',
    height: isLivePreview ? 'auto' : '100%',
    width: '100%',
    maxWidth: isLivePreview ? '800px' : 'none',
    margin: '0 auto'
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
      navigator.clipboard.writeText(window.location.href);
      alert('Profile URL copied to clipboard!');
    }
  };

  // Render MySpace-style layout
  const renderMySpaceLayout = () => (
    <div className="myspace-layout">
      <div className="myspace-header">
        <div className="profile-main-info">
          <div className="profile-image">
            <span style={{ fontSize: '4rem' }}>{profile.avatar}</span>
          </div>
          <div className="profile-details">
            <h1 className="myspace-name">{profile.name}</h1>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">Mood:</span>
                <span className="stat-value">{profile.mood || "😊 chillin'"}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Location:</span>
                <span className="stat-value">{profile.location || "Internet"}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Last Login:</span>
                <span className="stat-value">{profile.lastLogin || "Just now!"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="myspace-content">
        <div className="myspace-left-column">
          <div className="myspace-section">
            <h3 className="section-title">About Me</h3>
            <div className="section-content">
              <p>{profile.bio}</p>
            </div>
          </div>

          {profile.musicLink && (
            <div className="myspace-section">
              <h3 className="section-title">My Music</h3>
              <div className="section-content">
                <button 
                  className="myspace-music-btn"
                  onClick={handleMusicClick}
                >
                  ♪ Now Playing: My Favorite Songs ♪
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="myspace-right-column">
          {profile.topFriends && (
            <div className="myspace-section">
              <h3 className="section-title">My Top 8</h3>
              <div className="top-friends-grid">
                {profile.topFriends.map((friend, index) => (
                  <div key={index} className="friend-card">
                    <div className="friend-avatar">{friend.avatar}</div>
                    <div className="friend-name">{friend.name}</div>
                    <div className="friend-status">{friend.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-preview" style={profileStyle}>
      <div className="profile-container">
        {!isLivePreview && onBack && (
          <button className="back-button" onClick={onBack}>
            ← Back to Editor
          </button>
        )}
        
        {profile.theme === 'MySpace Dark' ? (
          renderMySpaceLayout()
        ) : (
          <>
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
                  🎵 Play Music
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
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePreview;
