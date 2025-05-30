/**
 * Tool-ify Localization Utilities
 * Common functions for handling translations across the site
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始隐藏页面内容，显示loading
    if (window.Loading && window.Loading.showForLocalization) {
        window.Loading.showForLocalization();
    } else {
        // 如果Loading组件未加载，隐藏内容的备用方案
        document.body.style.opacity = '0';
    }
    
    // Check for saved language preference or use browser language
    const savedLanguage = localStorage.getItem('language');
    const browserLanguage = navigator.language.split('-')[0];
    let activeLanguage = 'en'; // 默认为英语
    
    // 语言识别逻辑：
    // 1. 如果本地存储中有语言设置，优先使用
    if (savedLanguage) {
        activeLanguage = savedLanguage;
    } 
    // 2. 否则检查浏览器语言，如果支持则使用
    else if (['en', 'zh', 'es'].includes(browserLanguage)) {
        activeLanguage = browserLanguage;
        // 保存到本地存储，以便其他页面使用
        localStorage.setItem('language', activeLanguage);
    }
    // 3. 如果都不符合，使用默认的英语
    
    // 更新当前语言显示
    updateLanguageDisplay(activeLanguage);
    
    // 设置语言下拉菜单
    setupLanguageDropdown();
    
    // 加载翻译并应用
    loadTranslations(activeLanguage);
    
    /**
     * 更新顶部导航栏中的当前语言显示
     * @param {string} lang - 语言代码
     */
    function updateLanguageDisplay(lang) {
        const currentLanguage = document.getElementById('current-language');
        if (currentLanguage) {
            switch(lang) {
                case 'en':
                    currentLanguage.textContent = 'English';
                    break;
                case 'zh':
                    currentLanguage.textContent = '中文';
                    break;
                case 'es':
                    currentLanguage.textContent = 'Español';
                    break;
            }
        }
    }
    
    /**
     * 设置语言下拉菜单功能
     */
    function setupLanguageDropdown() {
        const languageToggle = document.getElementById('language-toggle');
        const languageDropdown = document.getElementById('language-dropdown');
        
        if (!languageToggle || !languageDropdown) return;
        
        // 切换下拉菜单显示/隐藏
        languageToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('active');
        });
        
        // 点击页面其他地方时关闭下拉菜单
        document.addEventListener('click', function() {
            languageDropdown.classList.remove('active');
        });
        
        // 处理语言选择
        const languageOptions = languageDropdown.querySelectorAll('a');
        languageOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const lang = this.getAttribute('data-lang');
                
                // 保存用户选择的语言到本地存储
                localStorage.setItem('language', lang);
                
                // 在切换语言前显示loading
                if (window.Loading && window.Loading.showForLocalization) {
                    window.Loading.showForLocalization();
                }
                
                // 延迟一点再重载页面，让loading显示出来
                setTimeout(() => {
                    // 立即重新加载页面以应用新语言
                    window.location.reload();
                }, 100);
            });
        });
    }
    
    /**
     * 加载翻译文件并应用翻译
     * @param {string} lang - 语言代码
     */
    function loadTranslations(lang) {
        fetch(`/locales/${lang}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load language file');
                }
                return response.json();
            })
            .then(translations => {
                // 根据当前页面应用翻译
                const pagePath = window.location.pathname;
                
                // 主页
                if (pagePath === '/' || pagePath.endsWith('index.html')) {
                    updateHomePageContent(translations);
                }
                // 联系页面
                else if (pagePath.includes('contact.html')) {
                    updateContactPageContent(translations);
                }
                // 隐私政策页面
                else if (pagePath.includes('privacy.html')) {
                    updatePrivacyPageContent(translations);
                }
                // 使用条款页面
                else if (pagePath.includes('terms.html')) {
                    updateTermsPageContent(translations);
                }
                // 工具页面
                else if (pagePath.includes('/tools/')) {
                    updateToolPageContent(translations);
                }
                
                // 所有页面通用元素
                updateFooter(translations);
                
                // 通用UI元素翻译（按钮、提示等）
                updateCommonUIElements(translations);
                
                // 保存全局翻译对象，以便JavaScript动态使用
                window.translations = translations;
                
                // 延迟一小段时间后显示内容，确保DOM已更新
                setTimeout(() => {
                    // 隐藏loading，显示已翻译的内容
                    if (window.Loading && window.Loading.hideForLocalization) {
                        window.Loading.hideForLocalization();
                    } else {
                        // 如果Loading组件未加载，显示内容的备用方案
                        document.body.style.opacity = '1';
                    }
                }, 200);
            })
            .catch(error => {
                console.error('Error loading language file:', error);
                // 如果加载失败且不是英语，尝试回退到英语
                if (lang !== 'en') {
                    console.log('Falling back to English');
                    localStorage.setItem('language', 'en');
                    loadTranslations('en');
                } else {
                    // 如果是英语也失败了，还是要隐藏loading
                    if (window.Loading && window.Loading.hideForLocalization) {
                        window.Loading.hideForLocalization();
                    } else {
                        document.body.style.opacity = '1';
                    }
                }
            });
    }
    
    /**
     * 更新主页内容的翻译
     * @param {Object} translations - 翻译数据
     */
    function updateHomePageContent(translations) {
        // 英雄区域
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');
        
        if (heroTitle) heroTitle.textContent = translations.hero.title;
        if (heroSubtitle) heroSubtitle.textContent = translations.hero.subtitle;
        
        // 分类标题
        const textToolsTitle = document.getElementById('text-tools-title');
        const imageToolsTitle = document.getElementById('image-tools-title');
        const devToolsTitle = document.getElementById('dev-tools-title');
        const utilityToolsTitle = document.getElementById('utility-tools-title');
        
        if (textToolsTitle) textToolsTitle.textContent = translations.categories.text;
        if (imageToolsTitle) imageToolsTitle.textContent = translations.categories.image;
        if (devToolsTitle) devToolsTitle.textContent = translations.categories.dev;
        if (utilityToolsTitle) utilityToolsTitle.textContent = translations.categories.utility;
        
        // 工具卡片
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach(card => {
            const toolLink = card.querySelector('h3 a');
            if (toolLink) {
                const toolPath = toolLink.getAttribute('href');
                const toolId = toolPath.split('/').pop().replace('.html', '');
                
                if (translations.tools[toolId]) {
                    toolLink.textContent = translations.tools[toolId].name;
                    const description = card.querySelector('p');
                    if (description && translations.tools[toolId].description) {
                        description.textContent = translations.tools[toolId].description;
                    }
                }
            }
        });
    }
    
    /**
     * 更新联系页面内容的翻译
     * @param {Object} translations - 翻译数据
     */
    function updateContactPageContent(translations) {
        // 页面标题和描述
        const pageTitle = document.getElementById('page-title');
        const pageDescription = document.getElementById('page-description');
        
        if (pageTitle) pageTitle.textContent = translations.contact.title;
        if (pageDescription) pageDescription.textContent = translations.contact.description;
        
        // 联系部分
        const contactHeading = document.getElementById('contact-heading');
        const contactIntro = document.getElementById('contact-intro');
        const responseTime = document.getElementById('response-time');
        
        if (contactHeading) contactHeading.textContent = translations.contact.contact_heading;
        if (contactIntro) contactIntro.textContent = translations.contact.contact_intro;
        if (responseTime) responseTime.textContent = translations.contact.response_time;
        
        // 关于部分
        const aboutHeading = document.getElementById('about-heading');
        const aboutText1 = document.getElementById('about-text1');
        const aboutText2 = document.getElementById('about-text2');
        
        if (aboutHeading) aboutHeading.textContent = translations.contact.about_heading;
        if (aboutText1) aboutText1.textContent = translations.contact.about_text1;
        if (aboutText2) aboutText2.textContent = translations.contact.about_text2;
    }
    
    /**
     * 更新隐私政策页面内容的翻译
     * @param {Object} translations - 翻译数据
     */
    function updatePrivacyPageContent(translations) {
        // 页面标题
        const pageTitle = document.getElementById('page-title');
        if (pageTitle && translations.privacy.title) {
            pageTitle.textContent = translations.privacy.title;
        }
        
        // 亮点框
        const highlightTitle = document.getElementById('privacy-highlight-title');
        const highlightText = document.getElementById('privacy-highlight-text');
        
        if (highlightTitle && translations.privacy.highlight_title) {
            highlightTitle.textContent = translations.privacy.highlight_title;
        }
        
        if (highlightText && translations.privacy.highlight_text) {
            highlightText.textContent = translations.privacy.highlight_text;
        }
        
        // 注意：完整实现时，所有其他隐私页面元素都需要 ID 和相应的翻译
    }
    
    /**
     * 更新使用条款页面内容的翻译
     * @param {Object} translations - 翻译数据
     */
    function updateTermsPageContent(translations) {
        // 页面标题
        const pageTitle = document.getElementById('page-title');
        if (pageTitle && translations.terms.title) {
            pageTitle.textContent = translations.terms.title;
        }
        
        // 亮点框
        const highlightTitle = document.getElementById('terms-highlight-title');
        const highlightText = document.getElementById('terms-highlight-text');
        
        if (highlightTitle && translations.terms.highlight_title) {
            highlightTitle.textContent = translations.terms.highlight_title;
        }
        
        if (highlightText && translations.terms.highlight_text) {
            highlightText.textContent = translations.terms.highlight_text;
        }
        
        // 注意：完整实现时，所有其他使用条款页面元素都需要 ID 和相应的翻译
    }
    
    /**
     * 更新工具页面内容的翻译
     * @param {Object} translations - 翻译数据
     */
    function updateToolPageContent(translations) {
        // 获取当前工具ID
        const pagePath = window.location.pathname;
        const toolId = pagePath.split('/').pop().replace('.html', '');
        
        // 更新页面标题和描述
        const toolTitle = document.getElementById('tool-title');
        const toolDescription = document.getElementById('tool-description');
        
        // 如果找到当前工具的翻译
        if (translations.tools[toolId]) {
            if (toolTitle) toolTitle.textContent = translations.tools[toolId].name;
            if (toolDescription) toolDescription.textContent = translations.tools[toolId].description;
            
            // 更新页面标题（浏览器选项卡）
            if (document.title.includes('|')) {
                const siteName = document.title.split('|').pop().trim();
                document.title = `${translations.tools[toolId].name} | ${siteName}`;
            }
        }
        
        // 返回链接
        const backText = document.getElementById('back-text');
        if (backText && translations.ui.back_to_tools) {
            backText.textContent = translations.ui.back_to_tools;
        }
        
        // 处理特定工具页面的额外翻译内容
        if (toolId === 'timer-stopwatch' && translations.timer_stopwatch) {
            updateTimerStopwatchContent(translations.timer_stopwatch);
        }
    }
    
    /**
     * 更新计时器和秒表页面的特定内容
     * @param {Object} translations - 计时器和秒表相关的翻译数据
     */
    function updateTimerStopwatchContent(translations) {
        // 关于工具的信息
        const aboutToolTitle = document.getElementById('about-tool-title');
        if (aboutToolTitle && translations.about_tool_title) {
            aboutToolTitle.textContent = translations.about_tool_title;
        }
        
        const aboutToolIntro = document.getElementById('about-tool-intro');
        if (aboutToolIntro && translations.about_tool_intro) {
            aboutToolIntro.textContent = translations.about_tool_intro;
        }
        
        // 计时器部分
        const aboutTimerTitle = document.getElementById('about-timer-title');
        if (aboutTimerTitle && translations.about_timer_title) {
            aboutTimerTitle.textContent = translations.about_timer_title;
        }
        
        const aboutTimerDesc = document.getElementById('about-timer-desc');
        if (aboutTimerDesc && translations.about_timer_desc) {
            aboutTimerDesc.textContent = translations.about_timer_desc;
        }
        
        // 计时器用途列表
        const aboutTimerUses = document.getElementById('about-timer-uses');
        if (aboutTimerUses && translations.about_timer_uses && Array.isArray(translations.about_timer_uses)) {
            // 清空当前内容
            aboutTimerUses.innerHTML = '';
            
            // 添加翻译后的列表项
            translations.about_timer_uses.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                aboutTimerUses.appendChild(li);
            });
        }
        
        const aboutTimerFeaturesIntro = document.getElementById('about-timer-features-intro');
        if (aboutTimerFeaturesIntro && translations.about_timer_features_intro) {
            aboutTimerFeaturesIntro.textContent = translations.about_timer_features_intro;
        }
        
        // 计时器功能列表
        const aboutTimerFeatures = document.getElementById('about-timer-features');
        if (aboutTimerFeatures && translations.about_timer_features && Array.isArray(translations.about_timer_features)) {
            // 清空当前内容
            aboutTimerFeatures.innerHTML = '';
            
            // 添加翻译后的列表项
            translations.about_timer_features.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                aboutTimerFeatures.appendChild(li);
            });
        }
        
        // 秒表部分
        const aboutStopwatchTitle = document.getElementById('about-stopwatch-title');
        if (aboutStopwatchTitle && translations.about_stopwatch_title) {
            aboutStopwatchTitle.textContent = translations.about_stopwatch_title;
        }
        
        const aboutStopwatchDesc = document.getElementById('about-stopwatch-desc');
        if (aboutStopwatchDesc && translations.about_stopwatch_desc) {
            aboutStopwatchDesc.textContent = translations.about_stopwatch_desc;
        }
        
        // 秒表用途列表
        const aboutStopwatchUses = document.getElementById('about-stopwatch-uses');
        if (aboutStopwatchUses && translations.about_stopwatch_uses && Array.isArray(translations.about_stopwatch_uses)) {
            // 清空当前内容
            aboutStopwatchUses.innerHTML = '';
            
            // 添加翻译后的列表项
            translations.about_stopwatch_uses.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                aboutStopwatchUses.appendChild(li);
            });
        }
        
        const aboutStopwatchFeaturesIntro = document.getElementById('about-stopwatch-features-intro');
        if (aboutStopwatchFeaturesIntro && translations.about_stopwatch_features_intro) {
            aboutStopwatchFeaturesIntro.textContent = translations.about_stopwatch_features_intro;
        }
        
        // 秒表功能列表
        const aboutStopwatchFeatures = document.getElementById('about-stopwatch-features');
        if (aboutStopwatchFeatures && translations.about_stopwatch_features && Array.isArray(translations.about_stopwatch_features)) {
            // 清空当前内容
            aboutStopwatchFeatures.innerHTML = '';
            
            // 添加翻译后的列表项
            translations.about_stopwatch_features.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                aboutStopwatchFeatures.appendChild(li);
            });
        }
    }
    
    /**
     * 更新页脚内容的翻译
     * @param {Object} translations - 翻译数据
     */
    function updateFooter(translations) {
        // 版权信息
        const footerCopyright = document.querySelector('.footer-section p');
        if (footerCopyright && translations.footer.copyright) {
            footerCopyright.textContent = translations.footer.copyright;
        }
        
        // 页脚链接
        const footerLinks = document.querySelectorAll('.footer-links a');
        footerLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href.includes('contact.html') && translations.footer.contact) {
                link.textContent = translations.footer.contact;
            } else if (href.includes('privacy.html') && translations.footer.privacy) {
                link.textContent = translations.footer.privacy;
            } else if (href.includes('terms.html') && translations.footer.terms) {
                link.textContent = translations.footer.terms;
            }
        });
    }
    
    /**
     * 更新通用UI元素的翻译（按钮、提示文本等）
     * @param {Object} translations - 翻译数据
     */
    function updateCommonUIElements(translations) {
        // 只有在ui部分存在时才继续
        if (!translations.ui) return;
        
        // 翻译按钮文本
        translateButtonTexts(translations.ui);
        
        // 翻译静态UI元素（标签、提示等）
        translateStaticUIElements(translations.ui);
        
        // 更新输入框占位符
        updatePlaceholders(translations.placeholders);
        
        // 为隐藏的通知文本元素提供翻译，供JS动态使用
        createHiddenTranslationElements(translations.notifications);
    }
    
    /**
     * 翻译页面上的按钮文本
     * @param {Object} uiTranslations - UI部分的翻译数据
     */
    function translateButtonTexts(uiTranslations) {
        // 复制按钮
        document.querySelectorAll('[id$="copy-btn"], [id*="copy-"]').forEach(btn => {
            if (btn.querySelector('span')) {
                const span = btn.querySelector('span');
                if (span && uiTranslations.copy) {
                    span.textContent = uiTranslations.copy;
                }
            } else if (uiTranslations.copy) {
                // 处理没有span子元素的按钮
                const icon = btn.querySelector('i');
                if (icon && btn.childNodes.length > 1) {
                    // 按钮有图标和文本，查找并替换文本节点
                    for (let i = 0; i < btn.childNodes.length; i++) {
                        if (btn.childNodes[i].nodeType === 3 && btn.childNodes[i].textContent.trim()) {
                            btn.childNodes[i].textContent = ' ' + uiTranslations.copy;
                            break;
                        }
                    }
                } else if (!icon && btn.textContent.trim()) {
                    // 按钮只有文本，直接替换
                    btn.textContent = uiTranslations.copy;
                }
            }
        });
        
        // 清除按钮
        document.querySelectorAll('[id$="clear-btn"], [id*="clear-"]').forEach(btn => {
            if (btn.querySelector('span')) {
                const span = btn.querySelector('span');
                if (span && uiTranslations.clear) {
                    span.textContent = uiTranslations.clear;
                }
            } else if (uiTranslations.clear) {
                // 处理没有span子元素的按钮
                const icon = btn.querySelector('i');
                if (icon && btn.childNodes.length > 1) {
                    // 按钮有图标和文本，查找并替换文本节点
                    for (let i = 0; i < btn.childNodes.length; i++) {
                        if (btn.childNodes[i].nodeType === 3 && btn.childNodes[i].textContent.trim()) {
                            btn.childNodes[i].textContent = ' ' + uiTranslations.clear;
                            break;
                        }
                    }
                } else if (!icon && btn.textContent.trim()) {
                    // 按钮只有文本，直接替换
                    btn.textContent = uiTranslations.clear;
                }
            }
        });
        
        // 下载按钮
        document.querySelectorAll('[id$="download-btn"], [id*="download-"]').forEach(btn => {
            if (btn.querySelector('span')) {
                const span = btn.querySelector('span');
                if (span && uiTranslations.download) {
                    span.textContent = uiTranslations.download;
                }
            } else if (uiTranslations.download) {
                // 处理没有span子元素的按钮
                const icon = btn.querySelector('i');
                if (icon && btn.childNodes.length > 1) {
                    // 按钮有图标和文本，查找并替换文本节点
                    for (let i = 0; i < btn.childNodes.length; i++) {
                        if (btn.childNodes[i].nodeType === 3 && btn.childNodes[i].textContent.trim()) {
                            btn.childNodes[i].textContent = ' ' + uiTranslations.download;
                            break;
                        }
                    }
                } else if (!icon && btn.textContent.trim()) {
                    // 按钮只有文本，直接替换
                    btn.textContent = uiTranslations.download;
                }
            }
        });
        
        // 转换按钮
        document.querySelectorAll('[id$="convert-btn"], [id*="convert-"]').forEach(btn => {
            if (btn.querySelector('span')) {
                const span = btn.querySelector('span');
                if (span && uiTranslations.convert) {
                    span.textContent = uiTranslations.convert;
                }
            } else if (uiTranslations.convert) {
                // 处理没有span子元素的按钮
                const icon = btn.querySelector('i');
                if (icon && btn.childNodes.length > 1) {
                    // 按钮有图标和文本，查找并替换文本节点
                    for (let i = 0; i < btn.childNodes.length; i++) {
                        if (btn.childNodes[i].nodeType === 3 && btn.childNodes[i].textContent.trim()) {
                            btn.childNodes[i].textContent = ' ' + uiTranslations.convert;
                            break;
                        }
                    }
                } else if (!icon && btn.textContent.trim()) {
                    // 按钮只有文本，直接替换
                    btn.textContent = uiTranslations.convert;
                }
            }
        });
        
        // 生成按钮
        document.querySelectorAll('[id$="generate-btn"], [id*="generate-"]').forEach(btn => {
            if (btn.querySelector('span')) {
                const span = btn.querySelector('span');
                if (span && uiTranslations.generate) {
                    span.textContent = uiTranslations.generate;
                }
            } else if (uiTranslations.generate) {
                // 处理没有span子元素的按钮
                const icon = btn.querySelector('i');
                if (icon && btn.childNodes.length > 1) {
                    // 按钮有图标和文本，查找并替换文本节点
                    for (let i = 0; i < btn.childNodes.length; i++) {
                        if (btn.childNodes[i].nodeType === 3 && btn.childNodes[i].textContent.trim()) {
                            btn.childNodes[i].textContent = ' ' + uiTranslations.generate;
                            break;
                        }
                    }
                } else if (!icon && btn.textContent.trim()) {
                    // 按钮只有文本，直接替换
                    btn.textContent = uiTranslations.generate;
                }
            }
        });
        
        // 编码按钮
        document.querySelectorAll('[id$="encode-btn"], [id*="encode-"]').forEach(btn => {
            if (btn.querySelector('span')) {
                const span = btn.querySelector('span');
                if (span && uiTranslations.encode) {
                    span.textContent = uiTranslations.encode;
                }
            } else if (uiTranslations.encode) {
                // 处理没有span子元素的按钮
                const icon = btn.querySelector('i');
                if (icon && btn.childNodes.length > 1) {
                    // 按钮有图标和文本，查找并替换文本节点
                    for (let i = 0; i < btn.childNodes.length; i++) {
                        if (btn.childNodes[i].nodeType === 3 && btn.childNodes[i].textContent.trim()) {
                            btn.childNodes[i].textContent = ' ' + uiTranslations.encode;
                            break;
                        }
                    }
                } else if (!icon && btn.textContent.trim()) {
                    // 按钮只有文本，直接替换
                    btn.textContent = uiTranslations.encode;
                }
            }
        });
        
        // 解码按钮
        document.querySelectorAll('[id$="decode-btn"], [id*="decode-"]').forEach(btn => {
            if (btn.querySelector('span')) {
                const span = btn.querySelector('span');
                if (span && uiTranslations.decode) {
                    span.textContent = uiTranslations.decode;
                }
            } else if (uiTranslations.decode) {
                // 处理没有span子元素的按钮
                const icon = btn.querySelector('i');
                if (icon && btn.childNodes.length > 1) {
                    // 按钮有图标和文本，查找并替换文本节点
                    for (let i = 0; i < btn.childNodes.length; i++) {
                        if (btn.childNodes[i].nodeType === 3 && btn.childNodes[i].textContent.trim()) {
                            btn.childNodes[i].textContent = ' ' + uiTranslations.decode;
                            break;
                        }
                    }
                } else if (!icon && btn.textContent.trim()) {
                    // 按钮只有文本，直接替换
                    btn.textContent = uiTranslations.decode;
                }
            }
        });
        
        // 格式化按钮
        document.querySelectorAll('[id$="format-btn"], [id*="format-"]').forEach(btn => {
            if (btn.querySelector('span')) {
                const span = btn.querySelector('span');
                if (span && uiTranslations.format) {
                    span.textContent = uiTranslations.format;
                }
            } else if (uiTranslations.format) {
                // 处理没有span子元素的按钮
                const icon = btn.querySelector('i');
                if (icon && btn.childNodes.length > 1) {
                    // 按钮有图标和文本，查找并替换文本节点
                    for (let i = 0; i < btn.childNodes.length; i++) {
                        if (btn.childNodes[i].nodeType === 3 && btn.childNodes[i].textContent.trim()) {
                            btn.childNodes[i].textContent = ' ' + uiTranslations.format;
                            break;
                        }
                    }
                } else if (!icon && btn.textContent.trim()) {
                    // 按钮只有文本，直接替换
                    btn.textContent = uiTranslations.format;
                }
            }
        });
        
        // 重置按钮
        document.querySelectorAll('[id$="reset-btn"], [id*="reset-"]').forEach(btn => {
            if (btn.querySelector('span')) {
                const span = btn.querySelector('span');
                if (span && uiTranslations.reset) {
                    span.textContent = uiTranslations.reset;
                }
            } else if (uiTranslations.reset) {
                // 处理没有span子元素的按钮
                const icon = btn.querySelector('i');
                if (icon && btn.childNodes.length > 1) {
                    // 按钮有图标和文本，查找并替换文本节点
                    for (let i = 0; i < btn.childNodes.length; i++) {
                        if (btn.childNodes[i].nodeType === 3 && btn.childNodes[i].textContent.trim()) {
                            btn.childNodes[i].textContent = ' ' + uiTranslations.reset;
                            break;
                        }
                    }
                } else if (!icon && btn.textContent.trim()) {
                    // 按钮只有文本，直接替换
                    btn.textContent = uiTranslations.reset;
                }
            }
        });
        
        // 解析/分析按钮
        document.querySelectorAll('[id$="parse-btn"], [id*="parse-"]').forEach(btn => {
            if (btn.querySelector('span')) {
                const span = btn.querySelector('span');
                if (span && uiTranslations.parse) {
                    span.textContent = uiTranslations.parse;
                }
            } else if (uiTranslations.parse) {
                // 处理没有span子元素的按钮
                const icon = btn.querySelector('i');
                if (icon && btn.childNodes.length > 1) {
                    // 按钮有图标和文本，查找并替换文本节点
                    for (let i = 0; i < btn.childNodes.length; i++) {
                        if (btn.childNodes[i].nodeType === 3 && btn.childNodes[i].textContent.trim()) {
                            btn.childNodes[i].textContent = ' ' + uiTranslations.parse;
                            break;
                        }
                    }
                } else if (!icon && btn.textContent.trim()) {
                    // 按钮只有文本，直接替换
                    btn.textContent = uiTranslations.parse;
                }
            }
        });
        
        // 通用按钮文本替换
        // 扫描页面上的所有按钮，根据其文本内容匹配翻译
        document.querySelectorAll('button').forEach(btn => {
            const btnText = btn.textContent.trim().toLowerCase();
            
            // 匹配常见按钮文本
            if (btnText === 'start' && uiTranslations.start) {
                updateButtonText(btn, uiTranslations.start);
            } else if (btnText === 'pause' && uiTranslations.pause) {
                updateButtonText(btn, uiTranslations.pause);
            } else if (btnText === 'resume' && uiTranslations.resume) {
                updateButtonText(btn, uiTranslations.resume);
            } else if (btnText === 'stop' && uiTranslations.stop) {
                updateButtonText(btn, uiTranslations.stop);
            } else if (btnText === 'apply' && uiTranslations.apply) {
                updateButtonText(btn, uiTranslations.apply);
            } else if (btnText === 'cancel' && uiTranslations.cancel) {
                updateButtonText(btn, uiTranslations.cancel);
            } else if (btnText === 'save' && uiTranslations.save) {
                updateButtonText(btn, uiTranslations.save);
            }
        });
    }
    
    /**
     * 更新按钮文本，保留图标
     * @param {HTMLElement} button - 按钮元素
     * @param {string} newText - 新的按钮文本
     */
    function updateButtonText(button, newText) {
        const icon = button.querySelector('i');
        if (icon) {
            // 保留图标，替换文本
            const iconHtml = icon.outerHTML;
            button.innerHTML = iconHtml + ' ' + newText;
        } else {
            // 没有图标，直接替换文本
            button.textContent = newText;
        }
    }
    
    /**
     * 翻译静态UI元素（标签、提示等）
     * @param {Object} uiTranslations - UI部分的翻译数据
     */
    function translateStaticUIElements(uiTranslations) {
        // 通用标签和文本，通过ID查找和翻译
        
        // 标签页
        const encodeTab = document.getElementById('encode-tab');
        if (encodeTab && uiTranslations.encode_url) {
            encodeTab.textContent = uiTranslations.encode_url;
        }
        
        const decodeTab = document.getElementById('decode-tab');
        if (decodeTab && uiTranslations.decode_url) {
            decodeTab.textContent = uiTranslations.decode_url;
        }
        
        const parserTab = document.getElementById('parser-tab');
        if (parserTab && uiTranslations.url_parser) {
            parserTab.textContent = uiTranslations.url_parser;
        }
        
        // 编码选项标签
        const encodeComponentLabel = document.getElementById('encode-component-label');
        if (encodeComponentLabel && uiTranslations.encode_component_label) {
            encodeComponentLabel.textContent = uiTranslations.encode_component_label;
        }
        
        const encodeUriLabel = document.getElementById('encode-uri-label');
        if (encodeUriLabel && uiTranslations.encode_uri_label) {
            encodeUriLabel.textContent = uiTranslations.encode_uri_label;
        }
        
        // 解码选项标签
        const decodeComponentLabel = document.getElementById('decode-component-label');
        if (decodeComponentLabel && uiTranslations.decode_component_label) {
            decodeComponentLabel.textContent = uiTranslations.decode_component_label;
        }
        
        const decodeUriLabel = document.getElementById('decode-uri-label');
        if (decodeUriLabel && uiTranslations.decode_uri_label) {
            decodeUriLabel.textContent = uiTranslations.decode_uri_label;
        }
        
        // URL解析器标签
        const protocolLabel = document.getElementById('protocol-label');
        if (protocolLabel && uiTranslations.protocol_label) {
            protocolLabel.textContent = uiTranslations.protocol_label;
        }
        
        const hostnameLabel = document.getElementById('hostname-label');
        if (hostnameLabel && uiTranslations.hostname_label) {
            hostnameLabel.textContent = uiTranslations.hostname_label;
        }
        
        const portLabel = document.getElementById('port-label');
        if (portLabel && uiTranslations.port_label) {
            portLabel.textContent = uiTranslations.port_label;
        }
        
        const pathnameLabel = document.getElementById('pathname-label');
        if (pathnameLabel && uiTranslations.pathname_label) {
            pathnameLabel.textContent = uiTranslations.pathname_label;
        }
        
        const parametersLabel = document.getElementById('parameters-label');
        if (parametersLabel && uiTranslations.parameters_label) {
            parametersLabel.textContent = uiTranslations.parameters_label;
        }
        
        const hashLabel = document.getElementById('hash-label');
        if (hashLabel && uiTranslations.hash_label) {
            hashLabel.textContent = uiTranslations.hash_label;
        }
        
        // 计时器和秒表页面标签
        const timerTab = document.querySelector('.tab[data-tab="timer"]');
        if (timerTab && uiTranslations.timer) {
            timerTab.textContent = uiTranslations.timer;
        }
        
        const stopwatchTab = document.querySelector('.tab[data-tab="stopwatch"]');
        if (stopwatchTab && uiTranslations.stopwatch) {
            stopwatchTab.textContent = uiTranslations.stopwatch;
        }
        
        const hoursLabel = document.querySelector('label[for="hours"]');
        if (hoursLabel && uiTranslations.hours) {
            hoursLabel.textContent = uiTranslations.hours;
        }
        
        const minutesLabel = document.querySelector('label[for="minutes"]');
        if (minutesLabel && uiTranslations.minutes) {
            minutesLabel.textContent = uiTranslations.minutes;
        }
        
        const secondsLabel = document.querySelector('label[for="seconds"]');
        if (secondsLabel && uiTranslations.seconds) {
            secondsLabel.textContent = uiTranslations.seconds;
        }
        
        const lapsTitle = document.querySelector('.lap-title');
        if (lapsTitle && lapsTitle.firstChild && lapsTitle.firstChild.nodeType === 3 && uiTranslations.laps) {
            lapsTitle.firstChild.textContent = uiTranslations.laps;
        }
        
        const clearLapsBtn = document.getElementById('clear-laps');
        if (clearLapsBtn && uiTranslations.clear_laps) {
            // 保留图标
            const icon = clearLapsBtn.querySelector('i');
            if (icon) {
                clearLapsBtn.innerHTML = icon.outerHTML + ' ' + uiTranslations.clear_laps;
            } else {
                clearLapsBtn.textContent = uiTranslations.clear_laps;
            }
        }
        
        const emptyLaps = document.querySelector('.empty-laps');
        if (emptyLaps && uiTranslations.no_laps) {
            emptyLaps.textContent = uiTranslations.no_laps;
        }
        
        // 通用标签
        const formatLabel = document.getElementById('output-format-label');
        if (formatLabel && uiTranslations.output_format) {
            formatLabel.textContent = uiTranslations.output_format;
        }
        
        const qualityLabel = document.getElementById('quality-label');
        if (qualityLabel && uiTranslations.quality) {
            qualityLabel.textContent = uiTranslations.quality;
        }
        
        const originalImageLabel = document.getElementById('original-image-label');
        if (originalImageLabel && uiTranslations.original_image) {
            originalImageLabel.textContent = uiTranslations.original_image;
        }
        
        const convertedImageLabel = document.getElementById('converted-image-label');
        if (convertedImageLabel && uiTranslations.converted_image) {
            convertedImageLabel.textContent = uiTranslations.converted_image;
        }
        
        const dragDropText = document.getElementById('drag-drop-text');
        if (dragDropText && uiTranslations.drag_drop) {
            dragDropText.textContent = uiTranslations.drag_drop;
        }
        
        const resultLabel = document.getElementById('result-label');
        if (resultLabel && uiTranslations.result) {
            resultLabel.textContent = uiTranslations.result;
        }
        
        // 计时器预设按钮
        const preset1min = document.getElementById('preset-1min');
        if (preset1min && uiTranslations.preset_1min) {
            preset1min.textContent = uiTranslations.preset_1min;
        }
        
        const preset5min = document.getElementById('preset-5min');
        if (preset5min && uiTranslations.preset_5min) {
            preset5min.textContent = uiTranslations.preset_5min;
        }
        
        const preset10min = document.getElementById('preset-10min');
        if (preset10min && uiTranslations.preset_10min) {
            preset10min.textContent = uiTranslations.preset_10min;
        }
        
        const preset30min = document.getElementById('preset-30min');
        if (preset30min && uiTranslations.preset_30min) {
            preset30min.textContent = uiTranslations.preset_30min;
        }
        
        const preset1hour = document.getElementById('preset-1hour');
        if (preset1hour && uiTranslations.preset_1hour) {
            preset1hour.textContent = uiTranslations.preset_1hour;
        }
        
        // 声音选项文本
        const soundOptionText = document.getElementById('sound-option-text');
        if (soundOptionText && uiTranslations.sound_option_text) {
            soundOptionText.textContent = uiTranslations.sound_option_text;
        }
        
        // 时间显示标签
        const timerTimeLabel = document.getElementById('timer-time-label');
        if (timerTimeLabel && uiTranslations.timer_time_label) {
            timerTimeLabel.textContent = uiTranslations.timer_time_label;
        }
        
        const stopwatchTimeLabel = document.getElementById('stopwatch-time-label');
        if (stopwatchTimeLabel && uiTranslations.stopwatch_time_label) {
            stopwatchTimeLabel.textContent = uiTranslations.stopwatch_time_label;
        }
    }
    
    /**
     * 更新输入框占位符文本
     * @param {Object} placeholders - 占位符翻译数据
     */
    function updatePlaceholders(placeholders) {
        if (!placeholders) return;
        
        // 文本输入框
        document.querySelectorAll('textarea, input[type="text"]').forEach(input => {
            // 根据输入框ID判断类型并应用相应的占位符
            const id = input.id.toLowerCase();
            
            if (id === 'url-input' && placeholders.url_input) {
                input.placeholder = placeholders.url_input;
            }
            else if (id === 'encoded-output' && placeholders.encoded_output) {
                input.placeholder = placeholders.encoded_output;
            }
            else if (id === 'encoded-input' && placeholders.encoded_input) {
                input.placeholder = placeholders.encoded_input;
            }
            else if (id === 'decoded-output' && placeholders.decoded_output) {
                input.placeholder = placeholders.decoded_output;
            }
            else if (id === 'url-to-parse' && placeholders.url_to_parse) {
                input.placeholder = placeholders.url_to_parse;
            }
            else if (id.includes('text') && placeholders.enter_text) {
                input.placeholder = placeholders.enter_text;
            } 
            else if (id.includes('json') && placeholders.enter_json) {
                input.placeholder = placeholders.enter_json;
            }
            else if (id.includes('base64') && placeholders.enter_base64) {
                input.placeholder = placeholders.enter_base64;
            }
            else if (id.includes('url') && placeholders.enter_url) {
                input.placeholder = placeholders.enter_url;
            }
            else if (id.includes('result') && placeholders.result_placeholder) {
                input.placeholder = placeholders.result_placeholder;
            }
        });
    }
    
    /**
     * 创建隐藏的翻译元素，以便JavaScript可以动态使用
     * @param {Object} notifications - 通知翻译数据
     */
    function createHiddenTranslationElements(notifications) {
        if (!notifications) return;
        
        // 检查是否已有隐藏翻译容器
        let hiddenTranslations = document.getElementById('hidden-translations');
        
        // 如果没有，创建一个
        if (!hiddenTranslations) {
            hiddenTranslations = document.createElement('div');
            hiddenTranslations.id = 'hidden-translations';
            hiddenTranslations.style.display = 'none';
            document.body.appendChild(hiddenTranslations);
        }
        
        // 清空当前内容
        hiddenTranslations.innerHTML = '';
        
        // 添加所有通知文本
        for (const [key, value] of Object.entries(notifications)) {
            const span = document.createElement('span');
            span.id = `notification-${key}`;
            span.textContent = value;
            hiddenTranslations.appendChild(span);
        }
        
        // 添加一些常用的UI文本
        if (window.translations && window.translations.ui) {
            const ui = window.translations.ui;
            for (const [key, value] of Object.entries(ui)) {
                const span = document.createElement('span');
                span.id = `ui-${key}`;
                span.textContent = value;
                hiddenTranslations.appendChild(span);
            }
        }
        
        // 覆盖原生的showNotification函数，使用翻译后的通知消息
        overrideShowNotificationFunction(notifications);
    }
    
    /**
     * 覆盖原生的showNotification函数，使用翻译后的通知消息
     * @param {Object} notifications - 通知翻译数据
     */
    function overrideShowNotificationFunction(notifications) {
        // 保存页面上的原始showNotification函数（如果存在）
        if (typeof window.originalShowNotification === 'undefined' && typeof window.showNotification === 'function') {
            window.originalShowNotification = window.showNotification;
        }
        
        // 创建一个新的showNotification函数，其中使用翻译文本
        window.showNotification = function(message, type) {
            // 尝试根据消息内容匹配翻译
            let translatedMessage = message;
            
            // 常见的通知消息映射到notifications中的键
            const messageMap = {
                'Copied to clipboard': 'copied_clipboard',
                'Nothing to copy': 'empty_input',
                'URL encoded successfully': 'conversion_success',
                'URL decoded successfully': 'conversion_success',
                'Please enter text to encode': 'text_required',
                'Please enter URL encoded text to decode': 'text_required',
                'Error encoding URL': 'operation_failed',
                'Error decoding URL': 'operation_failed',
                'URL parsed successfully': 'conversion_success',
                'Invalid URL': 'invalid_format',
                'Please enter a URL to parse': 'text_required',
                'Timer complete!': 'timer_complete',
                'Please select an image': 'file_required',
                'Image converted successfully': 'image_converted',
                'Image resized successfully': 'conversion_success',
                'Please enter a valid CSS': 'text_required',
                'CSS formatted successfully': 'conversion_success',
                'CSS minified successfully': 'conversion_success',
                'Password generated successfully': 'conversion_success',
                'UUID generated successfully': 'conversion_success',
                'Time converted successfully': 'conversion_success'
            };
            
            // 查找匹配的消息翻译
            const notificationKey = messageMap[message];
            if (notificationKey && notifications[notificationKey]) {
                translatedMessage = notifications[notificationKey];
            } else {
                // 尝试直接匹配
                for (const [key, value] of Object.entries(notifications)) {
                    if (message.toLowerCase().includes(key.replace(/_/g, ' '))) {
                        translatedMessage = value;
                        break;
                    }
                }
            }
            
            // 使用原始的showNotification函数，但使用翻译后的消息
            if (window.originalShowNotification) {
                window.originalShowNotification(translatedMessage, type);
            } else {
                // 如果没有原始函数，使用通用实现
                const notification = document.getElementById('notification');
                if (notification) {
                    notification.textContent = translatedMessage;
                    notification.className = 'notification ' + type;
                    notification.classList.add('show');
                    
                    setTimeout(() => {
                        notification.classList.remove('show');
                    }, 3000);
                }
            }
        };
    }
}); 