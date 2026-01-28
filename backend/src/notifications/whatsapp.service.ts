import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TenderNotification } from './notifications.service';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly apiUrl: string;
  private readonly phoneNumberId: string;
  private readonly accessToken: string;
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('whatsapp.apiUrl') || '';
    this.phoneNumberId = this.configService.get<string>('whatsapp.phoneNumberId') || '';
    this.accessToken = this.configService.get<string>('whatsapp.accessToken') || '';

    if (this.phoneNumberId && this.accessToken) {
      this.isConfigured = true;
      this.logger.log('Service WhatsApp initialisé');
    } else {
      this.logger.warn('Configuration WhatsApp manquante - les messages ne seront pas envoyés');
    }
  }

  /**
   * Envoie une notification de nouveaux appels d'offres
   */
  async sendNewTendersNotification(
    to: string,
    tenders: TenderNotification[],
  ): Promise<void> {
    if (!this.isConfigured) {
      this.logger.warn(`WhatsApp non envoyé (non configuré): ${to}`);
      return;
    }

    // Formater le numéro de téléphone
    const phoneNumber = this.formatPhoneNumber(to);
    if (!phoneNumber) {
      this.logger.warn(`Numéro de téléphone invalide: ${to}`);
      return;
    }

    const message = this.generateNewTendersMessage(tenders);

    try {
      await this.sendMessage(phoneNumber, message);
      this.logger.log(`WhatsApp envoyé à ${phoneNumber} - ${tenders.length} appels d'offres`);
    } catch (error: any) {
      this.logger.error(`Erreur envoi WhatsApp à ${phoneNumber}: ${error.message}`);
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
    if (!this.isConfigured) {
      return;
    }

    const phoneNumber = this.formatPhoneNumber(to);
    if (!phoneNumber) return;

    const daysLeft = Math.ceil(
      (new Date(tender.dateLimite).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    const message = this.generateReminderMessage(tender, daysLeft);

    try {
      await this.sendMessage(phoneNumber, message);
      this.logger.log(`Rappel WhatsApp envoyé à ${phoneNumber}`);
    } catch (error: any) {
      this.logger.error(`Erreur envoi rappel WhatsApp: ${error.message}`);
    }
  }

  /**
   * Envoie un message via l'API WhatsApp Business
   */
  private async sendMessage(to: string, text: string): Promise<void> {
    const url = `${this.apiUrl}/${this.phoneNumberId}/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: {
          preview_url: true,
          body: text,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erreur WhatsApp API');
    }
  }

  /**
   * Formate un numéro de téléphone au format international
   */
  private formatPhoneNumber(phone: string): string | null {
    // Supprimer tous les caractères non numériques
    let cleaned = phone.replace(/\D/g, '');

    // Si le numéro commence par 0, ajouter l'indicatif du Sénégal
    if (cleaned.startsWith('0')) {
      cleaned = '221' + cleaned.substring(1);
    }

    // Si le numéro ne commence pas par 221, l'ajouter
    if (!cleaned.startsWith('221')) {
      cleaned = '221' + cleaned;
    }

    // Vérifier la longueur (221 + 9 chiffres)
    if (cleaned.length !== 12) {
      return null;
    }

    return cleaned;
  }

  /**
   * Génère le message pour les nouveaux appels d'offres
   */
  private generateNewTendersMessage(tenders: TenderNotification[]): string {
    const emoji = tenders.length > 1 ? '📢' : '🔔';
    
    let message = `${emoji} *PMN Marchés Publics*\n\n`;
    message += `${tenders.length} nouveau(x) appel(s) d'offres :\n\n`;

    for (const tender of tenders.slice(0, 5)) {
      const dateLimite = new Date(tender.dateLimite).toLocaleDateString('fr-FR');
      message += `📋 *${tender.reference}*\n`;
      message += `${tender.titre.substring(0, 100)}${tender.titre.length > 100 ? '...' : ''}\n`;
      message += `🏛️ ${tender.institution}\n`;
      message += `📍 ${tender.region} | ⏰ ${dateLimite}\n\n`;
    }

    if (tenders.length > 5) {
      message += `_Et ${tenders.length - 5} autre(s)..._\n\n`;
    }

    message += `👉 Consultez tous les détails sur:\nhttps://pmn-marches.sn/appels-offres`;

    return message;
  }

  /**
   * Génère le message de rappel
   */
  private generateReminderMessage(
    tender: TenderNotification,
    daysLeft: number,
  ): string {
    const urgencyEmoji = daysLeft <= 3 ? '🚨' : daysLeft <= 7 ? '⚠️' : '⏰';
    const dateLimite = new Date(tender.dateLimite).toLocaleDateString('fr-FR');

    return `${urgencyEmoji} *RAPPEL - ${daysLeft} jour(s) restant(s)*

📋 *${tender.reference}*
${tender.titre}

🏛️ ${tender.institution}
📍 ${tender.region}
⏰ Date limite: *${dateLimite}*

👉 https://pmn-marches.sn/appels-offres/${tender.tenderId}

_PMN Marchés Publics_`;
  }
}
