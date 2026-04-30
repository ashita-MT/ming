const configSelect = document.getElementById('config-select');
const categoryTitle = document.getElementById('category-title');
const displayArea = document.getElementById('display-area');
const btn = document.getElementById('generate-btn');

let currentData = []; 

// 页面启动时的初始化流程
async function initApp() {
    try {
        // 1. 获取清单文件
        const manifestRes = await fetch('./configs/manifest.json');
        const fileNames = await manifestRes.json();

        // 2. 清空下拉菜单
        configSelect.innerHTML = '';

        // 3. 遍历文件名，动态获取每个配置的 Title
        for (const file of fileNames) {
            const res = await fetch(`./configs/${file}`);
            const config = await res.json();

            // 创建选项：value 存文件名，text 存 JSON 里的中文 title
            const option = document.createElement('option');
            option.value = file;
            option.textContent = config.title; 
            configSelect.appendChild(option);
        }

        // 4. 默认加载第一个分类
        if (fileNames.length > 0) {
            loadConfig(fileNames[0]);
        }

    } catch (error) {
        console.error('初始化失败:', error);
        categoryTitle.innerText = "配置读取错误";
    }
}

// 加载特定配置的数据
async function loadConfig(fileName) {
    const response = await fetch(`./configs/${fileName}`);
    const config = await response.json();
    currentData = config.data;
    categoryTitle.innerText = config.title;
    displayArea.innerText = "已就绪";
}

// 抽取逻辑
btn.addEventListener('click', () => {
    if (currentData.length === 0) return;
    const randomIndex = Math.floor(Math.random() * currentData.length);
    displayArea.innerText = currentData[randomIndex];
    
    // 简单的缩放动画
    displayArea.style.transform = "scale(1.1)";
    setTimeout(() => displayArea.style.transform = "scale(1)", 100);
});

// 切换分类监听
configSelect.addEventListener('change', (e) => {
    loadConfig(e.target.value);
});

// 确保 DOM 加载完成后再执行
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    
    // 主题初始化
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerText = '☀️';
    }

    // 主题切换
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.innerText = isDark ? '☀️' : '🌙';
    });

    initApp(); // 启动数据加载
});

async function initApp() {
    try {
        // 尝试获取清单
        const manifestRes = await fetch('./configs/manifest.json');
        if (!manifestRes.ok) throw new Error('无法找到 manifest.json');
        
        const fileNames = await manifestRes.json();
        const configSelect = document.getElementById('config-select');
        configSelect.innerHTML = '';

        for (const file of fileNames) {
            const res = await fetch(`./configs/${file}`);
            if (!res.ok) continue; // 跳过损坏的单个配置
            const config = await res.json();

            const option = document.createElement('option');
            option.value = file;
            option.textContent = config.title; 
            configSelect.appendChild(option);
        }

        if (fileNames.length > 0) {
            loadConfig(fileNames[0]);
        }
    } catch (error) {
        console.error('初始化失败:', error);
        document.getElementById('category-title').innerText = "配置加载失败: " + error.message;
    }
}

// 启动程序
initApp();
