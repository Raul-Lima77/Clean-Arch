import type { RowDataPacket } from "mysql2"
import { Usuario, type UsuarioProps } from "../../../dominio/entidades/Usuario"
import type { UsuarioRepositorio } from "../../../dominio/repositorios/UsuarioRepositorio"
import { conexao } from "./MysqlConexao"

export class UsuarioRepositorioMysql implements UsuarioRepositorio {
  public async buscarPorId(id: string): Promise<Usuario | null> {
    try {
      const [[result]] = await conexao.query<UsuarioProps & RowDataPacket[]>("SELECT * FROM usuarios WHERE id=?", [id])
      if (!result) {
        return null
      }
      const { nome, email, senha, saldo, dataCriacao } = result

      const usuario = Usuario.fromPersistence({ id, nome, email, senha, saldo, dataCriacao: new Date(dataCriacao) })
      return usuario
    } catch (error) {
      throw error
    }
  }

  public async buscarPorEmail(email: string): Promise<Usuario | null> {
    try {
      const [[result]] = await conexao.query<UsuarioProps & RowDataPacket[]>("SELECT * FROM usuarios WHERE email=?", [
        email,
      ])
      if (!result) {
        return null
      }
      const { id, nome, senha, saldo, dataCriacao } = result

      const usuario = Usuario.fromPersistence({
        id,
        nome,
        email,
        senha,
        saldo,
        dataCriacao: new Date(dataCriacao),
      })
      return usuario
    } catch (error) {
      throw error
    }
  }

  async listar(): Promise<Usuario[]> {
    const [rows] = await conexao.query<UsuarioProps[] & RowDataPacket[]>("SELECT * FROM usuarios")
    if (Array.isArray(rows)) {
      return rows.map((row) => {
        const { id, nome, email, senha, saldo, dataCriacao } = row
        return Usuario.fromPersistence({ id, nome, email, senha, saldo, dataCriacao: new Date(dataCriacao) })
      })
    }
    return []
  }

  async salvar(usuario: Usuario): Promise<void> {
    try {
      await conexao.query(
        "INSERT INTO usuarios (id, nome, email, senha, saldo, data_criacao) VALUES (?, ?, ?, ?, ?, ?)",
        [usuario.id, usuario.nome, usuario.email, usuario.senha, usuario.saldo, usuario.dataCriacao],
      )
    } catch (error) {
      console.log(error)
      throw Error("Erro ao salvar o usuário: " + usuario.nome)
    }
  }

  async atualizar(usuario: Usuario): Promise<void> {
    await conexao.query("UPDATE usuarios SET nome = ?, email = ?, senha = ?, saldo = ? WHERE id = ?", [
      usuario.nome,
      usuario.email,
      usuario.senha,
      usuario.saldo,
      usuario.id,
    ])
  }

  async remover(id: string): Promise<boolean> {
    try {
      await conexao.query("DELETE FROM usuarios WHERE id = ?", [id])
      return true
    } catch (error) {
      console.log(error)
      throw Error("Erro ao deletar o usuário: " + id)
    }
  }
}
