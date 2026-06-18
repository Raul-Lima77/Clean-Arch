import { AlterarSenha } from "../../../aplicacao/usecase/usuario/AlterarSenha"
import { UsuarioRepositorioMysql } from "../../../infra/bd/mysql/UsuarioRepositorioMysql"
import { criarUsuario } from "../../setup/seed"

describe("Integração - AlterarSenha", () => {
  test("deve alterar a senha com sucesso", async () => {
    const email = `alterar${Date.now()}@email.com`
    const senhaAntiga = "senhaAntiga123"
    const novaSenha = "novaSenha123"

    const usuarioId = await criarUsuario("Maria Alice", email, senhaAntiga)

    const repositorio = new UsuarioRepositorioMysql()
    const usecase = new AlterarSenha(repositorio)

    await usecase.execute({
      usuarioId,
      senhaAtual: senhaAntiga,
      novaSenha,
    })

    const usuarioAtualizado = await repositorio.buscarPorId(usuarioId)

    expect(usuarioAtualizado).not.toBeNull()
    expect(usuarioAtualizado?.senha).toBe(novaSenha)
  })

  test("não deve alterar senha de usuário inexistente", async () => {
    const usecase = new AlterarSenha(
      new UsuarioRepositorioMysql()
    )

    await expect(
      usecase.execute({
        usuarioId: "usuario-inexistente",
        senhaAtual: "senha12345",
        novaSenha: "novaSenha123",
      })
    ).rejects.toThrow("Usuário não encontrado")
  })

  test("não deve alterar senha quando a senha atual estiver incorreta", async () => {
    const email = `senhaatual${Date.now()}@email.com`

    const usuarioId = await criarUsuario("Maria Alice", email, "senhaCorreta123")

    const repositorio = new UsuarioRepositorioMysql()
    const usecase = new AlterarSenha(repositorio)

    await expect(
      usecase.execute({
        usuarioId,
        senhaAtual: "senhaErrada123",
        novaSenha: "novaSenha123",
      })
    ).rejects.toThrow("Senha atual incorreta")

    const usuario = await repositorio.buscarPorId(usuarioId)

    expect(usuario?.senha).toBe("senhaCorreta123")
  })
})