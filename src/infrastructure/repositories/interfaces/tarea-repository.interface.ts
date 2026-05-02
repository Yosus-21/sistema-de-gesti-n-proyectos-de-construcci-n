import { Tarea } from '../../../domain';
import { TipoTarea } from '../../../domain/enums';

export interface TareaRepositoryFindManyParams {
  idCronograma?: number;
  idProyecto?: number;
  tipoTarea?: TipoTarea;
  busqueda?: string;
  pagina?: number;
  limite?: number;
}

export interface TareaRepository {
  create: (data: Tarea) => Promise<Tarea>;
  findById: (idTarea: number) => Promise<Tarea | null>;
  findMany: (params?: TareaRepositoryFindManyParams) => Promise<Tarea[]>;
  update: (idTarea: number, data: Partial<Tarea>) => Promise<Tarea>;
  delete: (idTarea: number) => Promise<void>;
}
