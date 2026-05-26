import { Usuario } from "../../../dominio/entidades/Usuario"
import type { UsuarioRepositorio } from "../../../dominio/repositorios/UsuarioRepositorio"
import type { CreateUsuarioInputDTO } from "../../dto/usuario/CreateUsuarioInputDTO"
import type { CreateUsuarioOutputDTO } from "../../dto/usuario/CreateUsuarioOutputDTO"
import type { UseCase } from "../UseCase"

export class CreateUsuario implements UseCase<CreateUsuarioInputDTO, CreateUsuarioOutputDTO> {
  constructor(private readonly usuarioRepositorio: UsuarioRepositorio) {}

  public async execute(inputDto: CreateUsuarioInputDTO): Promise<CreateUsuarioOutputDTO> {
    
    const usuarioExistente = await this.usuarioRepositorio.buscarPorEmail(inputDto.email)
    if (usuarioExistente) {
      throw new Error("E-mail já cadastrado")
    }

    const usuario = Usuario.create(inputDto.nome, inputDto.email, inputDto.senha)
    await this.usuarioRepositorio.salvar(usuario)

    const outputDTO: CreateUsuarioOutputDTO = { id: usuario.id }

    return outputDTO
  }
}
