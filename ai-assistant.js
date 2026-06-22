(function () {
  'use strict';

  // ==================== Configuration ====================
  const API_KEY = 'sk-aaa0c59478034b6daa52c6bcce0c7890';
  const API_URL = 'https://api.deepseek.com/chat/completions';
  const MODEL = 'deepseek-chat';

  // ==================== Module Definitions ====================
  const MODULE_KEYWORDS = {
    '健康评估': ['体质评估', '体质测评', '九种体质', '雷达图', '体质分数', '平和质', '气虚质', '阳虚质', '阴虚质', '痰湿质', '湿热质', '血瘀质', '气郁质', '特禀质'],
    'AI舌诊': ['舌诊', '舌象', '舌苔', '舌色', '拍照分析'],
    '急救指南': ['急救', '急救方案', '突发', '应急'],
    '健康养生': ['轻养生', '养生库', '冲刺计划', '养生水', '养生操'],
    '饮食指南': ['饮食原则', '食疗', '忌口', '宜吃', '食堂搭配'],
    '穴位按摩': ['穴位', '按摩', '按压', '三阴交', '足三里', '合谷'],
    '情绪疗愈': ['情绪疗愈', '冥想', '呼吸调节', '情绪管理', '正念'],
    '个人中心': ['个人中心', '打卡记录', '测评报告', '我的']
  };

  const MODULE_PROMPTS = {
    '首页': '你是"医靠"健康助手的AI顾问，专门为脆皮大学生提供中医健康建议。你的角色是友好、专业的大学生健康伙伴。请用轻松易懂的语言回答问题，适当使用emoji。当用户描述具体症状时，给出实用的建议，但严重情况要提醒就医。',
    '健康评估': '你是"医靠"的中医体质评估专家。你精通中医九种体质（平和质、气虚质、阳虚质、阴虚质、痰湿质、湿热质、血瘀质、气郁质、特禀质）的判定和调理。请根据用户的问题，提供专业的体质分析和调理建议。用大学生能理解的语言解释中医概念。',
    'AI舌诊': '你是"医靠"的AI舌诊分析专家。你精通中医舌诊理论，能通过舌色、舌苔、舌形等特征分析健康状况。请用专业但易懂的语言解释舌诊相关概念，给出针对性的调理建议。提醒用户：AI舌诊仅供参考，如有不适请就医。',
    '急救指南': '你是"医靠"的急救顾问，专门处理大学生常见的突发健康问题（如胃痛、头痛、失眠、痛经、中暑、低血糖等）。请给出实用、安全的急救建议，步骤清晰。重要提醒：严重情况必须立即就医，不要自行处理。',
    '健康养生': '你是"医靠"的养生专家，专注于适合大学生的轻养生方案。你了解考前冲刺养生、养生茶饮、宿舍养生操等。请给出切实可行、低成本、适合学生群体的养生建议。',
    '饮食指南': '你是"医靠"的饮食营养师，擅长根据不同中医体质提供饮食建议。你了解大学生食堂饮食的局限性，能给出平价、易得的饮食搭配方案。请根据用户体质推荐宜吃和忌口的食物。',
    '穴位按摩': '你是"医靠"的穴位按摩专家。你精通常用穴位的定位和按摩手法，能根据症状推荐对应的穴位。请详细说明穴位位置、按摩手法、时间和频率。提醒：穴位按摩为辅助调理，严重不适请就医。',
    '情绪疗愈': '你是"医靠"的情绪疗愈顾问，一位温暖、理解大学生的心理咨询伙伴。你擅长情绪管理、正念冥想、呼吸调节等技巧。请用共情的语言回应，给出实用的情绪调节方法。如果用户情绪持续低落，温柔地建议寻求专业帮助。',
    '个人中心': '你是"医靠"的健康管理助手，帮助用户查看和解读健康记录、体质报告、打卡数据等。请用鼓励的语气帮助用户坚持健康管理，解读他们的健康数据。'
  };

  const QUICK_QUESTIONS = {
    '首页': ['你能帮我做什么？', '大学生常见健康问题', '如何改善睡眠？'],
    '健康评估': ['什么是九种体质？', '总是怕冷是什么体质？', '气虚怎么调理？'],
    'AI舌诊': ['舌诊怎么看？', '舌苔厚白什么原因？', '舌边有齿痕怎么办？'],
    '急救指南': ['突然胃痛怎么办？', '失眠怎么快速入睡？', '痛经怎么缓解？'],
    '健康养生': ['考前怎么养生？', '有什么养生茶推荐？', '宿舍能做什么运动？'],
    '饮食指南': ['阳虚体质吃什么好？', '食堂怎么搭配最健康？', '湿热体质忌口什么？'],
    '穴位按摩': ['头痛按什么穴位？', '三阴交在哪里？', '失眠按什么穴位？'],
    '情绪疗愈': ['怎么缓解考前焦虑？', '冥想怎么做？', '心情低落怎么办？'],
    '个人中心': ['我的体质怎么调理？', '如何坚持健康打卡？', '测评结果怎么看？']
  };

  const WELCOME_MESSAGES = {
    '首页': '你好！我是医靠AI助手 🌿 你的大学生健康伙伴～有什么健康问题都可以问我哦！',
    '健康评估': '你好！我是体质评估专家 🔍 想了解你的中医体质类型吗？随时问我！',
    'AI舌诊': '你好！我是舌诊分析专家 👅 对舌象有疑问？我来帮你解读！',
    '急救指南': '你好！我是急救顾问 🏥 遇到突发不适？告诉我症状，我来帮你！',
    '健康养生': '你好！我是养生专家 🍵 想要轻松养生？我有适合大学生的方案！',
    '饮食指南': '你好！我是饮食营养师 🥗 想知道吃什么更健康？问我吧！',
    '穴位按摩': '你好！我是穴位按摩专家 💆 哪里不舒服？我来告诉你按哪个穴位！',
    '情绪疗愈': '你好！我是情绪疗愈伙伴 🌈 心情不好？我来陪你聊聊～',
    '个人中心': '你好！我是健康管理助手 📊 想了解你的健康数据？我来帮你解读！'
  };

  // ==================== State ====================
  let isOpen = false;
  let isDragging = false;
  let hasMoved = false;
  let currentModule = '首页';
  let chatHistory = [];
  let isStreaming = false;

  // ==================== DOM References ====================
  let btn, panel, messagesArea, inputEl, sendBtn, closeBtn, moduleLabel, quickArea;

  // ==================== Inject CSS ====================
  function injectCSS() {
    const style = document.createElement('style');
    style.id = 'yikao-ai-styles';
    style.textContent = `
/* ===== Medicine Box Button ===== */
.yikao-ai-btn {
  position: fixed;
  z-index: 999999;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  bottom: 30px;
  right: 30px;
  transition: transform 0.2s ease, filter 0.2s ease;
}
.yikao-ai-btn:active { cursor: grabbing; }
.yikao-ai-btn.dragging { transition: none; }

.yikao-ai-btn-handle {
  width: 24px;
  height: 7px;
  background: linear-gradient(180deg, #d63031, #b71c1c);
  border-radius: 4px 4px 0 0;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  box-shadow: 0 -1px 3px rgba(0,0,0,0.1);
}

.yikao-ai-btn-body {
  width: 60px;
  height: 50px;
  background: linear-gradient(145deg, #ff6b6b, #e74c3c);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.35), 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2);
  position: relative;
  margin-top: -1px;
}

.yikao-ai-btn-cross {
  position: relative;
  width: 20px;
  height: 20px;
}
.yikao-ai-btn-cross-h,
.yikao-ai-btn-cross-v {
  position: absolute;
  background: rgba(255,255,255,0.95);
  border-radius: 2px;
}
.yikao-ai-btn-cross-h {
  width: 20px;
  height: 6px;
  top: 7px;
  left: 0;
}
.yikao-ai-btn-cross-v {
  width: 6px;
  height: 20px;
  top: 0;
  left: 7px;
}

/* Pulse */
@keyframes yikao-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}
.yikao-ai-btn:not(.dragging):not(.open) .yikao-ai-btn-body {
  animation: yikao-pulse 2.5s ease-in-out infinite;
}
.yikao-ai-btn:hover .yikao-ai-btn-body {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.45), 0 3px 6px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2);
}

/* Tooltip */
.yikao-ai-btn-tip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  background: rgba(0,0,0,0.75);
  color: #fff;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}
.yikao-ai-btn:hover .yikao-ai-btn-tip {
  opacity: 1;
}

/* ===== Chat Panel ===== */
.yikao-ai-panel {
  position: fixed;
  z-index: 999998;
  width: 380px;
  height: 530px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.12), 0 2px 10px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  transform: scale(0.85) translateY(15px);
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.yikao-ai-panel.show {
  opacity: 1;
  transform: scale(1) translateY(0);
  pointer-events: auto;
}

/* Header */
.yikao-ai-header {
  background: linear-gradient(135deg, #ff6b6b, #e74c3c);
  color: #fff;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.yikao-ai-header-icon {
  width: 36px;
  height: 36px;
  background: rgba(255,255,255,0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.yikao-ai-header-info { flex: 1; min-width: 0; }
.yikao-ai-header-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
}
.yikao-ai-header-sub {
  font-size: 11px;
  opacity: 0.8;
  line-height: 1.3;
}
.yikao-ai-header-actions { display: flex; gap: 6px; }
.yikao-ai-header-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255,255,255,0.2);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  flex-shrink: 0;
}
.yikao-ai-header-btn:hover { background: rgba(255,255,255,0.35); }

/* Messages */
.yikao-ai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f8f9fa;
}
.yikao-ai-messages::-webkit-scrollbar { width: 5px; }
.yikao-ai-messages::-webkit-scrollbar-track { background: transparent; }
.yikao-ai-messages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }

.yikao-ai-msg {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.yikao-ai-msg-ai {
  align-self: flex-start;
  background: #fff;
  color: #333;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.yikao-ai-msg-user {
  align-self: flex-end;
  background: linear-gradient(135deg, #ff6b6b, #e74c3c);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.yikao-ai-msg-ai strong { color: #e74c3c; }
.yikao-ai-msg-ai code {
  background: #f0f0f0;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 13px;
}
.yikao-ai-msg-ai ul, .yikao-ai-msg-ai ol {
  margin: 4px 0;
  padding-left: 18px;
}
.yikao-ai-msg-ai li { margin: 2px 0; }

/* Typing Indicator */
.yikao-ai-typing {
  display: flex;
  gap: 4px;
  padding: 10px 14px;
  align-self: flex-start;
  background: #fff;
  border-radius: 14px;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.yikao-ai-typing span {
  width: 7px;
  height: 7px;
  background: #bbb;
  border-radius: 50%;
  animation: yikao-bounce 1.2s infinite;
}
.yikao-ai-typing span:nth-child(2) { animation-delay: 0.2s; }
.yikao-ai-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes yikao-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

/* Quick Questions */
.yikao-ai-quick {
  padding: 8px 16px 6px;
  flex-shrink: 0;
}
.yikao-ai-quick-label {
  font-size: 11px;
  color: #999;
  margin-bottom: 6px;
}
.yikao-ai-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.yikao-ai-chip {
  padding: 5px 12px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 16px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.yikao-ai-chip:hover {
  border-color: #e74c3c;
  color: #e74c3c;
  background: #fff5f5;
}

/* Input Area */
.yikao-ai-input-area {
  padding: 10px 16px 14px;
  display: flex;
  gap: 8px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}
.yikao-ai-input {
  flex: 1;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  background: #fafafa;
}
.yikao-ai-input:focus {
  border-color: #e74c3c;
  background: #fff;
}
.yikao-ai-input:disabled {
  opacity: 0.5;
}
.yikao-ai-send {
  width: 38px;
  height: 38px;
  border: none;
  background: linear-gradient(135deg, #ff6b6b, #e74c3c);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  flex-shrink: 0;
}
.yikao-ai-send:hover {
  transform: scale(1.08);
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.4);
}
.yikao-ai-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Error message */
.yikao-ai-error {
  color: #e74c3c;
  font-size: 13px;
  text-align: center;
  padding: 8px;
}

/* ===== Responsive ===== */
@media (max-width: 480px) {
  .yikao-ai-panel {
    width: calc(100vw - 20px);
    height: calc(100vh - 80px);
    border-radius: 12px;
  }
  .yikao-ai-btn-tip { display: none; }
}
    `;
    document.head.appendChild(style);
  }

  // ==================== Create DOM ====================
  function createDOM() {
    // Medicine Box Button
    btn = document.createElement('div');
    btn.className = 'yikao-ai-btn';
    btn.innerHTML = `
      <div class="yikao-ai-btn-tip">医靠AI助手</div>
      <div class="yikao-ai-btn-handle"></div>
      <div class="yikao-ai-btn-body">
        <div class="yikao-ai-btn-cross">
          <span class="yikao-ai-btn-cross-h"></span>
          <span class="yikao-ai-btn-cross-v"></span>
        </div>
      </div>
    `;

    // Chat Panel
    panel = document.createElement('div');
    panel.className = 'yikao-ai-panel';
    panel.innerHTML = `
      <div class="yikao-ai-header">
        <div class="yikao-ai-header-icon">🩺</div>
        <div class="yikao-ai-header-info">
          <div class="yikao-ai-header-title">医靠AI助手</div>
          <div class="yikao-ai-header-sub" id="yikaoAiModule">当前：首页</div>
        </div>
        <div class="yikao-ai-header-actions">
          <button class="yikao-ai-header-btn" id="yikaoAiClear" title="清空对话">↻</button>
          <button class="yikao-ai-header-btn" id="yikaoAiClose" title="关闭">✕</button>
        </div>
      </div>
      <div class="yikao-ai-messages" id="yikaoAiMessages"></div>
      <div class="yikao-ai-quick" id="yikaoAiQuick" style="display:none">
        <div class="yikao-ai-quick-label">快捷提问</div>
        <div class="yikao-ai-chips" id="yikaoAiChips"></div>
      </div>
      <div class="yikao-ai-input-area">
        <input type="text" class="yikao-ai-input" id="yikaoAiInput" placeholder="问问医靠AI..." autocomplete="off" />
        <button class="yikao-ai-send" id="yikaoAiSend">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    // Cache references
    messagesArea = document.getElementById('yikaoAiMessages');
    inputEl = document.getElementById('yikaoAiInput');
    sendBtn = document.getElementById('yikaoAiSend');
    closeBtn = document.getElementById('yikaoAiClose');
    moduleLabel = document.getElementById('yikaoAiModule');
    quickArea = document.getElementById('yikaoAiQuick');

    // Event listeners
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      togglePanel(false);
    });

    document.getElementById('yikaoAiClear').addEventListener('click', function (e) {
      e.stopPropagation();
      clearChat();
    });

    sendBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      sendMessage();
    });

    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    inputEl.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  // ==================== Position ====================
  function initPosition() {
    var rect = btn.getBoundingClientRect();
    btn.style.left = rect.left + 'px';
    btn.style.top = rect.top + 'px';
    btn.style.right = 'auto';
    btn.style.bottom = 'auto';
  }

  function updatePanelPosition() {
    var btnRect = btn.getBoundingClientRect();
    var pw = 380, ph = 530;
    var gap = 12;

    // Prefer: above the button, right-aligned
    var left = btnRect.right - pw;
    var top = btnRect.top - ph - gap;

    // If not enough space above, place below
    if (top < 10) {
      top = btnRect.bottom + gap;
    }
    // If still off-screen bottom, just clamp
    if (top + ph > window.innerHeight - 10) {
      top = window.innerHeight - ph - 10;
    }
    // Clamp horizontal
    if (left < 10) left = 10;
    if (left + pw > window.innerWidth - 10) left = window.innerWidth - pw - 10;
    // Clamp vertical
    if (top < 10) top = 10;

    panel.style.left = left + 'px';
    panel.style.top = top + 'px';

    // Set transform-origin near button position for animation
    var originX = btnRect.left + btnRect.width / 2 - left;
    var originY = top < btnRect.top ? ph : 0;
    panel.style.transformOrigin = originX + 'px ' + originY + 'px';
  }

  // ==================== Draggable ====================
  function initDraggable() {
    var startX, startY, startLeft, startTop;
    var totalMove = 0;
    var THRESHOLD = 5;

    function onStart(e) {
      if (e.target.closest('.yikao-ai-btn-handle') || e.target.closest('.yikao-ai-btn-body') || e.target === btn || e.target.parentElement === btn) {
        // ok, on the button
      } else {
        return;
      }
      e.preventDefault();
      var pt = e.touches ? e.touches[0] : e;
      startX = pt.clientX;
      startY = pt.clientY;
      var rect = btn.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      totalMove = 0;
      isDragging = false;

      document.addEventListener('mousemove', onMove, { passive: false });
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);
    }

    function onMove(e) {
      e.preventDefault();
      var pt = e.touches ? e.touches[0] : e;
      var dx = pt.clientX - startX;
      var dy = pt.clientY - startY;
      totalMove += Math.abs(dx) + Math.abs(dy);

      if (totalMove > THRESHOLD) {
        isDragging = true;
        btn.classList.add('dragging');
      }

      var newLeft = startLeft + dx;
      var newTop = startTop + dy;

      // Constrain
      var maxL = window.innerWidth - btn.offsetWidth;
      var maxT = window.innerHeight - btn.offsetHeight;
      newLeft = Math.max(0, Math.min(newLeft, maxL));
      newTop = Math.max(0, Math.min(newTop, maxT));

      btn.style.left = newLeft + 'px';
      btn.style.top = newTop + 'px';

      if (isOpen) updatePanelPosition();
    }

    function onEnd() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);

      btn.classList.remove('dragging');

      if (!isDragging) {
        togglePanel();
      }
      isDragging = false;
    }

    btn.addEventListener('mousedown', onStart);
    btn.addEventListener('touchstart', onStart, { passive: false });
  }

  // ==================== Toggle Panel ====================
  function togglePanel(forceState) {
    isOpen = typeof forceState === 'boolean' ? forceState : !isOpen;

    if (isOpen) {
      updatePanelPosition();
      panel.classList.add('show');
      btn.classList.add('open');
      inputEl.focus();
    } else {
      panel.classList.remove('show');
      btn.classList.remove('open');
    }
  }

  // ==================== Module Detection ====================
  function detectModule() {
    var bodyText = (document.body.innerText || '').substring(0, 5000);
    var scores = {};

    for (var mod in MODULE_KEYWORDS) {
      scores[mod] = 0;
      var kws = MODULE_KEYWORDS[mod];
      for (var i = 0; i < kws.length; i++) {
        var idx = 0, count = 0;
        while ((idx = bodyText.indexOf(kws[i], idx)) > -1 && count < 3) {
          count++;
          idx += kws[i].length;
        }
        scores[mod] += count;
      }
    }

    // Check navigation elements for active state
    var navElements = document.querySelectorAll('nav *, [class*="nav"] *, [class*="tab"] *');
    var priorityModules = ['AI舌诊', '急救指南', '穴位按摩', '情绪疗愈', '健康评估', '饮食指南', '健康养生', '个人中心'];
    for (var n = 0; n < navElements.length; n++) {
      var el = navElements[n];
      var txt = (el.textContent || '').trim();
      for (var p = 0; p < priorityModules.length; p++) {
        if (txt === priorityModules[p]) {
          var isActive = el.classList.contains('active') || el.classList.contains('selected') ||
            el.classList.contains('current') || el.getAttribute('aria-selected') === 'true' ||
            (el.parentElement && (el.parentElement.classList.contains('active') || el.parentElement.classList.contains('selected')));
          if (isActive) {
            scores[priorityModules[p]] += 10;
          }
        }
      }
    }

    var maxScore = 0;
    var detected = '首页';
    for (var m in scores) {
      if (scores[m] > maxScore) {
        maxScore = scores[m];
        detected = m;
      }
    }

    if (detected !== currentModule) {
      currentModule = detected;
      onModuleChange();
    }
  }

  function onModuleChange() {
    if (moduleLabel) {
      moduleLabel.textContent = '当前：' + currentModule;
    }
    // Update quick questions
    showQuickQuestions();
  }

  function startModuleObserver() {
    var observer = new MutationObserver(function () {
      detectModule();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    // Also check on hash change
    window.addEventListener('hashchange', detectModule);
  }

  // ==================== Chat Logic ====================
  function addMessage(text, type) {
    var div = document.createElement('div');
    div.className = 'yikao-ai-msg yikao-ai-msg-' + type;
    if (type === 'ai') {
      div.innerHTML = renderMarkdown(text);
    } else {
      div.textContent = text;
    }
    messagesArea.appendChild(div);
    scrollToBottom();
    return div;
  }

  function addTypingIndicator() {
    var div = document.createElement('div');
    div.className = 'yikao-ai-typing';
    div.id = 'yikaoAiTyping';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesArea.appendChild(div);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    var el = document.getElementById('yikaoAiTyping');
    if (el) el.remove();
  }

  function showWelcome() {
    if (chatHistory.length > 0) return;
    var msg = WELCOME_MESSAGES[currentModule] || WELCOME_MESSAGES['首页'];
    addMessage(msg, 'ai');
  }

  function showQuickQuestions() {
    var chips = document.getElementById('yikaoAiChips');
    if (!chips) return;
    chips.innerHTML = '';
    var questions = QUICK_QUESTIONS[currentModule] || QUICK_QUESTIONS['首页'];
    for (var i = 0; i < questions.length; i++) {
      var chip = document.createElement('button');
      chip.className = 'yikao-ai-chip';
      chip.textContent = questions[i];
      chip.setAttribute('data-question', questions[i]);
      chip.addEventListener('click', function (e) {
        e.stopPropagation();
        var q = this.getAttribute('data-question');
        inputEl.value = q;
        sendMessage();
      });
      chips.appendChild(chip);
    }
    quickArea.style.display = 'block';
  }

  function hideQuickQuestions() {
    if (quickArea) quickArea.style.display = 'none';
  }

  function clearChat() {
    chatHistory = [];
    messagesArea.innerHTML = '';
    showWelcome();
    showQuickQuestions();
  }

  function sendMessage() {
    if (isStreaming) return;
    var text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = '';
    hideQuickQuestions();

    addMessage(text, 'user');
    chatHistory.push({ role: 'user', content: text });

    callAPI();
  }

  async function callAPI() {
    isStreaming = true;
    sendBtn.disabled = true;
    inputEl.disabled = true;
    addTypingIndicator();

    var systemPrompt = '你是"医靠"健康助手的AI顾问，专门为脆皮大学生提供中医健康建议。\n\n' +
      '当前模块：' + currentModule + '\n' +
      '模块专家身份：' + (MODULE_PROMPTS[currentModule] || MODULE_PROMPTS['首页']) + '\n\n' +
      '行为准则：\n1. 用轻松、友好、大学生能理解的语言回答\n2. 适当使用emoji增加亲和力\n3. 给出实用、可行的建议\n4. 回答要简洁，不要过长\n5. 严重健康问题必须提醒就医\n6. 中医建议仅供参考，不能替代专业医疗';

    var messages = [{ role: 'system', content: systemPrompt }].concat(chatHistory.slice(-10));

    try {
      var response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + API_KEY
        },
        body: JSON.stringify({
          model: MODEL,
          messages: messages,
          stream: true,
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        var errData = null;
        try { errData = await response.json(); } catch (e) { }
        throw new Error(errData && errData.error && errData.error.message ? errData.error.message : 'API请求失败 (' + response.status + ')');
      }

      removeTypingIndicator();

      // Streaming
      var reader = response.body.getReader();
      var decoder = new TextDecoder();
      var buffer = '';
      var fullContent = '';
      var msgEl = addMessage('', 'ai');
      msgEl.id = 'yikaoAiStreamMsg';

      while (true) {
        var result = await reader.read();
        if (result.done) break;

        buffer += decoder.decode(result.value, { stream: true });
        var lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].trim();
          if (!line || !line.startsWith('data: ')) continue;
          var data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            var json = JSON.parse(data);
            var delta = json.choices && json.choices[0] && json.choices[0].delta;
            if (delta && delta.content) {
              fullContent += delta.content;
              msgEl.innerHTML = renderMarkdown(fullContent);
              scrollToBottom();
            }
          } catch (e) {
            // skip
          }
        }
      }

      chatHistory.push({ role: 'assistant', content: fullContent });

    } catch (err) {
      removeTypingIndicator();
      var errorDiv = document.createElement('div');
      errorDiv.className = 'yikao-ai-error';
      errorDiv.textContent = '出错了：' + err.message;
      messagesArea.appendChild(errorDiv);
      scrollToBottom();
    }

    isStreaming = false;
    sendBtn.disabled = false;
    inputEl.disabled = false;
    inputEl.focus();
  }

  // ==================== Markdown Rendering ====================
  function renderMarkdown(text) {
    if (!text) return '';
    var html = text;

    // Escape HTML
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Code blocks (``` ... ```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, function (m, lang, code) {
      return '<pre style="background:#f5f5f5;padding:8px 10px;border-radius:6px;overflow-x:auto;font-size:13px;margin:6px 0"><code>' + code.trim() + '</code></pre>';
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Headers
    html = html.replace(/^### (.+)$/gm, '<div style="font-weight:600;font-size:14px;margin:6px 0 2px">$1</div>');
    html = html.replace(/^## (.+)$/gm, '<div style="font-weight:700;font-size:15px;margin:8px 0 3px">$1</div>');

    // Unordered lists
    html = html.replace(/^[•\-]\s+(.+)$/gm, '<li>$1</li>');

    // Ordered lists
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

    // Wrap consecutive <li> in <ul>
    html = html.replace(/(<li>[\s\S]*?<\/li>)+/g, function (match) {
      return '<ul style="margin:4px 0;padding-left:18px">' + match + '</ul>';
    });

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    // Clean up extra <br> around block elements
    html = html.replace(/<br><(ul|pre|div)/g, '<$1');
    html = html.replace(/<\/(ul|pre|div)><br>/g, '</$1>');

    return html;
  }

  // ==================== Utilities ====================
  function scrollToBottom() {
    requestAnimationFrame(function () {
      messagesArea.scrollTop = messagesArea.scrollHeight;
    });
  }

  // ==================== Initialize ====================
  function init() {
    injectCSS();
    createDOM();
    initPosition();
    initDraggable();
    detectModule();

    // Delayed start for module observer (let React render first)
    setTimeout(function () {
      startModuleObserver();
      showWelcome();
      showQuickQuestions();
    }, 800);
  }

  // ==================== Bootstrap ====================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
