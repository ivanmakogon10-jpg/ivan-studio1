/* =============================================================
   ИВАН STUDIO — ИНТЕРАКТИВ
   Без библиотек. Всё содержимое приходит из data.js.
   ============================================================= */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var money = function (n) { return new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽'; };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ---------- КОНТАКТЫ: единый источник — data.js ---------- */
  function applyContacts() {
    var map = {
      tg:   { href: CONTACTS.telegramUrl, text: CONTACTS.telegramHandle },
      mail: { href: 'mailto:' + CONTACTS.email, text: CONTACTS.email },
      tel:  { href: CONTACTS.phoneHref, text: CONTACTS.phone }
    };
    Object.keys(map).forEach(function (k) {
      $$('[data-c="' + k + '"]').forEach(function (a) { if (a.tagName === 'A') a.href = map[k].href; });
      $$('[data-c-text="' + k + '"]').forEach(function (s) { s.textContent = map[k].text; });
    });
  }

  /* ---------- ТЕМА ---------- */
  var root = document.documentElement;
  var themeBtn = $('#themeBtn');

  function currentTheme() {
    var saved = null;
    try { saved = localStorage.getItem('ivan-theme'); } catch (e) {}
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function paintTheme(t) {
    root.setAttribute('data-theme', t);
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#08090C' : '#EFF1F5');
    repaintCanvases();
  }
  function setTheme(t, animate) {
    try { localStorage.setItem('ivan-theme', t); } catch (e) {}
    if (animate && !reduced.matches) {
      document.body.classList.add('theme-shift');
      window.setTimeout(function () { document.body.classList.remove('theme-shift'); }, 520);
    }
    paintTheme(t);
  }
  paintTheme(currentTheme());
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    var saved = null;
    try { saved = localStorage.getItem('ivan-theme'); } catch (err) {}
    if (!saved) paintTheme(e.matches ? 'dark' : 'light');
  });

  /* ---------- КУРСОР ---------- */
  var cursor = $('#cursor');
  var cLabel = $('#cursorLabel');
  if (cursor && fine.matches && !reduced.matches) {
    document.body.classList.add('cursor-on');
    var cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy, raf = null;
    var loop = function () {
      cx += (tx - cx) * 0.19; cy += (ty - cy) * 0.19;
      cursor.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    document.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      cursor.classList.add('on');
    }, { passive: true });
    document.addEventListener('mouseleave', function () { cursor.classList.remove('on'); });

    document.addEventListener('mouseover', function (e) {
      var labelled = e.target.closest('[data-cursor]');
      if (labelled) {
        cursor.dataset.mode = 'label';
        cLabel.textContent = labelled.getAttribute('data-cursor');
        return;
      }
      var link = e.target.closest('a, button, label, [role="button"], input, textarea, summary');
      cursor.dataset.mode = link ? 'link' : '';
      cLabel.textContent = '';
    }, { passive: true });
  }

  /* ---------- МАГНИТНЫЕ КНОПКИ ---------- */
  function magnetise(node) {
    if (!fine.matches || reduced.matches) return;
    var max = 9;
    node.addEventListener('mousemove', function (e) {
      var r = node.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      node.style.transform = 'translate(' + (dx * max).toFixed(1) + 'px,' + (dy * max * 0.7).toFixed(1) + 'px)';
    });
    node.addEventListener('mouseleave', function () { node.style.transform = ''; });
  }
  function wireMagnets(scope) { $$('[data-magnetic]', scope || document).forEach(magnetise); }

  /* ---------- НАВИГАЦИЯ ---------- */
  var nav = $('#nav'), navInk = $('#navInk'), burger = $('#burger'), sheet = $('#sheet');

  var onScroll = function () { nav.classList.toggle('stuck', window.scrollY > 24); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function moveInk(link) {
    if (!link || !navInk) return;
    navInk.style.width = link.offsetWidth + 'px';
    navInk.style.transform = 'translateX(' + link.offsetLeft + 'px)';
    navInk.classList.add('on');
  }
  var navLinks = $$('.nav__link');
  var sectionsById = {};
  navLinks.forEach(function (l) {
    var id = l.getAttribute('href').slice(1);
    var s = document.getElementById(id);
    if (s) sectionsById[id] = l;
  });
  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var link = sectionsById[en.target.id];
      navLinks.forEach(function (l) { l.removeAttribute('aria-current'); });
      if (link) { link.setAttribute('aria-current', 'true'); moveInk(link); }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(sectionsById).forEach(function (id) { navObserver.observe(document.getElementById(id)); });
  window.addEventListener('resize', function () { moveInk($('.nav__link[aria-current="true"]')); });

  function toggleSheet(open) {
    sheet.classList.toggle('open', open);
    sheet.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.classList.toggle('is-locked', open);
    if (open) {
      $$('.sheet__link', sheet).forEach(function (a, i) { a.style.transitionDelay = (0.06 + i * 0.05) + 's'; });
    } else {
      $$('.sheet__link', sheet).forEach(function (a) { a.style.transitionDelay = ''; });
    }
  }
  burger.addEventListener('click', function () { toggleSheet(!sheet.classList.contains('open')); });
  $$('.sheet__link, .sheet__foot a', sheet).forEach(function (a) {
    a.addEventListener('click', function () { toggleSheet(false); });
  });

  /* ---------- ГЕНЕРАТИВНЫЕ ОБЛОЖКИ ----------
     Каждая обложка строится под пропорцию своей плитки,
     поэтому композиция не обрезается при кадрировании. */
  function dims(ratio) {
    var m = String(ratio || '4 / 3').split('/');
    var a = parseFloat(m[0]) || 4, b = parseFloat(m[1]) || 3;
    var H = 640, W = Math.round(H * a / b);
    return { w: W, h: H };
  }
  function svgWrap(d, inner) {
    return '<svg viewBox="0 0 ' + d.w + ' ' + d.h + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<rect width="' + d.w + '" height="' + d.h + '" fill="var(--ground-2)"/>' + inner + '</svg>';
  }

  var COVERS = {
    // Карате-клуб — круг додзё и одна линия удара
    arc: function (d) {
      var cx = d.w * 0.5, cy = d.h * 0.5, R = Math.min(d.w, d.h) * 0.43, g = '';
      for (var i = 6; i >= 1; i--) {
        g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R * i / 6).toFixed(1) + '" fill="none" ' +
             'stroke="var(--line-2)" stroke-width="1" opacity="' + (0.3 + i * 0.08).toFixed(2) + '"/>';
      }
      for (var k = 0; k < 32; k++) {
        var a = (k / 32) * Math.PI * 2, len = k % 4 === 0 ? R * 0.09 : R * 0.045;
        g += '<line x1="' + (cx + Math.cos(a) * R).toFixed(1) + '" y1="' + (cy + Math.sin(a) * R).toFixed(1) +
             '" x2="' + (cx + Math.cos(a) * (R + len)).toFixed(1) + '" y2="' + (cy + Math.sin(a) * (R + len)).toFixed(1) +
             '" stroke="var(--line-2)" stroke-width="1"/>';
      }
      var x1 = cx - R * 1.25, y1 = cy + R * 0.95, x2 = cx + R * 1.2, y2 = cy - R * 0.9;
      g += '<path d="M' + x1.toFixed(0) + ' ' + y1.toFixed(0) + 'L' + x2.toFixed(0) + ' ' + y2.toFixed(0) +
           '" stroke="var(--acc)" stroke-width="' + (R * 0.13).toFixed(0) + '" stroke-linecap="round" opacity=".13"/>';
      g += '<path d="M' + x1.toFixed(0) + ' ' + y1.toFixed(0) + 'L' + x2.toFixed(0) + ' ' + y2.toFixed(0) +
           '" stroke="var(--acc)" stroke-width="' + Math.max(6, R * 0.045).toFixed(0) + '" stroke-linecap="round"/>';
      g += '<circle cx="' + x2.toFixed(0) + '" cy="' + y2.toFixed(0) + '" r="' + (R * 0.055).toFixed(0) + '" fill="var(--acc)"/>';
      return svgWrap(d, g);
    },
    // Ресторан — набор меню и подача
    menu: function (d) {
      var L = d.w * 0.08, cx = d.w * 0.72, cy = d.h * 0.5, R = Math.min(d.w, d.h) * 0.3;
      var g = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R.toFixed(0) + '" fill="none" stroke="var(--line-2)"/>' +
              '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R * 0.68).toFixed(0) + '" fill="none" stroke="var(--line-2)"/>' +
              '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R * 0.32).toFixed(0) + '" fill="var(--acc)"/>';
      var ws = [0.40, 0.27, 0.34, 0.20, 0.31];
      for (var i = 0; i < ws.length; i++) {
        var y = d.h * (0.26 + i * 0.12);
        g += '<rect x="' + L.toFixed(0) + '" y="' + y.toFixed(0) + '" width="' + (d.w * ws[i]).toFixed(0) +
             '" height="' + (i === 2 ? 9 : 3) + '" rx="1.5" fill="' + (i === 2 ? 'var(--acc)' : 'var(--line-2)') + '"/>';
      }
      return svgWrap(d, g);
    },
    // Business Landing — поток экранов и конверсия
    flow: function (d) {
      var n = 7, base = d.h * 0.8, bw = d.w * 0.055, gap = (d.w * 0.84 - n * bw) / (n - 1), x0 = d.w * 0.08;
      var hs = [0.20, 0.34, 0.28, 0.46, 0.25, 0.37, 0.17], g = '';
      for (var i = 0; i < n; i++) {
        var h = d.h * hs[i], x = x0 + i * (bw + gap);
        g += '<rect x="' + x.toFixed(0) + '" y="' + (base - h).toFixed(0) + '" width="' + bw.toFixed(0) +
             '" height="' + h.toFixed(0) + '" rx="2" fill="' + (i === 3 ? 'var(--acc)' : 'var(--line-2)') +
             '" opacity="' + (i === 3 ? '1' : '.55') + '"/>';
      }
      g += '<rect x="' + x0.toFixed(0) + '" y="' + (base + 14).toFixed(0) + '" width="' + (d.w * 0.84).toFixed(0) + '" height="2" fill="var(--line-2)"/>';
      g += '<rect x="' + x0.toFixed(0) + '" y="' + (d.h * 0.1).toFixed(0) + '" width="' + (d.w * 0.22).toFixed(0) + '" height="8" rx="4" fill="var(--acc)"/>';
      g += '<rect x="' + x0.toFixed(0) + '" y="' + (d.h * 0.16).toFixed(0) + '" width="' + (d.w * 0.14).toFixed(0) + '" height="4" rx="2" fill="var(--line-2)"/>';
      return svgWrap(d, g);
    },
    // Концепты — буква проекта на точечной сетке
    ghost: function (d, letter) {
      var id = 'dg' + letter;
      var g = '<defs><pattern id="' + id + '" width="26" height="26" patternUnits="userSpaceOnUse">' +
              '<circle cx="1.6" cy="1.6" r="1.6" fill="var(--line-2)"/></pattern></defs>' +
              '<rect width="' + d.w + '" height="' + d.h + '" fill="url(#' + id + ')" opacity=".7"/>' +
              '<text x="' + (d.w / 2) + '" y="' + (d.h / 2) + '" text-anchor="middle" dominant-baseline="central" ' +
              'font-family="Onest, sans-serif" font-size="' + (d.h * 0.6).toFixed(0) + '" font-weight="300" ' +
              'fill="none" stroke="var(--acc)" stroke-width="2" opacity=".6">' + letter + '</text>';
      return svgWrap(d, g);
    }
  };

  function coverFor(p, ratio) {
    if (p.image) return '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + ' — превью проекта" loading="lazy" decoding="async">';
    var d = dims(ratio || (p.span && p.span.ratio));
    if (p.cover === 'ghost' || p.letter) return COVERS.ghost(d, p.letter || 'A');
    return (COVERS[p.cover] || COVERS.flow)(d);
  }

  /* ---------- СХЕМЫ ЭТАПОВ ---------- */
  var VIS_W = 420, VIS_H = 180;
  function visWrap(inner) {
    return '<svg viewBox="0 0 ' + VIS_W + ' ' + VIS_H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<rect width="' + VIS_W + '" height="' + VIS_H + '" fill="var(--ground-2)"/>' + inner + '</svg>';
  }
  var STEP_VIS = [
    // 01 Исследование — поле данных и область внимания
    function () {
      var g = '';
      for (var y = 0; y < 7; y++) for (var x = 0; x < 16; x++) {
        var on = (x > 4 && x < 11 && y > 1 && y < 5) && ((x + y) % 3 === 0);
        g += '<circle cx="' + (30 + x * 24) + '" cy="' + (24 + y * 22) + '" r="' + (on ? 3.2 : 1.8) + '" fill="' +
             (on ? 'var(--acc)' : 'var(--line-2)') + '"/>';
      }
      g += '<rect x="112" y="34" width="168" height="94" fill="none" stroke="var(--acc)" stroke-width="1.2" stroke-dasharray="5 5"/>';
      return visWrap(g);
    },
    // 02 Структура — дерево разделов
    function () {
      var g = '<rect x="176" y="20" width="68" height="24" rx="2" fill="var(--acc)"/>';
      var xs = [70, 176, 282];
      g += '<path d="M210 44v22M' + 104 + ' 66h212M104 66v20M210 66v20M316 66v20" stroke="var(--line-2)" stroke-width="1.2" fill="none"/>';
      for (var i = 0; i < 3; i++) {
        g += '<rect x="' + xs[i] + '" y="86" width="68" height="22" rx="2" fill="none" stroke="var(--line-2)"/>';
        g += '<rect x="' + (xs[i] + 10) + '" y="120" width="48" height="6" rx="3" fill="var(--line-2)" opacity=".7"/>';
        g += '<rect x="' + (xs[i] + 10) + '" y="134" width="30" height="6" rx="3" fill="var(--line-2)" opacity=".45"/>';
      }
      return visWrap(g);
    },
    // 03 Интерфейс — каркас экрана
    function () {
      var g = '<rect x="24" y="22" width="372" height="136" rx="3" fill="none" stroke="var(--line-2)"/>' +
              '<rect x="24" y="22" width="372" height="22" fill="var(--line-2)" opacity=".35"/>' +
              '<rect x="24" y="44" width="86" height="114" fill="var(--line-2)" opacity=".18"/>';
      for (var i = 0; i < 4; i++) {
        g += '<rect x="36" y="' + (58 + i * 22) + '" width="' + (62 - i * 6) + '" height="6" rx="3" fill="var(--line-2)"/>';
      }
      g += '<rect x="126" y="58" width="120" height="10" rx="2" fill="var(--acc)"/>';
      g += '<rect x="126" y="76" width="200" height="6" rx="3" fill="var(--line-2)"/>';
      g += '<rect x="126" y="88" width="160" height="6" rx="3" fill="var(--line-2)" opacity=".6"/>';
      g += '<rect x="126" y="112" width="112" height="32" rx="2" fill="none" stroke="var(--acc)"/>';
      g += '<rect x="250" y="112" width="112" height="32" rx="2" fill="none" stroke="var(--line-2)"/>';
      return visWrap(g);
    },
    // 04 Движение — кривая перехода
    function () {
      var g = '<path d="M32 148 C 140 148, 150 34, 300 34" fill="none" stroke="var(--acc)" stroke-width="2"/>' +
              '<path d="M32 148 H388 M32 148 V26" stroke="var(--line-2)" stroke-width="1"/>' +
              '<path d="M32 148 L140 148 M300 34 L300 148" stroke="var(--line-2)" stroke-width="1" stroke-dasharray="4 4"/>' +
              '<circle cx="32" cy="148" r="4" fill="var(--acc)"/>' +
              '<circle cx="300" cy="34" r="4" fill="var(--acc)"/>';
      for (var i = 1; i <= 5; i++) {
        g += '<circle cx="' + (300 + i * 17) + '" cy="34" r="' + (3.2 - i * 0.5) + '" fill="var(--acc)" opacity="' + (0.6 - i * 0.1).toFixed(2) + '"/>';
      }
      return visWrap(g);
    }
  ];

  /* ---------- ДЫМКА НА CANVAS ---------- */
  var canvases = [];
  function mulberry(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function cssVar(n) { return getComputedStyle(root).getPropertyValue(n).trim(); }

  function drawHaze(cv, seed) {
    var box = cv.parentElement.getBoundingClientRect();
    if (!box.width || !box.height) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(box.width * dpr);
    cv.height = Math.round(box.height * dpr);
    var ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, box.width, box.height);
    var rnd = mulberry(seed * 977 + 13);
    var c1 = cssVar('--haze-1') || '#C9D6FF';
    var c2 = cssVar('--haze-2') || '#2E5CF0';
    for (var i = 0; i < 9; i++) {
      var x = (0.1 + rnd() * 0.8) * box.width;
      var y = (0.1 + rnd() * 0.8) * box.height;
      var r = (0.34 + rnd() * 0.5) * Math.max(box.width, box.height);
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, i % 2 ? c2 : c1);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = 0.14 + rnd() * 0.16;
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    // тонкая сетка поверх — поле читается как графика, а не как размытое фото
    ctx.globalAlpha = 1;
    ctx.strokeStyle = cssVar('--line-2') || '#C4CAD6';
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1;
    for (var gx = 24; gx < box.width; gx += 24) {
      ctx.beginPath(); ctx.moveTo(gx + 0.5, 0); ctx.lineTo(gx + 0.5, box.height); ctx.stroke();
    }
    for (var gy = 24; gy < box.height; gy += 24) {
      ctx.beginPath(); ctx.moveTo(0, gy + 0.5); ctx.lineTo(box.width, gy + 0.5); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  function mountHaze(host, seed) {
    var cv = document.createElement('canvas');
    host.appendChild(cv);
    canvases.push({ cv: cv, seed: seed });
    drawHaze(cv, seed);
  }
  function repaintCanvases() {
    // может вызываться до инициализации списка (paintTheme на старте)
    if (!canvases || !canvases.length) return;
    canvases.forEach(function (c) { drawHaze(c.cv, c.seed); });
  }
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(repaintCanvases, 180);
  }, { passive: true });

  /* ---------- РАБОТЫ ---------- */
  var worksGrid = $('#worksGrid');

  function projectCard(p) {
    var a = document.createElement('button');
    a.type = 'button';
    a.className = 'pj';
    a.style.setProperty('--col', p.span.col);
    a.style.setProperty('--ratio', p.span.ratio);
    a.setAttribute('data-id', p.id);
    a.setAttribute('data-cursor', 'Открыть');
    a.setAttribute('aria-label', 'Открыть проект: ' + p.title);
    a.innerHTML =
      '<div class="pj__frame">' +
        '<div class="pj__media">' + coverFor(p) + '</div>' +
        (p.image ? '' : '<span class="pj__hint mono">Превью — место под изображение</span>') +
        '<span class="pj__chip mono">Смотреть кейс</span>' +
      '</div>' +
      '<div class="pj__body">' +
        '<span class="pj__num mono">' + esc(p.number) + '</span>' +
        '<span class="pj__title">' + esc(p.title) + '</span>' +
        '<span class="pj__sum">' + esc(p.summary) + '</span>' +
        '<span class="pj__cats mono">' + p.categories.map(esc).join(' / ') + '</span>' +
      '</div>';
    a.addEventListener('click', function () { openCase(p, a); });
    return a;
  }

  function conceptPanel() {
    var box = document.createElement('div');
    box.className = 'cpanel';
    box.style.setProperty('--col', 'span 4');
    var rows = CONCEPTS.map(function (c) {
      return '<div class="crow" data-cursor="Скоро">' +
        '<span class="crow__n mono">' + esc(c.number) + '</span>' +
        '<span class="crow__t">' + esc(c.title) + '</span>' +
        '<span class="crow__s mono">Скоро</span>' +
      '</div>';
    }).join('');
    box.innerHTML =
      '<h3>Концептуальные проекты</h3>' +
      '<div class="cpanel__list">' + rows + '</div>' +
      '<div class="cpanel__foot">' +
        '<p>Собственные кейсы — в работе. Появятся здесь.</p>' +
        '<a class="dot-btn" href="#brief" aria-label="Перейти к заявке">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 5v14M5 12h14"/></svg>' +
        '</a>' +
      '</div>';
    return box;
  }

  if (worksGrid) {
    PROJECTS.forEach(function (p) { worksGrid.appendChild(projectCard(p)); });
    worksGrid.appendChild(conceptPanel());
    var total = PROJECTS.length + CONCEPTS.length;
    $('#worksCount').textContent = '01 — ' + String(total).padStart(2, '0');
  }

  /* ---------- КЕЙС ---------- */
  var caseEl = $('#case'), caseBody = $('#caseBody'), caseKicker = $('#caseKicker'), lastTrigger = null;

  function row(term, value) {
    var empty = !value || (Array.isArray(value) && !value.length);
    var text = empty ? 'Раздел в подготовке' : (Array.isArray(value) ? value.join(', ') : value);
    return '<div class="case__row"><dt class="mono">' + esc(term) + '</dt>' +
           '<dd' + (empty ? ' class="empty"' : '') + '>' + esc(text) + '</dd></div>';
  }

  function openCase(p, trigger) {
    lastTrigger = trigger || null;
    caseKicker.textContent = 'Проект / ' + p.number;
    var c = p.case || {};
    caseBody.innerHTML =
      '<p class="mono" style="color:var(--ink-3)">' + p.categories.map(esc).join(' / ') + '</p>' +
      '<h1 class="case__title" id="caseTitle">' + esc(p.title) + '</h1>' +
      '<p class="case__sum">' + esc(p.summary) + '</p>' +
      '<div class="case__cover">' + coverFor(p, '16 / 9') + '</div>' +
      '<dl class="case__dl">' +
        row('Задача', c.task) +
        row('Решение', c.solution) +
        row('Роль', c.role) +
        row('Технологии', c.stack) +
        row('Процесс', c.process) +
      '</dl>' +
      '<p class="case__note">Материалы проекта готовятся к публикации. Структура кейса уже собрана — задача, решение, процесс и финальные экраны добавятся в этот раздел.</p>';
    caseEl.classList.add('open');
    caseEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    caseEl.scrollTop = 0;
    $('#caseClose').focus({ preventScroll: true });
    try { history.pushState({ project: p.id }, '', '#project-' + p.id); } catch (e) {}
  }

  function closeCase(fromPop) {
    if (!caseEl.classList.contains('open')) return;
    caseEl.classList.remove('open');
    caseEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    if (!fromPop) { try { history.back(); } catch (e) {} }
  }
  $('#caseClose').addEventListener('click', function () { closeCase(false); });
  window.addEventListener('popstate', function () { closeCase(true); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (caseEl.classList.contains('open')) closeCase(false);
    else if (sheet.classList.contains('open')) toggleSheet(false);
  });

  /* ---------- ПОДХОД ---------- */
  var stepsBox = $('#steps');
  if (stepsBox) {
    APPROACH.forEach(function (s, i) {
      var d = document.createElement('div');
      d.className = 'step';
      d.innerHTML =
        '<span class="step__n">' + esc(s.number) + '</span>' +
        '<div class="step__txt">' +
          '<span class="mono">' + esc(s.number) + '</span>' +
          '<h3>' + esc(s.title) + '</h3>' +
          '<p>' + esc(s.text) + '</p>' +
          '<p>' + esc(s.detail) + '</p>' +
        '</div>' +
        '<div class="step__vis plate">' + STEP_VIS[i % STEP_VIS.length]() + '</div>' +
        '<span class="dot-btn step__go" aria-hidden="true">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 12h15M13 6l6 6-6 6"/></svg>' +
        '</span>';
      stepsBox.appendChild(d);
    });
    var stepObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('active', en.isIntersecting); });
    }, { rootMargin: '-42% 0px -42% 0px' });
    $$('.step', stepsBox).forEach(function (s) { stepObs.observe(s); });
  }

  /* ---------- О СТУДИИ ---------- */
  var aboutGrid = $('#aboutGrid');
  if (aboutGrid) {
    aboutGrid.innerHTML =
      '<div class="about__text">' +
        '<p class="eyebrow mono">' + esc(ABOUT.label) + '</p>' +
        '<p>' + esc(ABOUT.text) + '</p>' +
        '<p class="about__kicker">' + esc(ABOUT.kicker) + '</p>' +
      '</div>' +
      '<div class="portrait plate">' +
        (ABOUT.portrait
          ? '<img src="' + esc(ABOUT.portrait) + '" alt="Портрет" loading="lazy" decoding="async">'
          : '<span class="mono">Место под портрет</span>') +
      '</div>' +
      '<ul class="roles">' + ABOUT.roles.map(function (r) {
        return '<li class="role"><i aria-hidden="true"></i>' + esc(r) + '</li>';
      }).join('') + '</ul>';
    if (!ABOUT.portrait) mountHaze($('.portrait', aboutGrid), 21);
  }

  /* ---------- УСЛУГИ ---------- */
  var svcGrid = $('#svcGrid');
  if (svcGrid) {
    SERVICES.forEach(function (s, i) {
      var d = document.createElement('article');
      d.className = 'svc';
      d.innerHTML =
        '<p class="svc__n">' + String(i + 1).padStart(2, '0') + '</p>' +
        '<h3 class="svc__title">' + esc(s.title) + '</h3>' +
        '<p class="svc__price">От ' + money(s.price) + '</p>' +
        '<p class="svc__scope">' + esc(s.scope) + '</p>';
      svcGrid.appendChild(d);
    });
  }
  $$('.plate[data-haze]').forEach(function (p, i) { mountHaze(p, 41 + i * 7); });

  /* ---------- КАЛЬКУЛЯТОР ---------- */
  var calcForm = $('#calcForm'), calcRail = $('#calcRail'), calcSum = $('#calcSum');
  var calcGroups = [
    { key: 'type',   n: '01', kind: 'radio' },
    { key: 'scope',  n: '02', kind: 'radio' },
    { key: 'extras', n: '03', kind: 'checkbox' },
    { key: 'volume', n: '04', kind: 'radio' }
  ];

  if (calcForm) {
    calcRail.innerHTML = calcGroups.map(function (g) {
      return '<span>' + g.n + ' <b>' + esc(CALC[g.key].label) + '</b></span>';
    }).join('');

    calcGroups.forEach(function (g) {
      var cfg = CALC[g.key];
      var fs = document.createElement('fieldset');
      fs.className = 'fset';
      var def = cfg.def || (cfg.options[0] || {}).id;
      var opts = cfg.options.map(function (o) {
        var id = 'c-' + g.key + '-' + o.id;
        var checked = (g.kind === 'radio' && o.id === def) ? ' checked' : '';
        return '<label class="opt">' +
          '<input type="' + g.kind + '" id="' + id + '" name="calc-' + g.key + '" value="' + o.id + '"' + checked + '>' +
          '<span>' + esc(o.label) + '</span></label>';
      }).join('');
      fs.innerHTML = '<legend class="mono">' + g.n + ' · ' + esc(cfg.label) + '</legend>' +
                     '<div class="opts ' + (g.key === 'extras' || g.key === 'volume' ? 'opts--2' : '') + '">' + opts + '</div>';
      calcForm.appendChild(fs);
    });

    var lastEstimate = null;

    var recalc = function () {
      var typeId = (calcForm.querySelector('[name="calc-type"]:checked') || {}).value;
      var scopeId = (calcForm.querySelector('[name="calc-scope"]:checked') || {}).value;
      var volId = (calcForm.querySelector('[name="calc-volume"]:checked') || {}).value;
      var find = function (k, id) { return CALC[k].options.filter(function (o) { return o.id === id; })[0]; };
      var t = find('type', typeId), s = find('scope', scopeId), v = find('volume', volId);
      if (!t || !s || !v) return;
      var base = t.base * s.mult * v.mult;
      var add = 0;
      $$('[name="calc-extras"]:checked', calcForm).forEach(function (inp) {
        var o = find('extras', inp.value);
        if (o) add += o.add;
      });
      var low = Math.round(base * (1 + add) / 1000) * 1000;
      var high = Math.round(low * 1.35 / 1000) * 1000;
      calcSum.innerHTML = 'от <b>' + money(low) + '</b> до ' + money(high);
      lastEstimate = { low: low, high: high, type: t, scope: s, volume: v,
        extras: $$('[name="calc-extras"]:checked', calcForm).map(function (i) {
          return find('extras', i.value).label;
        }) };
    };
    calcForm.addEventListener('change', recalc);
    recalc();

    $('#calcGo').addEventListener('click', function () {
      if (lastEstimate) prefillBrief(lastEstimate);
      var target = document.getElementById('brief');
      target.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
    });
  }

  /* ---------- ЗАЯВКА ---------- */
  var briefForm = $('#briefForm'), briefMain = $('#briefMain'), briefTicks = $('#briefTicks');
  var answers = {};
  var stepIndex = 0;
  var sending = false;

  try {
    var draft = JSON.parse(localStorage.getItem('ivan-brief-draft') || '{}');
    if (draft && typeof draft === 'object') answers = draft;
  } catch (e) {}

  function saveDraft() {
    try { localStorage.setItem('ivan-brief-draft', JSON.stringify(answers)); } catch (e) {}
  }

  function renderTicks() {
    briefTicks.innerHTML = BRIEF_STEPS.map(function (s, i) {
      var cls = i === stepIndex ? 'now' : (answers[s.id] !== undefined && answers[s.id] !== '' ? 'done' : '');
      return '<button class="tick ' + cls + '" type="button" data-goto="' + i + '"' +
        (i > stepIndex && !answers[s.id] ? ' disabled' : '') + '>' +
        '<span class="mono">' + s.number + '</span><span class="tick__t">' + esc(shortLabel(s)) + '</span></button>';
    }).join('');
    $$('[data-goto]', briefTicks).forEach(function (b) {
      b.addEventListener('click', function () {
        var i = Number(b.getAttribute('data-goto'));
        if (i <= stepIndex) { stepIndex = i; renderStep(); }
      });
    });
    var now = $('.tick.now', briefTicks);
    if (now && briefTicks.scrollWidth > briefTicks.clientWidth) {
      briefTicks.scrollTo({ left: now.offsetLeft - 20, behavior: reduced.matches ? 'auto' : 'smooth' });
    }
  }

  function shortLabel(s) {
    return { product: 'Что нужно создать?', work: 'Что нужно сделать?', budget: 'Какой бюджет?',
             timing: 'Когда запуск?', contact: 'Контакты', about: 'Описание' }[s.id] || s.question;
  }

  function renderStep() {
    var s = BRIEF_STEPS[stepIndex];
    var body = '';

    if (s.type === 'choice') {
      body = '<div class="tiles">' + s.options.map(function (o, i) {
        var id = 'b-' + s.id + '-' + i;
        var checked = answers[s.id] === o ? ' checked' : '';
        return '<label class="tile"><input type="radio" id="' + id + '" name="b-' + s.id + '" value="' + esc(o) + '"' + checked + '>' +
               '<span>' + esc(o) + '</span></label>';
      }).join('') + '</div>';
    } else if (s.type === 'contact') {
      body = '<div class="grid2">' + s.fields.map(function (f) {
        var val = answers[f.id] ? esc(answers[f.id]) : '';
        return '<div class="field" data-field="' + f.id + '">' +
          '<label class="mono" for="f-' + f.id + '">' + esc(f.label) + (f.required ? ' *' : '') + '</label>' +
          '<input id="f-' + f.id + '" name="' + f.id + '" type="' + f.type + '" autocomplete="' + f.autocomplete + '" ' +
          'value="' + val + '" placeholder="' + esc(f.placeholder || '') + '">' +
          '<span class="err"></span></div>';
      }).join('') + '</div>';
    } else {
      body = '<div class="field"><label class="vh" for="f-about">Описание проекта</label>' +
        '<textarea id="f-about" name="about" placeholder="' + esc(s.placeholder) + '">' + esc(answers.about || '') + '</textarea>' +
        '<span class="err"></span></div>';
    }

    var isLast = stepIndex === BRIEF_STEPS.length - 1;
    briefMain.innerHTML =
      '<div class="stage-in">' +
        '<p class="mono" style="color:var(--ink-3)">Шаг ' + s.number + ' / 06</p>' +
        '<h3 class="brief__q">' + esc(s.question) + '</h3>' +
        (s.hint ? '<p class="brief__hint">' + esc(s.hint) + '</p>' : '') +
        '<div class="brief__fields">' + body + '</div>' +
        '<p class="brief__err" id="briefErr" role="alert"></p>' +
      '</div>' +
      '<div class="brief__nav">' +
        (stepIndex > 0 ? '<button class="brief__back" type="button" id="briefBack">← Назад</button>' : '') +
        '<button class="btn" type="button" id="briefNext" data-magnetic>' + (isLast ? 'Отправить заявку' : 'Далее') +
          '<svg class="arr" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>' +
        '</button>' +
        '<span class="brief__count mono">' + s.number + ' / 06</span>' +
      '</div>';

    wireMagnets(briefMain);
    renderTicks();

    $$('input[type="radio"]', briefMain).forEach(function (r) {
      r.addEventListener('change', function () { answers[BRIEF_STEPS[stepIndex].id] = r.value; saveDraft(); renderTicks(); });
    });
    $$('input[type="text"], input[type="tel"], input[type="email"], textarea', briefMain).forEach(function (f) {
      f.addEventListener('input', function () {
        answers[f.name] = f.value;
        saveDraft();
        var wrap = f.closest('.field');
        if (wrap) wrap.classList.remove('bad');
      });
    });

    var back = $('#briefBack');
    if (back) back.addEventListener('click', function () { stepIndex--; renderStep(); });
    $('#briefNext').addEventListener('click', onNext);
  }

  function setErr(msg) { var e = $('#briefErr'); if (e) e.textContent = msg || ''; }
  function fieldErr(id, msg) {
    var w = briefMain.querySelector('[data-field="' + id + '"]');
    if (!w) return;
    w.classList.add('bad');
    $('.err', w).textContent = msg;
  }

  function validate() {
    var s = BRIEF_STEPS[stepIndex];
    setErr('');
    $$('.field', briefMain).forEach(function (w) { w.classList.remove('bad'); });

    if (s.type === 'choice') {
      if (!answers[s.id]) { setErr('Выберите один из вариантов.'); return false; }
      return true;
    }
    if (s.type === 'contact') {
      var ok = true;
      var name = (answers.name || '').trim();
      var tg = (answers.telegram || '').trim();
      var phone = (answers.phone || '').trim();
      var mail = (answers.email || '').trim();

      if (name.length < 2) { fieldErr('name', 'Введите имя — как к вам обращаться.'); ok = false; }
      if (mail && !/^[^\s@]+@[^\s@]+\.[a-zA-Zа-яА-Я]{2,}$/.test(mail)) {
        fieldErr('email', 'Проверьте адрес: нужен формат name@mail.ru'); ok = false;
      }
      if (phone && phone.replace(/\D/g, '').length < 10) {
        fieldErr('phone', 'Номер слишком короткий — нужно минимум 10 цифр.'); ok = false;
      }
      if (!tg && !phone && !mail) { setErr('Оставьте хотя бы один способ связи: Telegram, телефон или email.'); ok = false; }
      else if (!ok) setErr('Поправьте отмеченные поля — остальные ответы сохранены.');
      return ok;
    }
    return true;
  }

  function onNext() {
    if (sending) return;
    if (!validate()) {
      var bad = $('.field.bad input', briefMain);
      if (bad) bad.focus();
      return;
    }
    if (stepIndex < BRIEF_STEPS.length - 1) { stepIndex++; renderStep(); return; }
    send();
  }

  function send() {
    sending = true;
    var btn = $('#briefNext');
    if (btn) { btn.textContent = 'Отправляем…'; btn.disabled = true; }

    var payload = {
      'Что создать': answers.product || '',
      'Что сделать': answers.work || '',
      'Бюджет': answers.budget || '',
      'Сроки': answers.timing || '',
      'Имя': answers.name || '',
      'Telegram': answers.telegram || '',
      'Телефон': answers.phone || '',
      'Email': answers.email || '',
      'О проекте': answers.about || ''
    };

    Promise.resolve(submitBrief(payload)).then(function () {
      try { localStorage.removeItem('ivan-brief-draft'); } catch (e) {}
      briefTicks.innerHTML = '';
      briefMain.innerHTML =
        '<div class="brief__done stage-in">' +
          '<span class="ok" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 13 4.5 4.5L19 7"/></svg></span>' +
          '<h3>Заявка отправлена.</h3>' +
          '<p>Свяжусь с вами для обсуждения проекта.</p>' +
        '</div>';
      briefMain.setAttribute('role', 'status');
    }).catch(function () {
      sending = false;
      if (btn) { btn.textContent = 'Отправить заявку'; btn.disabled = false; }
      setErr('Не получилось отправить. Напишите в Telegram ' + CONTACTS.telegramHandle + ' — отвечу там.');
    });
  }

  function prefillBrief(est) {
    var typeMap = { landing: 'Landing', corporate: 'Корпоративный сайт', shop: 'Интернет-магазин', turnkey: 'Другое', uxui: 'Digital product' };
    var scopeMap = { design: 'Только дизайн', dev: 'Только разработка', both: 'Дизайн + разработка' };
    answers.product = typeMap[est.type.id] || 'Другое';
    answers.work = scopeMap[est.scope.id] || 'Дизайн + разработка';
    answers.budget = est.low < 50000 ? '25–50 тыс. ₽'
      : est.low < 100000 ? '50–100 тыс. ₽'
      : est.low < 200000 ? '100–200 тыс. ₽' : '200 тыс. ₽+';
    var lines = ['Из калькулятора: ' + est.type.label + ', ' + est.scope.label.toLowerCase() + ', ' + est.volume.label.toLowerCase() + '.'];
    if (est.extras.length) lines.push('Дополнительно: ' + est.extras.join(', ') + '.');
    lines.push('Ориентир: ' + money(est.low) + ' — ' + money(est.high) + '.');
    answers.about = lines.join(' ');
    stepIndex = 0;
    saveDraft();
    renderStep();
  }

  if (briefForm) {
    briefForm.addEventListener('submit', function (e) { e.preventDefault(); onNext(); });
    renderStep();
  }

  /* ---------- ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ ---------- */
  if (!reduced.matches && 'IntersectionObserver' in window) {
    var targets = $$('.sec-head, .pj, .cpanel, .step, .svc, .calc, .brief__box, .ccard, .finale__grid > div, .about__grid > *');
    var vh = window.innerHeight;
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); revealObs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    targets.forEach(function (t, i) {
      if (t.getBoundingClientRect().top < vh * 0.92) return; // видимое сразу — не прячем
      t.classList.add('js-reveal');
      t.style.transitionDelay = ((i % 4) * 0.06) + 's';
      revealObs.observe(t);
    });
  }

  /* ---------- ПАРАЛЛАКС ОБЪЕКТА ---------- */
  var stage = $('#markStage');
  if (stage && fine.matches && !reduced.matches) {
    var hero = $('#top');
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      stage.style.transform = 'rotateY(' + (dx * 15).toFixed(2) + 'deg) rotateX(' + (-dy * 13).toFixed(2) + 'deg)';
      stage.style.transition = 'transform .5s cubic-bezier(.22,.68,0,1)';
    }, { passive: true });
    hero.addEventListener('mouseleave', function () { stage.style.transform = ''; });
  }

  /* ---------- МЕЛОЧИ ---------- */
  applyContacts();
  wireMagnets(document);
  $('#year').textContent = new Date().getFullYear();
})();
