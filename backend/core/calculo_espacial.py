import math

def calcular_distancia_haversine(lat1, lon1, lat2, lon2):
    # Radio medio de la Tierra en kilómetros
    radio_tierra_km = 6371.0

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    
    c = 2 * math.asin(math.sqrt(a))

    return radio_tierra_km * c

def encontrar_nodo_mas_cercano(grafo, lat_objetivo, lon_objetivo):
    nodo_mas_cercano = None
    distancia_minima = float('inf')

    for osmid, datos in grafo.nodos.items():
        distancia = calcular_distancia_haversine(
            lat_objetivo, lon_objetivo, datos['lat'], datos['lon']
        )

        if distancia < distancia_minima:
            distancia_minima = distancia
            nodo_mas_cercano = osmid

    return nodo_mas_cercano