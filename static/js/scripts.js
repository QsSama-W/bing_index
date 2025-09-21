// 更新时钟显示
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}

// 初始化时钟并每0.5秒更新
updateClock();
setInterval(updateClock, 500);

// 加载按钮数据
async function loadButtonData() {
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const buttonContainer = document.getElementById('button-container');
    
    try {
        // 显示加载状态
        loadingIndicator.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        buttonContainer.classList.add('hidden');
        
        const response = await fetch('buttons.json');
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态码: ${response.status}`);
        }
        
        const buttonData = await response.json();
        
        // 渲染按钮
        renderButtons(buttonData);
        
        // 显示按钮容器，隐藏加载状态
        buttonContainer.classList.remove('hidden');
        loadingIndicator.classList.add('hidden');
    } catch (error) {
        console.error('加载按钮数据时出错:', error);
        
        // 显示错误信息，隐藏加载状态
        errorMessage.classList.remove('hidden');
        loadingIndicator.classList.add('hidden');
        buttonContainer.classList.add('hidden');
    }
}

// 动态生成按钮网格
function renderButtons(buttonData) {
    const container = document.getElementById('button-container');
    container.innerHTML = ''; // 清空容器
    
    // 遍历按钮数据，创建每个按钮元素
    buttonData.forEach((button) => {
        const buttonElement = document.createElement('a');
        buttonElement.href = button.url;
        buttonElement.className = "btn-card";
        buttonElement.title = button.name;
        
        // 确定要使用的图标URL，不存在则使用默认图标
        const imageUrl = button.imageUrl ? button.imageUrl : './static/img/default_icon.svg';
        
        // 设置按钮内容
        buttonElement.innerHTML = `
            <img src="${imageUrl}" alt="${button.name}图标" class="btn-img">
            <span class="btn-name">${button.name}</span>
        `;
        
        container.appendChild(buttonElement);
    });
}

// 初始化主题切换功能
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;
    
    // 检查本地存储中的主题偏好或系统设置
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
        themeIcon.classList.remove('fa-moon-o');
        themeIcon.classList.add('fa-sun-o');
    } else {
        htmlElement.classList.remove('dark');
        themeIcon.classList.remove('fa-sun-o');
        themeIcon.classList.add('fa-moon-o');
    }
    
    // 手动切换主题
    themeToggle.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            // 切换到浅色模式
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun-o');
            themeIcon.classList.add('fa-moon-o');
        } else {
            // 切换到深色模式
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon-o');
            themeIcon.classList.add('fa-sun-o');
        }
        
        // 添加旋转动画效果
        themeIcon.classList.add('animate-spin');
        setTimeout(() => {
            themeIcon.classList.remove('animate-spin');
        }, 1000);
    });
}

// 禁用右键菜单
function disableRightClick() {
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // 阻止默认右键菜单
    }, false);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化主题切换
    initThemeToggle();
    
    // 加载按钮数据
    loadButtonData();
    
    // 绑定重试按钮事件
    document.getElementById('retry-button').addEventListener('click', loadButtonData);
    
    // 为按钮容器添加居中样式
    const buttonContainer = document.getElementById('button-container');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexWrap = 'wrap';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.alignItems = 'center';
    
    // 禁用右键菜单
    disableRightClick();
});
