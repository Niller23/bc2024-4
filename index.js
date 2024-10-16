const http = require('http');
const { Command } =  require('commander');
const fs = require('fs').promises;
const path = require('path');

const program = new Command();
program 
.requiredOption('-h, --host <host>', 'server host')
.requiredOption('-p, --port <port>', 'server port')
.requiredOption('-c, --cache <cache>', 'cache directory path');

program.parse(process.argv);

const options = program.opts();

// Функція для перевірки існування директорії
async function checkCacheDirectory() {
    const stat = await fs.stat(cacheDir).catch(() => null);
    if (!stat || !stat.isDirectory()) {
      console.error(`Помилка: Директорія для кешу не існує: ${cacheDir}`);
      process.exit(1);
    }
  }

const host = 'localhost';
const port = 8000;
const cache = './cache';

const requestListener = function (req, res){
    res.writeHead(200);
    res.end ("My first server!")
}

///Створюємо об'єкт сервера
const server = http.createServer(requestListener);

//Задаю порт та адресу, яку прослуховує сервер


server.listen(port, host, () => {
    console.log(`Server is running ont http://${host}:${port}`);
    console.log(`Host:${host}`);
    console.log(`Port:${port}`);
    console.log(`Cache:${cache}`);
});

