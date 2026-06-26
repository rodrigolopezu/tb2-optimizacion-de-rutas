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
    # 1. Traducir coordenadas a nodos (osmids)
    origen_id = encontrar_nodo_mas_cercano(grafo_urbano, peticion.lat_origen, peticion.lon_origen)
    destino_id = encontrar_nodo_mas_cercano(grafo_urbano, peticion.lat_destino, peticion.lon_destino)

    if not origen_id or not destino_id:
        raise HTTPException(status_code=400, detail="No se pudieron mapear las coordenadas a la red vial.")

    # 2. Acotar espacio de búsqueda con Bounding Box
    nodos_validos, adyacencia_filtrada = aplicar_bounding_box(grafo_urbano, origen_id, destino_id)

    # 3. Calcular la ruta óptima
    ruta_ids, costo_total = dijkstra(nodos_validos, adyacencia_filtrada, origen_id, destino_id)

    if ruta_ids is None:
        raise HTTPException(status_code=404, detail="No existe una ruta posible entre estos puntos.")

    # 4. Traducir los IDs de la ruta a lat/lon para dibujar la polilínea en el mapa
    ruta_coordenadas = [
        {"lat": grafo_urbano.nodos[nodo_id]['lat'], "lon": grafo_urbano.nodos[nodo_id]['lon']}
        for nodo_id in ruta_ids
    ]

    return {
        "origen_mapeado": origen_id,
        "destino_mapeado": destino_id,
        "costo_total": costo_total,
        "cantidad_nodos_ruta": len(ruta_ids),
        "ruta": ruta_coordenadas
    }