# Guía de Instalación del Front-end

Esta guía proporciona instrucciones paso a paso para configurar y ejecutar el Front-end del proyecto.

## Prerrequisitos

<h2>1. Instalar Node.js</h2>

   - Descarga e instala Node.js desde [https://nodejs.org/es](https://nodejs.org/es).

>[!IMPORTANT]
>Espera a que se instale por completo el node js

   - Verifica la instalación ejecutando:
     ```bash
     node -v
     npm -v
     ```

<h2>2. Descargar y configurar el back-end</h2>
     
>[!NOTE]
>Ve la documentacion de instalacion y configuracion del back-end en el siguiente linck: https://github.com/jazielSlayer/SAFT-Bakent

  - Clona el repositorio del bakent:

     ```bash
     git clone https://github.com/jazielSlayer/SAFT-Bakent.git
     ```
     

>[!IMPORTANT]
>Importante es nesesario que la instalacion del back-end se aga de forma como se ecplica en la documentacion

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## Pasos de Instalación

<h2>3. Clonar el Repositorio</h2>

   - Clona el repositorio del proyecto usando:
   
   ```bash
   git clone https://github.com/jazielSlayer/SAFT-Bakent.git
   ```

<h2>4. Instalar Dependencias</h2>

   - Navega al directorio del proyecto e instala las dependencias requeridas:
   
   ```bash
   npm install
   ```

<h2>5. Configurar Variables de Entorno</h2>

>[!IMPORTANT]
>Este archivo es importante para no guardar datos sensibles como contraseñas

   - Crea un archivo `.env` en la raíz del proyecto:
     ```powershell
     New-Item -Path .env -ItemType File -Force
     ```
   - Agrega las siguientes variables al archivo `.env`:
     ```powershell
     Add-Content -Path .env -Value "DB_HOST=localhost"
     Add-Content -Path .env -Value "DB_USER=root"
     Add-Content -Path .env -Value "DB_PASSWORD="
     Add-Content -Path .env -Value "DB_DATABASE=saf"
     ```
   - Agrega tu correo electrónico para la variable `CORREO_APP` (reemplaza `example@gmail.com` con tu correo real):
     ```powershell
     Add-Content -Path .env -Value "CORREO_APP=example@gmail.com"
     ```
>[!NOTE]
>Nesesitas activar la verificacion de dos pasos de tu cuenta de google
   - Genera una contraseña específica para la aplicación desde [Contraseñas de Aplicaciones de Google](https://myaccount.google.com/apppasswords?pli=1&rapt=AEjHL4MBatzGXSV5f-OI9U1v8ujdutvXwSkByemPACclTJANJBc6yTPJhopYmYIYqE_NtoCxRqvJMY_kx_E6loH_xljv-dPt1oqRblPceA-A_a9meGtBeoU) y agrégala al archivo `.env` (reemplaza la contraseña de ejemplo):
     ```powershell
     Add-Content -Path .env -Value "CONTRASENA_APP=tu-contraseña-generada"
     ```
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">
<h2>6. Configurar la Base de Datos</h2>

   - Ejecuta el script de la base de datos (`db`) para crear la estructura de la base de datos necesaria.

<h2>7. Compilar el Proyecto</h2>

   - Compila el proyecto para transformar la carpeta `src` en la carpeta `dist`:
     ```bash
     npm run build
     ```
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">
<h2>8. Ejecutar el Proyecto</h2>

   - Inicia el servidor de desarrollo (se reinicia automáticamente al hacer cambios):
     ```bash
     npm run dev
     ```

   - Alternativamente, ejecuta el proyecto compilado:
>[!IMPORTANT]
>Este comando es importante para crear el API para el frontend.

   ```bash
   npm run build
   ```
