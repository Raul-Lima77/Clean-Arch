import type { TipoTransacao } from "../../../dominio/entidades/Transacao"

export type ListTransacaoDTO = {
  id: string
  tipo: TipoTransacao
  descricao: string
  valor: number
  data: Date
  categoriaId?: string
}
