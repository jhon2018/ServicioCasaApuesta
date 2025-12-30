import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('🧪 INICIANDO PRUEBA DE CONEXIÓN A POSTGRESQL');
console.log('============================================');

// Verificar variables de entorno
console.log('📋 Variables cargadas:');
console.log('   DB_HOST:', process.env.DB_HOST ? '✅ Sí' : '❌ No');
console.log('   DB_USER:', process.env.DB_USER ? '✅ Sí' : '❌ No');
console.log('   DB_NAME:', process.env.DB_NAME ? '✅ Sí' : '❌ No');
console.log('   DB_PORT:', process.env.DB_PORT || '5432 (default)');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // ¡IMPORTANTE para Render!
  },
  connectionTimeoutMillis: 10000, // 10 segundos
});

async function testConnection() {
  console.log('\n🔗 Intentando conectar a PostgreSQL...');
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Puerto: ${process.env.DB_PORT || '5432'}`);
  console.log(`   Usuario: ${process.env.DB_USER}`);
  console.log(`   Base de datos: ${process.env.DB_NAME}`);
  
  try {
    const client = await pool.connect();
    console.log('✅ CONEXIÓN EXITOSA!');
    
    console.log('\n📊 Prueba 1: Versión de PostgreSQL');
    const versionResult = await client.query('SELECT version();');
    console.log(`   Versión: ${versionResult.rows[0].version.split(',')[0]}`);
    
    console.log('\n🕐 Prueba 2: Hora del servidor');
    const timeResult = await client.query('SELECT NOW() as current_time;');
    console.log(`   Hora actual: ${timeResult.rows[0].current_time}`);
    
    console.log('\n📋 Prueba 3: Tablas disponibles');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    if (tablesResult && tablesResult.rowCount !== null && tablesResult.rowCount > 0) {
      console.log(`   Se encontraron ${tablesResult.rowCount} tabla(s):`);
      tablesResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.table_name}`);
      });
    } else {
      console.log('   ⚠️ No hay tablas en la base de datos');
    }
    
    console.log('\n💾 Prueba 4: Información de la BD');
    const dbInfo = await client.query(`
      SELECT 
        pg_database_size(current_database()) as size_bytes,
        pg_size_pretty(pg_database_size(current_database())) as size_pretty;
    `);
    console.log(`   Tamaño: ${dbInfo.rows[0].size_pretty}`);
    
    client.release();
    
    console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!');
    console.log('✅ La base de datos está lista para usar');
    
  } catch (error: unknown) {
    console.error('\n❌ ERROR DE CONEXIÓN');
    console.log('='.repeat(50));
    
    if (error instanceof Error) {
      const nodeError = error as NodeJS.ErrnoException;
      
      console.error(`   Mensaje: ${nodeError.message}`);
      
      if (nodeError.code) {
        console.error(`   Código: ${nodeError.code}`);
        
        // Mensajes de ayuda
        const troubleshooting: Record<string, string> = {
          'ECONNREFUSED': '🔒 Conexión rechazada. Posibles causas:\n     • PostgreSQL no está corriendo\n     • Puerto incorrecto\n     • Host incorrecto',
          '28P01': '🔑 Error de autenticación. Verifica:\n     • Usuario y contraseña en .env\n     • Las credenciales en Render.com',
          '3D000': '🏷️ La base de datos no existe\n     • Verifica DB_NAME en .env',
          'ENOTFOUND': '🌐 No se puede resolver el host\n     • Verifica DB_HOST en .env\n     • ¿Tienes conexión a internet?',
          'ETIMEDOUT': '⏰ Timeout de conexión\n     • Render puede estar "dormido"\n     • Intenta de nuevo en 30 segundos',
        };
        
        if (troubleshooting[nodeError.code]) {
          console.error(`\n💡 ${troubleshooting[nodeError.code]}`);
        }
      }
    } else {
      console.error('   Error desconocido:', error);
    }
    
    console.log('\n🔍 Verifica tu configuración:');
    console.log('   1. Ve a https://dashboard.render.com/');
    console.log('   2. Selecciona tu base de datos PostgreSQL');
    console.log('   3. Verifica las credenciales en "Connections"');
    console.log('   4. Asegúrate de que la BD esté "Active"');
    
  } finally {
    console.log('\n🔌 Cerrando conexión...');
    await pool.end();
    console.log('✅ Prueba finalizada');
  }
}

testConnection();