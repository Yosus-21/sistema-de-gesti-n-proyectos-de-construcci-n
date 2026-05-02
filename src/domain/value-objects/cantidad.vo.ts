export class Cantidad {
  constructor(public readonly valor: number) {
    if (!Number.isFinite(valor) || valor < 0) {
      throw new Error('La cantidad debe ser un numero no negativo.');
    }
  }

  esCero(): boolean {
    return this.valor === 0;
  }
}
