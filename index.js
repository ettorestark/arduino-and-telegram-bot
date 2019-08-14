const five = require('johnny-five');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});


var blueLed; 
var redLed; 
var photoresistor;
const board = new five.Board();
board.on('ready', () => {
  blueLed = new five.Led(12);
  redLed = new five.Led(13);


  photoresistor = new five.Sensor({
    pin: "A2",
    freq: 1000
  });

  board.repl.inject({
    pot: photoresistor
  });

  photoresistor.on("data", function() {
    value = this.value;
  });

});


bot.onText(/\/echo (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text.toLowerCase();

  switch (message) {
    case 'turn on blue light':
      blueLed.on();
      bot.sendMessage(chatId, 'Blue light turn on');
      break;
    case 'turn off blue light':
      blueLed.off();
      bot.sendMessage(chatId, 'Blue light turn off');
      break;
    case 'turn on red light':
      redLed.on();
      bot.sendMessage(chatId, 'Red light turn on');
      break;
    case 'turn off red light':
      redLed.off();
      bot.sendMessage(chatId, 'Red light turn off');
      break;
    case 'turn on both lights':
      redLed.on();
      blueLed.on();
      bot.sendMessage(chatId, 'Blue light turn on');
      break;
    case 'turn off both lights':
      redLed.off();
      blueLed.off();
      bot.sendMessage(chatId, 'Both lights turn off');
      break;
    case 'measure the amount of light':
      photoresistor.on("data", function() {
        bot.sendMessage(chatId, this.value);
      });
      break;
  }
});