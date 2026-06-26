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
                # Guardamos latitud (y) y longitud (x) para validaciones espaciales futuras
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
                
                # El peso inicial será la distancia física (length)
                # Según tu propuesta, luego podemos ponderarlo por límite de velocidad (maxspeed)
                peso = float(row['length'])
                
                # Respetamos el atributo 'oneway': Grafo dirigido u -> v
                if u in self.adyacencia:
                    self.adyacencia[u].append((v, peso))
                    
        print("Lista de adyacencia construida correctamente.")

# Instancia global del grafo
grafo_urbano = GrafoLogistico()

if __name__ == "__main__":
    import time

    # Instanciamos temporalmente para la prueba
    grafo_prueba = GrafoLogistico()
    
    print("Iniciando prueba de carga de datos...")
    inicio = time.time()
    
    # IMPORTANTE: La ruta asume que ejecutarás el script estando en la carpeta 'backend'
    grafo_prueba.cargar_nodos('data/nodos.csv')
    grafo_prueba.cargar_aristas('data/aristas.csv')
    
    fin = time.time()
    
    print("-" * 30)
    print(f"Tiempo total de procesamiento: {fin - inicio:.4f} segundos")
    
    # Extraer el ID del primer nodo para verificar que la data es correcta
    nodos_ids = list(grafo_prueba.nodos.keys())
    if nodos_ids:
        primer_nodo = nodos_ids[0]
        print(f"Coordenadas del nodo {primer_nodo}: {grafo_prueba.nodos[primer_nodo]}")
        print(f"Cantidad de conexiones (adyacencias) de este nodo: {len(grafo_prueba.adyacencia[primer_nodo])}")