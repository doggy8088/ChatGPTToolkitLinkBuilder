// AI 提供者對應網址
const aiProviderUrls = {
    'chatgpt': 'https://chatgpt.com/',
    'claude': 'https://claude.ai/',
    'gemini': 'https://gemini.google.com/app',
    'groq': 'https://groq.com/',
    'perplexity': 'https://www.perplexity.ai/'
};

// AI 提供者顯示名稱
const aiProviderNames = {
    'chatgpt': 'ChatGPT',
    'claude': 'Claude',
    'gemini': 'Gemini',
    'groq': 'Groq',
    'perplexity': 'Perplexity'
};

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
}, {
    name: '擴寫文章',
    value: '請幫我擴寫以下文章內容，使其更加詳細、豐富，並保持原有的語氣和風格。'
}, {
    name: '改寫文章',
    value: '請幫我改寫以下文章，使用不同的表達方式，但保持原意不變。'
}, {
    name: '修正錯字與文法',
    value: '請幫我檢查並修正以下內容的錯字、標點符號和文法錯誤，並提供修正後的完整內容。'
}, {
    name: '改寫郵件（專業版）',
    value: '請幫我將以下內容改寫成專業且禮貌的商業郵件格式。'
}, {
    name: '縮減文字量',
    value: '請幫我將以下內容精簡，保留核心重點，減少不必要的描述。'
}, {
    name: 'Code Review',
    value: 'Please review the following code and provide feedback on code quality, potential bugs, performance issues, and best practices. Suggest improvements where necessary.'
}, {
    name: '最佳化程式碼',
    value: 'Please optimize the following code for better performance, readability, and maintainability. Explain the changes you make.'
}, {
    name: '將 PRD 轉成 Spec',
    value: '請將以下產品需求文件（PRD）轉換為詳細的技術規格文件（Spec），包含系統架構、API 設計、資料模型等技術細節。'
}, {
    name: '整理會議記錄',
    value: '請幫我整理以下會議記錄，提取重點、決議事項、待辦事項，並以清晰的格式呈現。'
}, {
    name: '生成測試計畫',
    value: '請根據以下需求或功能描述，生成一份完整的測試計畫，包含測試範圍、測試案例、預期結果等。'
}, {
    name: '解析 PDF 並總結內容',
    value: '請幫我解析並總結這份文件的主要內容，提取關鍵資訊和重點摘要。'
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

// 監聽 AI 提供者選擇變更
const aiProviderSelect = document.getElementById('aiProvider');
const baseurlInput = document.getElementById('baseurl');

// 追蹤使用者是否手動修改過提示詞標題
let userModifiedSubject = false;
let lastAutoSubject = '';

aiProviderSelect.addEventListener('change', (evt) => {
    const selectedProvider = evt.target.value;
    const url = aiProviderUrls[selectedProvider];
    if (url) {
        baseurlInput.value = url;
    }
    // 自動填入提示詞標題（僅在使用者未手動修改時）
    const providerName = aiProviderNames[selectedProvider];
    if (providerName) {
        const currentSubject = firstForm.subject.value.trim();
        // 如果當前標題是空的，或者等於上一次自動設定的值，才更新
        if (!currentSubject || currentSubject === lastAutoSubject) {
            firstForm.subject.value = providerName;
            lastAutoSubject = providerName;
            userModifiedSubject = false;
        }
    }
    run();
});

// 監聽提示詞標題的手動修改
const subjectInput = document.getElementById('subject');
subjectInput.addEventListener('input', () => {
    // 如果使用者手動輸入，標記為已修改
    if (subjectInput.value !== lastAutoSubject) {
        userModifiedSubject = true;
    }
});

// 進階設定切換
const advancedToggle = document.getElementById('advancedToggle');
const advancedSettings = document.getElementById('advancedSettings');
let isAdvancedOpen = false;

advancedToggle.addEventListener('click', () => {
    isAdvancedOpen = !isAdvancedOpen;
    if (isAdvancedOpen) {
        advancedSettings.style.display = 'block';
        advancedToggle.textContent = '▲ 進階設定';
    } else {
        advancedSettings.style.display = 'none';
        advancedToggle.textContent = '▼ 進階設定';
    }
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
            element.value = localStorage.getItem(element.name) || ''
        }
    });

    // 初始化 AI 提供者選擇
    if (!firstForm.aiProvider.value) {
        firstForm.aiProvider.value = 'chatgpt';
    }
    
    // 如果沒有設定 baseurl，使用選中的 AI 提供者的預設 URL
    if (!firstForm.baseurl.value) {
        const selectedProvider = firstForm.aiProvider.value;
        firstForm.baseurl.value = aiProviderUrls[selectedProvider] || 'https://chatgpt.com/';
    }
    
    // 初始化 lastAutoSubject（如果標題等於當前提供者的預設名稱）
    const currentProvider = firstForm.aiProvider.value;
    const currentProviderName = aiProviderNames[currentProvider];
    if (firstForm.subject.value === currentProviderName) {
        lastAutoSubject = currentProviderName;
        userModifiedSubject = false;
    } else if (firstForm.subject.value) {
        userModifiedSubject = true;
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
                element.value = params.get(element.name) || ''
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

// 複製按鈕功能
const copyUrlBtn = document.getElementById('copyUrlBtn');
const copyMarkdownBtn = document.getElementById('copyMarkdownBtn');

// 通用複製函數，帶視覺回饋
function copyToClipboardWithFeedback(text, button) {
    const originalText = button.innerHTML;
    navigator.clipboard.writeText(text).then(() => {
        button.innerHTML = '✓ 已複製';
        button.classList.add('copied');
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        // 降級處理：使用已選取的文字
        try {
            document.execCommand("copy");
            button.innerHTML = '✓ 已複製';
            button.classList.add('copied');
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('複製失敗', err);
        }
    });
}

copyUrlBtn.addEventListener('click', function() {
    promptUrl.select();
    promptUrl.setSelectionRange(0, 99999);
    copyToClipboardWithFeedback(promptUrl.value, copyUrlBtn);
});

copyMarkdownBtn.addEventListener('click', function() {
    promptMarkdown.select();
    promptMarkdown.setSelectionRange(0, 99999);
    copyToClipboardWithFeedback(promptMarkdown.value, copyMarkdownBtn);
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
