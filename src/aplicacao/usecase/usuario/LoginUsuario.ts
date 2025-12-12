import type { UsuarioRepositorio } from "../../../dominio/repositorios/UsuarioRepositorio"
import type { LoginUsuarioInputDTO } from "../../dto/usuario/LoginUsuarioInputDTO"
import type { LoginUsuarioOutputDTO } from "../../dto/usuario/LoginUsuarioOutputDTO"
import type { UseCase } from "../UseCase"

export class LoginUsuario implements UseCase<LoginUsuarioInputDTO, LoginUsuarioOutputDTO> {
  constructor(private readonly usuarioRepositorio: UsuarioRepositorio) {}

  public async execute(inputDto: LoginUsuarioInputDTO): Promise<LoginUsuarioOutputDTO> {
    const usuario = await this.usuarioRepositorio.buscarPorEmail(inputDto.email)

    if (!usuario) {
      throw new Error("Credenciais inválidas")
    }

    if (usuario.senha !== inputDto.senha) {
      throw new Error("Credenciais inválidas")
    }

    const outputDTO: LoginUsuarioOutputDTO = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      saldo: usuario.saldo,
    }

    return outputDTO
  }
}
