// 热门干货点击功能增强
(function() {
  'use strict';

  // 热门干货内容数据
  const hotTipsData = {
    '478呼吸法': {
      title: '478呼吸法',
      icon: '🌬️',
      description: '478呼吸法是一种简单有效的放松技巧，通过调节呼吸节奏来帮助身体放松、缓解焦虑、改善睡眠质量。',
      steps: [
        '用鼻子深深吸气4秒',
        '屏住呼吸7秒',
        '用嘴巴慢慢呼气8秒',
        '重复4-6次'
      ],
      benefits: ['缓解焦虑和压力', '改善睡眠质量', '降低心率', '提升专注力'],
      tips: '建议在安静的环境中练习，每天早晚各练习5分钟效果更佳。'
    },
    '宿舍拉伸操': {
      title: '宿舍拉伸操',
      icon: '🧘',
      description: '专为大学生设计的宿舍拉伸操，无需器械，随时随地都能做，帮助缓解久坐疲劳，改善体态。',
      steps: [
        '颈部拉伸：左右侧屈各保持30秒',
        '肩部拉伸：双手交叉上举，向两侧倾斜',
        '背部拉伸：坐姿，身体前倾，双手触地',
        '腿部拉伸：坐姿，一腿伸直，身体前倾',
        '腰部扭转：坐姿，双手扶膝，左右扭转'
      ],
      benefits: ['缓解颈椎疲劳', '改善圆肩驼背', '促进血液循环', '放松身心'],
      tips: '每次拉伸保持15-30秒，呼吸均匀，不要用力过猛。'
    },
    '熬夜修复指南': {
      title: '熬夜修复指南',
      icon: '🌙',
      description: '熬夜后如何快速恢复状态？这份指南告诉你如何通过饮食、作息和运动来修复熬夜带来的伤害。',
      steps: [
        '补充睡眠：中午午睡20-30分钟',
        '补充水分：多喝水，可加少量盐',
        '补充营养：吃富含维生素的食物',
        '适度运动：轻度有氧运动',
        '调整作息：当晚尽量早睡'
      ],
      benefits: ['快速恢复精力', '减轻疲劳感', '保护视力', '调节生物钟'],
      tips: '熬夜后避免喝咖啡和浓茶，以免加重身体负担。'
    }
  };

  // 添加点击样式
  const style = document.createElement('style');
  style.textContent = `
    /* 热门干货卡片点击效果 */
    .hot-tip-card {
      transition: all 0.2s ease !important;
    }

    .hot-tip-card:hover {
      transform: translateX(4px) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
    }

    .hot-tip-card:active {
      transform: scale(0.98) !important;
    }

    /* 详情弹窗样式 */
    .hot-tip-modal-overlay {
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
      animation: fadeIn 0.2s ease;
    }

    .hot-tip-modal {
      background: white;
      border-radius: 16px;
      width: 90%;
      max-width: 400px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;
    }

    .dark .hot-tip-modal {
      background: #1e293b;
    }

    .hot-tip-modal-header {
      padding: 20px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      background: white;
      border-radius: 16px 16px 0 0;
    }

    .dark .hot-tip-modal-header {
      background: #1e293b;
      border-bottom-color: #334155;
    }

    .hot-tip-modal-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      font-weight: bold;
      color: #1e293b;
    }

    .dark .hot-tip-modal-title {
      color: white;
    }

    .hot-tip-modal-close {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #f1f5f9;
      border: none;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .dark .hot-tip-modal-close {
      background: #334155;
      color: white;
    }

    .hot-tip-modal-close:hover {
      background: #e2e8f0;
    }

    .dark .hot-tip-modal-close:hover {
      background: #475569;
    }

    .hot-tip-modal-body {
      padding: 20px;
    }

    .hot-tip-description {
      color: #64748b;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .dark .hot-tip-description {
      color: #94a3b8;
    }

    .hot-tip-section {
      margin-bottom: 20px;
    }

    .hot-tip-section-title {
      font-size: 14px;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .dark .hot-tip-section-title {
      color: white;
    }

    .hot-tip-steps {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .hot-tip-step {
      padding: 10px 12px;
      background: #f8fafc;
      border-radius: 8px;
      margin-bottom: 8px;
      font-size: 13px;
      color: #475569;
      position: relative;
      padding-left: 28px;
    }

    .dark .hot-tip-step {
      background: #334155;
      color: #cbd5e1;
    }

    .hot-tip-step::before {
      content: '';
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      background: #f59e0b;
      border-radius: 50%;
    }

    .hot-tip-benefits {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .hot-tip-benefit {
      padding: 6px 12px;
      background: #dcfce7;
      border-radius: 20px;
      font-size: 12px;
      color: #166534;
    }

    .dark .hot-tip-benefit {
      background: rgba(22, 163, 74, 0.2);
      color: #86efac;
    }

    .hot-tip-tips {
      background: #fef3c7;
      padding: 12px;
      border-radius: 8px;
      font-size: 13px;
      color: #92400e;
      border-left: 4px solid #f59e0b;
    }

    .dark .hot-tip-tips {
      background: rgba(234, 179, 8, 0.1);
      color: #fde68a;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  document.head.appendChild(style);

  // 创建详情弹窗
  function createTipModal(data) {
    const modal = document.createElement('div');
    modal.className = 'hot-tip-modal-overlay';

    modal.innerHTML = `
      <div class="hot-tip-modal">
        <div class="hot-tip-modal-header">
          <div class="hot-tip-modal-title">
            <span>${data.icon}</span>
            <span>${data.title}</span>
          </div>
          <button class="hot-tip-modal-close" onclick="this.closest('.hot-tip-modal-overlay').remove()">×</button>
        </div>
        <div class="hot-tip-modal-body">
          <p class="hot-tip-description">${data.description}</p>

          <div class="hot-tip-section">
            <div class="hot-tip-section-title">📋 操作步骤</div>
            <ul class="hot-tip-steps">
              ${data.steps.map(step => `<li class="hot-tip-step">${step}</li>`).join('')}
            </ul>
          </div>

          <div class="hot-tip-section">
            <div class="hot-tip-section-title">✨ 主要功效</div>
            <div class="hot-tip-benefits">
              ${data.benefits.map(benefit => `<span class="hot-tip-benefit">${benefit}</span>`).join('')}
            </div>
          </div>

          <div class="hot-tip-section">
            <div class="hot-tip-tips">💡 ${data.tips}</div>
          </div>
        </div>
      </div>
    `;

    // 点击遮罩关闭
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });

    return modal;
  }

  // 为热门干货卡片添加点击事件
  function addHotTipClickHandlers() {
    // 查找所有section
    const sections = document.querySelectorAll('section');

    let foundSection = null;
    sections.forEach(sec => {
      const headings = sec.querySelectorAll('h2');
      headings.forEach(h2 => {
        if (h2.textContent.includes('热门干货')) {
          foundSection = sec;
        }
      });
    });

    if (!foundSection) return;

    setupSection(foundSection);
  }

  function setupSection(section) {
    const cards = section.querySelectorAll('.bg-white.dark\\:bg-gray-800.rounded-xl.p-4');
    if (cards.length === 0) return;

    cards.forEach(card => {
      // 检查是否已经添加过点击事件
      if (card.classList.contains('hot-tip-clickable')) return;
      card.classList.add('hot-tip-clickable', 'hot-tip-card');

      // 获取标题文本
      const titleEl = card.querySelector('.font-medium');
      if (!titleEl) return;

      const title = titleEl.textContent.trim();
      const data = hotTipsData[title];

      if (data) {
        card.addEventListener('click', function() {
          const modal = createTipModal(data);
          document.body.appendChild(modal);
        });
      }
    });
  }

  // 监听页面变化
  function observeHotTips() {
    const observer = new MutationObserver(function() {
      addHotTipClickHandlers();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(addHotTipClickHandlers, 500);
    setTimeout(addHotTipClickHandlers, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeHotTips);
  } else {
    observeHotTips();
  }

  // 暴露全局方法
  window.addHotTipClickHandlers = addHotTipClickHandlers;
})();