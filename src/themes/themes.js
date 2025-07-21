export const themes = {
  'MySpace Dark': {
    name: 'MySpace Dark',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    accentColor: '#ff6600',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    borderStyle: '2px solid #ff6600',
    backgroundPattern: 'none',
    buttonStyle: {
      backgroundColor: '#ff6600',
      color: '#000000',
      border: '1px solid #ffffff',
      borderRadius: '3px'
    },
    containerStyle: {
      background: 'linear-gradient(45deg, #000000, #1a1a1a)',
      border: '2px solid #ff6600',
      borderRadius: '0px'
    }
  },
  
  'Minecraft Pixel': {
    name: 'Minecraft Pixel',
    backgroundColor: '#8B4513',
    textColor: '#ffffff',
    accentColor: '#32CD32',
    fontFamily: 'monospace',
    fontSize: '16px',
    borderStyle: '4px solid #654321',
    backgroundPattern: `
      repeating-conic-gradient(#8B4513 0% 25%, #A0522D 25% 50%) 
      50% / 20px 20px
    `,
    buttonStyle: {
      backgroundColor: '#32CD32',
      color: '#000000',
      border: '2px solid #654321',
      borderRadius: '0px',
      fontFamily: 'monospace',
      textTransform: 'uppercase'
    },
    containerStyle: {
      background: `
        repeating-conic-gradient(#8B4513 0% 25%, #A0522D 25% 50%) 
        50% / 20px 20px
      `,
      border: '4px solid #654321',
      borderRadius: '0px',
      boxShadow: '4px 4px 0px #654321'
    }
  },
  
  'Vaporwave': {
    name: 'Vaporwave',
    backgroundColor: '#ff00ff',
    textColor: '#00ffff',
    accentColor: '#ffff00',
    fontFamily: '"Courier New", monospace',
    fontSize: '18px',
    borderStyle: '2px solid #00ffff',
    backgroundPattern: `
      linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff00ff)
    `,
    buttonStyle: {
      backgroundColor: '#00ffff',
      color: '#ff00ff',
      border: '2px solid #ffff00',
      borderRadius: '0px',
      fontFamily: '"Courier New", monospace',
      textTransform: 'uppercase',
      letterSpacing: '2px'
    },
    containerStyle: {
      background: `
        linear-gradient(135deg, 
          rgba(255, 0, 255, 0.8) 0%, 
          rgba(0, 255, 255, 0.8) 50%, 
          rgba(255, 255, 0, 0.8) 100%
        )
      `,
      border: '2px solid #00ffff',
      borderRadius: '0px',
      boxShadow: '0 0 20px #ff00ff, inset 0 0 20px rgba(0, 255, 255, 0.3)',
      backdropFilter: 'blur(2px)'
    }
  }
};

export const getThemeStyles = (themeName) => {
  return themes[themeName] || themes['MySpace Dark'];
};

export const applyThemeToElement = (element, themeName) => {
  const theme = getThemeStyles(themeName);
  
  if (element) {
    element.style.backgroundColor = theme.backgroundColor;
    element.style.color = theme.textColor;
    element.style.fontFamily = theme.fontFamily;
    element.style.fontSize = theme.fontSize;
    element.style.border = theme.borderStyle;
    
    if (theme.backgroundPattern && theme.backgroundPattern !== 'none') {
      element.style.background = theme.backgroundPattern;
    }
  }
};

export const getThemeNames = () => Object.keys(themes);
