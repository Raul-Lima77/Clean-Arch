import mysql from "mysql2/promise"

export const conexao = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1",
  database: "finance",
})

export default conexao