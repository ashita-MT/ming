document.addEventListener('DOMContentLoaded', () => {
    const configSelect = document.getElementById('config-select');
    const categoryTitle = document.getElementById('category-title');
    const displayArea = document.getElementById('display-area');
    const btn = document.getElementById('generate-btn');

    let currentData = [];

    async function initApp() {
        try {
            // 获取清单文件[cite: 1, 5]
            const manifestRes = await fetch('./configs/manifest.json');
            if (!manifestRes.ok) throw new Error('无法读取 manifest.json');
            
            const fileNames = await manifestRes.json();
            configSelect.innerHTML = '';

            for (const file of fileNames) {
                try {
                    const res = await fetch(`./configs/${file}`);
                    if (!res.ok) continue;
                    const config = await res.json();

                    const option = document.createElement('option');
                    option.value = file;
                    option.textContent = config.title; // 显示 JSON 里的 title[cite: 2, 5]
                    configSelect.appendChild(option);
                } catch (e) {
                    console.warn('跳过配置:', file);
                }
            }

            if (configSelect.options.length > 0) {
                loadConfig(configSelect.value);
            }
        } catch (error) {
            console.error('初始化失败:', error);
            categoryTitle.innerText = "配置读取错误";
            displayArea.innerText = "请检查 configs 文件夹路径";
        }
    }

    async function loadConfig(fileName) {
        try {
            const response = await fetch(`./configs/${fileName}`);
            const config = await response.json();
            currentData = config.data; // 更新抽取池[cite: 2, 5]
            categoryTitle.innerText = config.title; // 更新标题[cite: 2, 5]
            displayArea.innerText = "就绪";
        } catch (error) {
            displayArea.innerText = "加载失败";
        }
    }

    btn.addEventListener('click', () => {
        if (currentData.length === 0) return;
        const randomIndex = Math.floor(Math.random() * currentData.length);
        displayArea.innerText = currentData[randomIndex];
    });

    configSelect.addEventListener('change', (e) => {
        loadConfig(e.target.value);
    });

    initApp();
});
