import { ListCategoria } from "../../aplicacao/usecase/categoria/ListCategoria";

describe("ListCategoria UseCase", () => {

  it("deve listar categorias do usuário", async () => {

    const mockCategoriaRepositorio = {
      listarPorUsuario: jest.fn(),
    };

    mockCategoriaRepositorio.listarPorUsuario.mockResolvedValue([
      {
        id: "1",
        nome: "Alimentação",
        limiteGasto: 1000,
      },
      {
        id: "2",
        nome: "Transporte",
        limiteGasto: 500,
      },
    ]);
        const useCase = new ListCategoria(mockCategoriaRepositorio as any)

        const resultado = await useCase.execute({
        usuarioId: 'usuario-1'
       })

       expect(mockCategoriaRepositorio.listarPorUsuario)
        .toHaveBeenCalledWith('usuario-1')

        expect(resultado).toHaveLength(2)

        expect(resultado[0].nome).toBe('Alimentação')


  });


});
