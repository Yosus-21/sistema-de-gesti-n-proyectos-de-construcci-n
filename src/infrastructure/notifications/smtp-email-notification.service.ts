import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {
  NotificationPort,
  SendEmailParams,
  SendEmailResult,
} from './notification.port';

@Injectable()
export class SmtpEmailNotificationService implements NotificationPort {
  private readonly logger = new Logger(SmtpEmailNotificationService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly isEnabled: boolean;
  private readonly fromAddress: string;

  constructor() {
    this.isEnabled = process.env.EMAIL_ENABLED === 'true';
    this.fromAddress = process.env.EMAIL_FROM || 'no-reply@suarq.local';

    if (this.isEnabled) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      // Importante: No imprimir la contraseña de correo en los logs
      this.logger.log(
        `Servicio SMTP inicializado con host ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`,
      );
    } else {
      this.logger.log('Servicio SMTP deshabilitado (EMAIL_ENABLED=false)');
    }
  }

  async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
    if (!this.isEnabled || !this.transporter) {
      return {
        sent: false,
        provider: 'disabled',
        reason: 'Email deshabilitado por configuración (EMAIL_ENABLED=false)',
      };
    }

    try {
      const info = (await this.transporter.sendMail({
        from: this.fromAddress,
        to: params.to,
        subject: params.subject,
        text: params.message,
      })) as { messageId: string };

      return {
        sent: true,
        provider: 'smtp',
        messageId: info.messageId,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Error al enviar email a ${params.to}: ${err.message}`,
        err.stack,
      );
      return {
        sent: false,
        provider: 'smtp',
        reason: err.message || 'Error desconocido de SMTP',
      };
    }
  }
}
