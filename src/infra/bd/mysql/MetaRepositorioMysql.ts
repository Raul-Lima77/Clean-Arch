import type { RowDataPacket } from "mysql2"
import { Meta, type MetaProps } from "../../../dominio/entidades/Meta"
import type { MetaRepositorio } from "../../../dominio/repositorios/MetaRepositorio"
import { conexao } from "./MysqlConexao"

export class MetaRepositorioMysql implements MetaRepositorio {
  public async buscarPorId(id: string): Promise<Meta | null> {
    try {
      const [[result]] = await conexao.query<MetaProps & RowDataPacket[]>("SELECT * FROM metas WHERE id=?", [id])
      if (!result) {
        return null
      }
      const { descricao, valorAlvo, valorAtual, dataInicio, dataFim, usuarioId } = result

      const meta = Meta.fromPersistence({
        id,
        descricao,
        valorAlvo,
        valorAtual,
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        usuarioId,
      })
      return meta
    } catch (error) {
      throw error
    }
  }

  async listarPorUsuario(usuarioId: string): Promise<Meta[]> {
    const [rows] = await conexao.query<MetaProps[] & RowDataPacket[]>(
      "SELECT * FROM metas WHERE usuario_id=? ORDER BY data_fim DESC",
      [usuarioId],
    )
    if (Array.isArray(rows)) {
      return rows.map((row) => {
        const { id, descricao, valorAlvo, valorAtual, dataInicio, dataFim } = row
        return Meta.fromPersistence({
          id,
          descricao,
          valorAlvo,
          valorAtual,
          dataInicio: new Date(dataInicio),
          dataFim: new Date(dataFim),
          usuarioId,
        })
      })
    }
    return []
  }

  async salvar(meta: Meta): Promise<void> {
    try {
      await conexao.query(
        "INSERT INTO metas (id, descricao, valor_alvo, valor_atual, data_inicio, data_fim, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [meta.id, meta.descricao, meta.valorAlvo, meta.valorAtual, meta.dataInicio, meta.dataFim, meta.usuarioId],
      )
    } catch (error) {
      console.log(error)
      throw Error("Erro ao salvar a meta")
    }
  }

  async atualizar(meta: Meta): Promise<void> {
    await conexao.query("UPDATE metas SET valor_atual = ? WHERE id = ?", [meta.valorAtual, meta.id])
  }

  async remover(id: string): Promise<boolean> {
    try {
      await conexao.query("DELETE FROM metas WHERE id = ?", [id])
      return true
    } catch (error) {
      console.log(error)
      throw Error("Erro ao deletar a meta: " + id)
    }
  }
}
