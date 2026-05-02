export class RangoFechas {
  constructor(
    public readonly fechaInicio: Date,
    public readonly fechaFin: Date,
  ) {
    if (fechaFin < fechaInicio) {
      throw new Error(
        'La fecha final no puede ser anterior a la fecha inicial.',
      );
    }
  }

  contiene(fecha: Date): boolean {
    return fecha >= this.fechaInicio && fecha <= this.fechaFin;
  }
}
