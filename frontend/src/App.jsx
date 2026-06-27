import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import PantallaInicio from './components/PantallaInicio';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapaClick({ setRutasCompletas, setMarcadores }) {
  const [puntos, setPuntos] = useState([]);

  useMapEvents({
    click(e) {
      if (puntos.length === 2) {
        setPuntos([]);
        setMarcadores([]);
        setRutasCompletas({ corta: [], rapida: [] });
        return;
      }

      const nuevoPunto = { lat: e.latlng.lat, lon: e.latlng.lng };
      const nuevosPuntos = [...puntos, nuevoPunto];

      setPuntos(nuevosPuntos);
      setMarcadores(nuevosPuntos);

      if (nuevosPuntos.length === 2) {
        axios.post('http://127.0.0.1:8000/api/ruta', {
          lat_origen: nuevosPuntos[0].lat,
          lon_origen: nuevosPuntos[0].lon,
          lat_destino: nuevosPuntos[1].lat,
          lon_destino: nuevosPuntos[1].lon
        })
          .then(res => {
            setRutasCompletas({
              corta: res.data.ruta_corta.map(p => [p.lat, p.lon]),
              rapida: res.data.ruta_rapida.map(p => [p.lat, p.lon])
            });
          })
          .catch(err => alert("No se pudo calcular la ruta: " + err));
      }
    }
  });
  return null;
}

function App() {
  const [rutasCompletas, setRutasCompletas] = useState({ corta: [], rapida: [] });
  const [rutasVisibles, setRutasVisibles] = useState({ corta: [], rapida: [] });
  const [marcadores, setMarcadores] = useState([]);
  const [modoVisualizacion, setModoVisualizacion] = useState('ambas');
  const [mostrarInicio, setMostrarInicio] = useState(true);

  useEffect(() => {
    if (rutasCompletas.corta.length === 0) {
      setRutasVisibles({ corta: [], rapida: [] });
      return;
    }
    let index = 0;
    const maxLen = Math.max(rutasCompletas.corta.length, rutasCompletas.rapida.length);
    setRutasVisibles({ corta: [rutasCompletas.corta[0]], rapida: [rutasCompletas.rapida[0]] });

    const intervalo = setInterval(() => {
      index++;
      if (index >= maxLen) {
        clearInterval(intervalo);
      } else {
        setRutasVisibles(prev => ({
          corta: index < rutasCompletas.corta.length ? [...prev.corta, rutasCompletas.corta[index]] : prev.corta,
          rapida: index < rutasCompletas.rapida.length ? [...prev.rapida, rutasCompletas.rapida[index]] : prev.rapida
        }));
      }
    }, 15);

    return () => clearInterval(intervalo);
  }, [rutasCompletas]);

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      
      {/* 3. Renderizamos la pantalla de bienvenida si el estado es true */}
      {mostrarInicio && (
        <PantallaInicio onComenzar={() => setMostrarInicio(false)} />
      )}

      {/* Panel de Control Flotante */}
      <div style={{
        position: 'absolute', top: '20px', right: '20px', zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.8)', padding: '15px', borderRadius: '8px', color: 'white'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Modo de Ruta</h3>
        <select 
          value={modoVisualizacion} 
          onChange={(e) => setModoVisualizacion(e.target.value)}
          style={{ padding: '5px', width: '100%', marginBottom: '10px' }}
        >
          <option value="ambas">Mostrar Ambas</option>
          <option value="corta">Más Corta (Absoluta)</option>
          <option value="rapida">Más Rápida (Velocidad)</option>
        </select>
        <div style={{ fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#00d2ff', marginRight: '8px' }}></div>
            Más Corta
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#ff0055', marginRight: '8px' }}></div>
            Más Rápida
          </div>
        </div>
      </div>

      <MapContainer center={[-12.10, -77.02]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}@2x.png"
          minZoom={0}
          maxZoom={20}
          attribution='&copy; Stadia Maps'
        />

        <MapaClick setRutasCompletas={setRutasCompletas} setMarcadores={setMarcadores} />

        {marcadores.map((p, i) => <Marker key={i} position={[p.lat, p.lon]} />)}

        {(modoVisualizacion === 'ambas' || modoVisualizacion === 'corta') && rutasVisibles.corta.length > 0 && (
          <Polyline positions={rutasVisibles.corta} color="#00d2ff" weight={5} />
        )}
        
        {(modoVisualizacion === 'ambas' || modoVisualizacion === 'rapida') && rutasVisibles.rapida.length > 0 && (
          <Polyline positions={rutasVisibles.rapida} color="#ff0055" weight={5} dashArray="10, 10" />
        )}
      </MapContainer>
    </div>
  );
}

export default App;