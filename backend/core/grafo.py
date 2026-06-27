import csv

class GrafoLogistico:
    def __init__(self):
        # Diccionario para almacenar nodos: {osmid: {'lat': y, 'lon': x}}
        self.nodos = {}
        # Lista de adyacencia: {u: [(v, peso), ...]}
        self.adyacencia = {}

    def cargar_nodos(self, ruta_csv):
        print("Cargando nodos en memoria...")
        with open(ruta_csv, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                osmid = int(row['osmid'])
                self.nodos[osmid] = {
                    'lat': float(row['y']),
                    'lon': float(row['x'])
                }
                # Inicializamos su lista de adyacencia vacía
                self.adyacencia[osmid] = []
        print(f"Total de nodos cargados: {len(self.nodos)}")

    def cargar_aristas(self, ruta_csv):
        print("Construyendo aristas y calculando pesos...")
        
        with open(ruta_csv, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)

            for row in reader:
                u = int(row['u'])
                v = int(row['v'])

                distancia = float(row['length'])

                maxspeed_str = row.get('maxspeed','').strip()
                if maxspeed_str.isdigit():
                    velocidad_kmh = float(maxspeed_str)
                else:
                    velocidad_kmh = 40.0

                velocidad_ms = velocidad_kmh / 3.6
                tiempo = distancia / velocidad_ms

                oneway = row['oneway'].strip().lower() == 'true'

                if u in self.adyacencia:
                    self.adyacencia[u].append((v, distancia, tiempo))

                if not oneway and v in self.adyacencia:
                    self.adyacencia[v].append((u, distancia, tiempo))

        print("Lista de adyacencia construida correctamente.")

# Instancia global del grafo
grafo_urbano = GrafoLogistico()

if __name__ == "__main__":
    import time

    grafo_prueba = GrafoLogistico()
    
    print("Iniciando prueba de carga de datos...")
    inicio = time.time()
    
    grafo_prueba.cargar_nodos('data/nodos.csv')
    grafo_prueba.cargar_aristas('data/aristas.csv')
    
    fin = time.time()
    
    print("-" * 30)
    print(f"Tiempo total de procesamiento: {fin - inicio:.4f} segundos")
    
    nodos_ids = list(grafo_prueba.nodos.keys())
    if nodos_ids:
        primer_nodo = nodos_ids[0]
        print(f"Coordenadas del nodo {primer_nodo}: {grafo_prueba.nodos[primer_nodo]}")
        print(f"Cantidad de conexiones (adyacencias) de este nodo: {len(grafo_prueba.adyacencia[primer_nodo])}")