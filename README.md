# Proyecto Protocolos

## Descripción del Proyecto

**Proyecto Protocolos** es una API desarrollada en Node.js que permite administrar el proceso de registro y evaluación de un protocolo por la CATT para los alumnos de la ESCOM. La API incluye funcionalidades para el registro y gestión de alumnos, profesores (internos y externos) y administradores.

# 📌 Características Principales del Proyecto

## 1️⃣ Gestión de Usuarios
### 🔹 Registro de usuarios
- Se pueden registrar **alumnos, profesores, profesores externos y administradores**.
- Se validan los campos: **nombre, correo, contraseña, boleta y rol**.
- Se verifica que **el correo y la boleta sean únicos**.
- La contraseña debe tener **mínimo 8 caracteres**.

### 🔹 Obtención de usuarios
- Un usuario autenticado puede obtener **sus propios datos** (`GET /me`).
- Los **administradores** pueden ver **todos los usuarios** (`GET /admin`).
- Se puede **buscar un usuario específico** por su **ID**.

### 🔹 Modificación de usuarios
- **Usuarios normales** pueden **modificar su propio perfil**.
- **Administradores** pueden **modificar cualquier usuario** (rol, boleta, estado, etc.).

### 🔹 Activación y desactivación de usuarios
- Los **administradores** pueden:
  - **Desactivar** un usuario → `DELETE /admin/:id`
  - **Reactivar** un usuario → `PATCH /admin/:id`

### 🔹 Seguridad
- Se usa **JWT** para restringir accesos.
- Los **administradores** tienen permisos especiales (`validarAdminRole`).
- Se protege la edición de datos para evitar cambios no permitidos.

---

## 2️⃣ Gestión de Protocolos
### 🔹 Registro de protocolos
- **Solo los alumnos** pueden registrar un protocolo.
- Se valida que **suban un archivo**.
- Se requiere **nombre, boleta del líder, boletas de integrantes y descripción**.
- Se verifica que **los integrantes sean usuarios válidos**.

### 🔹 Obtención de protocolos
- Un usuario autenticado puede ver **su protocolo** (`GET /me`).
- Los **administradores** pueden ver **todos los protocolos** (`GET /admin`).

### 🔹 Edición de protocolos
- **El líder del protocolo** puede modificar la **descripción**.
- **Los administradores** pueden modificar **nombre, boletas y otros datos**.

### 🔹 Cambio de estado de un protocolo
- Solo los **administradores** pueden cambiar el estado (`Pendiente`, `Aprobado`, `Rechazado`).

### 🔹 Eliminación de protocolos
- Solo los **administradores** pueden eliminar un protocolo.

---

## 3️⃣ Autenticación y Control de Sesiones
### 🔹 Inicio de sesión (`POST /login`)
- Requiere **correo y contraseña**.
- Se verifica que **el usuario exista en la base de datos**.
- Se genera un **JWT** para autorizar accesos.

### 🔹 Verificación de sesión (`GET /verificarJWT`)
- Permite comprobar si un usuario sigue autenticado con un **token válido**.

### 🔹 Cierre de sesión (`POST /logout`)
- Invalida el **JWT del usuario actual**.

---



