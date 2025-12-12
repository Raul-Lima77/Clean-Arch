import { CreateCategoria } from "../../aplicacao/usecase/categoria/CreateCategoria"
import { EditarCategoria } from "../../aplicacao/usecase/categoria/EditarCategoria"
import { DeleteCategoria } from "../../aplicacao/usecase/categoria/DeleteCategoria"
import { ListCategoria } from "../../aplicacao/usecase/categoria/ListCategoria"
import { CategoriaRepositorioMysql } from "../../infra/bd/mysql/CategoriaRepositorioMysql"
import { TransacaoRepositorioMysql } from "../../infra/bd/mysql/TransacaoRepositorioMysql"
import { CategoriaControle } from "../../infra/web/express/controle/CategoriaControle"

const categoriaRepositorio = new CategoriaRepositorioMysql()
const transacaoRepositorio = new TransacaoRepositorioMysql()

const createCategoria = new CreateCategoria(categoriaRepositorio)
const editarCategoria = new EditarCategoria(categoriaRepositorio)
const deleteCategoria = new DeleteCategoria(categoriaRepositorio, transacaoRepositorio)
const listCategoria = new ListCategoria(categoriaRepositorio)

export const categoriaControle = new CategoriaControle(createCategoria, editarCategoria, deleteCategoria, listCategoria)
