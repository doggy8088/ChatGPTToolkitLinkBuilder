import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 讀取 package.json 取得版本號
const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));
const version = packageJson.version;

console.log(`Building ChatGPT Toolkit Link Builder v${version}...`);

// 確保 dist 目錄存在
if (!existsSync('dist')) {
  mkdirSync('dist', { recursive: true });
}

// 讀取原始檔案
const html = readFileSync('src/index.html', 'utf8');
const css = readFileSync('src/style.css', 'utf8');
const js = readFileSync('src/app.js', 'utf8');

// 最小化 CSS
function minifyCSS(css) {
  return css
    // 移除註解
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // 移除多餘的空白
    .replace(/\s+/g, ' ')
    // 移除分號前的空白
    .replace(/\s*;\s*/g, ';')
    // 移除冒號前後的空白
    .replace(/\s*:\s*/g, ':')
    // 移除大括號前後的空白
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    // 移除逗號後的空白
    .replace(/\s*,\s*/g, ',')
    // 移除開頭和結尾的空白
    .trim();
}

// 最小化 JavaScript (保守方式，避免破壞程式邏輯)
function minifyJS(js) {
  return js
    // 移除單行註解
    .replace(/\/\/.*$/gm, '')
    // 移除多行註解
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // 移除多餘的空白行
    .replace(/\n\s*\n/g, '\n')
    // 移除行首空白
    .replace(/^\s+/gm, '')
    // 移除行尾空白
    .replace(/\s+$/gm, '')
    // 將多個空白轉為單一空白
    .replace(/  +/g, ' ')
    .trim();
}

// 處理檔案
const minifiedCSS = minifyCSS(css);
// JavaScript 不做最小化以避免破壞程式邏輯（檔案已經很小）
const minifiedJS = js;

// 將 CSS 和 JS 內嵌到 HTML 中，並替換版本號
let finalHTML = html
  .replace('<link rel="stylesheet" href="style.css">', `<style>${minifiedCSS}</style>`)
  .replace('<script src="app.js"></script>', `<script>${minifiedJS}</script>`)
  .replace('__VERSION__', version);

// 寫入 dist 目錄
writeFileSync('dist/index.html', finalHTML);

// 複製 CNAME 和 .nojekyll 如果存在
if (existsSync('CNAME')) {
  writeFileSync('dist/CNAME', readFileSync('CNAME'));
}
if (existsSync('.nojekyll')) {
  writeFileSync('dist/.nojekyll', readFileSync('.nojekyll'));
}

console.log('✓ Build complete!');
console.log(`✓ Output: dist/index.html (${Math.round(finalHTML.length / 1024)} KB)`);
console.log(`✓ Version: ${version}`);
