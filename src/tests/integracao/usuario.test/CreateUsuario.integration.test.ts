import { CreateUsuario } from "../../../src/aplicacao/usecase/usuario/CreateUsuario";
import { UsuarioRepositorioMysql } from "../../../src/infra/bd/mysql/UsuarioRepositorioMysql";

describe("Integração - CreateUsuario", () => {

  test("deve criar um usuário com sucesso", async () => {

    const repositorio = new UsuarioRepositorioMysql();

    const usecase = new CreateUsuario(repositorio);

    const output = await usecase.execute({
      nome: "Raul Lima",
      email: "raul@gmail.com",
      senha: "12345678"
    });

    const usuario = await repositorio.buscarPorId(output.id);

    expect(usuario).not.toBeNull();
    expect(usuario?.nome).toBe("Raul Lima");
    expect(usuario?.email).toBe("raul@gmail.com");
  });

});