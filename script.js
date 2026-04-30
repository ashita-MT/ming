const configSelect = document.getElementById('config-select');
const categoryTitle = document.getElementById('category-title');
const displayArea = document.getElementById('display-area');
const btn = document.getElementById('generate-btn');

let currentData = []; // 存储当前分类的数据数组

/**
 * 方案 B 核心：加载 JSON 对象
 */
async function loadConfig(fileName) {
    try {
        // 在 GitHub Pages 部署后，这里的路径需要正确指向 configs 文件夹
        const response = await fetch(`./configs/${fileName}`);
        
        if (!response.ok) throw new Error('无法读取配置文件');
        
        const config = await response.json();
        
        // 1. 更新当前数据池
        currentData = config.data;
        
        // 2. 更新页面显示的分类标题 (从 JSON 的 title 字段读取)
        categoryTitle.innerText = config.title;
        
        // 3. 重置显示区
        displayArea.innerText = "已准备就绪";
        displayArea.style.color = "#94a3b8"; // 提示文字颜色浅一点
        
    } catch (error) {
        console.error('Error:', error);
        categoryTitle.innerText = "加载失败";
        displayArea.innerText = "请检查 configs 文件夹";
    }
}

// 抽取逻辑
btn.addEventListener('click', () => {
    if (currentData.length === 0) return;

    const randomIndex = Math.floor(Math.random() * currentData.length);
    const result = currentData[randomIndex];

    // 视觉反馈效果
    displayArea.style.opacity = '0';
    
    setTimeout(() => {
        displayArea.innerText = result;
        displayArea.style.color = "#1e293b";
        displayArea.style.opacity = '1';
        
        // 随机旋转一丁点，增加生动感
        const randomRotate = (Math.random() - 0.5) * 5;
        displayArea.style.transform = `rotate(${randomRotate}deg) scale(1.1)`;
        
        setTimeout(() => {
            displayArea.style.transform = `rotate(0deg) scale(1)`;
        }, 100);
    }, 150);
});

// 监听下拉框变化
configSelect.addEventListener('change', (e) => {
    loadConfig(e.target.value);
});

// 页面初始化时加载默认配置
loadConfig(configSelect.value);
