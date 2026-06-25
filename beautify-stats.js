// 统计数据排版美化 - 直接修改现有元素
(function() {
  'use strict';

  // 添加美化样式
  const style = document.createElement('style');
  style.textContent = `
    /* 横向排列的统计容器 */
    .stats-row-container {
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      justify-content: space-around !important;
      align-items: stretch !important;
      gap: 8px !important;
      margin-top: 20px !important;
      padding-top: 20px !important;
      border-top: 1px solid #e2e8f0 !important;
      overflow-x: auto !important;
      padding-bottom: 6px !important;
    }

    .dark .stats-row-container {
      border-top-color: #334155 !important;
    }

    /* 统计卡片 - 横向排列 */
    .stats-row-card {
      flex: 1 !important;
      min-width: 70px !important;
      max-width: 100px !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 14px 8px !important;
      border-radius: 14px !important;
      background: white !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;
      transition: all 0.25s ease !important;
      cursor: pointer !important;
    }

    .stats-row-card:hover {
      transform: translateY(-3px) !important;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1) !important;
    }

    /* 卡片颜色主题 */
    .stats-row-card.favorites {
      background: linear-gradient(135deg, #fff5f5, #ffe4e6) !important;
    }

    .stats-row-card.favorites .stats-value {
      color: #e11d48 !important;
    }

    .stats-row-card.checkins {
      background: linear-gradient(135deg, #f0fdfa, #ccfbf1) !important;
    }

    .stats-row-card.checkins .stats-value {
      color: #0d9488 !important;
    }

    .stats-row-card.today {
      background: linear-gradient(135deg, #f0fdf4, #dcfce7) !important;
    }

    .stats-row-card.today .stats-value {
      color: #16a34a !important;
    }

    .stats-row-card.likes {
      background: linear-gradient(135deg, #fffbeb, #fef3c7) !important;
    }

    .stats-row-card.likes .stats-value {
      color: #d97706 !important;
    }

    .stats-row-card.constitution {
      background: linear-gradient(135deg, #f5f3ff, #ede9fe) !important;
    }

    .stats-row-card.constitution .stats-value {
      color: #7c3aed !important;
    }

    /* 统计数值 */
    .stats-value {
      font-size: 22px !important;
      font-weight: 700 !important;
      line-height: 1 !important;
      margin-bottom: 4px !important;
    }

    /* 统计标签 */
    .stats-label {
      font-size: 10px !important;
      color: #64748b !important;
      font-weight: 500 !important;
      letter-spacing: 0.3px !important;
    }

    /* 深色模式 */
    .dark .stats-row-card {
      background: rgba(51, 65, 85, 0.8) !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2) !important;
    }

    .dark .stats-row-card:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3) !important;
    }

    .dark .stats-row-card.favorites {
      background: linear-gradient(135deg, rgba(88, 28, 35, 0.7), rgba(69, 10, 10, 0.7)) !important;
    }

    .dark .stats-row-card.favorites .stats-value {
      color: #fb7185 !important;
    }

    .dark .stats-row-card.favorites .stats-label {
      color: #fda4af !important;
    }

    .dark .stats-row-card.checkins {
      background: linear-gradient(135deg, rgba(19, 78, 74, 0.7), rgba(6, 78, 59, 0.7)) !important;
    }

    .dark .stats-row-card.checkins .stats-value {
      color: #5eead4 !important;
    }

    .dark .stats-row-card.checkins .stats-label {
      color: #99f6e4 !important;
    }

    .dark .stats-row-card.today {
      background: linear-gradient(135deg, rgba(22, 101, 52, 0.7), rgba(21, 128, 61, 0.7)) !important;
    }

    .dark .stats-row-card.today .stats-value {
      color: #86efac !important;
    }

    .dark .stats-row-card.today .stats-label {
      color: #bbf7d0 !important;
    }

    .dark .stats-row-card.likes {
      background: linear-gradient(135deg, rgba(120, 53, 15, 0.7), rgba(124, 45, 18, 0.7)) !important;
    }

    .dark .stats-row-card.likes .stats-value {
      color: #fcd34d !important;
    }

    .dark .stats-row-card.likes .stats-label {
      color: #fde68a !important;
    }

    .dark .stats-row-card.constitution {
      background: linear-gradient(135deg, rgba(55, 48, 163, 0.7), rgba(67, 56, 202, 0.7)) !important;
    }

    .dark .stats-row-card.constitution .stats-value {
      color: #c4b5fd !important;
    }

    .dark .stats-row-card.constitution .stats-label {
      color: #ddd6fe !important;
    }

    .dark .stats-label {
      color: #94a3b8 !important;
    }

    /* 动画效果 */
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .stats-row-card {
      animation: slideIn 0.4s ease forwards;
    }

    .stats-row-card:nth-child(1) { animation-delay: 0.1s; }
    .stats-row-card:nth-child(2) { animation-delay: 0.15s; }
    .stats-row-card:nth-child(3) { animation-delay: 0.2s; }
    .stats-row-card:nth-child(4) { animation-delay: 0.25s; }
    .stats-row-card:nth-child(5) { animation-delay: 0.3s; }
  `;

  document.head.appendChild(style);

  // 美化统计数据区域
  function beautifyStatsContainer() {
    const container = document.querySelector('.grid.grid-cols-5.gap-2.mt-6.pt-6.border-t');
    if (!container) return;

    if (container.classList.contains('beautified-stats')) return;

    container.classList.add('beautified-stats');

    // 移除原来的grid布局类
    container.classList.remove('grid', 'grid-cols-5', 'gap-2', 'mt-6', 'pt-6');

    // 添加新的横向布局类
    container.classList.add('stats-row-container');

    // 获取所有子卡片
    const cards = container.querySelectorAll(':scope > div');
    if (cards.length !== 5) return;

    const cardTypes = ['favorites', 'checkins', 'today', 'likes', 'constitution'];

    cards.forEach((card, index) => {
      // 移除原有样式类
      card.className = '';

      // 添加新的卡片类
      card.classList.add('stats-row-card', cardTypes[index]);

      // 获取数值和标签
      const valueEl = card.querySelector('div:first-child');
      const labelEl = card.querySelector('div:last-child');

      if (valueEl) {
        valueEl.className = 'stats-value';
      }
      if (labelEl) {
        labelEl.className = 'stats-label';
      }
    });

    console.log('统计数据区域已横向排版美化');
  }

  // 监听页面变化
  function observeStatsContainer() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function() {
        beautifyStatsContainer();
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });

    setTimeout(beautifyStatsContainer, 300);
    setTimeout(beautifyStatsContainer, 800);
    setTimeout(beautifyStatsContainer, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeStatsContainer);
  } else {
    observeStatsContainer();
  }

  window.beautifyStatsContainer = beautifyStatsContainer;
})();