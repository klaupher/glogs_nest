import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

export const mailerConfig: MailerOptions = {
  template: {
    dir: path.resolve(__dirname, '..', '..', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      extName: '.hbs',
      layoutsDir: path.resolve(__dirname, '..', '..', 'templates'),
    },
  },
  transport: {
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '25c40e63887b1b',
      pass: 'bed4ff4ef103f9',
    },
  },
  // transport: `smtps://25c40e63887b1b@mailtrap.io:bed4ff4ef103f9@sandbox.smtp.mailtrap.io`,
};
