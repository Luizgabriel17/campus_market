import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dns from 'dns';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend | null = null;

  constructor() {
    if (process.env.RESEND_API_KEY) {
      this.resend = new Resend(process.env.RESEND_API_KEY);
    }
  }

  private async createTransporter(): Promise<nodemailer.Transporter> {
    const ipv4List = await dns.promises.resolve4('smtp.gmail.com');
    const smtpIpv4 = ipv4List[0];

    return nodemailer.createTransport({
      // Usa IP IPv4 direto para evitar fallback para IPv6 no host
      host: smtpIpv4,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        // Mantém SNI/cert valido para o hostname oficial
        servername: 'smtp.gmail.com',
        rejectUnauthorized: true,
      },
      connectionTimeout: 10000,
      socketTimeout: 10000,
    } as any);
  }

  private getFromAddress() {
    return process.env.MAIL_FROM || process.env.MAIL_USER || 'no-reply@campusmarket.local';
  }

  private async sendWithResend(to: string, subject: string, html: string) {
    if (!this.resend) return false;

    await this.resend.emails.send({
      from: `CampusMarket <${this.getFromAddress()}>`,
      to,
      subject,
      html,
    });
    return true;
  }

  private async sendWithSmtp(to: string, subject: string, html: string) {
    const transporter = await this.createTransporter();
    await transporter.sendMail({
      from: `"CampusMarket" <${this.getFromAddress()}>`,
      to,
      subject,
      html,
    });
  }

  async sendVerificationCode(to: string, code: string): Promise<void> {
    const subject = 'Confirme seu cadastro no CampusMarket';
    const html = `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1a1a1a;">Confirme seu e-mail</h2>
            <p style="color: #444;">Use o código abaixo para confirmar seu cadastro no <strong>CampusMarket</strong>:</p>
            <div style="
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #1a1a1a;
              background: #f4f4f4;
              padding: 16px 24px;
              border-radius: 8px;
              text-align: center;
              margin: 24px 0;
            ">
              ${code}
            </div>
            <p style="color: #888; font-size: 14px;">Este código expira em <strong>15 minutos</strong>.</p>
            <p style="color: #888; font-size: 14px;">Se você não criou uma conta, ignore este e-mail.</p>
          </div>
        `;

    try {
      const sentByResend = await this.sendWithResend(to, subject, html);
      if (!sentByResend) {
        await this.sendWithSmtp(to, subject, html);
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail de verificação:', error);
      throw new InternalServerErrorException('Erro ao enviar e-mail de verificação.');
    }
  }

  async sendPasswordRecoveryCode(to: string, code: string): Promise<void> {
    const subject = 'Recuperação de Senha - CampusMarket';
    const html = `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; background: #ffffff;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 1.5rem; font-weight: 700;">Recupere sua senha</h2>
            <p style="color: #475569; font-size: 0.95rem; line-height: 1.5;">Use o código abaixo para redefinir a senha da sua conta no <strong>CampusMarket</strong>:</p>
            <div style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 6px;
              color: #10b981;
              background: #f8fafc;
              padding: 16px 24px;
              border-radius: 8px;
              text-align: center;
              margin: 24px 0;
              border: 1px dashed rgba(16, 185, 129, 0.3);
            ">
              ${code}
            </div>
            <p style="color: #64748b; font-size: 0.85rem; line-height: 1.4;">Este código expira em <strong>15 minutos</strong>.</p>
            <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 0;">Se você não solicitou a redefinição de senha, ignore este e-mail.</p>
          </div>
        `;

    try {
      const sentByResend = await this.sendWithResend(to, subject, html);
      if (!sentByResend) {
        await this.sendWithSmtp(to, subject, html);
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail de recuperação de senha:', error);
      throw new InternalServerErrorException('Erro ao enviar e-mail de recuperação de senha.');
    }
  }
}