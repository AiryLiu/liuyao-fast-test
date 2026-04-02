// 六爻起卦逻辑

/**
 * 传统起卦：三枚硬币抛六次
 * 字为阴，背为阳
 * - 3字（0背）= 阴
 * - 2字1背 = 阳
 * - 1字2背 = 阴
 * - 3背 = 阳
 *
 * 简化：背的数量
 * - 奇数背（1或3）= 阳
 * - 偶数背（0或2）= 阴
 */
function castLine() {
  // 模拟三枚硬币
  const coins = [
    Math.random() < 0.5 ? '字' : '背',
    Math.random() < 0.5 ? '字' : '背',
    Math.random() < 0.5 ? '字' : '背'
  ];

  // 数背的数量
  const backCount = coins.filter(c => c === '背').length;

  // 奇数为阳，偶数为阴
  return backCount % 2 === 1 ? 1 : 0;
}

/**
 * 起一卦（六爻）
 */
function castHexagram() {
  const lines = [];
  // 从下往上，共六爻
  for (let i = 0; i < 6; i++) {
    lines.push(castLine());
  }
  return lines;
}

/**
 * 将吉凶转换为拼音类名
 */
function pinyinLuck(luck) {
  const map = {
    '上上': 'shangshang',
    '上中': 'shangzhong',
    '中上': 'zhongshang',
    '中中': 'zhongzhong',
    '中下': 'zhongxia',
    '下下': 'xiaxia'
  };
  return map[luck] || 'zhongzhong';
}

/**
 * 查找卦象
 */
function findHexagram(lines) {
  const key = lines.join('');
  return HEXAGRAM_MAP[key] || null;
}

/**
 * 创建爻元素
 */
function createYaoPart() {
  const part = document.createElement('div');
  part.className = 'yao-part';
  return part;
}

/**
 * 渲染卦象
 */
function renderHexagram(lines, container) {
  container.textContent = '';

  // 从上往下渲染（第六爻在上）
  for (let i = 5; i >= 0; i--) {
    const yao = document.createElement('div');
    yao.className = `yao ${lines[i] === 1 ? 'yang' : 'yin'}`;

    // 阳爻：一条实线
    // 阴爻：两段断线
    if (lines[i] === 1) {
      yao.appendChild(createYaoPart());
    } else {
      yao.appendChild(createYaoPart());
      yao.appendChild(createYaoPart());
    }

    container.appendChild(yao);
  }
}

/**
 * 显示结果
 */
function showResult(hexagram, lines) {
  const resultPage = document.querySelector('.result-page');
  const homePage = document.querySelector('.home-page');

  // 渲染卦象
  const hexagramContainer = resultPage.querySelector('.hexagram-container');
  renderHexagram(lines, hexagramContainer);

  // 卦名
  resultPage.querySelector('.gua-name').textContent = hexagram.name;

  // 吉凶
  const luckEl = resultPage.querySelector('.gua-luck');
  luckEl.textContent = hexagram.luck;
  luckEl.className = 'gua-luck luck-' + pinyinLuck(hexagram.luck);

  // 符号（上下卦组成）
  resultPage.querySelector('.gua-symbol').textContent = hexagram.symbol;

  // 原判词
  resultPage.querySelector('.section-content.original').textContent = hexagram.original;

  // 现代解读
  resultPage.querySelector('.section-content.modern').textContent = hexagram.modern;

  // 切换页面
  homePage.classList.add('hidden');
  resultPage.classList.add('active');

  // 重置动画
  resetAnimations(resultPage);
}

/**
 * 重置动画
 */
function resetAnimations(page) {
  const elements = page.querySelectorAll('.hexagram-container, .yao, .gua-name, .gua-luck, .gua-symbol, .section, .restart-btn');
  elements.forEach(el => {
    el.style.animation = 'none';
    // 触发重绘
    void el.offsetHeight;
    el.style.animation = '';
  });
}

/**
 * 起卦
 */
function divine() {
  const btn = document.querySelector('.divine-btn');
  btn.classList.add('loading');

  // 模拟起卦过程
  setTimeout(() => {
    const lines = castHexagram();
    const hexagram = findHexagram(lines);

    if (hexagram) {
      showResult(hexagram, lines);
    } else {
      console.error('未找到对应卦象', lines);
    }

    btn.classList.remove('loading');
  }, 300);
}

/**
 * 再占一卦
 */
function restart() {
  const resultPage = document.querySelector('.result-page');
  const homePage = document.querySelector('.home-page');

  resultPage.classList.remove('active');
  homePage.classList.remove('hidden');
}

// 页面加载完成
document.addEventListener('DOMContentLoaded', () => {
  console.log('六爻占卜已就绪');
});
