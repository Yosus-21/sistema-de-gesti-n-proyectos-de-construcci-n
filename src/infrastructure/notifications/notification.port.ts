export const NOTIFICATION_PORT = 'NOTIFICATION_PORT';

export interface SendEmailParams {
  to: string;
  subject: string;
  message: string;
}

export interface SendEmailResult {
  sent: boolean;
  provider: string;
  messageId?: string;
  reason?: string;
}

export interface NotificationPort {
  sendEmail(params: SendEmailParams): Promise<SendEmailResult>;
}
