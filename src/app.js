// 提示範本列表
let promptList = [{
    name: '-- 選取提示範本 --',
    value: ''
}, {
    name: '使用正體中文回應',
    value: '請以台灣常用的正體中文回應。'
}, {
    name: '翻譯成正體中文',
    value: 'You are a professional translation AI proficient in Chinese and English language. Please help me translate content into Traditional Chinese with Taiwan culture.'
}, {
    name: '總結長文內容',
    value: 'Please help me summarize content and list the key points. Then translate all the content into Traditional Chinese. No explanations and additional information of the translations are required. Do not add pronunciation annotations.'
}];

// 初始化提示範本下拉選單
promptList.forEach(item => {
    promptTemplates.options.add(new Option(item.name, item.value));
});

// 監聽提示範本選擇變更
promptTemplates.addEventListener('change', (evt) => {
   var sel = evt.target;
   var idx = sel.selectedIndex;
   var itm = sel.options[idx];
   var val = itm.value;

   promptText.value = val;
   run();
});

// Base64 編碼 Unicode 字串
function b64EncodeUnicode(str) {
    const bytes = new TextEncoder().encode(str);
    const base64 = window.btoa(String.fromCharCode(...new Uint8Array(bytes)));
    if (base64.length < 64) {
        return str;
    } else {
        return base64;
    }
}

// 檢查是否為 Base64 Unicode 編碼
function isBase64Unicode(str) {
    const base64Regex = /^[\w\+\/=]+$/;
    if (!base64Regex.test(str)) return false;

    try {
        const decoded = window.atob(str);
        const bytes = new Uint8Array(decoded.length);
        for (let i = 0; i < decoded.length; i++) {
            bytes[i] = decoded.charCodeAt(i);
        }
        const decoder = new TextDecoder('utf-8');
        decoder.decode(bytes);
        return true;
    } catch (e) {
        return false;
    }
}

// Base64 解碼 Unicode 字串
function b64DecodeUnicode(str) {
    const bytes = Uint8Array.from(window.atob(str), c => c.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    return decoded;
}

// 取得表單和輸入元素
const firstForm = document.querySelector('form');
const inputElements = firstForm.querySelectorAll('input, textarea, select');

// 監聽所有輸入元素的變更
inputElements.forEach(element => {
    if (element.tagName === 'SELECT') {
        element.addEventListener('change', run);
    } else {
        element.addEventListener('input', run);
    }
});

// 頁面載入完成時執行
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromLocalStorage();
    loadDataFromHash();
    run();
    clearLocationHash();
});

// 從 LocalStorage 載入資料
function loadDataFromLocalStorage() {
    inputElements.forEach(element => {
        if (element.type == 'checkbox') {
            if (element.name === 'pasteImage') {
                element.checked = (localStorage.getItem(element.name) === 'true');
            } else if (element.name === 'autoSubmit') {
                element.checked = (localStorage.getItem(element.name) !== 'false');
            } else {
                element.checked = (localStorage.getItem(element.name) === 'true')
            }
        } else {
            element.value = localStorage.getItem(element.name)
        }
    });

    if (!firstForm.baseurl.value) {
        firstForm.baseurl.value = 'https://chatgpt.com/?model=gpt-4o-mini';
    }
}

// 從 URL Hash 載入資料
function loadDataFromHash() {
    var params = new URLSearchParams(location.hash.substring(1));
    inputElements.forEach(element => {
        if (params.has(element.name)) {
            if (element.type == 'checkbox') {
                element.checked = (params.get(element.name) !== 'false')
            } else {
                element.value = params.get(element.name)
            }
        }
    });
}

// 清除 URL Hash
function clearLocationHash() {
    if (history.replaceState) {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
    } else {
        window.location.hash = '';
    }
}

// 點擊自動複製到剪貼簿
promptMarkdown.addEventListener('click', function() {
   promptMarkdown.select();
   promptMarkdown.setSelectionRange(0, 99999);
   document.execCommand("copy");
});

promptUrl.addEventListener('click', function() {
   promptUrl.select();
   promptUrl.setSelectionRange(0, 99999);
   document.execCommand("copy");
});

searchengine_search.addEventListener('click', function() {
   searchengine_search.select();
   searchengine_search.setSelectionRange(0, 99999);
   document.execCommand("copy");
});

searchengine_url.addEventListener('click', function() {
   searchengine_url.select();
   searchengine_url.setSelectionRange(0, 99999);
   document.execCommand("copy");
});

// 開啟 ChatGPT 提問
function openChatGPT() {
  run();
  window.open(generateLink(), '_blank');
}

// 主要執行函數
function run() {
    // 儲存到 LocalStorage
    inputElements.forEach(element => {
        if (element.type == 'checkbox') {
            localStorage.setItem(element.name, element.checked);
        } else {
            localStorage.setItem(element.name, element.value);
        }
    });

    let promptChatGPTURL = generateLink();

    // 更新按鈕文字
    if (firstForm.baseurl.value.startsWith('https://chatgpt.com')) ask.innerHTML = '開啟 ChatGPT 提問'
    if (firstForm.baseurl.value.startsWith('https://gemini.google.com')) ask.innerHTML = '開啟 Gemini 提問'
    if (firstForm.baseurl.value.startsWith('https://claude.ai')) ask.innerHTML = '開啟 Claude 提問'
    if (firstForm.baseurl.value.startsWith('https://www.phind.com')) ask.innerHTML = '開啟 phind 提問'
    if (firstForm.baseurl.value.startsWith('https://groq.com')) ask.innerHTML = '開啟 Groq 提問'
    if (firstForm.baseurl.value.startsWith('https://www.perplexity.ai')) ask.innerHTML = '開啟 Perplexity 提問'
    
    // 建立書籤連結
    let link = document.createElement('a');
    link.className = 'result-link';
    link.setAttribute('href', promptChatGPTURL);
    link.setAttribute('target', '_blank');
    link.innerText = firstForm.subject.value;

    result.innerHTML = '';
    result.appendChild(link);

    // 更新 Markdown 和 URL
    promptMarkdown.value = `[${firstForm.subject.value}](${promptChatGPTURL})`
    promptUrl.value = `${promptChatGPTURL}`

    // 更新搜尋引擎設定
    searchengine_search.value = firstForm.subject.value;
    searchengine_url.value = generateLink(true);
}

// 產生連結
function generateLink(sitesearch = false) {
    let promptTextEncoded = encodeURIComponent(b64EncodeUnicode(firstForm.prompt.value));
    if (!!sitesearch) {
        promptTextEncoded = encodeURIComponent(firstForm.prompt.value).replace('%25s', '%s')
    }
    let url = `${firstForm.baseurl.value}#autoSubmit=${firstForm.autoSubmit.checked}&pasteImage=${firstForm.pasteImage.checked}&prompt=${promptTextEncoded}`;
    if (firstForm.tool && firstForm.tool.value) {
        url += `&tool=${encodeURIComponent(firstForm.tool.value)}`;
    }
    return url;
}

// 分享功能
function sharePrompt() {
    run();

    let hash = '#';
    inputElements.forEach(element => {
        if (element.type == 'checkbox') {
            hash += element.name + '=' + element.checked + '&';
        } else {
            hash += element.name + '=' + encodeURIComponent(element.value) + '&';
        }
    });

    location.hash = hash;

    navigator.clipboard.writeText(location.href).then(
        () => {
            console.log('clipboard successfully set')
        },
        () => {
            console.log('clipboard write failed');
        });
}
