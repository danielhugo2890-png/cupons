import mysql from "mysql2/promise"

// Configuração do banco de dados MySQL
export interface DbConfig {
  host: string
  user: string
  password: string
  database: string
}

const dbConfig: DbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cupons_linux",
}

let pool: mysql.Pool | null = null

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    })
  }
  return pool
}

// Função principal para consultas SQL
export async function query(sql: string, params?: any[]): Promise<any> {
  try {
    const connection = getPool()
    const [rows] = await connection.execute(sql, params || [])
    return rows
  } catch (error: any) {
    // 🔥 Exibe o erro real no terminal para depuração
    console.error("❌ ERRO REAL NO BANCO DE DADOS:")
    console.error("Mensagem:", error?.message)
    console.error("Código:", error?.code)
    console.error("SQL:", error?.sql)
    console.error("Stack:", error?.stack)
    
    // Relança o erro original para aparecer no console do Next.js
    throw error
  }
}

// Testar conexão manualmente
export async function testConnection(): Promise<boolean> {
  try {
    const connection = getPool()
    await connection.query("SELECT 1")
    console.log("✅ Conexão com o MySQL bem-sucedida.")
    return true
  } catch (error) {
    console.error("❌ Erro ao conectar com MySQL:", error)
    return false
  }
}

// Fechar pool de conexões
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
    console.log("🔒 Pool de conexões MySQL fechado.")
  }
}
