import type { UsuarioRepositorio } from "../../../dominio/repositorios/UsuarioRepositorio"
import type { EditarPerfilInputDTO } from "../../dto/usuario/EditarPerfilInputDTO"
import type { UseCase } from "../UseCase"

export class EditarPerfil implements UseCase<EditarPerfilInputDTO, void> {
  constructor(private readonly usuarioRepositorio: UsuarioRepositorio) {}

  public async execute(inputDto: EditarPerfilInputDTO): Promise<void> {
    const usuario = await this.usuarioRepositorio.buscarPorId(inputDto.usuarioId)

    if (!usuario) {
      throw new Error("Usuário não encontrado")
    }

    // Verificar se novo email já existe
    if (inputDto.email && inputDto.email !== usuario.email) {
      const emailExistente = await this.usuarioRepositorio.buscarPorEmail(inputDto.email)
      if (emailExistente) {
        throw new Error("E-mail já cadastrado")
      }
    }

    usuario.editarPerfil(inputDto.nome, inputDto.email)
    await this.usuarioRepositorio.atualizar(usuario)
  }
}
