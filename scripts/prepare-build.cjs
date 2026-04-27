const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
const html = `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>草船借箭</title>
  </head>
  <body>
    <main id="app">
      <div id="game"></div>
      <div id="ui-root"></div>
    </main>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`;

fs.writeFileSync(indexPath, html);
