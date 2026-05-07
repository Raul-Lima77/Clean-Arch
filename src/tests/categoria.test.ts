import { Categoria } from '../dominio/entidades/Categoria'

describe('Categoria', () => {

  it('deve criar uma categoria válida', () => {

    const categoria = Categoria.create(
      'Alimentação',
      'usuario-1',
      1000
    )

    expect(categoria).toBeInstanceOf(Categoria)
    expect(categoria.nome).toBe('Alimentação')
    expect(categoria.limiteGasto).toBe(1000)
    expect(categoria.usuarioId).toBe('usuario-1')

  })

  it('deve criar categoria sem limite de gasto', () => {

    const categoria = Categoria.create(
      'Transporte',
      'usuario-1'
    )

    expect(categoria.nome).toBe('Transporte')
    expect(categoria.limiteGasto).toBeUndefined()

  })

  it('deve lançar erro para nome vazio', () => {

    expect(() => {

      Categoria.create(
        '',
        'usuario-1',
        1000
      )

    }).toThrow('Nome da categoria é obrigatório')

  })

  it('deve lançar erro para limite de gasto inválido', () => {

    expect(() => {

      Categoria.create(
        'Alimentação',
        'usuario-1',
        0
      )

    }).toThrow('Limite de gasto deve ser maior que zero')

  })

  it('deve editar nome da categoria', () => {

    const categoria = Categoria.create(
      'Alimentação',
      'usuario-1',
      1000
    )

    categoria.editar('Mercado')

    expect(categoria.nome).toBe('Mercado')

  })

  it('deve editar limite de gasto', () => {

    const categoria = Categoria.create(
      'Alimentação',
      'usuario-1',
      1000
    )

    categoria.editar(undefined, 2000)

    expect(categoria.limiteGasto).toBe(2000)

  })

  it('não deve alterar limite de gasto inválido', () => {

    const categoria = Categoria.create(
      'Alimentação',
      'usuario-1',
      1000
    )

    categoria.editar(undefined, -500)

    expect(categoria.limiteGasto).toBe(1000)

  })

})