import React from 'react';
import footballVideo from '../src/assets/videos/FootballField.mp4';
import './App.css';

const App: React.FC = () => {

  return (
    <video className='video-bg' autoPlay loop muted>
      <source src={footballVideo}> </source>
    </video>
  );
};

export default App;