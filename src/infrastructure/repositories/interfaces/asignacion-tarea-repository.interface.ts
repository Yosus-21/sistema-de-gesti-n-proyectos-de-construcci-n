import { AsignacionTarea, EstadoAsignacion } from '../../../domain';

export interface AsignacionTareaRepositoryFindManyParams {
  idTarea?: number;
  idTrabajador?: number;
  estadoAsignacion?: EstadoAsignacion;
  asignadaPorContratista?: boolean;
  pagina?: number;
  limite?: number;
}

export interface AsignacionTareaRepository {
  create: (data: AsignacionTarea) => Promise<AsignacionTarea>;
  findById: (idAsignacionTarea: number) => Promise<AsignacionTarea | null>;
  findMany: (
    params?: AsignacionTareaRepositoryFindManyParams,
  ) => Promise<AsignacionTarea[]>;
  update: (
    idAsignacionTarea: number,
    data: Partial<AsignacionTarea>,
  ) => Promise<AsignacionTarea>;
  delete: (idAsignacionTarea: number) => Promise<void>;
  existsActiveAssignment: (
    idTarea: number,
    idTrabajador: number,
  ) => Promise<boolean>;
}
