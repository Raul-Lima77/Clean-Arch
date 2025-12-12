import type { Request, Response } from "express"
import type { CreateTransacao } from "../../../../aplicacao/usecase/transacao/CreateTransacao"
import type { EditarTransacao } from "../../../../aplicacao/usecase/transacao/EditarTransacao"
import type { DeleteTransacao } from "../../../../aplicacao/usecase/transacao/DeleteTransacao"
import type { ListTransacao } from "../../../../aplicacao/usecase/transacao/ListTransacao"
import type { FiltrarTransacao } from "../../../../aplicacao/usecase/transacao/FiltrarTransacao"

export class TransacaoControle {
  constructor(
    private createTransacao: CreateTransacao,
    private editarTransacao: EditarTransacao,
    private deleteTransacao: DeleteTransacao,
    private listTransacao: ListTransacao,
    private filtrarTransacao: FiltrarTransacao,
  ) {}

  public async criar(req: Request, res: Response) {
    try {
      const { tipo, descricao, valor, data, usuarioId, categoriaId } = req.body
      const transacao = await this.createTransacao.execute({
        tipo,
        descricao,
        valor,
        data: new Date(data),
        usuarioId,
        categoriaId,
      })
      res.status(201).json({ data: transacao, message: "Transação registrada com sucesso!" })
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao criar transação" })
    }
  }

  public async editar(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { descricao, valor, data, categoriaId, usuarioId } = req.body
      await this.editarTransacao.execute({
        id,
        usuarioId,
        descricao,
        valor,
        data: data ? new Date(data) : undefined,
        categoriaId,
      })
      res.status(200).json({ message: "Transação atualizada com sucesso!" })
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao editar transação" })
    }
  }

  public async remover(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { usuarioId } = req.body
      const result = await this.deleteTransacao.execute({ id, usuarioId })
      res.status(200).json({ data: result, message: "Transação removida com sucesso!" })
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao remover transação" })
    }
  }

  public async listar(req: Request, res: Response) {
    try {
      const { usuarioId } = req.params
      const transacoes = await this.listTransacao.execute({ usuarioId })
      res.status(200).json(transacoes)
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao listar transações" })
    }
  }

  public async filtrar(req: Request, res: Response) {
    try {
      const { usuarioId } = req.params
      const { dataInicio, dataFim, categoriaId } = req.query

      const transacoes = await this.filtrarTransacao.execute({
        usuarioId,
        dataInicio: dataInicio ? new Date(dataInicio as string) : undefined,
        dataFim: dataFim ? new Date(dataFim as string) : undefined,
        categoriaId: categoriaId as string,
      })
      res.status(200).json(transacoes)
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao filtrar transações" })
    }
  }
}
