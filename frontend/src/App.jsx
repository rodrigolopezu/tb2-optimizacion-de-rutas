import { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import MapInterface from './components/MapInterface';
import './App.css';

function App() {
  const [mostrarMapa, setMostrarMapa] = useState(false);

  return (
    <>
      {!mostrarMapa ? (
        <WelcomeScreen onEnter={() => setMostrarMapa(true)} />
      ) : (
        <MapInterface />
      )}
    </>
  );
}

export default App;