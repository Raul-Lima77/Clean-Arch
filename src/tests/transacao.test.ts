import { Transacao } from '../dominio/entidades/Transacao'

describe('Transacao', () => {

  it('deve criar uma transação válida', () => {

    const transacao = Transacao.create(
      'RECEITA',
      'Salário',
      3000,
      new Date(),
      'usuario-1',
      'categoria-1'
    )

    expect(transacao).toBeInstanceOf(Transacao)
    expect(transacao.tipo).toBe('RECEITA')
    expect(transacao.descricao).toBe('Salário')
    expect(transacao.valor).toBe(3000)
    expect(transacao.usuarioId).toBe('usuario-1')
    expect(transacao.categoriaId).toBe('categoria-1')

  })

  it('deve lançar erro para descrição inválida', () => {

    expect(() => {

      Transacao.create(
        'RECEITA',
        'ab',
        3000,
        new Date(),
        'usuario-1'
      )

    }).toThrow('Descrição deve ter no mínimo 3 caracteres')

  })

  it('deve lançar erro para valor menor ou igual a zero', () => {

    expect(() => {

      Transacao.create(
        'RECEITA',
        'Salário',
        0,
        new Date(),
        'usuario-1'
      )

    }).toThrow('Valor deve ser numérico e maior que zero')

  })

  it('deve lançar erro para data futura', () => {

    const dataFutura = new Date()
    dataFutura.setDate(dataFutura.getDate() + 1)

    expect(() => {

      Transacao.create(
        'RECEITA',
        'Salário',
        3000,
        dataFutura,
        'usuario-1'
      )

    }).toThrow('A data não pode ser futura')

  })

  it('deve lançar erro para tipo inválido', () => {

    expect(() => {

      Transacao.create(
        'TESTE' as any,
        'Salário',
        3000,
        new Date(),
        'usuario-1'
      )

    }).toThrow('Tipo de transação deve ser RECEITA ou DESPESA')

  })

  it('deve editar descrição da transação', () => {

    const transacao = Transacao.create(
      'DESPESA',
      'Mercado',
      200,
      new Date(),
      'usuario-1'
    )

    transacao.editar('Supermercado')

    expect(transacao.descricao).toBe('Supermercado')

  })

  it('deve editar valor da transação', () => {

    const transacao = Transacao.create(
      'DESPESA',
      'Mercado',
      200,
      new Date(),
      'usuario-1'
    )

    transacao.editar(undefined, 500)

    expect(transacao.valor).toBe(500)

  })

  it('deve editar categoria da transação', () => {

    const transacao = Transacao.create(
      'DESPESA',
      'Mercado',
      200,
      new Date(),
      'usuario-1'
    )

    transacao.editar(undefined, undefined, undefined, 'categoria-2')

    expect(transacao.categoriaId).toBe('categoria-2')

  })

})