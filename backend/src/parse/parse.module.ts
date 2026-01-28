import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ParseService } from './parse.service';
import { AppelOffreRepository } from './repositories/appel-offre.repository';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Parse = require('parse/node');

@Global()
@Module({
  providers: [ParseService, AppelOffreRepository],
  exports: [ParseService, AppelOffreRepository],
})
export class ParseModule implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const applicationId = this.configService.get<string>('parse.applicationId');
    const javascriptKey = this.configService.get<string>('parse.javascriptKey');
    const masterKey = this.configService.get<string>('parse.masterKey');
    const serverUrl = this.configService.get<string>('parse.serverUrl');

    if (!applicationId || !masterKey) {
      throw new Error('Parse configuration is missing. Please check your environment variables.');
    }

    Parse.initialize(applicationId, javascriptKey, masterKey);
    Parse.serverURL = serverUrl;

    console.log('✅ Parse SDK initialized successfully');
  }
}
