import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { PrismaClient, RolUsuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  AdminSeedConfigError,
  parseAdminSeedConfig,
  parsePositiveIntEnv,
} from '../src/common';

if (existsSync('.env')) {
  loadEnvFile('.env');
}

const prisma = new PrismaClient();

async function seedAdmin(): Promise<void> {
  const config = parseAdminSeedConfig();
  const existingUser = await prisma.usuario.findUnique({
    where: { correo: config.email },
  });

  if (!existingUser) {
    const passwordHash = await bcrypt.hash(
      config.password,
      parsePositiveIntEnv(process.env.BCRYPT_SALT_ROUNDS, 10),
    );
    const createdUser = await prisma.usuario.create({
      data: {
        nombre: config.nombre,
        correo: config.email,
        passwordHash,
        rol: RolUsuario.ADMIN,
        activo: true,
      },
      select: {
        idUsuario: true,
        correo: true,
        rol: true,
        activo: true,
      },
    });

    console.log(
      `Usuario ADMIN creado: idUsuario=${createdUser.idUsuario}, correo=${createdUser.correo}, rol=${createdUser.rol}, activo=${createdUser.activo}.`,
    );
    return;
  }

  const updateData: {
    passwordHash?: string;
    rol?: RolUsuario;
    activo?: boolean;
  } = {};

  if (existingUser.rol !== RolUsuario.ADMIN) {
    updateData.rol = RolUsuario.ADMIN;
  }

  if (!existingUser.activo) {
    updateData.activo = true;
  }

  if (config.overwritePassword) {
    updateData.passwordHash = await bcrypt.hash(
      config.password,
      parsePositiveIntEnv(process.env.BCRYPT_SALT_ROUNDS, 10),
    );
  }

  if (Object.keys(updateData).length > 0) {
    const updatedUser = await prisma.usuario.update({
      where: { idUsuario: existingUser.idUsuario },
      data: updateData,
      select: {
        idUsuario: true,
        correo: true,
        rol: true,
        activo: true,
      },
    });

    const passwordMessage = config.overwritePassword
      ? ' contraseña actualizada por ADMIN_OVERWRITE_PASSWORD=true,'
      : '';

    console.log(
      `Usuario ADMIN existente asegurado:${passwordMessage} idUsuario=${updatedUser.idUsuario}, correo=${updatedUser.correo}, rol=${updatedUser.rol}, activo=${updatedUser.activo}.`,
    );
    return;
  }

  console.log(
    `Usuario ADMIN ya existe: idUsuario=${existingUser.idUsuario}, correo=${existingUser.correo}, rol=${existingUser.rol}, activo=${existingUser.activo}.`,
  );
}

seedAdmin()
  .catch((error: unknown) => {
    if (error instanceof AdminSeedConfigError) {
      console.error(`Seed ADMIN inválido: ${error.message}`);
    } else {
      console.error('Seed ADMIN falló.');
      console.error(error);
    }

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
