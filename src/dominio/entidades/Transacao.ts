export type TipoTransacao = "RECEITA" | "DESPESA"

export type TransacaoProps = {
  id: string
  tipo: TipoTransacao
  descricao: string
  valor: number
  data: Date
  usuarioId: string
  categoriaId?: string
}

export class Transacao {
  private constructor(private props: TransacaoProps) {}

  public static create(
    tipo: TipoTransacao,
    descricao: string,
    valor: number,
    data: Date,
    usuarioId: string,
    categoriaId?: string,
  ): Transacao {
    if (!descricao || descricao.trim().length < 3) {
      throw new Error("Descrição deve ter no mínimo 3 caracteres")
    }

    if (!valor || valor <= 0) {
      throw new Error("Valor deve ser numérico e maior que zero")
    }

    if (data > new Date()) {
      throw new Error("A data não pode ser futura")
    }

    if (!["RECEITA", "DESPESA"].includes(tipo)) {
      throw new Error("Tipo de transação deve ser RECEITA ou DESPESA")
    }

    return new Transacao({
      id: crypto.randomUUID().toString(),
      tipo,
      descricao,
      valor,
      data,
      usuarioId,
      categoriaId,
    })
  }

  public editar(descricao?: string, valor?: number, data?: Date, categoriaId?: string): void {
    if (descricao && descricao.trim().length >= 3) {
      this.props.descricao = descricao
    }
    if (valor && valor > 0) {
      this.props.valor = valor
    }
    if (data && data <= new Date()) {
      this.props.data = data
    }
    if (categoriaId !== undefined) {
      this.props.categoriaId = categoriaId
    }
  }

  public static fromPersistence(props: TransacaoProps): Transacao {
    return new Transacao(props)
  }

  public toPersistence(): TransacaoProps {
    return this.props
  }

  public get id() {
    return this.props.id
  }
  public get tipo() {
    return this.props.tipo
  }
  public get descricao() {
    return this.props.descricao
  }
  public get valor() {
    return this.props.valor
  }
  public get data() {
    return this.props.data
  }
  public get usuarioId() {
    return this.props.usuarioId
  }
  public get categoriaId() {
    return this.props.categoriaId
  }
}
