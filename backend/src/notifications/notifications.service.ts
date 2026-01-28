import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { WhatsAppService } from './whatsapp.service';
import { ParseService } from '../parse/parse.service';

export interface NotificationRecipient {
  userId: string;
  email?: string;
  whatsapp?: string;
  preferences: {
    email: boolean;
    whatsapp: boolean;
  };
}

export interface TenderNotification {
  tenderId: string;
  reference: string;
  titre: string;
  module: string;
  institution: string;
  dateLimite: Date;
  region: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private emailService: EmailService,
    private whatsAppService: WhatsAppService,
    private parseService: ParseService,
  ) {}

  /**
   * Envoie des notifications pour de nouveaux appels d'offres
   */
  async notifyNewTenders(tenders: TenderNotification[]): Promise<void> {
    if (tenders.length === 0) return;

    this.logger.log(`Envoi de notifications pour ${tenders.length} nouveaux appels d'offres`);

    // Récupérer les utilisateurs avec des alertes actives
    const recipients = await this.getAlertRecipients(tenders);

    for (const recipient of recipients) {
      const matchingTenders = this.filterTendersForRecipient(tenders, recipient);
      
      if (matchingTenders.length === 0) continue;

      try {
        // Envoyer par email
        if (recipient.preferences.email && recipient.email) {
          await this.emailService.sendNewTendersNotification(
            recipient.email,
            matchingTenders,
          );
        }

        // Envoyer par WhatsApp
        if (recipient.preferences.whatsapp && recipient.whatsapp) {
          await this.whatsAppService.sendNewTendersNotification(
            recipient.whatsapp,
            matchingTenders,
          );
        }

        // Logger l'envoi
        await this.logNotification(recipient.userId, matchingTenders);
      } catch (error: any) {
        this.logger.error(
          `Erreur envoi notification pour ${recipient.userId}: ${error.message}`,
        );
      }
    }
  }

  /**
   * Récupère les destinataires des alertes
   */
  private async getAlertRecipients(
    tenders: TenderNotification[],
  ): Promise<NotificationRecipient[]> {
    // Récupérer les modules uniques des appels d'offres
    const modules = [...new Set(tenders.map((t) => t.module))];
    const regions = [...new Set(tenders.map((t) => t.region))];

    // Requête pour trouver les utilisateurs avec des alertes correspondantes
    const query = this.parseService.createQuery('_User');
    
    // Utilisateurs avec au moins un des modules dans leurs alertes
    query.containedIn('modulesAlertes', modules);
    
    // Ou région correspondante
    const regionQuery = this.parseService.createQuery('_User');
    regionQuery.containedIn('regionsAlertes', [...regions, 'National']);
    
    // Combinaison OR avec Parse.Query.or()
    const mainQuery = this.parseService.orQuery([query, regionQuery]);
    
    // Filtrer ceux qui ont au moins une alerte active
    mainQuery.notEqualTo('alertesEmail', false);

    const users = await this.parseService.findWithMasterKey(mainQuery);

    return users.map((user) => ({
      userId: user.id,
      email: user.get('email'),
      whatsapp: user.get('whatsapp'),
      preferences: {
        email: user.get('alertesEmail') || false,
        whatsapp: user.get('alertesWhatsapp') || false,
      },
    }));
  }

  /**
   * Filtre les appels d'offres pertinents pour un destinataire
   */
  private filterTendersForRecipient(
    tenders: TenderNotification[],
    recipient: NotificationRecipient,
  ): TenderNotification[] {
    // TODO: Récupérer les préférences de l'utilisateur depuis Parse
    // Pour l'instant, on renvoie tous les appels d'offres
    return tenders;
  }

  /**
   * Enregistre l'envoi d'une notification
   */
  private async logNotification(
    userId: string,
    tenders: TenderNotification[],
  ): Promise<void> {
    const log = this.parseService.createObject('NotificationLog');
    
    const user = this.parseService.createObject('_User');
    (user as any).id = userId;
    
    log.set('artisan', user);
    log.set('type', 'alerte');
    log.set('statut', 'envoye');
    log.set('nombreAppels', tenders.length);
    log.set('appelIds', tenders.map((t) => t.tenderId));

    await this.parseService.saveWithMasterKey(log);
  }

  /**
   * Envoie un rappel pour un appel d'offre en favori
   */
  async sendFavoriteReminder(
    userId: string,
    tender: TenderNotification,
  ): Promise<void> {
    const user = await this.parseService.getByIdWithMasterKey('_User', userId);
    if (!user) return;

    const email = user.get('email');
    const whatsapp = user.get('whatsapp');

    if (user.get('alertesEmail') && email) {
      await this.emailService.sendReminderNotification(email, tender);
    }

    if (user.get('alertesWhatsapp') && whatsapp) {
      await this.whatsAppService.sendReminderNotification(whatsapp, tender);
    }
  }
}
