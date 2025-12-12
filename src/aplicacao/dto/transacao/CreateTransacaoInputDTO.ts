import type { TipoTransacao } from "../../../dominio/entidades/Transacao"

export type CreateTransacaoInputDTO = {
  tipo: TipoTransacao
  descricao: string
  valor: number
  data: Date
  usuarioId: string
  categoriaId?: string
}
