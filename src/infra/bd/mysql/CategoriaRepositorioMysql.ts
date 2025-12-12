import type { RowDataPacket } from "mysql2"
import { Categoria, type CategoriaProps } from "../../../dominio/entidades/Categoria"
import type { CategoriaRepositorio } from "../../../dominio/repositorios/CategoriaRepositorio"
import { conexao } from "./MysqlConexao"

export class CategoriaRepositorioMysql implements CategoriaRepositorio {
  public async buscarPorId(id: string): Promise<Categoria | null> {
    try {
      const [[result]] = await conexao.query<CategoriaProps & RowDataPacket[]>("SELECT * FROM categorias WHERE id=?", [
        id,
      ])
      if (!result) {
        return null
      }
      const { nome, limiteGasto, usuarioId } = result

      const categoria = Categoria.fromPersistence({ id, nome, limiteGasto, usuarioId })
      return categoria
    } catch (error) {
      throw error
    }
  }

  async listarPorUsuario(usuarioId: string): Promise<Categoria[]> {
    const [rows] = await conexao.query<CategoriaProps[] & RowDataPacket[]>(
      "SELECT * FROM categorias WHERE usuario_id=?",
      [usuarioId],
    )
    if (Array.isArray(rows)) {
      return rows.map((row) => {
        const { id, nome, limiteGasto } = row
        return Categoria.fromPersistence({ id, nome, limiteGasto, usuarioId })
      })
    }
    return []
  }

  async buscarPorNome(nome: string, usuarioId: string): Promise<Categoria | null> {
    try {
      const [[result]] = await conexao.query<CategoriaProps & RowDataPacket[]>(
        "SELECT * FROM categorias WHERE nome=? AND usuario_id=?",
        [nome, usuarioId],
      )
      if (!result) {
        return null
      }
      const { id, limiteGasto } = result

      const categoria = Categoria.fromPersistence({ id, nome, limiteGasto, usuarioId })
      return categoria
    } catch (error) {
      throw error
    }
  }

  async salvar(categoria: Categoria): Promise<void> {
    try {
      await conexao.query("INSERT INTO categorias (id, nome, limite_gasto, usuario_id) VALUES (?, ?, ?, ?)", [
        categoria.id,
        categoria.nome,
        categoria.limiteGasto,
        categoria.usuarioId,
      ])
    } catch (error) {
      console.log(error)
      throw Error("Erro ao salvar a categoria")
    }
  }

  async atualizar(categoria: Categoria): Promise<void> {
    await conexao.query("UPDATE categorias SET nome = ?, limite_gasto = ? WHERE id = ?", [
      categoria.nome,
      categoria.limiteGasto,
      categoria.id,
    ])
  }

  async remover(id: string): Promise<boolean> {
    try {
      await conexao.query("DELETE FROM categorias WHERE id = ?", [id])
      return true
    } catch (error) {
      console.log(error)
      throw Error("Erro ao deletar a categoria: " + id)
    }
  }
}
