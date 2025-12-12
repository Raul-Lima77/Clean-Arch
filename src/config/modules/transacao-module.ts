import { CreateTransacao } from "../../aplicacao/usecase/transacao/CreateTransacao"
import { EditarTransacao } from "../../aplicacao/usecase/transacao/EditarTransacao"
import { DeleteTransacao } from "../../aplicacao/usecase/transacao/DeleteTransacao"
import { ListTransacao } from "../../aplicacao/usecase/transacao/ListTransacao"
import { FiltrarTransacao } from "../../aplicacao/usecase/transacao/FiltrarTransacao"
import { TransacaoRepositorioMysql } from "../../infra/bd/mysql/TransacaoRepositorioMysql"
import { UsuarioRepositorioMysql } from "../../infra/bd/mysql/UsuarioRepositorioMysql"
import { TransacaoControle } from "../../infra/web/express/controle/TransacaoControle"

const transacaoRepositorio = new TransacaoRepositorioMysql()
const usuarioRepositorio = new UsuarioRepositorioMysql()

const createTransacao = new CreateTransacao(transacaoRepositorio, usuarioRepositorio)
const editarTransacao = new EditarTransacao(transacaoRepositorio, usuarioRepositorio)
const deleteTransacao = new DeleteTransacao(transacaoRepositorio, usuarioRepositorio)
const listTransacao = new ListTransacao(transacaoRepositorio)
const filtrarTransacao = new FiltrarTransacao(transacaoRepositorio)

export const transacaoControle = new TransacaoControle(
  createTransacao,
  editarTransacao,
  deleteTransacao,
  listTransacao,
  filtrarTransacao,
)
