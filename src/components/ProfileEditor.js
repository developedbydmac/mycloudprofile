import React, { useState, useEffect, useRef } from 'react';
import { SketchPicker } from 'react-color';
import { 
  saveProfile, 
  getProfile, 
  exportProfileAsJSON, 
  importProfileFromJSON, 
  getDefaultProfile 
} from '../services/profileService';
import { signOut } from '../services/auth';
import { themes, getThemeStyles, getThemeNames } from '../themes/themes';
import ProfilePreview from './ProfilePreview';
import './ProfileEditor.css';

const ProfileEditor = ({ user }) => {
  const [profile, setProfile] = useState(getDefaultProfile());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerType, setColorPickerType] = useState('background');
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (user) {
      try {
        const result = await getProfile(user.uid);
        if (result.success) {
          setProfile(result.data);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      await saveProfile(user.uid, profile);
      alert('Profile saved successfully! 🎉');
    } catch (error) {
      alert('Error saving profile: ' + error.message);
    }
    setSaving(false);
  };

  const handleExport = () => {
    exportProfileAsJSON(profile);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const importedProfile = await importProfileFromJSON(file);
        setProfile({ ...profile, ...importedProfile });
        alert('Profile imported successfully! 🎉');
      } catch (error) {
        alert('Error importing profile: ' + error.message);
      }
    }
    event.target.value = '';
  };

  const handleThemeChange = (themeName) => {
    const themeStyles = getThemeStyles(themeName);
    setProfile({
      ...profile,
      theme: themeName,
      backgroundColor: themeStyles.backgroundColor,
      textColor: themeStyles.textColor,
      fontFamily: themeStyles.fontFamily,
      fontSize: themeStyles.fontSize.replace('px', '')
    });
  };

  const handleColorChange = (color) => {
    const colorValue = color.hex;
    if (colorPickerType === 'background') {
      setProfile({ ...profile, backgroundColor: colorValue });
    } else {
      setProfile({ ...profile, textColor: colorValue });
    }
  };

  const openColorPicker = (type) => {
    setColorPickerType(type);
    setShowColorPicker(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">🌟</div>
        <p>Loading your awesome profile...</p>
      </div>
    );
  }

  if (previewMode) {
    return (
      <ProfilePreview 
        profile={profile} 
        onBack={() => setPreviewMode(false)}
      />
    );
  }

  return (
    <div className="profile-editor">
      <div className="editor-header">
        <h1>🎨 MyCloudProfile Editor</h1>
        <div className="header-actions">
          <span className="user-info">
            Welcome, {user?.displayName || user?.email}!
          </span>
          <button onClick={handleSignOut} className="sign-out-btn">
            Sign Out
          </button>
        </div>
      </div>

      <div className="editor-content">
        <div className="editor-panel">
          <h2>Customize Your Profile</h2>
          
          {/* Basic Info */}
          <div className="form-group">
            <label>Profile Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter your profile name"
            />
          </div>

          <div className="form-group">
            <label>Avatar (Emoji)</label>
            <input
              type="text"
              value={profile.avatar}
              onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
              placeholder="😎"
              maxLength="4"
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell the world about yourself!"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Music Link (Spotify, YouTube, etc.)</label>
            <input
              type="url"
              value={profile.musicLink}
              onChange={(e) => setProfile({ ...profile, musicLink: e.target.value })}
              placeholder="https://open.spotify.com/..."
            />
          </div>

          {/* Theme Selection */}
          <div className="form-group">
            <label>Theme</label>
            <div className="theme-selector">
              {getThemeNames().map((themeName) => (
                <button
                  key={themeName}
                  className={`theme-button ${profile.theme === themeName ? 'active' : ''}`}
                  onClick={() => handleThemeChange(themeName)}
                  style={{
                    backgroundColor: themes[themeName].backgroundColor,
                    color: themes[themeName].textColor,
                    border: `2px solid ${themes[themeName].accentColor}`
                  }}
                >
                  {themeName}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="form-row">
            <div className="form-group">
              <label>Background Color</label>
              <div className="color-input">
                <div 
                  className="color-preview"
                  style={{ backgroundColor: profile.backgroundColor }}
                  onClick={() => openColorPicker('background')}
                />
                <input
                  type="text"
                  value={profile.backgroundColor}
                  onChange={(e) => setProfile({ ...profile, backgroundColor: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Text Color</label>
              <div className="color-input">
                <div 
                  className="color-preview"
                  style={{ backgroundColor: profile.textColor }}
                  onClick={() => openColorPicker('text')}
                />
                <input
                  type="text"
                  value={profile.textColor}
                  onChange={(e) => setProfile({ ...profile, textColor: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="form-row">
            <div className="form-group">
              <label>Font Family</label>
              <select
                value={profile.fontFamily}
                onChange={(e) => setProfile({ ...profile, fontFamily: e.target.value })}
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Verdana, sans-serif">Verdana</option>
                <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
              </select>
            </div>

            <div className="form-group">
              <label>Font Size</label>
              <input
                type="range"
                min="12"
                max="24"
                value={profile.fontSize}
                onChange={(e) => setProfile({ ...profile, fontSize: e.target.value })}
              />
              <span>{profile.fontSize}px</span>
            </div>
          </div>

          {/* Color Picker Modal */}
          {showColorPicker && (
            <div className="color-picker-modal">
              <div className="color-picker-backdrop" onClick={() => setShowColorPicker(false)} />
              <div className="color-picker-container">
                <SketchPicker
                  color={colorPickerType === 'background' ? profile.backgroundColor : profile.textColor}
                  onChange={handleColorChange}
                />
                <button onClick={() => setShowColorPicker(false)}>Done</button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              onClick={() => setPreviewMode(true)}
              className="preview-btn"
            >
              👀 Preview
            </button>
            
            <button 
              onClick={handleSave}
              disabled={saving}
              className="save-btn"
            >
              {saving ? '💾 Saving...' : '💾 Save'}
            </button>
            
            <button 
              onClick={handleExport}
              className="export-btn"
            >
              📤 Export JSON
            </button>
            
            <button 
              onClick={handleImport}
              className="import-btn"
            >
              📥 Import JSON
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileImport}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className="preview-panel">
          <h3>Live Preview</h3>
          <div className="live-preview">
            <ProfilePreview profile={profile} isLivePreview={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
