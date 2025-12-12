export type MetaProps = {
  id: string
  descricao: string
  valorAlvo: number
  valorAtual: number
  dataInicio: Date
  dataFim: Date
  usuarioId: string
}

export class Meta {
  private constructor(private props: MetaProps) {}

  public static create(descricao: string, valorAlvo: number, dataInicio: Date, dataFim: Date, usuarioId: string): Meta {
    if (!descricao || descricao.trim().length === 0) {
      throw new Error("Descrição da meta é obrigatória")
    }

    if (!valorAlvo || valorAlvo <= 0) {
      throw new Error("Valor alvo deve ser maior que zero")
    }

    if (dataInicio >= dataFim) {
      throw new Error("Data de início deve ser anterior à data de fim")
    }

    return new Meta({
      id: crypto.randomUUID().toString(),
      descricao,
      valorAlvo,
      valorAtual: 0,
      dataInicio,
      dataFim,
      usuarioId,
    })
  }

  public atualizarProgresso(valor: number): void {
    this.props.valorAtual += valor
  }

  public calcularProgresso(): number {
    return (this.props.valorAtual / this.props.valorAlvo) * 100
  }

  public static fromPersistence(props: MetaProps): Meta {
    return new Meta(props)
  }

  public toPersistence(): MetaProps {
    return this.props
  }

  public get id() {
    return this.props.id
  }
  public get descricao() {
    return this.props.descricao
  }
  public get valorAlvo() {
    return this.props.valorAlvo
  }
  public get valorAtual() {
    return this.props.valorAtual
  }
  public get dataInicio() {
    return this.props.dataInicio
  }
  public get dataFim() {
    return this.props.dataFim
  }
  public get usuarioId() {
    return this.props.usuarioId
  }
}
