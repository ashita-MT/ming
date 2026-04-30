/**
 * 完整的脚本逻辑
 * 包含：黑白模式切换、动态配置加载、随机元素抽取
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 元素获取 ---
    const themeToggle = document.getElementById('theme-toggle');
    const configSelect = document.getElementById('config-select');
    const categoryTitle = document.getElementById('category-title');
    const displayArea = document.getElementById('display-area');
    const btn = document.getElementById('generate-btn');

    let currentData = []; // 存储当前选中的随机池数据

    // --- 1. 黑白/深浅模式逻辑 ---
    
    // 初始化：检查本地存储[cite: 5]
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerText = '☀️';
    }

    // 切换按钮点击事件[cite: 5]
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        // 保存偏好到本地[cite: 5]
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // 更新图标：深色模式显示太阳（切回白天），浅色模式显示月亮（切回夜晚）[cite: 5]
        themeToggle.innerText = isDark ? '☀️' : '🌙';
    });


    // --- 2. 配置动态加载逻辑 ---

    /**
     * 初始化 App：读取 manifest 并填充下拉框
     */
    async function initApp() {
        try {
            // 步骤 A: 获取配置文件清单[cite: 1, 5]
            const manifestRes = await fetch('./configs/manifest.json');
            if (!manifestRes.ok) throw new Error(`无法获取清单文件 (${manifestRes.status})`);
            
            const fileNames = await manifestRes.json();
            
            // 步骤 B: 清空并填充下拉菜单[cite: 5]
            configSelect.innerHTML = '';

            // 遍历清单，获取每个文件的标题[cite: 5]
            for (const file of fileNames) {
                try {
                    const res = await fetch(`./configs/${file}`);
                    if (!res.ok) continue;
                    const config = await res.json();

                    const option = document.createElement('option');
                    option.value = file;
                    option.textContent = config.title; // 显示 JSON 里的中文标题[cite: 2, 5]
                    configSelect.appendChild(option);
                } catch (e) {
                    console.warn(`跳过损坏的配置文件: ${file}`, e);
                }
            }

            // 步骤 C: 默认加载第一个选项[cite: 5]
            if (configSelect.options.length > 0) {
                loadConfig(configSelect.value);
            } else {
                throw new Error('未发现有效的配置文件');
            }

        } catch (error) {
            console.error('初始化失败:', error);
            categoryTitle.innerText = "配置读取错误";
            displayArea.innerText = error.message;
        }
    }

    /**
     * 加载指定的 JSON 配置文件[cite: 5]
     */
    async function loadConfig(fileName) {
        try {
            const response = await fetch(`./configs/${fileName}`);
            if (!response.ok) throw new Error('读取数据失败');
            
            const config = await response.json();
            currentData = config.data; // 更新数据池[cite: 2, 5]
            categoryTitle.innerText = config.title; // 更新标题展示[cite: 2, 5]
            displayArea.innerText = "已就绪";
            displayArea.style.color = "var(--text-sub)";
        } catch (error) {
            console.error('加载配置失败:', error);
            displayArea.innerText = "文件加载失败";
        }
    }


    // --- 3. 抽取逻辑 ---

    btn.addEventListener('click', () => {
        if (!currentData || currentData.length === 0) {
            displayArea.innerText = "请先选择有效分类";
            return;
        }

        // 随机索引[cite: 5]
        const randomIndex = Math.floor(Math.random() * currentData.length);
        const result = currentData[randomIndex];

        // 视觉反馈
        displayArea.style.opacity = '0';
        
        setTimeout(() => {
            displayArea.innerText = result;
            displayArea.style.color = "var(--text-main)";
            displayArea.style.opacity = '1';
            
            // 微小的缩放动画[cite: 5]
            displayArea.style.transform = "scale(1.1)";
            setTimeout(() => {
                displayArea.style.transform = "scale(1)";
            }, 100);
        }, 100);
    });

    // 监听下拉菜单切换[cite: 5]
    configSelect.addEventListener('change', (e) => {
        loadConfig(e.target.value);
    });

    // 执行初始化
    initApp();
});
