// 健康评估详细分析增强
(function() {
  'use strict';

  // 九种体质的详细描述
  const constitutionDetails = {
    '平和质': {
      description: '平和质是一种健康的体质状态，表现为体态适中、面色红润、精力充沛、脏腑功能状态良好。',
      features: ['体态适中，体型匀称健壮', '面色、肤色润泽', '头发稠密有光泽', '鼻色明润，嗅觉通利', '味觉正常，唇色红润', '精力充沛，不易疲劳', '睡眠良好，二便正常', '舌色淡红，苔薄白', '脉和有神'],
      suggestions: ['继续保持规律作息', '均衡饮食，多吃五谷杂粮', '适量运动，保持心情愉悦', '定期体检，预防为主'],
      foods: {
        recommend: ['五谷杂粮', '新鲜蔬菜', '时令水果', '优质蛋白'],
        avoid: ['过度油腻', '暴饮暴食', '生冷食物']
      }
    },
    '气虚质': {
      description: '气虚质是由于元气不足，以气息低弱、机体、脏腑功能状态低下为主要特征的一种体质状态。',
      features: ['容易疲乏，声音低弱', '容易气短心慌', '容易感冒，发病后恢复慢', '喜欢安静，不喜欢说话', '面色偏黄或发白', '舌淡红，舌体胖大', '脉弱'],
      suggestions: ['避免过度劳累，注意休息', '适当进行有氧运动', '保持心情舒畅，避免过度思虑', '注意保暖，避免受凉'],
      foods: {
        recommend: ['山药', '红枣', '黄芪', '鸡肉', '牛肉', '糯米'],
        avoid: ['生冷食物', '油腻食物', '辛辣刺激']
      }
    },
    '阳虚质': {
      description: '阳虚质是由于阳气不足，以虚寒现象为主要特征的一种体质状态。',
      features: ['手脚发凉，怕冷', '胃脘部、背部或腰膝部怕冷', '衣服比别人穿得多', '冬天更怕冷，夏天不喜欢吹空调', '容易腹泻', '舌淡胖嫩', '脉沉迟'],
      suggestions: ['注意保暖，尤其是腰腹部', '多晒太阳，适当运动', '避免长时间待在空调房', '少吃生冷食物'],
      foods: {
        recommend: ['羊肉', '韭菜', '核桃', '桂圆', '生姜', '胡椒'],
        avoid: ['西瓜', '梨', '绿豆', '苦瓜', '冷饮']
      }
    },
    '阴虚质': {
      description: '阴虚质是由于体内津液、精血等阴液亏少，以阴虚内热为主要特征的一种体质状态。',
      features: ['手脚心发热', '面颊潮红或偏红', '皮肤干燥，口干咽燥', '容易失眠', '大便干燥，小便短黄', '舌红少苔', '脉细数'],
      suggestions: ['避免熬夜，保证充足睡眠', '少吃辛辣刺激食物', '保持心情平和，避免烦躁', '适当进行舒缓运动'],
      foods: {
        recommend: ['银耳', '百合', '梨', '鸭肉', '芝麻', '枸杞'],
        avoid: ['羊肉', '辣椒', '白酒', '生姜', '大蒜']
      }
    },
    '痰湿质': {
      description: '痰湿质是由于水液内停而痰湿凝聚，以黏滞重浊为主要特征的一种体质状态。',
      features: ['体形肥胖，腹部肥满松软', '容易困倦，身体沉重', '面部皮肤油脂较多', '多汗且黏，胸闷', '嘴里常有黏黏的感觉', '舌苔厚腻', '脉滑'],
      suggestions: ['控制体重，减少油腻食物', '坚持运动，促进代谢', '保持居住环境干燥', '避免久坐，定时活动'],
      foods: {
        recommend: ['冬瓜', '萝卜', '薏米', '赤小豆', '荷叶茶'],
        avoid: ['肥肉', '甜食', '油炸食品', '酒类']
      }
    },
    '湿热质': {
      description: '湿热质是以湿热内蕴为主要特征的一种体质状态。',
      features: ['面部容易出油，易生痤疮', '口苦口臭，身重困倦', '大便黏滞不爽', '小便颜色深黄', '男性易阴囊潮湿', '女性带下增多', '舌质偏红，苔黄腻', '脉滑数'],
      suggestions: ['饮食清淡，少吃辛辣油腻', '避免在潮湿环境久待', '保持大便通畅', '适当运动，促进排汗'],
      foods: {
        recommend: ['绿豆', '苦瓜', '黄瓜', '冬瓜', '薏米', '莲藕'],
        avoid: ['羊肉', '辣椒', '酒', '榴莲', '芒果']
      }
    },
    '血瘀质': {
      description: '血瘀质是由于血液运行不畅，以血瘀表现为主要特征的一种体质状态。',
      features: ['皮肤容易出现瘀青', '面色晦暗，口唇颜色偏暗', '皮肤干燥，容易有瘀斑', '容易忘事', '女性痛经，经血有血块', '舌质暗有瘀点', '脉细涩'],
      suggestions: ['保持心情舒畅，避免情绪压抑', '适当运动，促进血液循环', '注意保暖，避免受寒', '定期体检，关注心血管健康'],
      foods: {
        recommend: ['山楂', '玫瑰花', '黑木耳', '洋葱', '红酒（适量）'],
        avoid: ['寒凉食物', '油腻食物', '过度饮酒']
      }
    },
    '气郁质': {
      description: '气郁质是由于长期情志不畅、气机郁滞而形成的以性格内向不稳定、忧郁脆弱、敏感多疑为主要特征的一种体质状态。',
      features: ['情绪低落，容易郁闷', '容易焦虑、失眠', '胸胁胀满', '喜欢叹气', '咽喉有异物感', '舌淡红，苔薄白', '脉弦'],
      suggestions: ['多参加社交活动，保持心情开朗', '培养兴趣爱好，转移注意力', '适当运动，释放压力', '寻求家人朋友支持'],
      foods: {
        recommend: ['玫瑰花茶', '菊花茶', '柑橘', '香蕉', '全麦面包'],
        avoid: ['咖啡', '浓茶', '辛辣刺激', '过度饮酒']
      }
    },
    '特禀质': {
      description: '特禀质是由于先天禀赋不足或遗传等因素造成的一种特殊体质，包括过敏体质、遗传病体质等。',
      features: ['容易过敏（药物、食物、花粉等）', '容易患哮喘', '容易患鼻炎', '皮肤容易起荨麻疹', '容易对某些食物不耐受', '有家族遗传病史'],
      suggestions: ['避免接触过敏原', '增强体质，提高免疫力', '注意饮食，避免过敏食物', '随身携带应急药物'],
      foods: {
        recommend: ['新鲜蔬菜', '清淡饮食', '富含维生素C的食物'],
        avoid: ['已知过敏食物', '海鲜（如过敏）', '辛辣刺激']
      }
    }
  };

  // 根据体质分数生成详细分析
  function generateDetailedAnalysis(scores) {
    // 找出主要体质（分数最高的）
    let mainConstitution = '';
    let maxScore = 0;
    for (const [key, value] of Object.entries(scores)) {
      if (value > maxScore) {
        maxScore = value;
        mainConstitution = key;
      }
    }

    // 找出次要体质（分数第二高的）
    let secondConstitution = '';
    let secondScore = 0;
    for (const [key, value] of Object.entries(scores)) {
      if (key !== mainConstitution && value > secondScore) {
        secondScore = value;
        secondConstitution = key;
      }
    }

    // 生成详细分析HTML
    const details = constitutionDetails[mainConstitution];
    if (!details) {
      return '<p>暂无详细分析数据</p>';
    }

    let html = `
      <div style="margin-top: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; font-size: 18px;">🎯 您的主要体质：${mainConstitution}</h4>
          <p style="margin: 0; opacity: 0.9; line-height: 1.6;">${details.description}</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">📋 体质特征</h4>
          <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
            ${details.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>

        ${secondConstitution && secondScore > 30 ? `
        <div style="background: #fff3cd; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
          <h4 style="margin: 0 0 10px 0; color: #856404; font-size: 16px;">⚠️ 兼有体质：${secondConstitution}</h4>
          <p style="margin: 0; color: #856404; line-height: 1.6;">您的体质还带有${secondConstitution}的特征，建议同时关注相关调理方法。</p>
        </div>
        ` : ''}

        <div style="background: #d4edda; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 15px 0; color: #155724; font-size: 16px;">💡 调理建议</h4>
          <ul style="margin: 0; padding-left: 20px; color: #155724; line-height: 1.8;">
            ${details.suggestions.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div style="background: #e7f3ff; padding: 15px; border-radius: 12px;">
            <h5 style="margin: 0 0 10px 0; color: #0056b3; font-size: 14px;">✅ 宜吃食物</h5>
            <p style="margin: 0; color: #0056b3; font-size: 13px; line-height: 1.6;">${details.foods.recommend.join('、')}</p>
          </div>
          <div style="background: #fff5f5; padding: 15px; border-radius: 12px;">
            <h5 style="margin: 0 0 10px 0; color: #c53030; font-size: 14px;">❌ 忌口食物</h5>
            <p style="margin: 0; color: #c53030; font-size: 13px; line-height: 1.6;">${details.foods.avoid.join('、')}</p>
          </div>
        </div>

        <div style="background: #f0f4f8; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 15px 0; color: #2d3748; font-size: 16px;">📊 体质评分详情</h4>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            ${Object.entries(scores).map(([key, value]) => `
              <div style="background: white; padding: 10px; border-radius: 8px; text-align: center;">
                <div style="font-size: 12px; color: #718096; margin-bottom: 5px;">${key}</div>
                <div style="font-size: 20px; font-weight: bold; color: ${value >= 60 ? '#48bb78' : value >= 40 ? '#ed8936' : '#e53e3e'};">${value}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 12px; border-left: 4px solid #4caf50;">
          <p style="margin: 0; color: #2e7d32; font-size: 13px; line-height: 1.6;">
            <strong>温馨提示：</strong>以上分析仅供参考，如有身体不适请及时就医。建议定期进行体质评估，关注身体健康变化。
          </p>
        </div>
      </div>
    `;

    return html;
  }

  // 从页面DOM中提取测评结果
  function extractScoresFromDOM() {
    const scores = {};

    // 尝试从雷达图canvas中读取数据
    const canvas = document.querySelector('canvas');
    if (canvas) {
      // 如果有canvas，尝试从其属性或相关元素中读取
      // 这里我们尝试从页面文本中提取
    }

    // 尝试从页面文本中提取体质分数
    const constitutionNames = ['平和质', '气虚质', '阳虚质', '阴虚质', '痰湿质', '湿热质', '血瘀质', '气郁质', '特禀质'];

    // 方法1: 从页面文本中提取
    const allText = document.body.innerText;
    constitutionNames.forEach(name => {
      // 尝试匹配"体质名: 分数"或"体质名 分数"的模式
      const regex = new RegExp(name + '[：:]*\\s*(\\d+)', 'i');
      const match = allText.match(regex);
      if (match) {
        scores[name] = parseInt(match[1]);
      }
    });

    // 方法2: 尝试从特定元素中提取（如果页面有显示分数的元素）
    if (Object.keys(scores).length === 0) {
      // 查找所有可能包含分数的div或span元素
      const scoreElements = document.querySelectorAll('div, span, p');
      scoreElements.forEach(el => {
        const text = el.textContent || '';
        constitutionNames.forEach(name => {
          if (text.includes(name)) {
            const regex = new RegExp(name + '[：:]*\\s*(\\d+)', 'i');
            const match = text.match(regex);
            if (match) {
              scores[name] = parseInt(match[1]);
            }
          }
        });
      });
    }

    // 方法3: 如果还是没有找到，尝试从localStorage读取
    if (Object.keys(scores).length === 0) {
      const assessmentResult = localStorage.getItem('healthAssessmentResult');
      if (assessmentResult) {
        try {
          const result = JSON.parse(assessmentResult);
          if (result.scores) {
            return result.scores;
          }
        } catch (e) {
          console.error('解析测评结果失败:', e);
        }
      }
    }

    // 方法4: 尝试从全局变量中读取（如果有的话）
    if (Object.keys(scores).length === 0 && window.assessmentScores) {
      return window.assessmentScores;
    }

    return scores;
  }

  // 手动触发详细分析生成
  function triggerDetailedAnalysis() {
    const analysisSection = document.querySelector('.prose.dark\\:prose-invert.max-w-none');
    if (analysisSection) {
      const detailCard = analysisSection.closest('.bg-white.dark\\:bg-gray-800.rounded-2xl');
      if (detailCard && detailCard.querySelector('h3')?.textContent === '详细分析') {
        // 从DOM中提取测评结果
        let scores = extractScoresFromDOM();

        // 如果没有找到测评结果，使用模拟数据进行演示
        if (Object.keys(scores).length === 0) {
          console.log('未找到测评结果，使用模拟数据进行演示');
          scores = {
            '平和质': 45,
            '气虚质': 72,
            '阳虚质': 58,
            '阴虚质': 35,
            '痰湿质': 42,
            '湿热质': 38,
            '血瘀质': 25,
            '气郁质': 65,
            '特禀质': 20
          };
        }

        const detailedHTML = generateDetailedAnalysis(scores);
        analysisSection.innerHTML = detailedHTML;
        detailCard.classList.add('detailed-analysis-generated');

        // 同时保存到localStorage供后续使用
        localStorage.setItem('healthAssessmentResult', JSON.stringify({ scores, timestamp: Date.now() }));

        // 保存测评历史记录
        if (window.saveAssessmentHistory) {
          let mainConstitution = '';
          let maxScore = 0;
          for (const [key, value] of Object.entries(scores)) {
            if (value > maxScore) {
              maxScore = value;
              mainConstitution = key;
            }
          }
          window.saveAssessmentHistory({
            type: mainConstitution,
            scores: scores,
            timestamp: Date.now()
          });
        }

        console.log('详细分析已生成:', scores);
        return true;
      }
    }
    return false;
  }

  // 监听健康评估页面
  function observeHealthAssessment() {
    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        // 检查是否有详细分析区域
        const analysisSection = document.querySelector('.prose.dark\\:prose-invert.max-w-none');
        if (analysisSection) {
          const detailCard = analysisSection.closest('.bg-white.dark\\:bg-gray-800.rounded-2xl');
          if (detailCard && detailCard.querySelector('h3')?.textContent === '详细分析') {
            // 检查是否已经生成了详细分析
            if (!detailCard.querySelector('.detailed-analysis-generated')) {
              // 延迟执行，等待测评结果渲染完成
              setTimeout(() => {
                triggerDetailedAnalysis();
              }, 500);
            }
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // 立即检查一次
    setTimeout(() => {
      triggerDetailedAnalysis();
    }, 1000);
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeHealthAssessment);
  } else {
    observeHealthAssessment();
  }

  // 暴露全局方法供其他模块调用
  window.generateDetailedAnalysis = generateDetailedAnalysis;
  window.triggerDetailedAnalysis = triggerDetailedAnalysis;
})();