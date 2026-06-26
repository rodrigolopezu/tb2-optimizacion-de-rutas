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

                # Peso de la arista (distancia en metros)
                peso = float(row['length'])

                # Convierte el texto "True"/"False" del CSV a un booleano
                oneway = row['oneway'].strip().lower() == 'true'

                # Agrega la arista de u hacia v
                if u in self.adyacencia:
                    self.adyacencia[u].append((v, peso))

                # Si la vía es de doble sentido, agrega también la arista inversa
                if not oneway and v in self.adyacencia:
                    self.adyacencia[v].append((u, peso))

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