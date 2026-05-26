import { CreateMeta } from "../../aplicacao/usecase/meta/CreateMeta"
import { ListMeta } from "../../aplicacao/usecase/meta/ListMeta"
import { DeleteMeta } from "../../aplicacao/usecase/meta/DeleteMeta"
import { MetaRepositorioMock } from "./MetaRepositorioMock"
import { Meta } from "../../dominio/entidades/Meta"

describe("Use Cases - Meta", () => {
  let repositorioMock: MetaRepositorioMock

  beforeEach(() => {
    repositorioMock = new MetaRepositorioMock()
  })

  it("deve criar uma meta corretamente", async () => {
    const sut = new CreateMeta(repositorioMock)

    const inputDto = {
      descricao: "Economizar para viagem",
      valorAlvo: 3000,
      dataInicio: new Date("2026-06-01"),
      dataFim: new Date("2026-12-31"),
      usuarioId: "usuario-123",
    }

    const resultado = await sut.execute(inputDto)

    expect(resultado).toHaveProperty("id")
    expect(typeof resultado.id).toBe("string")
    expect(repositorioMock.metas.length).toBe(1)
    expect(repositorioMock.metas[0].descricao).toBe(inputDto.descricao)
    expect(repositorioMock.metas[0].usuarioId).toBe(inputDto.usuarioId)
  })

  it("deve listar as metas do usuário com progresso calculado", async () => {
    const sut = new ListMeta(repositorioMock)

    const meta1 = Meta.create(
      "Comprar notebook",
      5000,
      new Date("2026-01-01"),
      new Date("2026-12-31"),
      "usuario-1"
    )
    meta1.atualizarProgresso(1250)

    const meta2 = Meta.create(
      "Pagar dívida",
      2000,
      new Date("2026-02-01"),
      new Date("2026-08-31"),
      "usuario-1"
    )
    meta2.atualizarProgresso(500)

    const metaOutroUsuario = Meta.create(
      "Meta externa",
      1000,
      new Date("2026-03-01"),
      new Date("2026-09-30"),
      "usuario-2"
    )

    repositorioMock.metas.push(meta1, meta2, metaOutroUsuario)

    const resultado = await sut.execute({ usuarioId: "usuario-1" })

    expect(resultado).toHaveLength(2)
    expect(resultado).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: meta1.id,
          descricao: meta1.descricao,
          valorAlvo: meta1.valorAlvo,
          valorAtual: meta1.valorAtual,
          progresso: meta1.calcularProgresso(),
        }),
        expect.objectContaining({
          id: meta2.id,
          descricao: meta2.descricao,
          valorAlvo: meta2.valorAlvo,
          valorAtual: meta2.valorAtual,
          progresso: meta2.calcularProgresso(),
        }),
      ])
    )
  })

  it("deve remover uma meta quando for do mesmo usuário", async () => {
    const sut = new DeleteMeta(repositorioMock)

    const meta = Meta.create(
      "Viajar para a praia",
      4000,
      new Date("2026-04-01"),
      new Date("2026-10-01"),
      "usuario-10"
    )

    repositorioMock.metas.push(meta)

    const resultado = await sut.execute({ id: meta.id, usuarioId: "usuario-10" })

    expect(resultado).toBe(true)
    expect(repositorioMock.metas).toHaveLength(0)
  })

  it("deve falhar ao remover meta de outro usuário", async () => {
    const sut = new DeleteMeta(repositorioMock)

    const meta = Meta.create(
      "Trocar carro",
      15000,
      new Date("2026-05-01"),
      new Date("2026-11-01"),
      "usuario-20"
    )

    repositorioMock.metas.push(meta)

    await expect(
      sut.execute({ id: meta.id, usuarioId: "usuario-99" })
    ).rejects.toThrow("Apenas o dono da meta pode excluí-la")
    expect(repositorioMock.metas).toHaveLength(1)
  })
})
