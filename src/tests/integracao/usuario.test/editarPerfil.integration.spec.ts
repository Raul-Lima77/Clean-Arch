import { EditarPerfil } from "../../../aplicacao/usecase/usuario/EditarPerfil"
import { UsuarioRepositorioMysql } from "../../../infra/bd/mysql/UsuarioRepositorioMysql"
import { criarUsuario } from "../../setup/seed"

describe("Integração - EditarPerfil", () => {
  test("deve editar o perfil com sucesso", async () => {
    const emailAntigo = `antigo${Date.now()}@email.com`
    const emailNovo = `novo${Date.now()}@email.com`

    const usuarioId = await criarUsuario("Maria Alice", emailAntigo, "senha12345")

    const repositorio = new UsuarioRepositorioMysql()
    const usecase = new EditarPerfil(repositorio)

    await usecase.execute({
      usuarioId,
      nome: "Alice Freitas",
      email: emailNovo,
    })

    const usuarioAtualizado = await repositorio.buscarPorId(usuarioId)

    expect(usuarioAtualizado).not.toBeNull()
    expect(usuarioAtualizado?.nome).toBe("Alice Freitas")
    expect(usuarioAtualizado?.email).toBe(emailNovo)
  })

  test("não deve editar perfil de usuário inexistente", async () => {
    const usecase = new EditarPerfil(
      new UsuarioRepositorioMysql()
    )

    await expect(
      usecase.execute({
        usuarioId: "usuario-inexistente",
        nome: "Alice",
        email: `alice${Date.now()}@email.com`,
      })
    ).rejects.toThrow("Usuário não encontrado")
  })

  test("não deve permitir alterar para e-mail já cadastrado", async () => {
    const emailUsuarioA = `usuarioA${Date.now()}@email.com`
    const emailUsuarioB = `usuarioB${Date.now()}@email.com`

    const usuarioAId = await criarUsuario("Usuario A", emailUsuarioA, "senha12345")
    await criarUsuario("Usuario B", emailUsuarioB, "senha12345")

    const repositorio = new UsuarioRepositorioMysql()
    const usecase = new EditarPerfil(repositorio)

    await expect(
      usecase.execute({
        usuarioId: usuarioAId,
        nome: "Usuario A Alterado",
        email: emailUsuarioB,
      })
    ).rejects.toThrow("E-mail já cadastrado")

    const usuarioA = await repositorio.buscarPorId(usuarioAId)

    expect(usuarioA?.email).toBe(emailUsuarioA)
  })
})