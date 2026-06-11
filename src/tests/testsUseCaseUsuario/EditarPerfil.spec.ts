import { EditarPerfil } from "../../aplicacao/usecase/usuario/EditarPerfil"
import type { EditarPerfilInputDTO } from "../../aplicacao/dto/usuario/EditarPerfilInputDTO"
import { Usuario } from "../../dominio/entidades/Usuario"
import { UsuarioRepositorioMysql } from "../../infra/bd/mysql/UsuarioRepositorioMysql"

jest.mock("../../infra/bd/mysql/UsuarioRepositorioMysql")

describe("Caso de Uso - EditarPerfil", () => {
  let repositorioMock: jest.Mocked<UsuarioRepositorioMysql>
  let sut: EditarPerfil

  beforeEach(() => {
    repositorioMock = new UsuarioRepositorioMysql() as jest.Mocked<UsuarioRepositorioMysql>
    sut = new EditarPerfil(repositorioMock)
  })

  it("deve editar o perfil com sucesso quando os dados forem válidos", async () => {
    const usuarioExistente = Usuario.create("Maria Alice", "alice@email.com", "senhaSegura123")

    repositorioMock.buscarPorId.mockResolvedValueOnce(usuarioExistente)
    repositorioMock.buscarPorEmail.mockResolvedValueOnce(null)
    repositorioMock.atualizar.mockResolvedValueOnce(undefined)

    const inputDto: EditarPerfilInputDTO = {
      usuarioId: usuarioExistente.id,
      nome: "Alice Freitas", 
      email: "alice.freitas@email.com" 
    }

    await sut.execute(inputDto)

    expect(repositorioMock.atualizar).toHaveBeenCalledTimes(1)
    
    expect(repositorioMock.atualizar).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: "Alice Freitas",
        email: "alice.freitas@email.com"
      })
    )
  })

  
  it("deve lançar um erro se o ID do usuário não existir", async () => {
    
    repositorioMock.buscarPorId.mockResolvedValueOnce(null)

    const inputDto = {
      usuarioId: "id-qualquer-que-nao-existe",
      nome: "Nome Qualquer",
      email: "email@qualquer.com"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Usuário não encontrado")
    
    expect(repositorioMock.atualizar).not.toHaveBeenCalled()
  })

  
  it("deve lançar um erro se o novo e-mail já estiver cadastrado para outro usuário", async () => {
    const usuarioA = Usuario.create("Usuario A", "usuario.a@email.com", "senhaSegura123")
    const usuarioB = Usuario.create("Usuario B", "email.ocupado@email.com", "senhaSegura123")

    
    repositorioMock.buscarPorId.mockResolvedValueOnce(usuarioA)
    repositorioMock.buscarPorEmail.mockResolvedValueOnce(usuarioB)

    const inputDto = {
      usuarioId: usuarioA.id,
      nome: "Usuario A Modificado",
      email: "email.ocupado@email.com" 
    }

    
    await expect(sut.execute(inputDto)).rejects.toThrow("E-mail já cadastrado")
    expect(repositorioMock.atualizar).not.toHaveBeenCalled()
  })
})