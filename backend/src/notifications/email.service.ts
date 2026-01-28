import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { TenderNotification } from './notifications.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  /**
   * Initialise le transporteur SMTP
   */
  private initializeTransporter(): void {
    const host = this.configService.get<string>('email.host');
    const user = this.configService.get<string>('email.user');

    if (!host || !user) {
      this.logger.warn('Configuration SMTP manquante - les emails ne seront pas envoyés');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port: this.configService.get<number>('email.port'),
      secure: this.configService.get<boolean>('email.secure'),
      auth: {
        user,
        pass: this.configService.get<string>('email.pass'),
      },
    });

    this.logger.log('Transporteur SMTP initialisé');
  }

  /**
   * Envoie une notification de nouveaux appels d'offres
   */
  async sendNewTendersNotification(
    to: string,
    tenders: TenderNotification[],
  ): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`Email non envoyé (SMTP non configuré): ${to}`);
      return;
    }

    const fromName = this.configService.get<string>('email.fromName');
    const fromAddress = this.configService.get<string>('email.fromAddress');

    const subject = `${tenders.length} nouveau(x) appel(s) d'offres - PMN Marchés Publics`;

    const html = this.generateNewTendersEmail(tenders);

    try {
      await this.transporter.sendMail({
        from: `"${fromName}" <${fromAddress}>`,
        to,
        subject,
        html,
      });

      this.logger.log(`Email envoyé à ${to} - ${tenders.length} appels d'offres`);
    } catch (error: any) {
      this.logger.error(`Erreur envoi email à ${to}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Envoie un rappel pour un appel d'offre
   */
  async sendReminderNotification(
    to: string,
    tender: TenderNotification,
  ): Promise<void> {
    if (!this.transporter) {
      return;
    }

    const fromName = this.configService.get<string>('email.fromName');
    const fromAddress = this.configService.get<string>('email.fromAddress');

    const daysLeft = Math.ceil(
      (new Date(tender.dateLimite).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    const subject = `⚠️ Rappel: ${daysLeft} jour(s) restant(s) - ${tender.reference}`;

    const html = this.generateReminderEmail(tender, daysLeft);

    try {
      await this.transporter.sendMail({
        from: `"${fromName}" <${fromAddress}>`,
        to,
        subject,
        html,
      });

      this.logger.log(`Rappel envoyé à ${to} pour ${tender.reference}`);
    } catch (error: any) {
      this.logger.error(`Erreur envoi rappel à ${to}: ${error.message}`);
    }
  }

  /**
   * Génère le HTML pour l'email de nouveaux appels d'offres
   */
  private generateNewTendersEmail(tenders: TenderNotification[]): string {
    const tenderRows = tenders
      .map(
        (t) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <strong style="color: #059669;">${t.reference}</strong>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            ${t.titre}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            ${t.institution}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            ${t.region}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            ${new Date(t.dateLimite).toLocaleDateString('fr-FR')}
          </td>
        </tr>
      `,
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f3f4f6;">
        <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
          <!-- Header avec drapeau Sénégal -->
          <div style="height: 4px; background: linear-gradient(90deg, #00853F 33%, #FDEF42 33% 66%, #E31B23 66%);"></div>
          
          <div style="background-color: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 32px;">
            <!-- Logo -->
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #059669, #047857); padding: 12px 24px; border-radius: 12px;">
                <span style="color: white; font-size: 24px; font-weight: bold;">PMN</span>
                <span style="color: #fbbf24; font-size: 14px; display: block;">Marchés Publics</span>
              </div>
            </div>

            <h1 style="color: #059669; text-align: center; margin-bottom: 8px;">
              Nouveaux appels d'offres disponibles
            </h1>
            
            <p style="text-align: center; color: #6b7280; margin-bottom: 32px;">
              ${tenders.length} nouvelle(s) opportunité(s) correspondant à vos critères
            </p>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="background-color: #f9fafb;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Référence</th>
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Objet</th>
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Institution</th>
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Région</th>
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Date limite</th>
                </tr>
              </thead>
              <tbody>
                ${tenderRows}
              </tbody>
            </table>

            <div style="text-align: center; margin-top: 32px;">
              <a href="https://pmn-marches.sn/appels-offres" 
                 style="display: inline-block; background-color: #059669; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Voir tous les appels d'offres
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
              Vous recevez cet email car vous avez activé les alertes sur PMN Marchés Publics.<br>
              <a href="https://pmn-marches.sn/parametres/alertes" style="color: #059669;">
                Gérer mes alertes
              </a>
              |
              <a href="https://pmn-marches.sn/desinscription" style="color: #059669;">
                Se désinscrire
              </a>
            </p>

            <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 16px;">
              © ${new Date().getFullYear()} Projet Mobilier National du Sénégal. Tous droits réservés.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Génère le HTML pour l'email de rappel
   */
  private generateReminderEmail(
    tender: TenderNotification,
    daysLeft: number,
  ): string {
    const urgencyColor = daysLeft <= 3 ? '#dc2626' : daysLeft <= 7 ? '#f59e0b' : '#059669';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="height: 4px; background: linear-gradient(90deg, #00853F 33%, #FDEF42 33% 66%, #E31B23 66%);"></div>
          
          <div style="background-color: #ffffff; border-radius: 0 0 8px 8px; padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 48px;">⏰</span>
            </div>

            <h1 style="color: ${urgencyColor}; text-align: center;">
              Plus que ${daysLeft} jour(s) !
            </h1>

            <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h2 style="margin: 0 0 12px 0; color: #374151;">
                ${tender.titre}
              </h2>
              <p style="margin: 0; color: #6b7280;">
                <strong>Référence:</strong> ${tender.reference}<br>
                <strong>Institution:</strong> ${tender.institution}<br>
                <strong>Date limite:</strong> ${new Date(tender.dateLimite).toLocaleDateString('fr-FR')}
              </p>
            </div>

            <div style="text-align: center;">
              <a href="https://pmn-marches.sn/appels-offres/${tender.tenderId}" 
                 style="display: inline-block; background-color: #059669; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Consulter l'appel d'offres
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
