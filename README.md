# TB2 - Optimización de Rutas de Reparto - Guía de Ejecución

## 1. Instalación de Dependencias

Abre tu terminal e instala los módulos necesarios en ambos directorios.

### Backend

```bash
cd backend
python -m pip install -r requirements.txt
```

> **Nota:** Si usas un entorno virtual, asegúrate de activarlo antes con alguno de los siguientes comandos, según corresponda:

```bash
source venv/bin/activate
```

o

```bash
source env/bin/activate
```

### Frontend

```bash
cd ../frontend
npm install
```

---

## 2. Ejecución del Proyecto

Para correr la aplicación, debes abrir **dos ventanas o pestañas diferentes** en tu terminal.

### Terminal 1: Servidor Backend (FastAPI)

Navega a la carpeta `backend` y levanta el servidor Uvicorn:

```bash
cd backend
python -m uvicorn main:app --reload
```

### Terminal 2: Cliente Frontend (React + Vite)

Navega a la carpeta `frontend` e inicia el entorno de desarrollo:

```bash
cd frontend
npm run dev
```

Vite proporcionará un enlace local en la consola (usualmente `http://localhost:5173`). Ábrelo en tu navegador para interactuar con el mapa.

---

## 3. Funcionamiento Breve

1. Presiona **Comenzar** para revelar el mapa interactivo.
2. Haz un primer clic para marcar el **Punto de Origen** y un segundo clic para el **Punto de Destino**. (Los distritos considerados para la implementación son Santiago de Surco, San Isidro, Miraflores, Barranco, Chorrillos, La Molina, San Miguel, Jesús María, Magdalena del Mar, San Borja, Surquillo, Lince y Pueblo Libre)
3. El sistema calculará e ilustrará progresivamente dos rutas concurrentes:
   - **Línea celeste sólida:** Ruta más corta absoluta (optimización por distancia en metros).
   - **Línea roja punteada:** Ruta más rápida (optimización por tiempo estimado según límites de velocidad).
