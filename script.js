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

// 启动程序
initApp();
