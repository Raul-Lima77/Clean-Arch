import { CreateUsuario } from "../../../aplicacao/usecase/usuario/CreateUsuario";
import { UsuarioRepositorioMysql } from "../../../infra/bd/mysql/UsuarioRepositorioMysql";

describe("Integração - CreateUsuario", () => {

  test("deve criar um usuário com sucesso", async () => {

    const usecase = new CreateUsuario(
      new UsuarioRepositorioMysql()
    );

    const output = await usecase.execute({
      nome: "Raul Lima",
      email: `raul${Date.now()}@gmail.com`,
      senha: "12345678"
    });

    expect(output.id).toBeDefined();

  });

  test("não deve permitir e-mail já cadastrado", async () => {

    const usecase = new CreateUsuario(
      new UsuarioRepositorioMysql()
    );

    const email = `raul${Date.now()}@gmail.com`;

    await usecase.execute({
      nome: "Raul",
      email,
      senha: "12345678"
    });

    await expect(
      usecase.execute({
        nome: "Outro Usuário",
        email,
        senha: "87654321"
      })
    ).rejects.toThrow("E-mail já cadastrado");

  });

});