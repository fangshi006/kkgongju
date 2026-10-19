/**
 * 坤坤工具箱 · 本地 HTTPS 预览服务
 * 零依赖，只用 Node 内置模块。
 *
 *   node server.js              # https://localhost:3000
 *   $env:PORT=4000; node server.js   # 换端口（PowerShell）
 *
 * 证书位于 ./certs/，生成方法见 README「本地 HTTPS 预览」。
 */
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const ROOT = __dirname;
const CERT_DIR = path.join(ROOT, 'certs');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const NOT_FOUND = `<!doctype html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>404 · 坤坤工具箱</title>
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center;
         font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color: #5b6472; background: #f6f7f9; }
  p { font-size: 15px; }
  code { background: #eef1f5; padding: .15em .45em; border-radius: 4px; color: #171a1f; }
</style></head>
<body><p>404 · 找不到 <code>这个文件</code></p></body>
</html>`;

function send(res, status, body) {
  const buf = Buffer.from(body);
  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': buf.length,
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(buf);
}

let certOptions;
try {
  certOptions = {
    key: fs.readFileSync(path.join(CERT_DIR, 'localhost-key.pem')),
    cert: fs.readFileSync(path.join(CERT_DIR, 'localhost-cert.pem')),
  };
} catch (err) {
  console.error('缺少证书文件：certs/localhost-key.pem 或 certs/localhost-cert.pem');
  console.error('生成方法见 README 的「本地 HTTPS 预览」一节。');
  process.exit(1);
}

const server = https.createServer(certOptions, (req, res) => {
  const started = Date.now();
  const method = req.method || 'GET';

  res.on('finish', () => {
    const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    console.log(`[${time}] ${method} ${req.url} ${res.statusCode} ${Date.now() - started}ms`);
  });

  if (method !== 'GET' && method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return send(res, 405, '405 · Method Not Allowed');
  }

  let pathname = '/';
  try {
    pathname = decodeURIComponent(new URL(req.url, 'https://localhost').pathname);
  } catch (err) {
    return send(res, 400, '400 · Bad Request');
  }

  const target = path.resolve(ROOT, '.' + pathname);
  const rel = path.relative(ROOT, target);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    return send(res, 403, '403 · Forbidden');
  }

  fs.stat(target, (err, stat) => {
    if (err) return send(res, 404, NOT_FOUND);
    if (stat.isDirectory()) {
      const index = path.join(target, 'index.html');
      return fs.stat(index, (err2, stat2) => {
        if (err2) return send(res, 404, NOT_FOUND);
        streamFile(index, stat2);
      });
    }
    streamFile(target, stat);
  });

  function streamFile(file, stat) {
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    });
    if (method === 'HEAD') return res.end();

    const stream = fs.createReadStream(file);
    stream.on('error', () => res.destroy());
    stream.pipe(res);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用。可用 PORT 环境变量换一个，例如：$env:PORT=4000; node server.js`);
  } else {
    console.error('服务启动失败：', err.message);
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log('坤坤工具箱 · 本地预览已启动');
  console.log(`  地址：https://localhost:${PORT}`);
  console.log(`  根目录：${ROOT}`);
  console.log('  停止：Ctrl + C');
});
