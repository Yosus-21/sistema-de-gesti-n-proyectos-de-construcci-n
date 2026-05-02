export class Dinero {
  constructor(
    public readonly monto: number,
    public readonly moneda = 'BOB',
  ) {
    if (!Number.isFinite(monto) || monto < 0) {
      throw new Error('El monto debe ser un numero no negativo.');
    }
  }

  esCero(): boolean {
    return this.monto === 0;
  }
}
