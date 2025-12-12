import type { UsuarioRepositorio } from "../../../dominio/repositorios/UsuarioRepositorio"
import type { AlterarSenhaInputDTO } from "../../dto/usuario/AlterarSenhaInputDTO"
import type { UseCase } from "../UseCase"

export class AlterarSenha implements UseCase<AlterarSenhaInputDTO, void> {
  constructor(private readonly usuarioRepositorio: UsuarioRepositorio) {}

  public async execute(inputDto: AlterarSenhaInputDTO): Promise<void> {
    const usuario = await this.usuarioRepositorio.buscarPorId(inputDto.usuarioId)

    if (!usuario) {
      throw new Error("Usuário não encontrado")
    }

    if (usuario.senha !== inputDto.senhaAtual) {
      throw new Error("Senha atual incorreta")
    }

    usuario.alterarSenha(inputDto.novaSenha)
    await this.usuarioRepositorio.atualizar(usuario)
  }
}
