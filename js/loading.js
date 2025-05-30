/**
 * loading.js - 通用加载遮罩层组件
 * 无入侵式设计，只需引入此JS文件即可使用
 * 使用方法:
 * Loading.show() - 显示加载遮罩
 * Loading.hide() - 隐藏加载遮罩
 * Loading.showForLocalization() - 显示国际化专用遮罩（不透明背景）
 * Loading.hideForLocalization() - 隐藏国际化专用遮罩
 */

(function() {
    // 创建命名空间
    window.Loading = {};
    
    // 内部状态
    let loadingCount = 0;
    let localizationLoading = false;
    let loadingElement = null;
    
    /**
     * 创建loading元素和样式
     */
    function createLoadingElement() {
        // 如果已经创建过，直接返回
        if (loadingElement) return loadingElement;
        
        // 创建样式
        const style = document.createElement('style');
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s, visibility 0.3s;
            }
            
            .loading-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            .loading-overlay.localization {
                background-color: #ffffff;  /* 白色不透明背景 */
            }
            
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 5px solid rgba(0, 0, 0, 0.1);
                border-radius: 50%;
                border-top-color: #3498db;
                animation: spin 1s ease-in-out infinite;
            }
            
            .localization .loading-spinner {
                border-color: rgba(0, 0, 0, 0.1);
                border-top-color: #3498db;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            /* 添加淡入淡出页面内容的样式 */
            body.loading-localization > *:not(.loading-overlay) {
                opacity: 0;
                transition: opacity 0.5s;
            }
            
            body.loading-complete > *:not(.loading-overlay) {
                opacity: 1;
                transition: opacity 0.5s;
            }
        `;
        document.head.appendChild(style);
        
        // 创建遮罩层元素
        loadingElement = document.createElement('div');
        loadingElement.className = 'loading-overlay';
        
        // 创建加载动画
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        // 组装DOM
        loadingElement.appendChild(spinner);
        document.body.appendChild(loadingElement);
        
        return loadingElement;
    }
    
    /**
     * 显示加载中遮罩
     */
    window.Loading.show = function() {
        // 增加加载计数
        loadingCount++;
        
        // 确保元素已创建
        const element = createLoadingElement();
        
        // 显示loading
        element.classList.add('active');
        
        // 防止页面滚动
        document.body.style.overflow = 'hidden';
    };
    
    /**
     * 隐藏加载中遮罩
     */
    window.Loading.hide = function() {
        // 减少加载计数
        loadingCount = Math.max(0, loadingCount - 1);
        
        // 如果计数为0，隐藏loading
        if (loadingCount === 0 && loadingElement && !localizationLoading) {
            loadingElement.classList.remove('active');
            
            // 恢复页面滚动
            document.body.style.overflow = '';
        }
    };
    
    /**
     * 显示国际化专用加载遮罩
     * 使用不透明背景，防止用户看到未翻译的内容
     */
    window.Loading.showForLocalization = function() {
        localizationLoading = true;
        
        // 确保元素已创建
        const element = createLoadingElement();
        
        // 设置国际化专用样式
        element.classList.add('active', 'localization');
        
        // 设置body类，隐藏所有内容
        document.body.classList.add('loading-localization');
        
        // 防止页面滚动
        document.body.style.overflow = 'hidden';
    };
    
    /**
     * 隐藏国际化专用加载遮罩
     */
    window.Loading.hideForLocalization = function() {
        localizationLoading = false;
        
        // 设置body类，显示所有内容
        document.body.classList.remove('loading-localization');
        document.body.classList.add('loading-complete');
        
        // 如果没有其他loading，恢复页面滚动
        if (loadingCount === 0 && loadingElement) {
            loadingElement.classList.remove('active', 'localization');
            document.body.style.overflow = '';
        }
    };
    
    // 确保DOM加载完成后再初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createLoadingElement);
    } else {
        createLoadingElement();
    }
})(); 