from flask import Flask, request, jsonify
import json
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# Funciones para cargar y guardar proyectos
def cargar_proyectos_existentes():
    try:
        with open('proyectos_existentes.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def guardar_proyectos_existentes(proyectos):
    with open('proyectos_existentes.json', 'w', encoding='utf-8') as f:
        json.dump(proyectos, f, indent=4, ensure_ascii=False)

def cargar_intentos_registro():
    try:
        with open('intentos_registro.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def guardar_intentos_registro(intentos):
    with open('intentos_registro.json', 'w', encoding='utf-8') as f:
        json.dump(intentos, f, indent=4, ensure_ascii=False)

# Función para comparar descripciones usando TF-IDF y similitud de coseno
def comparar_descripciones(descripcion1, descripcion2):
    # Crear el vectorizador TF-IDF
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([descripcion1, descripcion2])
    
    # Calcular la similitud de coseno entre las dos descripciones
    similitud = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    return similitud[0][0]

# Función para comparar proyectos
def comparar_proyecto(titulo_nuevo, descripcion_nueva, proyectos_existentes, umbral_similitud=0.4):
    for proyecto in proyectos_existentes:
        if proyecto['titulo'] == titulo_nuevo:
            return False  # Plagio detectado por título exacto
        
        similitud = comparar_descripciones(proyecto['descripcion'], descripcion_nueva)
        if similitud >= umbral_similitud:
            print(f"Plagio detectado: similitud del {similitud*100:.2f}% con el proyecto '{proyecto['titulo']}'")
            return False  # Plagio detectado por similitud en descripción
    
    return True  # No hay plagio

# Ruta para procesar los datos del formulario
@app.route('/registrar', methods=['POST'])
def registrar_proyecto():
    titulo_nuevo = request.form.get('titulo')
    descripcion_nueva = request.form.get('descripcion')

    proyectos_existentes = cargar_proyectos_existentes()
    intentos_registro = cargar_intentos_registro()

    # Verificar si el proyecto es único
    es_unico = comparar_proyecto(titulo_nuevo, descripcion_nueva, proyectos_existentes)

    if es_unico:
        # Agregar el proyecto a los proyectos existentes
        proyectos_existentes.append({"titulo": titulo_nuevo, "descripcion": descripcion_nueva})
        guardar_proyectos_existentes(proyectos_existentes)

        # Registrar como aceptado
        intentos_registro.append({"titulo": titulo_nuevo, "descripcion": descripcion_nueva, "estado": "aceptado"})
    else:
        # Registrar como rechazado
        intentos_registro.append({"titulo": titulo_nuevo, "descripcion": descripcion_nueva, "estado": "rechazado"})

    # Guardar intentos de registro
    guardar_intentos_registro(intentos_registro)

    # Enviar respuesta JSON estructurada
    return jsonify({
        "status": "aceptado" if es_unico else "rechazado",
        "message": f"Proyecto '{titulo_nuevo}' registrado como {'aceptado' if es_unico else 'rechazado'}"
    })

if __name__ == '__main__':
    app.run(debug=True)
