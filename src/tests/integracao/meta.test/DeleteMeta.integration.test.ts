import { DeleteMeta } from "../../../aplicacao/usecase/meta/DeleteMeta";
import { MetaRepositorioMysql } from "../../../infra/bd/mysql/MetaRepositorioMysql";
import { criarMeta, criarUsuario } from "../setup/seed";

describe("Integração - DeleteMeta", () => {

  test("deve remover uma meta com sucesso", async () => {

    const usuarioId = await criarUsuario();
    const metaId = await criarMeta(usuarioId);

    const usecase = new DeleteMeta(
      new MetaRepositorioMysql()
    );

    const resultado = await usecase.execute({
      id: metaId,
      usuarioId
    });

    expect(resultado).toBe(true);

  });

  test("não deve remover meta inexistente", async () => {

    const usuarioId = await criarUsuario();

    const usecase = new DeleteMeta(
      new MetaRepositorioMysql()
    );

    await expect(
      usecase.execute({
        id: "meta-inexistente",
        usuarioId
      })
    ).rejects.toThrow("Meta não encontrada");

  });

});