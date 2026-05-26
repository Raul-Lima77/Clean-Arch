import { EditarPerfil } from "../../aplicacao/usecase/usuario/EditarPerfil"
import { UsuarioRepositorioMock } from "./UsuarioRepositorioMock"
import { Usuario } from "../../dominio/entidades/Usuario"

describe("Caso de Uso - EditarPerfil", () => {
  let repositorioMock: UsuarioRepositorioMock
  let sut: EditarPerfil

  beforeEach(() => {
    repositorioMock = new UsuarioRepositorioMock()
    sut = new EditarPerfil(repositorioMock)
  })

  // CENÁRIO 1: Sucesso
  it("deve editar o perfil com sucesso quando os dados forem válidos", async () => {
    // 1. Cadastramos um usuário no banco falso
    const usuario = Usuario.create("Maria Alice", "alice@email.com", "senhaSegura123")
    await repositorioMock.salvar(usuario)

    // 2. Criamos os dados novos para alteração usando o ID dele
    const inputDto = {
      usuarioId: usuario.id,
      nome: "Alice Freitas", // Mudando o nome
      email: "alice.freitas@email.com" // Mudando o email
    }

    // 3. Executamos
    await sut.execute(inputDto)

    // Verificações: Vamos buscar o usuário na memória para ver se mudou de verdade
    const usuarioAtualizado = await repositorioMock.buscarPorId(usuario.id)
    expect(usuarioAtualizado?.nome).toBe("Alice Freitas")
    expect(usuarioAtualizado?.email).toBe("alice.freitas@email.com")
  })

  // CENÁRIO 2: Usuário não encontrado
  it("deve lançar um erro se o ID do usuário não existir", async () => {
    const inputDto = {
      usuarioId: "id-qualquer-que-nao-existe",
      nome: "Nome Qualquer",
      email: "email@qualquer.com"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Usuário não encontrado")
  })

  // CENÁRIO 3: E-mail já ocupado por outra pessoa
  it("deve lançar um erro se o novo e-mail já estiver cadastrado para outro usuário", async () => {
    // 1. Cadastramos o Usuário A (quem vai tentar editar)
    const usuarioA = Usuario.create("Usuario A", "usuario.a@email.com", "senhaSegura123")
    await repositorioMock.salvar(usuarioA)

    // 2. Cadastramos o Usuário B (quem já é dono do email que o A quer roubar)
    const usuarioB = Usuario.create("Usuario B", "email.ocupado@email.com", "senhaSegura123")
    await repositorioMock.salvar(usuarioB)

    // 3. O Usuário A tenta mudar o e-mail dele para o e-mail do Usuário B
    const inputDto = {
      usuarioId: usuarioA.id,
      nome: "Usuario A Modificado",
      email: "email.ocupado@email.com" // E-mail do Usuário B
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("E-mail já cadastrado")
  })
})