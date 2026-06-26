import heapq

def aplicar_bounding_box(grafo, origen_id, destino_id, margen=0.01):
    # 1. Obtener coordenadas de origen y destino
    lat_origen = grafo.nodos[origen_id]['lat']
    lon_origen = grafo.nodos[origen_id]['lon']
    lat_destino = grafo.nodos[destino_id]['lat']
    lon_destino = grafo.nodos[destino_id]['lon']

    # 2. Definir los límites del cuadrante (Bounding Box) con un margen extra
    min_lat = min(lat_origen, lat_destino) - margen
    max_lat = max(lat_origen, lat_destino) + margen
    min_lon = min(lon_origen, lon_destino) - margen
    max_lon = max(lon_origen, lon_destino) + margen

    # 3. Filtrar los nodos que caen dentro del cuadrante
    nodos_filtrados = set()
    for osmid, datos in grafo.nodos.items():
        if min_lat <= datos['lat'] <= max_lat and min_lon <= datos['lon'] <= max_lon:
            nodos_filtrados.add(osmid)

    # 4. Reconstruir la lista de adyacencia solo con los nodos válidos
    adyacencia_filtrada = {}
    for nodo in nodos_filtrados:
        vecinos_validos = []
        for vecino, peso in grafo.adyacencia.get(nodo, []):
            if vecino in nodos_filtrados:
                vecinos_validos.append((vecino, peso))
        adyacencia_filtrada[nodo] = vecinos_validos

    print(f"Bounding Box aplicado: de {len(grafo.nodos)} a {len(nodos_filtrados)} nodos.")
    return nodos_filtrados, adyacencia_filtrada

def dijkstra(nodos_validos, adyacencia, origen_id, destino_id):
    # Cola de prioridad para procesar los nodos de menor costo primero
    # Formato: (costo_acumulado, nodo_actual)
    cola = [(0, origen_id)]
    
    # Diccionario para rastrear el costo mínimo para llegar a cada nodo
    distancias = {nodo: float('inf') for nodo in nodos_validos}
    distancias[origen_id] = 0
    
    # Diccionario para reconstruir el camino (de dónde vine para llegar aquí)
    padres = {nodo: None for nodo in nodos_validos}

    while cola:
        costo_actual, nodo_actual = heapq.heappop(cola)

        # Si llegamos al destino, terminamos la búsqueda temprana
        if nodo_actual == destino_id:
            break

        # Si encontramos un camino más largo en la cola, lo ignoramos
        if costo_actual > distancias[nodo_actual]:
            continue

        # Explorar vecinos
        for vecino, peso in adyacencia.get(nodo_actual, []):
            nuevo_costo = costo_actual + peso

            if nuevo_costo < distancias[vecino]:
                distancias[vecino] = nuevo_costo
                padres[vecino] = nodo_actual
                heapq.heappush(cola, (nuevo_costo, vecino))

    # Reconstrucción de la ruta desde el destino hacia el origen
    ruta = []
    nodo_paso = destino_id
    
    # Si el destino no tiene padre y no es el origen, no hay ruta posible
    if padres[destino_id] is None and destino_id != origen_id:
        return None, float('inf')

    while nodo_paso is not None:
        ruta.append(nodo_paso)
        nodo_paso = padres[nodo_paso]
        
    ruta.reverse() # Invertimos para que vaya de origen a destino

    return ruta, distancias[destino_id]