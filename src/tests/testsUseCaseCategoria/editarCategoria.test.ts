import { EditarCategoria } from "../../aplicacao/usecase/categoria/EditarCategoria"

describe('EditarCategoria UseCase', () => {

    it('deve editar categoria com sucesso', async () => {

        const mockCategoriaRepositorio = {
          buscarPorId: jest.fn(),
          buscarPorNome: jest.fn(),
          atualizar: jest.fn()
        }


        mockCategoriaRepositorio.buscarPorId.mockResolvedValue({
         id: '1',
         nome: 'Alimentação',
         usuarioId: 'usuario-1',
         editar: jest.fn()
        })

        mockCategoriaRepositorio.buscarPorNome.mockResolvedValue(null)

        mockCategoriaRepositorio.atualizar.mockResolvedValue(undefined)

        const useCase = new EditarCategoria(
          mockCategoriaRepositorio as any
        )

        await useCase.execute({
         id: '1',
         nome: 'Mercado',
         usuarioId: 'usuario-1',
         limiteGasto: 2000
        })


        expect(mockCategoriaRepositorio.buscarPorId)
         .toHaveBeenCalledWith('1')

        expect(mockCategoriaRepositorio.buscarPorNome)
         .toHaveBeenCalledWith('Mercado', 'usuario-1')

        expect(mockCategoriaRepositorio.atualizar)
         .toHaveBeenCalled()

    })

})