import { Meta } from '../dominio/entidades/Meta'

describe('Meta', () => {

  it('deve criar uma meta com dados válidos', () => {

    const meta = Meta.create(
      'Comprar notebook',
      5000,
      new Date('2026-01-01'),
      new Date('2026-12-31'),
      'usuario-1'
    )

    expect(meta).toBeInstanceOf(Meta)
    expect(meta.descricao).toBe('Comprar notebook')
    expect(meta.valorAlvo).toBe(5000)
    expect(meta.valorAtual).toBe(0)
    expect(meta.usuarioId).toBe('usuario-1')

  })

  it('deve lançar erro para descrição vazia', () => {

    expect(() => {

      Meta.create(
        '',
        5000,
        new Date('2026-01-01'),
        new Date('2026-12-31'),
        'usuario-1'
      )

    }).toThrow('Descrição da meta é obrigatória')

  })

  it('deve lançar erro para valor alvo menor ou igual a zero', () => {

    expect(() => {

      Meta.create(
        'Comprar notebook',
        0,
        new Date('2026-01-01'),
        new Date('2026-12-31'),
        'usuario-1'
      )

    }).toThrow('Valor alvo deve ser maior que zero')

  })

  it('deve lançar erro quando data inicial for maior ou igual à data final', () => {

    expect(() => {

      Meta.create(
        'Comprar notebook',
        5000,
        new Date('2026-12-31'),
        new Date('2026-01-01'),
        'usuario-1'
      )

    }).toThrow('Data de início deve ser anterior à data de fim')

  })

  it('deve atualizar o progresso da meta', () => {

    const meta = Meta.create(
      'Comprar notebook',
      5000,
      new Date('2026-01-01'),
      new Date('2026-12-31'),
      'usuario-1'
    )

    meta.atualizarProgresso(1000)

    expect(meta.valorAtual).toBe(1000)

  })

  it('deve calcular o progresso corretamente', () => {

    const meta = Meta.create(
      'Comprar notebook',
      5000,
      new Date('2026-01-01'),
      new Date('2026-12-31'),
      'usuario-1'
    )

    meta.atualizarProgresso(2500)

    expect(meta.calcularProgresso()).toBe(50)

  })

})