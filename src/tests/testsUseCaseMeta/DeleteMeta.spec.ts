import { DeleteMeta } from "../../../src/aplicacao/usecase/meta/DeleteMeta"
import type { DeleteMetaDTO } from "../../../src/aplicacao/dto/meta/DeleteMetaDTO"
import { Meta } from "../../../src/dominio/entidades/Meta"
import { MetaRepositorioMysql } from "../../../src/infra/bd/mysql/MetaRepositorioMysql"

jest.mock("../../../src/infra/bd/mysql/MetaRepositorioMysql")

describe("Caso de Uso - DeleteMeta", () => {
  let metaRepositorioMock: jest.Mocked<MetaRepositorioMysql>
  let deleteMeta: DeleteMeta

  beforeEach(() => {
    metaRepositorioMock =
      new MetaRepositorioMysql() as jest.Mocked<MetaRepositorioMysql>

    deleteMeta = new DeleteMeta(metaRepositorioMock)
  })

  it("deve remover uma meta corretamente", async () => {
    const meta = Meta.create( "Comprar notebook", 5000, new Date("2026-01-01"), new Date("2026-12-31"), "usuario-1" )

    metaRepositorioMock.buscarPorId.mockResolvedValueOnce(meta)
    metaRepositorioMock.remover.mockResolvedValueOnce(true)

    const dto: DeleteMetaDTO = {
      id: meta.id,
      usuarioId: "usuario-1",
    }

    const resultado = await deleteMeta.execute(dto)

    expect(resultado).toBe(true)

    expect(metaRepositorioMock.buscarPorId)
      .toHaveBeenCalledTimes(1)

    expect(metaRepositorioMock.buscarPorId)
      .toHaveBeenCalledWith(meta.id)

    expect(metaRepositorioMock.remover)
      .toHaveBeenCalledTimes(1)

    expect(metaRepositorioMock.remover)
      .toHaveBeenCalledWith(meta.id)
  })

  it("deve lançar erro quando a meta não existir", async () => {
    metaRepositorioMock.buscarPorId.mockResolvedValueOnce(null)

    const dto: DeleteMetaDTO = {
      id: "meta-inexistente",
      usuarioId: "usuario-1",
    }

    await expect(
      deleteMeta.execute(dto)
    ).rejects.toThrow("Meta não encontrada")

    expect(metaRepositorioMock.buscarPorId)
      .toHaveBeenCalledTimes(1)
  })

  it("deve lançar erro quando o usuário não for o dono da meta", async () => {
    const meta = Meta.create(
      "Comprar notebook",
      5000,
      new Date("2026-01-01"),
      new Date("2026-12-31"),
      "usuario-1"
    )

    metaRepositorioMock.buscarPorId.mockResolvedValueOnce(meta)

    const dto: DeleteMetaDTO = {
      id: meta.id,
      usuarioId: "usuario-2",
    }

    await expect(
      deleteMeta.execute(dto)
    ).rejects.toThrow(
      "Apenas o dono da meta pode excluí-la"
    )

    expect(metaRepositorioMock.buscarPorId)
      .toHaveBeenCalledTimes(1)
  })
})