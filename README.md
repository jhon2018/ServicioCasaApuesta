
## primer paso
ServicesCasaApuesta>npm install
npm run dev


# Instala las dependencias necesarias.
npm install pg dotenv
npm install -D @types/pg ts-node typescript
npm install morgan @types/morgan
npm install joi
npm install -D @types/joi
npm install bcryptjs jsonwebtoken nodemailer
npm install -D @types/bcryptjs @types/jsonwebtoken @types/nodemailer

# ejecuta el archivo test-connection.ts (si tienes conexion al servidor RENDER)
npm run test:db


# Lista completa de dependencias instaladas
npm list
# Ver solo dependencias de producción
npm list --only=prod
# Ver solo dependencias de desarrollo
npm list --only=dev
# Eliminar dependencias
npm uninstall mysql2 @types/mysql



📦src
 ┣ 📂config         # Variables entorno, config DB
 ┣ 📂controllers    # Lógica endpoints (ya la tienes)
 ┣ 📂database       # Configuración DB, queries (ya la tienes)
 ┣ 📂middleware     # Auth, validators, error handlers
 ┣ 📂models         # Interfaces/types (ya la tienes)
 ┣ 📂routes         # Definición rutas (ya la tienes)
 ┣ 📂schemas        # Validación (Joi/Zod) (ya la tienes)
 ┣ 📂services       # Lógica de negocio (ya la tienes)
 ┣ 📂shared         # Helpers comunes (ya la tienes)
 ┣ 📂utils          # Funciones auxiliares, constants
 ┗ 📜app.ts         # App principal