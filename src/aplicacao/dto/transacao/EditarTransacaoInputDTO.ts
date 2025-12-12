export type EditarTransacaoInputDTO = {
  id: string
  usuarioId: string
  descricao?: string
  valor?: number
  data?: Date
  categoriaId?: string
}
