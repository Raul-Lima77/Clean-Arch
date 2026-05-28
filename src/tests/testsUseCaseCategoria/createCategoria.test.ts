import { CreateCategoria } from "../../aplicacao/usecase/categoria/CreateCategoria"

describe('CreateCategoria UseCase', () => {

    it('deve criar uma categoria com sucesso', async () => {


        const mockCategoriaRepositorio = {
            buscarPorNome: jest.fn(),
            salvar: jest.fn()
        }

        mockCategoriaRepositorio.buscarPorNome.mockResolvedValue(null)

        const useCase = new CreateCategoria(mockCategoriaRepositorio as any)

        const resultado = await useCase.execute({
            nome: 'Alimentação',
            usuarioId: 'usuario-1',
            limiteGasto: 1000
        })


        expect(mockCategoriaRepositorio.buscarPorNome)
            .toHaveBeenCalledWith('Alimentação', 'usuario-1')

        expect(mockCategoriaRepositorio.salvar)
            .toHaveBeenCalled()

        expect(resultado).toHaveProperty('id')

    })

})