import type { Request, Response } from "express"
import type { CreateUsuario } from "../../../../aplicacao/usecase/usuario/CreateUsuario"
import type { LoginUsuario } from "../../../../aplicacao/usecase/usuario/LoginUsuario"
import type { EditarPerfil } from "../../../../aplicacao/usecase/usuario/EditarPerfil"
import type { AlterarSenha } from "../../../../aplicacao/usecase/usuario/AlterarSenha"

export class UsuarioControle {
  constructor(
    private createUsuario: CreateUsuario,
    private loginUsuario: LoginUsuario,
    private editarPerfil: EditarPerfil,
    private alterarSenha: AlterarSenha,
  ) {}

  public async cadastrar(req: Request, res: Response) {
    try {
      const { nome, email, senha } = req.body
      const usuario = await this.createUsuario.execute({ nome, email, senha })
      res.status(201).json({ data: usuario.id, message: "Usuário cadastrado com sucesso!" })
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao cadastrar usuário" })
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body
      const usuario = await this.loginUsuario.execute({ email, senha })
      res.status(200).json({ data: usuario, message: "Login realizado com sucesso!" })
    } catch (error: any) {
      res.status(401).json({ error: error.message || "Credenciais inválidas" })
    }
  }

  public async editar(req: Request, res: Response) {
    try {
      const { usuarioId } = req.params
      const { nome, email } = req.body
      await this.editarPerfil.execute({ usuarioId, nome, email })
      res.status(200).json({ message: "Perfil atualizado com sucesso!" })
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao editar perfil" })
    }
  }

  public async alterarSenhaHandler(req: Request, res: Response) {
    try {
      const { usuarioId } = req.params
      const { senhaAtual, novaSenha } = req.body
      await this.alterarSenha.execute({ usuarioId, senhaAtual, novaSenha })
      res.status(200).json({ message: "Senha alterada com sucesso!" })
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Erro ao alterar senha" })
    }
  }
}
