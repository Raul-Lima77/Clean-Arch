import { EditarPerfil } from "../../aplicacao/usecase/usuario/EditarPerfil"
import type { EditarPerfilInputDTO } from "../../aplicacao/dto/usuario/EditarPerfilInputDTO"
import { UsuarioRepositorioMock } from "./UsuarioRepositorioMock"
import { Usuario } from "../../dominio/entidades/Usuario"

describe("Caso de Uso - EditarPerfil", () => {
  let repositorioMock: UsuarioRepositorioMock
  let sut: EditarPerfil

  beforeEach(() => {
    repositorioMock = new UsuarioRepositorioMock()
    sut = new EditarPerfil(repositorioMock)
  })


  it("deve editar o perfil com sucesso quando os dados forem válidos", async () => {
   
    const usuario = Usuario.create("Maria Alice", "alice@email.com", "senhaSegura123")
    await repositorioMock.salvar(usuario)

    
    const inputDto: EditarPerfilInputDTO = {
      usuarioId: usuario.id,
      nome: "Alice Freitas", 
      email: "alice.freitas@email.com" 
    }

    
    await sut.execute(inputDto)

    const usuarioAtualizado = await repositorioMock.buscarPorId(usuario.id)
    expect(usuarioAtualizado?.nome).toBe("Alice Freitas")
    expect(usuarioAtualizado?.email).toBe("alice.freitas@email.com")
  })

  it("deve lançar um erro se o ID do usuário não existir", async () => {
    const inputDto: EditarPerfilInputDTO = {
      usuarioId: "id-qualquer-que-nao-existe",
      nome: "Nome Qualquer",
      email: "email@qualquer.com"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Usuário não encontrado")
  })

  
  it("deve lançar um erro se o novo e-mail já estiver cadastrado para outro usuário", async () => {
    
    const usuarioA = Usuario.create("Usuario A", "usuario.a@email.com", "senhaSegura123")
    await repositorioMock.salvar(usuarioA)

    
    const usuarioB = Usuario.create("Usuario B", "email.ocupado@email.com", "senhaSegura123")
    await repositorioMock.salvar(usuarioB)

    
    const inputDto = {
      usuarioId: usuarioA.id,
      nome: "Usuario A Modificado",
      email: "email.ocupado@email.com" 
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("E-mail já cadastrado")
  })
})