const elements = ["赛博朋克城市", "深海发光生物", "迷雾中的古堡", "机械动力装甲", "浮空岛屿"];

const displayArea = document.getElementById('display-area');
const btn = document.getElementById('generate-btn');

btn.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * elements.length);
    displayArea.innerText = elements[randomIndex];
    
    // 添加一点简单的动画效果
    displayArea.style.transform = "scale(1.1)";
    setTimeout(() => displayArea.style.transform = "scale(1)", 100);
});
