import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapaClick({ setRuta, setMarcadores }) {
  const [puntos, setPuntos] = useState([]);

  useMapEvents({
    click(e) {
      if (puntos.length === 2) {
        setPuntos([]);
        setMarcadores([]);
        setRuta([]);
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
            const rutaFormateada = res.data.ruta.map(p => [p.lat, p.lon]);
            setRuta(rutaFormateada);
          })
          .catch(err => alert("No se pudo calcular la ruta: " + err));
      }
    }
  });
  return null;
}

function App() {
  const [ruta, setRuta] = useState([]);
  const [marcadores, setMarcadores] = useState([]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[-12.10, -77.02]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapaClick setRuta={setRuta} setMarcadores={setMarcadores} />

        {marcadores.map((p, i) => <Marker key={i} position={[p.lat, p.lon]} />)}

        {ruta.length > 0 && <Polyline positions={ruta} color="blue" weight={5} />}
      </MapContainer>
    </div>
  );
}

export default App;