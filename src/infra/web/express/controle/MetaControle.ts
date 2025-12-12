import type { Request, Response } from "express"
import type { CreateMeta } from "../../../../aplicacao/usecase/meta/CreateMeta"
import type { ListMeta } from "../../../../aplicacao/usecase/meta/ListMeta"
import type { DeleteMeta } from "../../../../aplicacao/usecase/meta/DeleteMeta"

export class MetaControle {
  constructor(
    private createMeta: CreateMeta,
    private listMeta: ListMeta,
    private deleteMeta: DeleteMeta,
  ) {}

  public async criar(req: Request, res: Response) {
    try {
      const { descricao, valorAlvo, dataInicio, dataFim, usuarioId } = req.body
      const meta = await this.createMeta.execute({
        descricao,
        valorAlvo,
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        usuarioId,
      })
      res.status(201).json({ data: meta.id, message: "Meta criada com sucesso!" })
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao criar meta" })
    }
  }

  public async listar(req: Request, res: Response) {
    try {
      const { usuarioId } = req.params
      const metas = await this.listMeta.execute({ usuarioId })
      res.status(200).json(metas)
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao listar metas" })
    }
  }

  public async remover(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { usuarioId } = req.body
      const result = await this.deleteMeta.execute({ id, usuarioId })
      res.status(200).json({ data: result, message: "Meta removida com sucesso!" })
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao remover meta" })
    }
  }
}
