export class ContratoDetalle {
  idContratoDetalle?: number;
  cantidadPersonas: number;
  costoUnitarioPorDia: number;
  idContrato?: number;
  idCargo?: number;

  constructor(data: Partial<ContratoDetalle> = {}) {
    Object.assign(this, data);
  }
}
