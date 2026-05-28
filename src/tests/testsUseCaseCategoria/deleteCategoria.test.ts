import { DeleteCategoria } from "../../aplicacao/usecase/categoria/DeleteCategoria"

describe('DeleteCategoria UseCase', () => {

    it('deve deletar categoria com sucesso', async () => {

        const mockCategoriaRepositorio = {
         buscarPorId: jest.fn(),
         remover: jest.fn()
        }

        const mockTransacaoRepositorio = {
         filtrarPorCategoria: jest.fn()
        }

        mockCategoriaRepositorio.buscarPorId.mockResolvedValue({
            id: '1',
            nome: 'Alimentação',
            usuarioId: 'usuario-1'
        })

        mockTransacaoRepositorio.filtrarPorCategoria.mockResolvedValue([])

        mockCategoriaRepositorio.remover.mockResolvedValue(true)

        const useCase = new DeleteCategoria(
            mockCategoriaRepositorio as any,
            mockTransacaoRepositorio as any
        )
            
         const resultado = await useCase.execute({
            id: '1',
            usuarioId: 'usuario-1'
        })

        expect(resultado).toBe(true)

    })

})