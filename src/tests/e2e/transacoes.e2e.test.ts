import request from "supertest"
import { app } from "./app"

describe("E2E - Transações", () => {
  const usuarioEmail = `transacao.usuario.${Date.now()}@teste.com`
  const usuarioSenha = "senhaTrans123"

  async function criarUsuario() {
    const cadastro = await request(app)
      .post("/usuarios/cadastro")
      .send({ nome: "Usuário Transação", email: usuarioEmail, senha: usuarioSenha })
    return cadastro.body.data
  }

  async function criarCategoria(usuarioId: string) {
    const categoria = await request(app)
      .post("/categorias")
      .send({ nome: "Alimentação", usuarioId, limiteGasto: 1200 })
    return categoria.body.data
  }

  it("deve criar, listar, filtrar, editar e remover uma transação", async () => {
    const usuarioId = await criarUsuario()
    const categoriaId = await criarCategoria(usuarioId)

    const criarRes = await request(app)
      .post("/transacoes")
      .send({
        descricao: "Supermercado",
        valor: 150,
        tipo: "DESPESA",
        data: new Date().toISOString(),
        usuarioId,
        categoriaId,
      })

    expect(criarRes.status).toBe(201)
    expect(criarRes.body.data.id).toBeDefined()
    const transacaoId = criarRes.body.data.id

    const listarRes = await request(app).get(`/transacoes/${usuarioId}`)
    expect(listarRes.status).toBe(200)
    expect(Array.isArray(listarRes.body)).toBe(true)
    expect(listarRes.body).toHaveLength(1)

    const filtrarRes = await request(app)
      .get(`/transacoes/${usuarioId}/filtrar`)
      .query({ dataInicio: new Date(Date.now() - 86400000).toISOString() })

    expect(filtrarRes.status).toBe(200)
    expect(Array.isArray(filtrarRes.body)).toBe(true)
    expect(filtrarRes.body[0].id).toBe(transacaoId)

    const editarRes = await request(app)
      .put(`/transacoes/${transacaoId}`)
      .send({
        descricao: "Supermercado Atualizado",
        valor: 180,
        data: new Date().toISOString(),
        usuarioId,
        categoriaId,
      })

    expect(editarRes.status).toBe(200)
    expect(editarRes.body.message).toContain("Transação atualizada")

    const removerRes = await request(app)
      .delete(`/transacoes/${transacaoId}`)
      .send({ usuarioId })

    expect(removerRes.status).toBe(200)
    expect(removerRes.body.data).toBe(true)

    const listarDepoisRes = await request(app).get(`/transacoes/${usuarioId}`)
    expect(listarDepoisRes.status).toBe(200)
    expect(Array.isArray(listarDepoisRes.body)).toBe(true)
    expect(listarDepoisRes.body).toHaveLength(0)
  })
})
