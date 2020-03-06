
# Auto Dialer BackEnd - Node.js(LoopBack)


### Prerequisites

1. [Node.js](http://nodejs.org/) (version 6 or higher)
2. A Twilio account with a verified [phone number](https://www.twilio.com/console/phone-numbers/incoming). (Get a
   [free account](https://www.twilio.com/try-twilio?utm_campaign=tutorials&utm_medium=readme)
   here.) If you are using a Twilio Trial Account, you can learn all about it
   [here](https://www.twilio.com/help/faq/twilio-basics/how-does-twilios-free-trial-work).
3. Mysql Database Server install on your server and setting the details on .env
4. Firebase RealTime Database Creating and setting the details on .env
   file.
   You can get some information from this URL [here](https://support.google.com/firebase/answer/7015592?hl=en)

### Local Deployment


1. Install dependencies.

  ```bash
  $ npm install
  ```

2. Run the application.

  ```bash
  $ npm start
  ```

3. Expose the application to the wider Internet using [ngrok](https://ngrok.com/).

   ```bash
   $ ngrok http 3000
   ```

   Once you have started ngrok, update your App voice URL
   setting to use your ngrok hostname. It will look something like
   this:



### Setting up Twilio App


   1. Change the [Voice Request URL](https://www.twilio.com/console/voice/twiml/apps/AP5339600fa1b74418884efa14c9cb5b18) with ngrok url

   ```
    http://<your-ngrok-subdomain>/voice
   ```

   2. Reference Screen

   ![Screenshot](./screenshot.png)

