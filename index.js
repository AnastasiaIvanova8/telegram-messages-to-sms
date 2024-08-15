// Подключение переменных из файла .env
require('dotenv').config();

// Подключение библиотеки для Telegram ботов
const TelegramBot = require('node-telegram-bot-api');

// Точка подключения для отправки SMS через Exolve HTTP API
const url = 'https://api.exolve.ru/messaging/v1/SendSMS';

const apiKeyExolve = process.env.API_KEY_EXOLVE; // API-ключ приложения в Exolve
const exolveNumber = process.env.EXOLVE_NUMBER; // Купленный номер в Exolve
const recieverNumber = process.env.RECIEVER_NUMBER; // Номер, куда пересылать сообщения из Telegram

// Функция отправки SMS через SMS HTTP Exolve
async function sendSMS(exolveNumber, recieverNumber, text) {
  // передача в функцию номера Exolve, номера получателя и текста SMS
  let response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + apiKeyExolve },
    body: JSON.stringify({
      number: exolveNumber,
      destination: recieverNumber,
      text: text,
    }),
  });

  let result = await response.json();
  console.log(result);
}

// Инициализация Telegram бота
const bot = new TelegramBot(process.env.API_KEY_BOT, {
  polling: true,
});

// Прослушка сообщений в боте
bot.on('text', async (msg) => {
  // Отправка полученного в боте сообщения в SMS

  try {
    await sendSMS(exolveNumber, recieverNumber, msg.text);
  } catch (e) {
    console.error(e);
  }

  // Ответ на сообщение в боте
  await bot.sendMessage(msg.chat.id, 'Ваше сообщение перенаправлено в SMS');
});
