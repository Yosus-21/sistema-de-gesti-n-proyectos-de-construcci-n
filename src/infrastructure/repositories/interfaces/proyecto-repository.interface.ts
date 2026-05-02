import { Proyecto } from '../../../domain';

export interface ProyectoRepositoryFindManyParams {
  idCliente?: number;
  busqueda?: string;
  pagina?: number;
  limite?: number;
}

export interface ProyectoRepository {
  create: (data: Proyecto) => Promise<Proyecto>;
  findById: (idProyecto: number) => Promise<Proyecto | null>;
  findMany: (params?: ProyectoRepositoryFindManyParams) => Promise<Proyecto[]>;
  update: (idProyecto: number, data: Partial<Proyecto>) => Promise<Proyecto>;
  delete: (idProyecto: number) => Promise<void>;
  existsActiveByCliente: (idCliente: number) => Promise<boolean>;
}
