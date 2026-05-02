export class Porcentaje {
  constructor(public readonly valor: number) {
    if (!Number.isFinite(valor) || valor < 0 || valor > 100) {
      throw new Error('El porcentaje debe estar entre 0 y 100.');
    }
  }

  aDecimal(): number {
    return this.valor / 100;
  }
}
