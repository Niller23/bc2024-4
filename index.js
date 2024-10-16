const http = require('http');
const { Command } = require('commander');
const fs = require('fs').promises;
const path = require('path');

const program = new Command();
program
  .requiredOption('-h, --host <host>', 'server host')
  .requiredOption('-p, --port <port>', 'server port')
  .requiredOption('-c, --cache <cache>', 'cache directory path');

program.parse(process.argv);

const options = program.opts();
const host = options.host;
const port = options.port;
const cacheDir = options.cache;

// Функція для перевірки існування директорії
async function checkCacheDirectory() {
  const stat = await fs.stat(cacheDir).catch(() => null);
  if (!stat || !stat.isDirectory()) {
    console.error(`Помилка: Директорія для кешу не існує: ${cacheDir}`);
    process.exit(1);
  }
}

// Функція для читання файлу з кешу
async function readFromCache(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return data;
  } catch (error) {
    console.error(`Помилка читання файлу: ${error}`);
    return null;
  }
}

// Функція для запису файлу в кеш
async function writeToCache(filePath, data) {
  try {
    await fs.writeFile(filePath, data, 'utf8');
    console.log(`Файл збережено в кеш: ${filePath}`);
  } catch (error) {
    console.error(`Помилка запису файлу: ${error}`);
  }
}

const requestListener = async function (req, res) {
    const urlPath = req.url.slice(1); // Видаляємо перший слеш '/'
    const code = parseInt(urlPath, 10); // Перетворюємо шлях на число
  
    if (isNaN(code)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Неправильний HTTP код');
      return;
    }
  
    const htmlFilePath = path.join(__dirname, 'index.html'); // Шлях до HTML-файлу
    try {
      const htmlContent = await fs.readFile(htmlFilePath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(htmlContent);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Помилка сервера');
    }
  };
// Спершу перевіряємо наявність директорії для кешу, а потім запускаємо сервер
checkCacheDirectory().then(() => {
  const server = http.createServer(requestListener);

  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
    console.log(`Host: ${host}`);
    console.log(`Port: ${port}`);
    console.log(`Cache: ${cacheDir}`);
  });
});
