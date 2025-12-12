import type { RowDataPacket } from "mysql2"
import { Transacao, type TransacaoProps, type TipoTransacao } from "../../../dominio/entidades/Transacao"
import type { TransacaoRepositorio } from "../../../dominio/repositorios/TransacaoRepositorio"
import { conexao } from "./MysqlConexao"

export class TransacaoRepositorioMysql implements TransacaoRepositorio {
  public async buscarPorId(id: string): Promise<Transacao | null> {
    try {
      const [[result]] = await conexao.query<TransacaoProps & RowDataPacket[]>("SELECT * FROM transacoes WHERE id=?", [
        id,
      ])
      if (!result) {
        return null
      }
      const { tipo, descricao, valor, data, usuarioId, categoriaId } = result

      const transacao = Transacao.fromPersistence({
        id,
        tipo: tipo as TipoTransacao,
        descricao,
        valor,
        data: new Date(data),
        usuarioId,
        categoriaId,
      })
      return transacao
    } catch (error) {
      throw error
    }
  }

  async listarPorUsuario(usuarioId: string): Promise<Transacao[]> {
    const [rows] = await conexao.query<TransacaoProps[] & RowDataPacket[]>(
      "SELECT * FROM transacoes WHERE usuario_id=? ORDER BY data DESC",
      [usuarioId],
    )
    if (Array.isArray(rows)) {
      return rows.map((row) => {
        const { id, tipo, descricao, valor, data, categoriaId } = row
        return Transacao.fromPersistence({
          id,
          tipo: tipo as TipoTransacao,
          descricao,
          valor,
          data: new Date(data),
          usuarioId,
          categoriaId,
        })
      })
    }
    return []
  }

  async filtrarPorPeriodo(usuarioId: string, dataInicio: Date, dataFim: Date): Promise<Transacao[]> {
    const [rows] = await conexao.query<TransacaoProps[] & RowDataPacket[]>(
      "SELECT * FROM transacoes WHERE usuario_id=? AND data BETWEEN ? AND ? ORDER BY data DESC",
      [usuarioId, dataInicio, dataFim],
    )
    if (Array.isArray(rows)) {
      return rows.map((row) => {
        const { id, tipo, descricao, valor, data, categoriaId } = row
        return Transacao.fromPersistence({
          id,
          tipo: tipo as TipoTransacao,
          descricao,
          valor,
          data: new Date(data),
          usuarioId,
          categoriaId,
        })
      })
    }
    return []
  }

  async filtrarPorCategoria(usuarioId: string, categoriaId: string): Promise<Transacao[]> {
    const [rows] = await conexao.query<TransacaoProps[] & RowDataPacket[]>(
      "SELECT * FROM transacoes WHERE usuario_id=? AND categoria_id=? ORDER BY data DESC",
      [usuarioId, categoriaId],
    )
    if (Array.isArray(rows)) {
      return rows.map((row) => {
        const { id, tipo, descricao, valor, data } = row
        return Transacao.fromPersistence({
          id,
          tipo: tipo as TipoTransacao,
          descricao,
          valor,
          data: new Date(data),
          usuarioId,
          categoriaId,
        })
      })
    }
    return []
  }

  async salvar(transacao: Transacao): Promise<void> {
    try {
      await conexao.query(
        "INSERT INTO transacoes (id, tipo, descricao, valor, data, usuario_id, categoria_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          transacao.id,
          transacao.tipo,
          transacao.descricao,
          transacao.valor,
          transacao.data,
          transacao.usuarioId,
          transacao.categoriaId,
        ],
      )
    } catch (error) {
      console.log(error)
      throw Error("Erro ao salvar a transação")
    }
  }

  async atualizar(transacao: Transacao): Promise<void> {
    await conexao.query("UPDATE transacoes SET descricao = ?, valor = ?, data = ?, categoria_id = ? WHERE id = ?", [
      transacao.descricao,
      transacao.valor,
      transacao.data,
      transacao.categoriaId,
      transacao.id,
    ])
  }

  async remover(id: string): Promise<boolean> {
    try {
      await conexao.query("DELETE FROM transacoes WHERE id = ?", [id])
      return true
    } catch (error) {
      console.log(error)
      throw Error("Erro ao deletar a transação: " + id)
    }
  }
}
