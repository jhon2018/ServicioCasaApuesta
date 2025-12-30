
## primer paso
ServicesCasaApuesta>npm install


# Instala las dependencias necesarias.
npm install pg dotenv
npm install -D @types/pg ts-node typescript

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
