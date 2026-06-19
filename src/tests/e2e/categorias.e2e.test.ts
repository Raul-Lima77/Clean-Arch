import request from "supertest"
import { app } from "./app"

describe("E2E - Categorias", () => {
  const usuarioEmail = `categoria.usuario.${Date.now()}@teste.com`
  const usuarioSenha = "senhaCat123"

  async function criarUsuario() {
    const cadastro = await request(app)
      .post("/usuarios/cadastro")
      .send({ nome: "Usuário Categoria", email: usuarioEmail, senha: usuarioSenha })
    return cadastro.body.data
  }

  it("deve criar, listar, editar e remover uma categoria", async () => {
    const usuarioId = await criarUsuario()

    const criarRes = await request(app)
      .post("/categorias")
      .send({ nome: "Alimentação", usuarioId, limiteGasto: 1500 })

    expect(criarRes.status).toBe(201)
    expect(criarRes.body.data).toBeDefined()
    const categoriaId = criarRes.body.data

    const listarRes = await request(app).get(`/categorias/${usuarioId}`)
    expect(listarRes.status).toBe(200)
    expect(Array.isArray(listarRes.body)).toBe(true)
    expect(listarRes.body).toHaveLength(1)
    expect(listarRes.body[0].id).toBe(categoriaId)

    const editarRes = await request(app)
      .put(`/categorias/${categoriaId}`)
      .send({ nome: "Alimentação E2E", limiteGasto: 2000, usuarioId })

    expect(editarRes.status).toBe(200)
    expect(editarRes.body.message).toContain("Categoria atualizada")

    const removerRes = await request(app)
      .delete(`/categorias/${categoriaId}`)
      .send({ usuarioId })

    expect(removerRes.status).toBe(200)
    expect(removerRes.body.data).toBe(true)

    const listarDepoisRes = await request(app).get(`/categorias/${usuarioId}`)
    expect(listarDepoisRes.status).toBe(200)
    expect(Array.isArray(listarDepoisRes.body)).toBe(true)
    expect(listarDepoisRes.body).toHaveLength(0)
  })
})
