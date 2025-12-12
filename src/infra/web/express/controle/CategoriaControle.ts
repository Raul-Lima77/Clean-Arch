import type { Request, Response } from "express"
import type { CreateCategoria } from "../../../../aplicacao/usecase/categoria/CreateCategoria"
import type { EditarCategoria } from "../../../../aplicacao/usecase/categoria/EditarCategoria"
import type { DeleteCategoria } from "../../../../aplicacao/usecase/categoria/DeleteCategoria"
import type { ListCategoria } from "../../../../aplicacao/usecase/categoria/ListCategoria"

export class CategoriaControle {
  constructor(
    private createCategoria: CreateCategoria,
    private editarCategoria: EditarCategoria,
    private deleteCategoria: DeleteCategoria,
    private listCategoria: ListCategoria,
  ) {}

  public async criar(req: Request, res: Response) {
    try {
      const { nome, usuarioId, limiteGasto } = req.body
      const categoria = await this.createCategoria.execute({ nome, usuarioId, limiteGasto })
      res.status(201).json({ data: categoria.id, message: "Categoria criada com sucesso!" })
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao criar categoria" })
    }
  }

  public async editar(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { nome, limiteGasto, usuarioId } = req.body
      await this.editarCategoria.execute({ id, usuarioId, nome, limiteGasto })
      res.status(200).json({ message: "Categoria atualizada com sucesso!" })
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao editar categoria" })
    }
  }

  public async remover(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { usuarioId } = req.body
      const result = await this.deleteCategoria.execute({ id, usuarioId })
      res.status(200).json({ data: result, message: "Categoria removida com sucesso!" })
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao remover categoria" })
    }
  }

  public async listar(req: Request, res: Response) {
    try {
      const { usuarioId } = req.params
      const categorias = await this.listCategoria.execute({ usuarioId })
      res.status(200).json(categorias)
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao listar categorias" })
    }
  }
}
