/* ===========================================================
   坤坤工具箱 · 交互逻辑
   纯原生 JS，无依赖。数据来自 data.js 里的 window.TOOLS。
   =========================================================== */
(function () {
  'use strict';

  /* ---------- 常量 ---------- */
  var CATEGORIES = ['系统工具', '办公效率', '影音图像', '开发编程', '网络工具', '安全维护', '其他'];
  var THEME_KEY = 'kk-theme';
  var THEME_MODES = ['system', 'light', 'dark'];
  var THEME_LABELS = { system: '跟随系统', light: '浅色', dark: '深色' };

  var tools = Array.isArray(window.TOOLS) ? window.TOOLS : [];

  var root = document.documentElement;
  var gridEl = document.getElementById('grid');
  var chipsEl = document.getElementById('chips');
  var countEl = document.getElementById('count');
  var emptyEl = document.getElementById('empty');
  var resetBtn = document.getElementById('reset');
  var searchEl = document.getElementById('search');
  var clearSearchBtn = document.getElementById('clear-search');
  var themeBtn = document.getElementById('theme-btn');

  var activeCat = '全部';
  var cards = [];
  var themeMode = 'system';
  var darkMedia = window.matchMedia('(prefers-color-scheme: dark)');

  /* ---------- 工具函数 ---------- */
  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  /* 名称 -> 固定色相，保证同一个工具每次颜色一致 */
  function hueOf(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h % 360;
  }

  function firstChar(str) {
    var chars = Array.from(String(str || '?').trim());
    return chars.length ? chars[0] : '?';
  }

  function readThemeMode() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      return THEME_MODES.indexOf(saved) >= 0 ? saved : 'system';
    } catch (err) {
      return 'system';
    }
  }

  function saveThemeMode(mode) {
    try {
      if (mode === 'system') {
        localStorage.removeItem(THEME_KEY);
      } else {
        localStorage.setItem(THEME_KEY, mode);
      }
    } catch (err) {
      /* 隐私模式下 localStorage 可能不可用，忽略即可 */
    }
  }

  /* ---------- 主题 ---------- */
  function effectiveTheme() {
    if (themeMode === 'system') {
      return darkMedia.matches ? 'dark' : 'light';
    }
    return themeMode;
  }

  function applyTheme() {
    var theme = effectiveTheme();
    var label = THEME_LABELS[themeMode];

    root.setAttribute('data-theme', theme);
    root.setAttribute('data-mode', themeMode);

    themeBtn.setAttribute('aria-label', '切换主题，当前：' + label);
    themeBtn.setAttribute('title', '当前：' + label + '（点击切换）');

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#0e1116' : '#f6f7f9');
    }
  }

  themeBtn.addEventListener('click', function () {
    var index = THEME_MODES.indexOf(themeMode);
    themeMode = THEME_MODES[(index + 1) % THEME_MODES.length];
    saveThemeMode(themeMode);
    applyTheme();
  });

  if (typeof darkMedia.addEventListener === 'function') {
    darkMedia.addEventListener('change', function () {
      if (themeMode === 'system') {
        applyTheme();
      }
    });
  } else if (typeof darkMedia.addListener === 'function') {
    darkMedia.addListener(function () {
      if (themeMode === 'system') {
        applyTheme();
      }
    });
  }

  /* ---------- 分类 ---------- */
  function renderChips() {
    chipsEl.innerHTML = '';

    ['全部'].concat(CATEGORIES).forEach(function (cat) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = cat;
      chip.setAttribute('aria-pressed', cat === activeCat ? 'true' : 'false');
      chip.addEventListener('click', function () {
        if (activeCat === cat) return;
        activeCat = cat;
        renderChips();
        applyFilter();
      });
      chipsEl.appendChild(chip);
    });
  }

  /* ---------- 卡片 ---------- */
  function buildCard(tool, index) {
    var card = document.createElement('article');
    card.className = 'card';
    card.dataset.category = tool.category || '';

    var moreId = 'card-more-' + index;
    var name = escapeHtml(tool.name || '未命名');
    var desc = escapeHtml(tool.desc || '');
    var detail = escapeHtml(tool.detail || '');
    var category = escapeHtml(tool.category || '其他');
    var url = typeof tool.url === 'string' ? tool.url.trim() : '';
    var hue = hueOf(String(tool.name || ''));

    var moreHtml = '';
    if (detail) {
      moreHtml += '<p class="card__detail">' + detail + '</p>';
    }
    if (url) {
      moreHtml +=
        '<a class="btn link-btn" href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' +
        '访问官网' +
        '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M14 4h6v6"/><path d="M20 4l-8.5 8.5"/>' +
        '<path d="M19 14.5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V6.5A1.5 1.5 0 0 1 5 5h4.5"/>' +
        '</svg>' +
        '</a>';
    }

    card.innerHTML =
      '<div class="card__head">' +
        '<span class="avatar" style="--h:' + hue + '" aria-hidden="true">' + escapeHtml(firstChar(tool.name)) + '</span>' +
        '<div class="card__title">' +
          '<h2 class="card__name">' + name + '</h2>' +
          '<span class="card__cat">' + category + '</span>' +
        '</div>' +
      '</div>' +
      '<p class="card__desc">' + desc + '</p>' +
      '<button class="card__toggle" type="button" aria-expanded="false" aria-controls="' + moreId + '">' +
        '<span class="card__toggle-label">展开</span>' +
        '<svg class="icon chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
      '</button>' +
      '<div class="card__more" id="' + moreId + '" hidden>' + moreHtml + '</div>';

    var toggle = card.querySelector('.card__toggle');
    var more = card.querySelector('.card__more');

    if (!moreHtml) {
      /* 没有长介绍也没有官网时，展开按钮没有意义 */
      toggle.hidden = true;
    } else {
      toggle.addEventListener('click', function () {
        var open = card.classList.toggle('is-open');
        more.hidden = !open;
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.querySelector('.card__toggle-label').textContent = open ? '收起' : '展开';
      });
    }

    return { el: card, tool: tool };
  }

  function render() {
    gridEl.innerHTML = '';
    cards = [];

    tools.forEach(function (tool, index) {
      var item = buildCard(tool, index);
      cards.push(item);
      gridEl.appendChild(item.el);
    });
  }

  /* ---------- 搜索 + 筛选 ---------- */
  function applyFilter() {
    var keyword = searchEl.value.trim().toLowerCase();
    var visible = 0;

    cards.forEach(function (item) {
      var tool = item.tool;
      var matchCategory = activeCat === '全部' || tool.category === activeCat;
      var matchKeyword = true;

      if (keyword) {
        var haystack = (
          String(tool.name || '') + ' ' +
          String(tool.desc || '') + ' ' +
          String(tool.detail || '')
        ).toLowerCase();
        matchKeyword = haystack.indexOf(keyword) >= 0;
      }

      var show = matchCategory && matchKeyword;
      item.el.hidden = !show;
      if (show) visible++;
    });

    var filtering = keyword !== '' || activeCat !== '全部';
    countEl.textContent = filtering
      ? '找到 ' + visible + ' 个工具'
      : '共 ' + visible + ' 个工具';

    emptyEl.hidden = visible !== 0;
    gridEl.hidden = visible === 0;
    clearSearchBtn.hidden = keyword === '';
  }

  searchEl.addEventListener('input', applyFilter);
  searchEl.addEventListener('search', applyFilter);

  clearSearchBtn.addEventListener('click', function () {
    searchEl.value = '';
    applyFilter();
    searchEl.focus();
  });

  resetBtn.addEventListener('click', function () {
    searchEl.value = '';
    activeCat = '全部';
    renderChips();
    applyFilter();
    searchEl.focus();
  });

  /* ---------- 启动 ---------- */
  themeMode = readThemeMode();
  applyTheme();
  renderChips();
  render();
  applyFilter();
})();
