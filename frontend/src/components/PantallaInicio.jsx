import { useState } from 'react';

function PantallaInicio({ onComenzar }) {
  const [fading, setFading] = useState(false);

  const handleStart = () => {
    setFading(true);
    setTimeout(() => {
      onComenzar();
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(10, 10, 10, 0.90)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.8s ease-in-out',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px',
      textAlign: 'center',
      backdropFilter: 'blur(6px)',
      pointerEvents: fading ? 'none' : 'all'
    }}>
      
      <div style={{ maxWidth: '750px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        <div>
          <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '16px', color: '#a0a0a0', margin: 0 }}>
            Ingeniería de Software
          </h4>
          <h2 style={{ fontSize: '24px', fontWeight: '400', margin: '6px 0 0 0', color: '#e0e0e0' }}>
            1ACC0184 - Complejidad Algorítmica <span style={{ color: '#00d2ff', fontSize: '18px', fontWeight: '500' }}>(NRC2966)</span>
          </h2>
        </div>

        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.12)', 
          borderBottom: '1px solid rgba(255,255,255,0.12)', 
          padding: '24px 0' 
        }}>
          <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-0.5px', margin: '0 0 12px 0' }}>
            Trabajo Final
          </h1>
          <p style={{ fontSize: '14px', color: '#00d2ff', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>
            Caso de estudio
          </p>
          <h3 style={{ fontSize: '28px', fontWeight: '600', color: '#ffffff', margin: 0, letterSpacing: '0.5px' }}>
            OPTIMIZACIÓN DE RUTAS DE REPARTO (LOGÍSTICA URBANA)
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <p style={{ fontSize: '14px', color: '#a0a0a0', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Profesor
            </p>
            <p style={{ fontSize: '20px', fontWeight: '500', margin: 0, color: '#f0f0f0' }}>
              Abraham Sopla Maslucán
            </p>
          </div>

          <div>
            <p style={{ fontSize: '14px', color: '#a0a0a0', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Integrantes
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '18px', alignItems: 'center' }}>
              <p style={{ margin: 0, fontWeight: '400', color: '#e0e0e0' }}>
                <code style={{ color: '#ff0055', backgroundColor: 'rgba(255,0,85,0.1)', padding: '2px 6px', borderRadius: '4px', marginRight: '8px', fontFamily: 'monospace' }}>U202420071</code> 
                Bernal Torres, Carlos Alberto
              </p>
              <p style={{ margin: 0, fontWeight: '400', color: '#e0e0e0' }}>
                <code style={{ color: '#ff0055', backgroundColor: 'rgba(255,0,85,0.1)', padding: '2px 6px', borderRadius: '4px', marginRight: '8px', fontFamily: 'monospace' }}>U20241A911</code> 
                Aguirre Ramos, Eduardo Manuel
              </p>
              <p style={{ margin: 0, fontWeight: '500', color: '#ffffff' }}>
                <code style={{ color: '#ff0055', backgroundColor: 'rgba(255,0,85,0.1)', padding: '2px 6px', borderRadius: '4px', marginRight: '8px', fontFamily: 'monospace' }}>U202421866</code> 
                López Monroy, Rodrigo Alfredo
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '14px' }}>
          <button 
            onClick={handleStart}
            style={{
              backgroundColor: '#ffffff',
              color: '#0a0a0a',
              border: 'none',
              padding: '16px 38px',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '30px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(255,255,255,0.15)',
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.backgroundColor = '#f0f0f0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = '#ffffff'; }}
          >
            Comenzar
          </button>
        </div>

        <div style={{ fontSize: '14px', color: '#555555', marginTop: '10px', letterSpacing: '0.05em' }}>
          Ciclo 2026-10
        </div>

      </div>
    </div>
  );
}

export default PantallaInicio;