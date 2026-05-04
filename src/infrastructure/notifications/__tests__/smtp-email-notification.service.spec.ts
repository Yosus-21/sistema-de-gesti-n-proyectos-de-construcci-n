import { SmtpEmailNotificationService } from '../smtp-email-notification.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('SmtpEmailNotificationService', () => {
  let service: SmtpEmailNotificationService;
  let sendMailMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    sendMailMock = jest.fn();
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });
  });

  it('retorna disabled si EMAIL_ENABLED=false', async () => {
    process.env.EMAIL_ENABLED = 'false';
    service = new SmtpEmailNotificationService();

    const result = await service.sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      message: 'Message',
    });

    expect(result).toEqual({
      sent: false,
      provider: 'disabled',
      reason: 'Email deshabilitado por configuración (EMAIL_ENABLED=false)',
    });
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it('envía email correctamente si EMAIL_ENABLED=true', async () => {
    process.env.EMAIL_ENABLED = 'true';
    process.env.EMAIL_FROM = 'test@suarq.local';

    sendMailMock.mockResolvedValue({ messageId: '12345' });

    service = new SmtpEmailNotificationService();

    const result = await service.sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      message: 'Message',
    });

    expect(result).toEqual({
      sent: true,
      provider: 'smtp',
      messageId: '12345',
    });
    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'test@suarq.local',
      to: 'test@example.com',
      subject: 'Test',
      text: 'Message',
    });
  });

  it('maneja errores de envio de forma controlada', async () => {
    process.env.EMAIL_ENABLED = 'true';
    process.env.EMAIL_FROM = 'test@suarq.local';

    sendMailMock.mockRejectedValue(new Error('SMTP Error'));

    service = new SmtpEmailNotificationService();

    const result = await service.sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      message: 'Message',
    });

    expect(result).toEqual({
      sent: false,
      provider: 'smtp',
      reason: 'SMTP Error',
    });
  });
});
