// 时钟显示
function updateClock() {
    const now = new Date();
    
    // 获取年月日
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
    const day = String(now.getDate()).padStart(2, '0');
    
    // 获取时分秒
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // 格式化显示 年/月/日<br>时:分:秒（使用HTML换行）
    document.getElementById('clock').innerHTML = 
        `${year}/${month}/${day}<br>${hours}:${minutes}:${seconds}`;
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
    let isAutoMode = localStorage.getItem('themeMode') === 'auto';
    
    // 检查当前模式并设置初始图标
    updateIconAndTheme();
    
    // 自动模式下检查时间并更新主题
    function checkTimeAndUpdateTheme() {
        if (!isAutoMode) return;
        
        const hour = new Date().getHours();
        // 6点到18点为白天（浅色模式），其余时间为黑夜（深色模式）
        const isDayTime = hour >= 6 && hour < 18;
        
        if (isDayTime && !htmlElement.classList.contains('light')) {
            htmlElement.classList.add('light');
        } else if (!isDayTime && htmlElement.classList.contains('light')) {
            htmlElement.classList.remove('light');
        }
    }
    
    // 更新图标和主题
    function updateIconAndTheme() {
        if (isAutoMode) {
            // 自动模式
            themeIcon.classList.remove('fa-moon-o', 'fa-sun-o');
            themeIcon.classList.add('fa-adjust');
            checkTimeAndUpdateTheme();
        } else {
            // 手动模式 - 根据当前主题设置图标
            if (htmlElement.classList.contains('light')) {
                themeIcon.classList.remove('fa-moon-o', 'fa-adjust');
                themeIcon.classList.add('fa-sun-o');
            } else {
                themeIcon.classList.remove('fa-sun-o', 'fa-adjust');
                themeIcon.classList.add('fa-moon-o');
            }
        }
    }
    
    // 手动切换模式（自动 -> 浅色 -> 深色）
    themeToggle.addEventListener('click', () => {
        if (isAutoMode) {
            // 从自动模式切换到浅色模式
            isAutoMode = false;
            htmlElement.classList.add('light');
            localStorage.setItem('theme', 'light');
            localStorage.setItem('themeMode', 'manual');
        } else if (htmlElement.classList.contains('light')) {
            // 从浅色模式切换到深色模式
            htmlElement.classList.remove('light');
            localStorage.setItem('theme', 'dark');
            localStorage.setItem('themeMode', 'manual');
        } else {
            // 从深色模式切换到自动模式
            isAutoMode = true;
            localStorage.setItem('themeMode', 'auto');
        }
        
        // 添加旋转动画效果
        themeIcon.classList.add('animate-spin');
        setTimeout(() => {
            themeIcon.classList.remove('animate-spin');
        }, 1000);
        
        updateIconAndTheme();
    });
    
    // 每5分钟检查一次时间（在自动模式下）
    setInterval(() => {
        checkTimeAndUpdateTheme();
    }, 300000); 
    
    // 初始检查
    checkTimeAndUpdateTheme();
}



// 禁用右键菜单
function disableRightClick() {
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
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
