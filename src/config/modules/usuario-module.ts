import { CreateUsuario } from "../../aplicacao/usecase/usuario/CreateUsuario"
import { LoginUsuario } from "../../aplicacao/usecase/usuario/LoginUsuario"
import { EditarPerfil } from "../../aplicacao/usecase/usuario/EditarPerfil"
import { AlterarSenha } from "../../aplicacao/usecase/usuario/AlterarSenha"
import { UsuarioRepositorioMysql } from "../../infra/bd/mysql/UsuarioRepositorioMysql"
import { UsuarioControle } from "../../infra/web/express/controle/UsuarioControle"

const usuarioRepositorio = new UsuarioRepositorioMysql()

const createUsuario = new CreateUsuario(usuarioRepositorio)
const loginUsuario = new LoginUsuario(usuarioRepositorio)
const editarPerfil = new EditarPerfil(usuarioRepositorio)
const alterarSenha = new AlterarSenha(usuarioRepositorio)

export const usuarioControle = new UsuarioControle(createUsuario, loginUsuario, editarPerfil, alterarSenha)
