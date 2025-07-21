import { render, screen } from '@testing-library/react';
import App from './App';

// Mock Firebase
jest.mock('./services/auth', () => ({
  onAuthStateChange: jest.fn(() => () => {}),
  signInWithGoogle: jest.fn(),
  signInWithGithub: jest.fn(),
  signOut: jest.fn()
}));

jest.mock('./services/profileService', () => ({
  getProfile: jest.fn(),
  saveProfile: jest.fn(),
  getDefaultProfile: jest.fn(() => ({
    name: 'Test Profile',
    avatar: '😎',
    backgroundColor: '#6366f1',
    textColor: '#ffffff',
    fontSize: '16',
    fontFamily: 'Arial, sans-serif',
    musicLink: '',
    bio: 'Test bio',
    theme: 'MySpace Dark',
    customStyles: {},
    createdAt: new Date().toISOString()
  }))
}));

test('renders loading screen initially', () => {
  render(<App />);
  const loadingElement = screen.getByText(/Loading MyCloudProfile/i);
  expect(loadingElement).toBeInTheDocument();
});
