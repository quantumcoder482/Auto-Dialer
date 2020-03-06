'use strict';

const { urlencoded } = require('body-parser');
const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;

module.exports = function(app)
{
  app.use(urlencoded({ extended: false }));

  app.get('/api/twiliotoken', (request, response) => {
    const capability = new ClientCapability({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN
    });

    capability.addScope(
      new ClientCapability.OutgoingClientScope({
        applicationSid: process.env.TWILIO_TWIML_APP_SID
      })
    );

    const token = capability.toJwt();

    // Include token in a JSON response
    response.send({
      token: token
    });
  });

  // Create TwiML for outbound calls
  app.post('/api/voicecall', (request, response) => {
    const voiceResponse = new VoiceResponse();
       // Call with agentNumber
    voiceResponse.dial({
      callerId: request.body.agentnumber,
    }, request.body.number);

    response.type('text/xml');
    response.send(voiceResponse.toString());
  });


}
