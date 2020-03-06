'use strict';

module.exports = {
  db: {
    name: 'db',
    connector: 'memory',
  },
  mysql: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    url: '',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    name: 'mysql',
    user: process.env.DB_USER,
    connector: 'mysql',
  },
  mandrill: {
    name: 'mandrill',
    connector: 'lb-connector-mandrill',
    apikey: process.env.MANDRILL_KEY,
  },
  pxApi: {
    name: 'pxApi',
    crud: false,
    connector: 'rest',
    operations: [{
      template: {
        method: 'POST',
        headers: {
          accepts: 'application/json',
          'content-type': 'application/json',
        },
        url: 'http://api.open.stagingpx.com/px',
        body: '{data:object}',
        json: true,
      },
      functions: {
        insertLead: ['data'],
      },
    }],
  },
  datalotApi: {
    name: 'datalotApi',
    crud: false,
    connector: 'rest',
    operations: [{
      template: {
        method: 'POST',
        headers: {
          accepts: 'application/xml',
          'content-type': 'application/xml',
        },
        url: 'https://api.datalot.com/contact/create/v2',
        body: '{data:text}',
        xml: true,
      },
      functions: {
        insertLead: ['data'],
      },
    }],
  },
  Firebase: {
    name: 'Firebase',
    connector: 'loopback-connector-realtime-database',
    projectId: process.env.FIREBASE_PROJECTID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY,
  },
  twilio: {
    name: 'twilio',
    connector: 'loopback-connector-twilio',
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  },
};
