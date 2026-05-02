-- CreateEnum
CREATE TYPE "EstadoProyecto" AS ENUM ('PLANIFICACION', 'EN_EJECUCION', 'PAUSADO', 'FINALIZADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoCronograma" AS ENUM ('PLANIFICADO', 'EN_EJECUCION', 'REPLANIFICADO', 'ATRASADO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "EstadoTarea" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'ATRASADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoTarea" AS ENUM ('OBRA_BRUTA', 'OBRA_FINA');

-- CreateEnum
CREATE TYPE "PrioridadTarea" AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'CRITICA');

-- CreateEnum
CREATE TYPE "TipoAlerta" AS ENUM ('MATERIAL_BAJO', 'RETRASO_TAREA', 'DESVIACION_CRONOGRAMA', 'PLAZO_CRITICO');

-- CreateEnum
CREATE TYPE "EstadoAlerta" AS ENUM ('ACTIVA', 'INACTIVA', 'NOTIFICADA', 'RESUELTA');

-- CreateEnum
CREATE TYPE "EstadoAsignacion" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'REASIGNADA');

-- CreateEnum
CREATE TYPE "EstadoOrdenCompra" AS ENUM ('BORRADOR', 'EMITIDA', 'RECIBIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoMaterial" AS ENUM ('OBRA_BRUTA', 'OBRA_FINA', 'GENERAL');

-- CreateEnum
CREATE TYPE "OcupacionTrabajador" AS ENUM ('INGENIERO_CIVIL', 'CONTRATISTA', 'ALBANIL', 'PLOMERO', 'ELECTRICISTA', 'VIDRIERO', 'CARPINTERO');

-- CreateEnum
CREATE TYPE "TipoReporte" AS ENUM ('AVANCE_PROYECTO', 'MATERIALES', 'COSTOS', 'ALERTAS', 'GENERAL');

-- CreateEnum
CREATE TYPE "MetodoNotificacion" AS ENUM ('EMAIL', 'SISTEMA', 'WHATSAPP');

-- CreateTable
CREATE TABLE "Cliente" (
    "idCliente" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "tipoCliente" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("idCliente")
);

-- CreateTable
CREATE TABLE "Proyecto" (
    "idProyecto" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "presupuesto" DOUBLE PRECISION NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFinEstimada" TIMESTAMP(3) NOT NULL,
    "estadoProyecto" "EstadoProyecto" NOT NULL,
    "especificacionesTecnicas" TEXT NOT NULL,
    "idCliente" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proyecto_pkey" PRIMARY KEY ("idProyecto")
);

-- CreateTable
CREATE TABLE "Cronograma" (
    "idCronograma" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL,
    "estadoCronograma" "EstadoCronograma" NOT NULL,
    "fechaUltimaModificacion" TIMESTAMP(3),
    "motivoReplanificacion" TEXT,
    "accionesAnteRetraso" TEXT,
    "idProyecto" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cronograma_pkey" PRIMARY KEY ("idCronograma")
);

-- CreateTable
CREATE TABLE "Tarea" (
    "idTarea" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipoTarea" "TipoTarea" NOT NULL,
    "perfilRequerido" "OcupacionTrabajador" NOT NULL,
    "duracionEstimada" DOUBLE PRECISION NOT NULL,
    "fechaInicioPlanificada" TIMESTAMP(3) NOT NULL,
    "fechaFinPlanificada" TIMESTAMP(3) NOT NULL,
    "fechaInicioReal" TIMESTAMP(3),
    "fechaFinReal" TIMESTAMP(3),
    "estadoTarea" "EstadoTarea" NOT NULL,
    "prioridad" "PrioridadTarea" NOT NULL,
    "observaciones" TEXT,
    "accionesAnteRetraso" TEXT,
    "idCronograma" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tarea_pkey" PRIMARY KEY ("idTarea")
);

-- CreateTable
CREATE TABLE "Seguimiento" (
    "idSeguimiento" SERIAL NOT NULL,
    "fechaSeguimiento" TIMESTAMP(3) NOT NULL,
    "estadoReportado" TEXT NOT NULL,
    "cantidadMaterialUsado" DOUBLE PRECISION NOT NULL,
    "observaciones" TEXT,
    "porcentajeAvance" DOUBLE PRECISION NOT NULL,
    "idTarea" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seguimiento_pkey" PRIMARY KEY ("idSeguimiento")
);

-- CreateTable
CREATE TABLE "Contrato" (
    "idContrato" SERIAL NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "costoTotal" DOUBLE PRECISION NOT NULL,
    "metodoPago" TEXT NOT NULL,
    "terminosYCondiciones" TEXT NOT NULL,
    "estadoContrato" TEXT NOT NULL,
    "idProyecto" INTEGER,
    "idContratista" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("idContrato")
);

-- CreateTable
CREATE TABLE "ContratoDetalle" (
    "idContratoDetalle" SERIAL NOT NULL,
    "cantidadPersonas" DOUBLE PRECISION NOT NULL,
    "costoUnitarioPorDia" DOUBLE PRECISION NOT NULL,
    "idContrato" INTEGER,
    "idCargo" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContratoDetalle_pkey" PRIMARY KEY ("idContratoDetalle")
);

-- CreateTable
CREATE TABLE "Contratista" (
    "idContratista" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ci" TEXT NOT NULL,
    "empresa" TEXT,
    "telefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contratista_pkey" PRIMARY KEY ("idContratista")
);

-- CreateTable
CREATE TABLE "Trabajador" (
    "idTrabajador" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ci" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "licenciaProfesional" TEXT,
    "aniosExperiencia" DOUBLE PRECISION NOT NULL,
    "especializaciones" TEXT,
    "certificaciones" TEXT,
    "ocupacion" "OcupacionTrabajador" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trabajador_pkey" PRIMARY KEY ("idTrabajador")
);

-- CreateTable
CREATE TABLE "Cargo" (
    "idCargo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipoObra" "TipoTarea" NOT NULL,
    "licenciaRequerida" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cargo_pkey" PRIMARY KEY ("idCargo")
);

-- CreateTable
CREATE TABLE "Material" (
    "idMaterial" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipoMaterial" "TipoMaterial" NOT NULL,
    "unidad" TEXT NOT NULL,
    "cantidadDisponible" DOUBLE PRECISION NOT NULL,
    "costoUnitario" DOUBLE PRECISION NOT NULL,
    "especificacionesTecnicas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("idMaterial")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "idProveedor" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "terminosEntrega" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("idProveedor")
);

-- CreateTable
CREATE TABLE "OrdenCompra" (
    "idOrdenCompra" SERIAL NOT NULL,
    "fechaOrden" TIMESTAMP(3) NOT NULL,
    "fechaEntregaEstimada" TIMESTAMP(3),
    "estadoOrden" "EstadoOrdenCompra" NOT NULL,
    "idProveedor" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrdenCompra_pkey" PRIMARY KEY ("idOrdenCompra")
);

-- CreateTable
CREATE TABLE "LineaOrdenCompra" (
    "idLineaOrdenCompra" SERIAL NOT NULL,
    "cantidadSolicitada" DOUBLE PRECISION NOT NULL,
    "precioUnitarioAcordado" DOUBLE PRECISION NOT NULL,
    "estadoLinea" TEXT,
    "idOrdenCompra" INTEGER,
    "idMaterial" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LineaOrdenCompra_pkey" PRIMARY KEY ("idLineaOrdenCompra")
);

-- CreateTable
CREATE TABLE "EntregaMaterial" (
    "idEntregaMaterial" SERIAL NOT NULL,
    "fechaEntrega" TIMESTAMP(3) NOT NULL,
    "estadoEntrega" TEXT NOT NULL,
    "observaciones" TEXT,
    "cantidadEntregada" DOUBLE PRECISION NOT NULL,
    "idOrdenCompra" INTEGER,
    "idMaterial" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntregaMaterial_pkey" PRIMARY KEY ("idEntregaMaterial")
);

-- CreateTable
CREATE TABLE "AsignacionTarea" (
    "idAsignacionTarea" SERIAL NOT NULL,
    "fechaAsignacion" TIMESTAMP(3) NOT NULL,
    "rolEnLaTarea" TEXT NOT NULL,
    "estadoAsignacion" "EstadoAsignacion" NOT NULL,
    "observaciones" TEXT,
    "asignadaPorContratista" BOOLEAN NOT NULL,
    "idTarea" INTEGER,
    "idTrabajador" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AsignacionTarea_pkey" PRIMARY KEY ("idAsignacionTarea")
);

-- CreateTable
CREATE TABLE "AsignacionMaterial" (
    "idAsignacionMaterial" SERIAL NOT NULL,
    "cantidadAsignada" DOUBLE PRECISION NOT NULL,
    "fechaAsignacion" TIMESTAMP(3) NOT NULL,
    "criteriosPrioridad" TEXT,
    "costoMaximoPermitido" DOUBLE PRECISION,
    "restricciones" TEXT,
    "estadoAsignacion" "EstadoAsignacion" NOT NULL,
    "generadaPorIa" BOOLEAN NOT NULL,
    "idTarea" INTEGER,
    "idMaterial" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AsignacionMaterial_pkey" PRIMARY KEY ("idAsignacionMaterial")
);

-- CreateTable
CREATE TABLE "PronosticoMaterial" (
    "idPronosticoMaterial" SERIAL NOT NULL,
    "periodoAnalisis" TEXT NOT NULL,
    "stockMinimo" DOUBLE PRECISION NOT NULL,
    "stockMaximo" DOUBLE PRECISION NOT NULL,
    "fechaGeneracion" TIMESTAMP(3) NOT NULL,
    "nivelConfianza" DOUBLE PRECISION NOT NULL,
    "observaciones" TEXT,
    "idProyecto" INTEGER,
    "idMaterial" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PronosticoMaterial_pkey" PRIMARY KEY ("idPronosticoMaterial")
);

-- CreateTable
CREATE TABLE "Alerta" (
    "idAlerta" SERIAL NOT NULL,
    "criterioActivacion" TEXT NOT NULL,
    "tipoAlerta" "TipoAlerta" NOT NULL,
    "estadoAlerta" "EstadoAlerta" NOT NULL,
    "mensajeNotificacion" TEXT,
    "metodoNotificacion" "MetodoNotificacion",
    "fechaGeneracion" TIMESTAMP(3),
    "idProyecto" INTEGER,
    "idTarea" INTEGER,
    "idMaterial" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alerta_pkey" PRIMARY KEY ("idAlerta")
);

-- CreateTable
CREATE TABLE "Reporte" (
    "idReporte" SERIAL NOT NULL,
    "tipoReporte" "TipoReporte" NOT NULL,
    "fechaGeneracion" TIMESTAMP(3) NOT NULL,
    "fechaInicioPeriodo" TIMESTAMP(3),
    "fechaFinPeriodo" TIMESTAMP(3),
    "porcentajeAvanceGeneral" DOUBLE PRECISION,
    "contenidoResumen" TEXT NOT NULL,
    "rutaArchivoPdf" TEXT,
    "idProyecto" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reporte_pkey" PRIMARY KEY ("idReporte")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cronograma_idProyecto_key" ON "Cronograma"("idProyecto");

-- AddForeignKey
ALTER TABLE "Proyecto" ADD CONSTRAINT "Proyecto_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Cliente"("idCliente") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cronograma" ADD CONSTRAINT "Cronograma_idProyecto_fkey" FOREIGN KEY ("idProyecto") REFERENCES "Proyecto"("idProyecto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarea" ADD CONSTRAINT "Tarea_idCronograma_fkey" FOREIGN KEY ("idCronograma") REFERENCES "Cronograma"("idCronograma") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seguimiento" ADD CONSTRAINT "Seguimiento_idTarea_fkey" FOREIGN KEY ("idTarea") REFERENCES "Tarea"("idTarea") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_idProyecto_fkey" FOREIGN KEY ("idProyecto") REFERENCES "Proyecto"("idProyecto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_idContratista_fkey" FOREIGN KEY ("idContratista") REFERENCES "Contratista"("idContratista") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContratoDetalle" ADD CONSTRAINT "ContratoDetalle_idContrato_fkey" FOREIGN KEY ("idContrato") REFERENCES "Contrato"("idContrato") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContratoDetalle" ADD CONSTRAINT "ContratoDetalle_idCargo_fkey" FOREIGN KEY ("idCargo") REFERENCES "Cargo"("idCargo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompra" ADD CONSTRAINT "OrdenCompra_idProveedor_fkey" FOREIGN KEY ("idProveedor") REFERENCES "Proveedor"("idProveedor") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineaOrdenCompra" ADD CONSTRAINT "LineaOrdenCompra_idOrdenCompra_fkey" FOREIGN KEY ("idOrdenCompra") REFERENCES "OrdenCompra"("idOrdenCompra") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineaOrdenCompra" ADD CONSTRAINT "LineaOrdenCompra_idMaterial_fkey" FOREIGN KEY ("idMaterial") REFERENCES "Material"("idMaterial") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregaMaterial" ADD CONSTRAINT "EntregaMaterial_idOrdenCompra_fkey" FOREIGN KEY ("idOrdenCompra") REFERENCES "OrdenCompra"("idOrdenCompra") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregaMaterial" ADD CONSTRAINT "EntregaMaterial_idMaterial_fkey" FOREIGN KEY ("idMaterial") REFERENCES "Material"("idMaterial") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionTarea" ADD CONSTRAINT "AsignacionTarea_idTarea_fkey" FOREIGN KEY ("idTarea") REFERENCES "Tarea"("idTarea") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionTarea" ADD CONSTRAINT "AsignacionTarea_idTrabajador_fkey" FOREIGN KEY ("idTrabajador") REFERENCES "Trabajador"("idTrabajador") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionMaterial" ADD CONSTRAINT "AsignacionMaterial_idTarea_fkey" FOREIGN KEY ("idTarea") REFERENCES "Tarea"("idTarea") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionMaterial" ADD CONSTRAINT "AsignacionMaterial_idMaterial_fkey" FOREIGN KEY ("idMaterial") REFERENCES "Material"("idMaterial") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PronosticoMaterial" ADD CONSTRAINT "PronosticoMaterial_idProyecto_fkey" FOREIGN KEY ("idProyecto") REFERENCES "Proyecto"("idProyecto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PronosticoMaterial" ADD CONSTRAINT "PronosticoMaterial_idMaterial_fkey" FOREIGN KEY ("idMaterial") REFERENCES "Material"("idMaterial") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_idProyecto_fkey" FOREIGN KEY ("idProyecto") REFERENCES "Proyecto"("idProyecto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_idTarea_fkey" FOREIGN KEY ("idTarea") REFERENCES "Tarea"("idTarea") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_idMaterial_fkey" FOREIGN KEY ("idMaterial") REFERENCES "Material"("idMaterial") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_idProyecto_fkey" FOREIGN KEY ("idProyecto") REFERENCES "Proyecto"("idProyecto") ON DELETE SET NULL ON UPDATE CASCADE;
