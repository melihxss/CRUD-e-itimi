const sql = require("mssql");
require("dotenv").config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, 
  database: process.env.DB_NAME,    
  options: {
    encrypt: false,                 // Somee için böyle bırak
    trustServerCertificate: true,
  },
};

async function getPool() {
  if (!global.connectionPool) {
    global.connectionPool = await sql.connect(dbConfig);
  }
  return global.connectionPool;
}

async function queryDb(query, params = []) {
  const pool = await getPool();
  const request = pool.request();

  params.forEach((p) => {
    request.input(p.name, p.type, p.value);
  });

  return request.query(query);
}

module.exports = { sql, queryDb };