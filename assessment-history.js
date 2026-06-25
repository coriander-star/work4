// 测评历史记录增强
(function() {
  'use strict';

  // 获取测评历史记录
  function getAssessmentHistory() {
    const history = localStorage.getItem('assessmentHistory');
    return history ? JSON.parse(history) : [];
  }

  // 保存测评历史记录
  function saveAssessmentHistory(record) {
    const history = getAssessmentHistory();
    
    // 添加新记录到开头
    history.unshift({
      ...record,
      id: Date.now(),
      timestamp: Date.now()
    });

    // 最多保存10条记录
    if (history.length > 10) {
      history.pop();
    }

    localStorage.setItem('assessmentHistory', JSON.stringify(history));
    updateHistoryUI();
  }

  // 更新历史记录UI
  function updateHistoryUI() {
    const historySection = document.querySelector('.bg-white.dark\\:bg-slate-800.rounded-xl.shadow-md.p-5:has(.lucide-clock)');
    if (!historySection) {
      // 尝试其他方式查找
      const sections = document.querySelectorAll('.bg-white.dark\\:bg-slate-800.rounded-xl');
      sections.forEach(sec => {
        if (sec.querySelector('.lucide-clock') && sec.querySelector('h3')?.textContent === '测评历史') {
          updateHistorySection(sec);
        }
      });
      return;
    }

    updateHistorySection(historySection);
  }

  function updateHistorySection(section) {
    const history = getAssessmentHistory();
    const container = section.querySelector('.space-y-3');
    if (!container) return;

    if (history.length === 0) {
      container.innerHTML = `
        <div class="text-center py-6 text-slate-500 dark:text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history w-12 h-12 mx-auto mb-3 opacity-50"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <p class="text-sm">暂无测评记录</p>
          <p class="text-xs mt-1">完成健康评估后，记录会保存在这里</p>
        </div>
      `;
      return;
    }

    const constitutionColors = {
      '平和质': '#4ade80',
      '气虚质': '#60a5fa',
      '阳虚质': '#f59e0b',
      '阴虚质': '#a78bfa',
      '痰湿质': '#10b981',
      '湿热质': '#f87171',
      '血瘀质': '#94a3b8',
      '气郁质': '#8b5cf6',
      '特禀质': '#ec4899'
    };

    container.innerHTML = history.map(record => {
      const color = constitutionColors[record.type] || '#64748b';
      const date = new Date(record.timestamp);
      const dateStr = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

      return `
        <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors history-item" data-id="${record.id}">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity w-4 h-4">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            <div>
              <div class="font-medium text-slate-800 dark:text-white text-sm" style="color: ${color};">${record.type}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">${dateStr} ${timeStr}</div>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right w-4 h-4 text-slate-400">
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </div>
      `;
    }).join('');

    // 添加点击事件
    container.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', function() {
        const id = parseInt(this.dataset.id);
        const record = history.find(r => r.id === id);
        if (record) {
          showHistoryDetail(record);
        }
      });
    });
  }

  // 显示历史记录详情
  function showHistoryDetail(record) {
    const constitutionColors = {
      '平和质': '#16a34a',
      '气虚质': '#2563eb',
      '阳虚质': '#d97706',
      '阴虚质': '#7c3aed',
      '痰湿质': '#059669',
      '湿热质': '#dc2626',
      '血瘀质': '#64748b',
      '气郁质': '#6d28d9',
      '特禀质': '#db2777'
    };

    const color = constitutionColors[record.type] || '#64748b';
    const date = new Date(record.timestamp);
    const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    const modal = document.createElement('div');
    modal.className = 'hot-tip-modal-overlay';

    modal.innerHTML = `
      <div class="hot-tip-modal">
        <div class="hot-tip-modal-header">
          <div class="hot-tip-modal-title">
            <span>📊</span>
            <span>测评记录详情</span>
          </div>
          <button class="hot-tip-modal-close" onclick="this.closest('.hot-tip-modal-overlay').remove()">×</button>
        </div>
        <div class="hot-tip-modal-body">
          <div style="background: linear-gradient(135deg, ${color}15, ${color}08); border-radius: 12px; padding: 16px; margin-bottom: 20px; border-left: 4px solid ${color};">
            <div style="font-size: 24px; font-weight: bold; color: ${color}; margin-bottom: 4px;">${record.type}</div>
            <div style="font-size: 12px; color: #64748b;">测评时间：${dateStr}</div>
          </div>

          ${record.scores ? `
          <div class="hot-tip-section">
            <div class="hot-tip-section-title">📈 体质评分</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
              ${Object.entries(record.scores).map(([key, value]) => `
                <div style="background: #f8fafc; padding: 8px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 10px; color: #64748b; margin-bottom: 2px;">${key}</div>
                  <div style="font-size: 16px; font-weight: bold; color: ${value >= 60 ? '#16a34a' : value >= 40 ? '#d97706' : '#dc2626'};">${value}</div>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <div class="hot-tip-section">
            <div class="hot-tip-section-title">✨ 体质特征</div>
            <p style="color: #64748b; font-size: 13px; line-height: 1.6;">${getConstitutionDescription(record.type)}</p>
          </div>

          <div class="hot-tip-section">
            <div class="hot-tip-tips">💡 建议定期进行体质评估，关注身体健康变化。</div>
          </div>
        </div>
      </div>
    `;

    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });

    document.body.appendChild(modal);
  }

  // 获取体质描述
  function getConstitutionDescription(type) {
    const descriptions = {
      '平和质': '平和质是一种健康的体质状态，表现为体态适中、面色红润、精力充沛、脏腑功能状态良好。',
      '气虚质': '气虚质是由于元气不足，以气息低弱、机体、脏腑功能状态低下为主要特征。',
      '阳虚质': '阳虚质是由于阳气不足，以虚寒现象为主要特征的一种体质状态。',
      '阴虚质': '阴虚质是由于体内津液、精血等阴液亏少，以阴虚内热为主要特征。',
      '痰湿质': '痰湿质是由于水液内停而痰湿凝聚，以黏滞重浊为主要特征。',
      '湿热质': '湿热质是以湿热内蕴为主要特征的一种体质状态。',
      '血瘀质': '血瘀质是由于血液运行不畅，以血瘀表现为主要特征。',
      '气郁质': '气郁质是由于长期情志不畅、气机郁滞而形成的体质状态。',
      '特禀质': '特禀质是由于先天禀赋不足或遗传等因素造成的特殊体质。'
    };
    return descriptions[type] || '暂无描述';
  }

  // 监听测评完成事件
  function observeAssessment() {
    const observer = new MutationObserver(function() {
      updateHistoryUI();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 立即更新一次
    setTimeout(updateHistoryUI, 500);
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeAssessment);
  } else {
    observeAssessment();
  }

  // 暴露全局方法
  window.saveAssessmentHistory = saveAssessmentHistory;
  window.updateHistoryUI = updateHistoryUI;
  window.getAssessmentHistory = getAssessmentHistory;
})();