## Tabla de Contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Endpoints de la API](#endpoints-de-la-api)
- [Contribución](#contribución)
- [Licencia](#licencia)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Funcionalidades Pendientes](#funcionalidades-pendientes)
- [Errores Comunes y Soluciones](#errores-comunes-y-soluciones)

---

## Instalación

### 1. Clonar el repositorio
Desde la terminal, ejecuta el siguiente comando para clonar el repositorio de GitHub:
```bash
git clone https://github.com/VicenteRv/Proyecto-protocolos.git
```

Accede al directorio del proyecto:
```bash
cd Proyecto-protocolos
```

### 2. Instalar dependencias

Abre Visual Studio Code desde la terminal:
```bash
code .
```

Luego, instala las dependencias necesarias ejecutando:
```bash
npm install
```

### 3. Configurar la base de datos MongoDB

#### Opcion 1: MongoDB Atlas (en la nube)
1. Crear una cuenta en [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database).
2. Crear un clúster y obtener la cadena de conexión.
3. Crear un archivo `.env` en la raíz del proyecto y agregar la cadena de conexión:
```env
MONGO_URI=mongodb+srv://usuario:contraseña@cluster0.mongodb.net/nombre-de-la-bd?retryWrites=true&w=majority
```

#### Opcion 2: MongoDB local
1. Instalar [MongoDB Community Edition](https://www.mongodb.com/try/download/community) y MongoDB Compass.
2. Iniciar el servicio de MongoDB:
```cmd
net start MongoDB
```
3. Configurar el archivo `.env`:
```env
MONGO_URI=mongodb://localhost:27017/nombre-de-la-bd
```

### 4. Configurar el archivo `.env`

Crear el archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/nombredelproyecto
SECRETORPRIVATEKEY=clave-secreta
```

---

## Uso

Para iniciar el servidor en modo desarrollo:
```bash
nodemon app.js
```
cuando

---

## Endpoints de la API

### Autenticación
| Método  | Ruta                    | Descripción |
|---------|-------------------------|-------------|
| POST    | /api/auth/login         | Iniciar sesión |
| GET     | /api/auth/verificarJWT  | Verificar el jwt del usuario (vistas front-end) |
| POST    | /api/auth/logout        | Cerrar sesión |

#### 1. Iniciar Sesion (`POST /api/auth/login`)

Autentica a un usuario y le da un token de sesión

Parametros

**Body**
| Parametro  | Tipo    | Descripción | Ejemplo     |
|------------|---------|-------------|-------------|
| correo     | String  | Correo del usuario (obligatorio). Debe de ser un correo valido. Debe de existir en la base de datos. Debe de estar activo | `test1@test.com` |
| password   | String  | Contraseña del usuario (obligatorio). Debe de coincidir en la registrada en la base de datos | `12345678` |


Body(JSON)

```json
{
    "correo": "admin@test.com",
    "password": "123456789"
}
```
Respuesta del servidor
```json
{
    "msg": "inicio de sesión exitoso",
    "usuario": {
        "nombre": "test1",
        "correo": "test1@test.com",
        "password": "$2a$10$rOMb5r9OM70czsJfq6NvOeg.rnLd.saWN3PVNiOHcCqJvaq/NCSsW",
        "rol": "67b902172fa4cc9113d9ed1a",
        "estado": true,
        "boleta": "2020630000",
        "uid": "67be6fb0eb990216150184ab"
    }
}
```
#### 2. Verificación de sesión (`GET /api/auth/verificarJWT`)

Verifica si el JWT de la sesion del usuario es valido para proteger las vistas del front-end

Parametros

Headers

| Key    | Value |
|--------|-------|
| Cookie |token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2N2JlNmZiMGViOTkwMjE2MTUwMTg0YWIiLCJpYXQiOjE3NDA1MzQwNjEsImV4cCI6MTc0MDcwNjg2MX0.xQZ5d0vJhmXm180arotzXXAMR3Pz5vUmKcixKiz2s7U| 

Respuesta del servidor 
```json
{
  "msg": "Token verificado - correcto"
}
```
#### 3. Cerrar Sesión (`POST /api/auth/logout`)

Cierra la sesión de un usuario eliminando su token

Parametros

Headers
| Key    | Value |
|--------|-------|
| Cookie |token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2N2JlNmZiMGViOTkwMjE2MTUwMTg0YWIiLCJpYXQiOjE3NDA1MzQwNjEsImV4cCI6MTc0MDcwNjg2MX0.xQZ5d0vJhmXm180arotzXXAMR3Pz5vUmKcixKiz2s7U| 

Respuesta del servidor
```json
{
  "msg": "Sesión cerrada correctamente"
}
```


### Usuarios
| Método  | Ruta                    | Descripción |
|---------|-------------------------|-------------|
| POST    | /api/usuarios           | Registrar a un nuevo usuario |
| GET     | /api/usuarios/me        | Obtener datos del usuario loggeado |
| GET     | /api/usuarios           | Obtener todos los usuarios (ADMIN) |
| GET     | /api/usuarios/admin/:id | Buscar un usuario (ADMIN) |
| PUT     | /api/usuarios           | Modificar usuario loggeado |
| PUT     | /api/usuarios/admin/:id | Modificar un usuario (ADMIN) |
| DELETE  | /api/usuarios/admin/:id | Desactivar un usuario (ADMIN) |
| PATCH   | /api/usuarios/admin/:id | Activar un usuario (ADMIN) |

#### 1. Crear Usuario (`POST /api/usuarios`)

Registra un nuevo usuario en el sistema.

Parametros

**Body**
| Parametro  | Tipo    | Descripción | Ejemplo     |
|------------|---------|-------------|-------------|
| nombre     | String  | Nombre del usuario (obligatorio) | `test1` |
| correo     | String  | Correo del usuario (obligatorio). No debe estar duplicado. Debe de ser un correo valido | `test1@test.com` |
| password   | String  | Contraseña del usuario (obligatorio). Debe de tener almenos 8 caracteres | `12345678` |
| rol        | String  | Rol del usuario (obligatorio). Debe de ser un rol que este en la base de datos | `ALUMNO_ROL` |
| boleta     | String  | Boleta del usuario (obligatorio). Se verifica que no exista una boleta similar en bd | `2020630000` |
| externo  | Boolean   | Externo indica si un usuario (`Profesor`) es externo o interno, dependiendo de eso se agrega esa informacion a un diferente campo  | `true` o `false` |

Body(JSON)

``` json
{
  "nombre": "test1",
  "correo": "test1@test.com",
  "password": "123456789",
  "rol": "ALUMNO_ROL",
  "boleta": "2020630000",
  "externo": false
}
```
Respuesta del servidor
```json
{
  "msg": "Usuario creado correctamente",
  "usuario": {
    "nombre": "test1",
      "correo": "test1@test.com",
      "password": "$2a$10$rOMb5r9OM70czsJfq6NvOeg.rnLd.saWN3PVNiOHcCqJvaq/NCSsW",
      "rol": "67b902172fa4cc9113d9ed1a",
      "estado": true,
      "boleta": "2020630000",
      "uid": "67be6fb0eb990216150184ab"
  }
}
```
#### 2. Obtener datos del usuario loggeado (`GET /api/usuarios/me`)

Envia los datos del usuario loggeado, que obtiene al leer el JWT de la sesión

Parametros

| Key    | Value |
|--------|-------|
| Cookie | token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2N2JlNmZiMGViOTkwMjE2MTUwMTg0YWIiLCJpYXQiOjE3NDA1MzQwNjEsImV4cCI6MTc0MDcwNjg2MX0.xQZ5d0vJhmXm180arotzXXAMR3Pz5vUmKcixKiz2s7U |

Respuesta del servidor
```json
{
  "nombre": "test1",
    "correo": "test1@test.com",
    "boleta": "2020630000",
    "imgPerfilURL": "/uploads/images/f9a52ddc-a65e-45dc-9566-78e6347e2368.jpeg",
    "tipoUsuario": "ALUMNO"
}
```
#### 3. Obtener todos los usuarios - solo ADMIN (`GET /api/usuarios`)

Permite a un administrador obtener todos los usuarios que estan registrados en la base de datos y se le pueden agregar ciertos params. 

Parametros

Headers
| Key    | Value |
|--------|-------|
| Cookie |token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2N2JlNmZiMGViOTkwMjE2MTUwMTg0YWIiLCJpYXQiOjE3NDA1MzQwNjEsImV4cCI6MTc0MDcwNjg2MX0.xQZ5d0vJhmXm180arotzXXAMR3Pz5vUmKcixKiz2s7U| 

**Query Params**
| Campo  | Tipo    | Obligatorio | Descripción |
|--------|--------|-------------|-------------|
| activo | String | Sí          | `"true"` para usuarios activos, `"false"` para inactivos. |
| limite | Número | No          | Cantidad máxima de usuarios a devolver (por defecto `10`). |
| desde  | Número | No          | Índice desde el cual empezar a listar los usuarios (por defecto `0`). |

Ejemplo de solicitud
```http
GET /api/usuarios?activo=true&limite=10&desde=0
```

Respuesta del servidor
``` json
{
  "total": 2,
  "usuarios": [
    {
      "nombre": "profe1",
        "correo": "profe1@test.com",
        "boleta": "2020000000",
        "imgPerfilURL": null,
        "id": "67bfbf4d5def63a924402b47"
    },
    {
      "nombre": "admin1",
        "correo": "admin1@test.com",
        "boleta": "202063111111",
        "imgPerfilURL": null,
        "id": "67bfbfb85def63a924402b77"
    }
  ]
}
```
#### 4. Buscar un usuario por id - solo ADMIN (`GET /api/usuarios/admin/:id`)

Permite a un administrador obtener los datos de un usuario utilizando su id  y los envia en la respuesta

Headers
| Key    | Value |
|--------|-------|
| Cookie |token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2N2JlNmZiMGViOTkwMjE2MTUwMTg0YWIiLCJpYXQiOjE3NDA1MzQwNjEsImV4cCI6MTc0MDcwNjg2MX0.xQZ5d0vJhmXm180arotzXXAMR3Pz5vUmKcixKiz2s7U| 

**Params**
| Parametro  | Tipo    | Descripción | Ejemplo     |
|------------|---------|-------------|-------------|
| id         | String  | Es el id del usuario a buscar.Debe de ser un Id valido de mongo y el usuario debe de estar activo| `67be6fb0eb990216150184ab` |


Ejemplo de solicitud
```http
GET /api/usuarios/67be6fb0eb990216150184ab
```
Respuesta del servidor
```json
{
  "usuario": {
    "nombre": "test1",
    "correo": "test1@test.com",
    "password": "$2a$10$rOMb5r9OM70czsJfq6NvOeg.rnLd.saWN3PVNiOHcCqJvaq/NCSsW",
    "rol": {
      "rol": "ALUMNO_ROL"
    },
    "estado": true,
    "boleta": "2020630000",
    "img": "f9a52ddc-a65e-45dc-9566-78e6347e2368.jpeg",
    "uid": "67be6fb0eb990216150184ab"
  }
}
```
#### 5. Editar informacion (`PUT /api/usuarios`)
Este endpoitn permite a los usuarios modificar su propia informacion (`nombre`, `correo`, `contraseña`, `foto de perfil "opcional"`). Solo el usuario autenticado puede actualizar su propio perfil

Parametros

Headers
| Key    | Value |
|--------|-------|
| Cookie |token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2N2JlNmZiMGViOTkwMjE2MTUwMTg0YWIiLCJpYXQiOjE3NDA1MzQwNjEsImV4cCI6MTc0MDcwNjg2MX0.xQZ5d0vJhmXm180arotzXXAMR3Pz5vUmKcixKiz2s7U| 

**Body desde el form-data**
| Parametro  | Tipo    | Descripción | Ejemplo     |
|------------|---------|-------------|-------------|
| nombre     | String  | Nombre del usuario, si no se proporciona no se modificara | `Vicente rv` |
| correo     | String  | Correo del usuario, si no se proporciona no se modificara.Si se modifica debe de ser un correo valido. No debe estar registrado por otro usuario | `vicente@gmail.com` |
| password   | String  | Contraseña del usuario, si no de proporciona no se modificara.Si se modifica de tener almenos 8 caracteres | `12345678` |
| archivo  | File      | Foto de perfil del usuario(opcional).Debe ser una imagen con extensiones `jpg`,`png`,`jpeg`  | `perfil.jpg`,`perfil.png`, `perfil.jpeg` |

Respuesta del servidor
```json
{
  "usuario": {
    "nombre": "test1Editado",
    "correo": "test1editado@test.com",
    "password": "$2a$10$objUm5OuM.huZYDcz/JHpun0kOfv7NQb/dMjKzTHvN.n5q/lheRqO",
    "rol": "67b902172fa4cc9113d9ed1a",
    "estado": true,
    "boleta": "2020630000",
    "img": "c69f07c5-ae9f-4b2b-b20c-36376cadff6c.jpeg",
    "uid": "67be6fb0eb990216150184ab"
  }
}
```
#### 6. Modificar información de un usuario - solo admin (`PUT /api/usuarios/admin/:id`)

Permite a un administrador poder editar datos de un usuario selecionado por medio de su id, para poder modificar su rol, boleta y si es externo o no


Hasta aqui llegamos en la documentacion de momento





### Protocolos
| Método | Ruta            | Descripción |
|---------|----------------|-------------|
| POST    | /api/protocolos | Registrar un nuevo protocolo |
| GET     | /api/protocolos/me | Obtener protocolo del usuario loggeado |
| GET     | /api/protocolos/admin | Obtener todos los protocolos |
| GET     | /api/protocolos/admin/modificar/:id | Obtener datos del protocolo a editar |
| PUT     | /api/protocolos/lider | Modificar protocolo (ALUMNO) |
| PUT     | /api/protocolos/admin/:id | Modificar protocolo (ADMIN) |
| PATCH   | /api/protocolos/admin/:id | Cambiar estado del protocolo (ADMIN) |


## Tecnologías Utilizadas

Este proyecto utiliza las siguientes tecnologías y herramientas:

- **Node.js** - Entorno de ejecución de JavaScript.
- **Express.js** - Framework para construir la API REST.
- **MongoDB** - Base de datos NoSQL utilizada para almacenar los datos.
- **Mongoose** - ODM (Object Data Modeling) para manejar MongoDB con Node.js.
- **JWT (JSON Web Token)** - Para autenticación y manejo de sesiones.
- **bcryptjs** - Para encriptar contraseñas.
- **Express-validator** - Para la validación de datos en las peticiones.
- **dotenv** - Para manejar variables de entorno.
- **Multer** - Para la gestión de archivos subidos por los usuarios.
- **Nodemon** - Para recargar el servidor automáticamente en desarrollo.

## Funcionalidades Pendientes

Este proyecto aún está en desarrollo. Algunas funcionalidades que se planean implementar incluyen:

- [ ] Regresar el archivo pdf al front-end
- [ ] Modificar a un usuario solo por el admin
- [ ] Modificar un protocolo (usuario) - front-end
- [ ] Modificar un protocolo (admin) - front-end
- [ ] Cambiar el estado de un protocolo - front-end
- [ ] Verificar que pasa si un alumno recursa y tiene que meter un protocolo, verificar cuantas veces maximo puedo meter protocolo un alumno
- [ ] Verificar que al editar a un usuario que si esta como alumno y se va a cambiar el rol que no este registrado en un protocolo, y si lo esta decir que lo saquen
- [ ] Verificar que en la parte de editar usuario por el admin no se agregue un boleta ya añadida
- [ ] paginar la parte donde se muestran lso protocolos ya que solo se mandan 10 igual para la parte de los usuarios


## Errores Comunes y Soluciones

### 🔸 `listen EADDRINUSE: address already in use :::8080`
**Causa:** El puerto del servidor asignado esta siendo ocupado.  
**Solución:** Verificar no tener corriendo ya el programa pero en otra terminal o revisar que programa esta usando ese puerto
