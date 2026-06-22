// 设置面板功能
(function() {
  'use strict';

  // 等待页面加载完成
  function initSettings() {
    // 深色模式切换
    const darkModeToggle = document.querySelector('.flex.items-center.justify-between.p-3.bg-slate-50.dark\\:bg-slate-700\\/50.rounded-lg .w-12.h-6.bg-slate-200.dark\\:bg-teal-500');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDarkMode();
      });
    }

    // 健康提醒切换
    const healthReminderToggle = document.querySelectorAll('.flex.items-center.justify-between.p-3.bg-slate-50.dark\\:bg-slate-700\\/50.rounded-lg .w-12.h-6')[1];
    if (healthReminderToggle) {
      healthReminderToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleHealthReminder();
      });
    }

    // 关于医靠
    const aboutBtn = document.querySelectorAll('.flex.items-center.justify-between.p-3.bg-slate-50.dark\\:bg-slate-700\\/50.rounded-lg.cursor-pointer')[0];
    if (aboutBtn) {
      aboutBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showAboutModal();
      });
    }

    // 使用说明
    const helpBtn = document.querySelectorAll('.flex.items-center.justify-between.p-3.bg-slate-50.dark\\:bg-slate-700\\/50.rounded-lg.cursor-pointer')[1];
    if (helpBtn) {
      helpBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showHelpModal();
      });
    }

    // 意见反馈
    const feedbackBtn = document.querySelectorAll('.flex.items-center.justify-between.p-3.bg-slate-50.dark\\:bg-slate-700\\/50.rounded-lg.cursor-pointer')[2];
    if (feedbackBtn) {
      feedbackBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showFeedbackModal();
      });
    }

    // 添加登录注册按钮
    addLoginButton();
  }

  // 深色模式切换
  function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    } else {
      html.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    }
    
    // 更新开关状态
    updateToggleUI();
  }

  // 健康提醒切换
  function toggleHealthReminder() {
    const isEnabled = localStorage.getItem('healthReminder') === 'true';
    localStorage.setItem('healthReminder', (!isEnabled).toString());
    
    // 更新开关状态
    updateHealthReminderUI();
    
    // 显示提示
    showToast(!isEnabled ? '健康提醒已开启' : '健康提醒已关闭');
  }

  // 更新深色模式开关UI
  function updateToggleUI() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    const toggle = document.querySelector('.flex.items-center.justify-between.p-3.bg-slate-50.dark\\:bg-slate-700\\/50.rounded-lg .w-12.h-6.bg-slate-200.dark\\:bg-teal-500');
    if (toggle) {
      const knob = toggle.querySelector('div');
      if (isDark) {
        toggle.classList.remove('bg-slate-200');
        toggle.classList.add('bg-teal-500');
        knob.style.right = '4px';
        knob.style.left = 'auto';
      } else {
        toggle.classList.remove('bg-teal-500');
        toggle.classList.add('bg-slate-200');
        knob.style.left = '4px';
        knob.style.right = 'auto';
      }
    }
  }

  // 更新健康提醒开关UI
  function updateHealthReminderUI() {
    const isEnabled = localStorage.getItem('healthReminder') === 'true';
    const toggle = document.querySelectorAll('.flex.items-center.justify-between.p-3.bg-slate-50.dark\\:bg-slate-700\\/50.rounded-lg .w-12.h-6')[1];
    if (toggle) {
      const knob = toggle.querySelector('div');
      if (isEnabled) {
        toggle.classList.add('bg-teal-500');
        toggle.classList.remove('bg-slate-200');
        knob.style.right = '4px';
        knob.style.left = 'auto';
      } else {
        toggle.classList.remove('bg-teal-500');
        toggle.classList.add('bg-slate-200');
        knob.style.left = '4px';
        knob.style.right = 'auto';
      }
    }
  }

  // 显示关于医靠弹窗
  function showAboutModal() {
    const modal = createModal('关于医靠', `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 48px; margin-bottom: 16px;">🌿</div>
        <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">医靠</h3>
        <p style="color: #666; margin-bottom: 16px;">脆皮大学生的健康助手</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; text-align: left; font-size: 14px; line-height: 1.6;">
          <p><strong>版本：</strong>v1.0.0</p>
          <p><strong>开发者：</strong>医靠团队</p>
          <p><strong>简介：</strong>医靠是一款专为大学生设计的健康管理应用，结合中医智慧与现代科技，提供体质评估、AI舌诊、急救指南、健康养生、饮食指南、穴位按摩、情绪疗愈等全方位健康服务。</p>
        </div>
      </div>
    `);
    document.body.appendChild(modal);
  }

  // 显示使用说明弹窗
  function showHelpModal() {
    const modal = createModal('使用说明', `
      <div style="padding: 20px; font-size: 14px; line-height: 1.8;">
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">🏠 首页</h4>
          <p style="color: #666;">快速访问所有功能模块，获取健康资讯。</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">🔍 健康评估</h4>
          <p style="color: #666;">通过中医九种体质测评，了解您的体质类型。</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">👅 AI舌诊</h4>
          <p style="color: #666;">拍照分析舌象，获取健康状况评估。</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">🏥 急救指南</h4>
          <p style="color: #666;">突发不适时的应急处理方法。</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">🍵 健康养生</h4>
          <p style="color: #666;">适合大学生的轻养生方案和建议。</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">🥗 饮食指南</h4>
          <p style="color: #666;">根据体质推荐饮食搭配和食疗方案。</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">💆 穴位按摩</h4>
          <p style="color: #666;">常用穴位定位和按摩手法指导。</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">🌈 情绪疗愈</h4>
          <p style="color: #666;">冥想、呼吸调节等情绪管理技巧。</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="font-weight: bold; margin-bottom: 8px;">👤 个人中心</h4>
          <p style="color: #666;">查看健康记录、打卡记录和测评报告。</p>
        </div>
      </div>
    `);
    document.body.appendChild(modal);
  }

  // 显示意见反馈弹窗
  function showFeedbackModal() {
    const modal = createModal('意见反馈', `
      <div style="padding: 20px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: bold; margin-bottom: 8px;">反馈类型</label>
          <select id="feedbackType" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
            <option value="suggestion">功能建议</option>
            <option value="bug">问题反馈</option>
            <option value="content">内容纠错</option>
            <option value="other">其他</option>
          </select>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: bold; margin-bottom: 8px;">详细描述</label>
          <textarea id="feedbackContent" rows="4" placeholder="请详细描述您的建议或遇到的问题..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; resize: vertical;"></textarea>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: bold; margin-bottom: 8px;">联系方式（可选）</label>
          <input type="text" id="feedbackContact" placeholder="邮箱或手机号" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
        </div>
        <button onclick="submitFeedback()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #ff6b6b, #e74c3c); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer;">提交反馈</button>
      </div>
    `);
    document.body.appendChild(modal);
  }

  // 创建弹窗
  function createModal(title, content) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;
    
    modal.innerHTML = `
      <div style="background: white; border-radius: 16px; width: 90%; max-width: 500px; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
        <div style="padding: 16px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="font-size: 18px; font-weight: bold; margin: 0;">${title}</h3>
          <button onclick="this.closest('.modal-overlay').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">×</button>
        </div>
        <div class="modal-content">${content}</div>
      </div>
    `;
    
    modal.className = 'modal-overlay';
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    return modal;
  }

  // 提交反馈
  window.submitFeedback = function() {
    const type = document.getElementById('feedbackType').value;
    const content = document.getElementById('feedbackContent').value;
    const contact = document.getElementById('feedbackContact').value;
    
    if (!content.trim()) {
      showToast('请填写详细描述');
      return;
    }
    
    // 模拟提交
    console.log('反馈提交:', { type, content, contact });
    showToast('感谢您的反馈！我们会尽快处理。');
    
    // 关闭弹窗
    document.querySelector('.modal-overlay').remove();
  };

  // 显示提示
  function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10001;
      animation: fadeIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes fadeOut {
      from { opacity: 1; transform: translateX(-50%) translateY(0); }
      to { opacity: 0; transform: translateX(-50%) translateY(20px); }
    }
    .login-register-btn {
      padding: 6px 16px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    }
    .login-register-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }
    .login-register-btn:active {
      transform: scale(0.98);
    }
  `;
  document.head.appendChild(style);

  // 添加登录注册按钮到用户信息卡片
  function addLoginButton() {
    const userCard = document.querySelector('.bg-white.dark\\:bg-slate-800.rounded-2xl.shadow-lg.p-6.mb-6');
    if (!userCard) return;
    
    const existingBtn = userCard.querySelector('.login-register-btn');
    if (existingBtn) return;
    
    const flexContainer = userCard.querySelector('.flex.items-center.gap-4');
    if (!flexContainer) return;
    
    const loginBtn = document.createElement('button');
    loginBtn.className = 'login-register-btn';
    
    const isLoggedIn = checkLoginStatus();
    if (isLoggedIn) {
      loginBtn.textContent = '退出登录';
      loginBtn.onclick = createLogoutHandler(loginBtn);
    } else {
      loginBtn.textContent = '登录/注册';
      loginBtn.onclick = function(e) {
        e.stopPropagation();
        showLoginModal();
      };
    }
    
    flexContainer.appendChild(loginBtn);
    
    if (isLoggedIn) {
      const userName = userCard.querySelector('h1');
      if (userName) {
        userName.textContent = getLoggedInUser()?.nickname || '用户昵称';
      }
      const userDays = userCard.querySelector('p.text-slate-500');
      if (userDays) {
        userDays.textContent = '已登录';
      }
    }
  }

  function createLogoutHandler(btn) {
    return function(e) {
      e.stopPropagation();
      logout();
      showToast('已退出登录');
      btn.textContent = '登录/注册';
      btn.onclick = function(e) {
        e.stopPropagation();
        showLoginModal();
      };
      
      const userCard = document.querySelector('.bg-white.dark\\:bg-slate-800.rounded-2xl.shadow-lg.p-6.mb-6');
      if (userCard) {
        const userName = userCard.querySelector('h1');
        if (userName) {
          userName.textContent = '欢迎使用';
        }
        const userDays = userCard.querySelector('p.text-slate-500');
        if (userDays) {
          userDays.textContent = '已坚持打卡 0 天';
        }
      }
    };
  }

  function checkLoginStatus() {
    const user = localStorage.getItem('loggedInUser');
    return !!user;
  }

  function getLoggedInUser() {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  }

  function saveLoginStatus(user) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  function logout() {
    localStorage.removeItem('loggedInUser');
  }

  // 显示登录弹窗
  function showLoginModal() {
    const savedPhone = localStorage.getItem('loginPhone');
    const modal = createModal('登录/注册', `
      <div style="padding: 20px;">
        <div style="display: flex; gap: 12px; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 12px;">
          <button onclick="switchTab('login')" id="tabLogin" style="flex: 1; padding: 8px; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: bold; cursor: pointer;">登录</button>
          <button onclick="switchTab('register')" id="tabRegister" style="flex: 1; padding: 8px; background: #f5f5f5; color: #666; border: none; border-radius: 8px; font-size: 14px; font-weight: bold; cursor: pointer;">注册</button>
        </div>
        
        <div id="loginForm">
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: bold; margin-bottom: 8px;">手机号</label>
            <input type="tel" id="loginPhone" placeholder="请输入手机号" value="${savedPhone || ''}" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: bold; margin-bottom: 8px;">密码</label>
            <input type="password" id="loginPassword" placeholder="请输入密码" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <label style="display: flex; align-items: center; gap: 6px; font-size: 14px; color: #666;">
              <input type="checkbox" id="rememberMe" ${savedPhone ? 'checked' : ''}> 记住我
            </label>
            <a href="#" onclick="showForgotPassword()" style="color: #10b981; font-size: 14px; text-decoration: none;">忘记密码?</a>
          </div>
          <button onclick="handleLogin()" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer;">登录</button>
          <div style="margin-top: 16px; text-align: center;">
            <p style="color: #666; font-size: 14px;">其他登录方式</p>
            <div style="display: flex; justify-content: center; gap: 16px; margin-top: 12px;">
              <button onclick="handleWechatLogin()" style="width: 40px; height: 40px; border-radius: 50%; background: #f5f5f5; border: none; font-size: 20px; cursor: pointer; transition: all 0.2s ease;">📱</button>
              <button onclick="handleEmailLogin()" style="width: 40px; height: 40px; border-radius: 50%; background: #f5f5f5; border: none; font-size: 20px; cursor: pointer; transition: all 0.2s ease;">📧</button>
            </div>
          </div>
        </div>
        
        <div id="registerForm" style="display: none;">
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: bold; margin-bottom: 8px;">手机号</label>
            <input type="tel" id="registerPhone" placeholder="请输入手机号" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: bold; margin-bottom: 8px;">验证码</label>
            <div style="display: flex; gap: 10px;">
              <input type="text" id="registerCode" placeholder="请输入验证码" style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
              <button onclick="sendCode()" id="sendCodeBtn" style="padding: 12px 20px; background: #f5f5f5; color: #666; border: none; border-radius: 8px; font-size: 14px; cursor: pointer;">获取验证码</button>
            </div>
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: bold; margin-bottom: 8px;">密码</label>
            <input type="password" id="registerPassword" placeholder="请设置密码" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
          </div>
          <div style="margin-bottom: 20px;">
            <label style="display: flex; align-items: center; gap: 6px; font-size: 14px; color: #666;">
              <input type="checkbox" id="agreeTerms"> 我已阅读并同意<a href="#" style="color: #10b981;">《用户协议》</a>和<a href="#" style="color: #10b981;">《隐私政策》</a>
            </label>
          </div>
          <button onclick="handleRegister()" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer;">注册</button>
        </div>
      </div>
    `);
    document.body.appendChild(modal);
  }

  // 切换登录/注册标签
  window.switchTab = function(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    
    if (tab === 'login') {
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      tabLogin.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      tabLogin.style.color = 'white';
      tabRegister.style.background = '#f5f5f5';
      tabRegister.style.color = '#666';
    } else {
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      tabLogin.style.background = '#f5f5f5';
      tabLogin.style.color = '#666';
      tabRegister.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      tabRegister.style.color = 'white';
    }
  };

  // 发送验证码
  let currentCode = '';
  
  window.sendCode = function() {
    const phone = document.getElementById('registerPhone').value;
    const btn = document.getElementById('sendCodeBtn');
    
    if (!phone) {
      showToast('请输入手机号');
      return;
    }
    
    btn.disabled = true;
    btn.textContent = '发送中...';
    
    setTimeout(() => {
      btn.textContent = '60s后重发';
      let countdown = 60;
      const timer = setInterval(() => {
        countdown--;
        btn.textContent = countdown + 's后重发';
        if (countdown <= 0) {
          clearInterval(timer);
          btn.disabled = false;
          btn.textContent = '获取验证码';
        }
      }, 1000);
      
      // 生成随机验证码（4位数字）
      currentCode = Math.floor(1000 + Math.random() * 9000).toString();
      // 在Toast中显示验证码
      showToast('验证码：' + currentCode);
    }, 1000);
  };

  // 处理登录
  window.handleLogin = function() {
    const phone = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!phone) {
      showToast('请输入手机号');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast('请输入正确的手机号');
      return;
    }
    if (!password) {
      showToast('请输入密码');
      return;
    }
    if (password.length < 6) {
      showToast('密码长度不能少于6位');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('loginPhone', phone);
    } else {
      localStorage.removeItem('loginPhone');
    }

    const users = getUsers();
    const user = users.find(u => u.phone === phone && u.password === password);
    
    if (user) {
      saveLoginStatus({
        phone: user.phone,
        nickname: user.nickname,
        createdAt: user.createdAt
      });
      showToast('登录成功！');
      document.querySelector('.modal-overlay').remove();
      updateUserCard();
    } else {
      showToast('手机号或密码错误');
    }
  };

  // 处理微信登录
  window.handleWechatLogin = function() {
    showToast('微信登录功能开发中...');
  };

  // 处理邮箱登录
  window.handleEmailLogin = function() {
    showToast('邮箱登录功能开发中...');
  };

  // 处理注册
  window.handleRegister = function() {
    const phone = document.getElementById('registerPhone').value;
    const code = document.getElementById('registerCode').value;
    const password = document.getElementById('registerPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    if (!phone) {
      showToast('请输入手机号');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast('请输入正确的手机号');
      return;
    }
    if (!code) {
      showToast('请输入验证码');
      return;
    }
    if (code !== currentCode) {
      showToast('验证码错误');
      return;
    }
    if (!password) {
      showToast('请设置密码');
      return;
    }
    if (password.length < 6) {
      showToast('密码长度不能少于6位');
      return;
    }
    if (!agreeTerms) {
      showToast('请阅读并同意用户协议和隐私政策');
      return;
    }

    const users = getUsers();
    const existingUser = users.find(u => u.phone === phone);
    
    if (existingUser) {
      showToast('该手机号已注册');
      return;
    }

    const newUser = {
      phone: phone,
      password: password,
      nickname: '用户' + phone.slice(-4),
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    saveLoginStatus({
      phone: newUser.phone,
      nickname: newUser.nickname,
      createdAt: newUser.createdAt
    });

    showToast('注册成功！');
    document.querySelector('.modal-overlay').remove();
    updateUserCard();
  };

  function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  // 显示忘记密码弹窗
  window.showForgotPassword = function() {
    const modal = createModal('忘记密码', `
      <div style="padding: 20px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: bold; margin-bottom: 8px;">手机号</label>
          <input type="tel" id="forgotPhone" placeholder="请输入手机号" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: bold; margin-bottom: 8px;">验证码</label>
          <div style="display: flex; gap: 10px;">
            <input type="text" id="forgotCode" placeholder="请输入验证码" style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
            <button onclick="sendForgotCode()" id="sendForgotCodeBtn" style="padding: 12px 20px; background: #f5f5f5; color: #666; border: none; border-radius: 8px; font-size: 14px; cursor: pointer;">获取验证码</button>
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-weight: bold; margin-bottom: 8px;">新密码</label>
          <input type="password" id="forgotPassword" placeholder="请设置新密码" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
        </div>
        <button onclick="handleForgotPassword()" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer;">重置密码</button>
      </div>
    `);
    document.body.appendChild(modal);
  };

  // 发送忘记密码验证码
  let forgotCode = '';
  
  window.sendForgotCode = function() {
    const phone = document.getElementById('forgotPhone').value;
    const btn = document.getElementById('sendForgotCodeBtn');
    
    if (!phone) {
      showToast('请输入手机号');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast('请输入正确的手机号');
      return;
    }
    
    btn.disabled = true;
    btn.textContent = '发送中...';
    
    setTimeout(() => {
      btn.textContent = '60s后重发';
      let countdown = 60;
      const timer = setInterval(() => {
        countdown--;
        btn.textContent = countdown + 's后重发';
        if (countdown <= 0) {
          clearInterval(timer);
          btn.disabled = false;
          btn.textContent = '获取验证码';
        }
      }, 1000);
      
      forgotCode = Math.floor(1000 + Math.random() * 9000).toString();
      showToast('验证码：' + forgotCode);
    }, 1000);
  };

  // 处理忘记密码
  window.handleForgotPassword = function() {
    const phone = document.getElementById('forgotPhone').value;
    const code = document.getElementById('forgotCode').value;
    const password = document.getElementById('forgotPassword').value;
    
    if (!phone) {
      showToast('请输入手机号');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast('请输入正确的手机号');
      return;
    }
    if (!code) {
      showToast('请输入验证码');
      return;
    }
    if (code !== forgotCode) {
      showToast('验证码错误');
      return;
    }
    if (!password) {
      showToast('请设置新密码');
      return;
    }
    if (password.length < 6) {
      showToast('密码长度不能少于6位');
      return;
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.phone === phone);
    
    if (userIndex === -1) {
      showToast('该手机号未注册');
      return;
    }
    
    users[userIndex].password = password;
    saveUsers(users);
    
    showToast('密码重置成功！');
    document.querySelector('.modal-overlay').remove();
  };

  // 更新用户卡片状态
  function updateUserCard() {
    const userCard = document.querySelector('.bg-white.dark\\:bg-slate-800.rounded-2xl.shadow-lg.p-6.mb-6');
    if (!userCard) return;

    const loginBtn = userCard.querySelector('.login-register-btn');
    if (loginBtn) {
      loginBtn.textContent = '退出登录';
      loginBtn.onclick = createLogoutHandler(loginBtn);
    }

    const userName = userCard.querySelector('h1');
    if (userName) {
      const user = getLoggedInUser();
      userName.textContent = user?.nickname || '用户昵称';
    }

    const userDays = userCard.querySelector('p.text-slate-500');
    if (userDays) {
      userDays.textContent = '已登录';
    }
  }

  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettings);
  } else {
    initSettings();
  }

  // 监听页面变化，处理动态加载的内容
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        initSettings();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();