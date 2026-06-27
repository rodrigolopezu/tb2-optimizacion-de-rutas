from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from core.grafo import grafo_urbano
from core.calculo_espacial import encontrar_nodo_mas_cercano
from core.algoritmos import aplicar_bounding_box, dijkstra

# Estructura de los datos que esperamos recibir del frontend web
class PeticionRuta(BaseModel):
    lat_origen: float
    lon_origen: float
    lat_destino: float
    lon_destino: float

app = FastAPI(title="API Logística Urbana TB1")

# Habilitar CORS para permitir peticiones desde el frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Evento que se ejecuta automáticamente al iniciar Uvicorn
@app.on_event("startup")
def iniciar_servidor():
    print("Inicializando servidor y cargando grafo en memoria...")
    grafo_urbano.cargar_nodos('data/nodos.csv')
    grafo_urbano.cargar_aristas('data/aristas.csv')
    print("Servidor listo.")

@app.post("/api/ruta")
def calcular_ruta(peticion: PeticionRuta):
    origen_id = encontrar_nodo_mas_cercano(grafo_urbano, peticion.lat_origen, peticion.lon_origen)
    destino_id = encontrar_nodo_mas_cercano(grafo_urbano, peticion.lat_destino, peticion.lon_destino)

    if not origen_id or not destino_id:
        raise HTTPException(status_code=400, detail="Error de mapeo.")

    nodos_validos, adyacencia_filtrada = aplicar_bounding_box(grafo_urbano, origen_id, destino_id)

    # Ejecutamos Dijkstra para ambos modos
    ruta_corta_ids, costo_corta = dijkstra(nodos_validos, adyacencia_filtrada, origen_id, destino_id, modo='distancia')
    ruta_rapida_ids, costo_rapida = dijkstra(nodos_validos, adyacencia_filtrada, origen_id, destino_id, modo='tiempo')

    if ruta_corta_ids is None or ruta_rapida_ids is None:
        raise HTTPException(status_code=404, detail="No hay ruta posible.")

    # Mapeamos a coordenadas
    coords_corta = [{"lat": grafo_urbano.nodos[n]['lat'], "lon": grafo_urbano.nodos[n]['lon']} for n in ruta_corta_ids]
    coords_rapida = [{"lat": grafo_urbano.nodos[n]['lat'], "lon": grafo_urbano.nodos[n]['lon']} for n in ruta_rapida_ids]

    return {
        "ruta_corta": coords_corta,
        "ruta_rapida": coords_rapida
    }