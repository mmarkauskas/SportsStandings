import React from 'react';
import footballVideo from '../src/assets/videos/FootballField.mp4';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video className="absolute top-0 left-0 w-full h-full object-cover -z-10" autoPlay loop muted>
        <source src={footballVideo} type="video/mp4" />
      </video>
    </div>
  );
};

export default App; 
