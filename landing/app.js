(function () {
  var root = document.documentElement;
  var stored = localStorage.getItem('theme');
  if (stored) {
    root.setAttribute('data-theme', stored);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
  }
  updateThemeIcon();

  document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    populateStats();
    renderPhases();
    initModal();
    initCopyButtons();
    initStreamingTagline();
    initSmoothScroll();
    initFadeObserver();
    initFigureCycle();
  });

  function updateThemeIcon() {
    var icon = document.getElementById('themeIcon');
    if (!icon) return;
    var theme = root.getAttribute('data-theme');
    icon.textContent = theme === 'light' ? 'N' : 'D';
  }

  function initThemeToggle() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      var next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon();
    });
    updateThemeIcon();
  }

  function computeStats() {
    var totalLessons = 0;
    var completeLessons = 0;
    for (var i = 0; i < PHASES.length; i++) {
      var lessons = PHASES[i].lessons;
      totalLessons += lessons.length;
      for (var j = 0; j < lessons.length; j++) {
        if (lessons[j].status === 'complete') completeLessons++;
      }
    }
    var completePhases = 0;
    for (var p = 0; p < PHASES.length; p++) {
      if (PHASES[p].status === 'complete') completePhases++;
    }
    return {
      lessons: totalLessons,
      phases: PHASES.length,
      complete: completeLessons,
      completePhases: completePhases
    };
  }

  function setBar(selector, pct) {
    var el = document.querySelector(selector);
    if (!el) return;
    var clamped = Math.max(0, Math.min(100, pct));
    el.style.setProperty('--bar-pct', clamped.toFixed(1) + '%');
  }

  function populateStats() {
    var stats = computeStats();
    var pct = stats.lessons > 0 ? (stats.complete / stats.lessons) * 100 : 0;
    var phasePct = stats.phases > 0 ? (stats.completePhases / stats.phases) * 100 : 0;
    var glossaryCount = (typeof GLOSSARY !== 'undefined') ? GLOSSARY.length : 0;

    setText('[data-stat="complete-frac"]', stats.complete + ' / ' + stats.lessons);
    setText('[data-stat="phases-frac"]', stats.completePhases + ' / ' + stats.phases);
    setText('[data-stat="glossary-count"]', String(glossaryCount));
    setBar('[data-bar="complete"]', pct);
    setBar('[data-bar="phases"]', phasePct);
    setBar('[data-bar="languages"]', 100);
    setBar('[data-bar="glossary"]', glossaryCount > 0 ? 100 : 0);
  }

  function setText(selector, value) {
    var el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  function renderPhases() {
    var grid = document.getElementById('phasesGrid');
    if (!grid) return;
    var html = '';
    for (var i = 0; i < PHASES.length; i++) {
      var p = PHASES[i];
      var total = p.lessons.length;
      var done = 0;
      for (var j = 0; j < p.lessons.length; j++) {
        if (p.lessons[j].status === 'complete') done++;
      }
      var statusClass = p.status.replace(/ /g, '-');
      var roman = toRoman(p.id);
      var num = String(p.id).padStart(2, '0');
      html += '<div class="toc-row" data-phase-index="' + i + '" role="button" tabindex="0" aria-label="Open Phase ' + num + ': ' + escapeHtml(p.name) + '">';
      html += '<span class="toc-num">' + roman + '.</span>';
      html += '<div><span class="toc-status ' + statusClass + '"></span><span class="toc-name">' + escapeHtml(p.name) + '</span></div>';
      html += '<span class="toc-meta">' + done + ' / ' + total + '</span>';
      html += '<span class="toc-meta">' + num + '</span>';
      html += '</div>';
    }
    grid.innerHTML = html;

    // Attach click events
    var rows = grid.querySelectorAll('.toc-row');
    rows.forEach(function (row) {
      row.addEventListener('click', function () {
        var phaseIdx = parseInt(this.getAttribute('data-phase-index'), 10);
        openModalForPhase(phaseIdx);
      });
      row.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var phaseIdx = parseInt(this.getAttribute('data-phase-index'), 10);
          openModalForPhase(phaseIdx);
        }
      });
    });
  }

  function toRoman(num) {
    var lookup = [
      ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
      ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
      ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
    ];
    var roman = '';
    for (var i = 0; i < lookup.length; i++) {
      while (num >= lookup[i][1]) {
        roman += lookup[i][0];
        num -= lookup[i][1];
      }
    }
    return roman;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function initModal() {
    var overlay = document.getElementById('modalOverlay');
    var closeBtn = document.getElementById('modalClose');
    if (!overlay || !closeBtn) return;

    closeBtn.addEventListener('click', function () {
      overlay.classList.remove('open');
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        overlay.classList.remove('open');
      }
    });
  }

  function openModalForPhase(idx) {
    var overlay = document.getElementById('modalOverlay');
    if (!overlay) return;
    var p = PHASES[idx];
    if (!p) return;

    overlay.querySelector('.modal-phase-num').textContent = 'Phase ' + String(p.id).padStart(2, '0');
    overlay.querySelector('.modal-title').textContent = p.name;
    
    var done = 0;
    var listHtml = '';
    for (var i = 0; i < p.lessons.length; i++) {
      var l = p.lessons[i];
      var isDone = l.status === 'complete';
      if (isDone) done++;
      
      listHtml += '<div class="modal-lesson">';
      listHtml += '  <div class="modal-lesson-open">';
      listHtml += '    <div class="modal-lesson-copy">';
      listHtml += '      <span class="modal-lesson-name">' + escapeHtml(l.name) + '</span>';
      listHtml += '      <div class="modal-lesson-meta">';
      listHtml += '        <span class="modal-lesson-type" data-type="' + l.type + '">' + l.type + '</span>';
      listHtml += '        <span>&middot;</span>';
      listHtml += '        <span class="modal-lesson-lang">' + l.lang + '</span>';
      listHtml += '      </div>';
      listHtml += '    </div>';
      listHtml += '    <span class="toc-status ' + (isDone ? 'complete' : 'planned') + '"></span>';
      listHtml += '  </div>';
      listHtml += '</div>';
    }

    overlay.querySelector('.modal-lessons').innerHTML = listHtml;
    
    var pct = p.lessons.length > 0 ? (done / p.lessons.length) * 100 : 0;
    overlay.querySelector('.modal-progress-count').textContent = done + ' / ' + p.lessons.length + ' Completed';
    overlay.querySelector('.modal-progress-pct').textContent = Math.round(pct) + '%';
    overlay.querySelector('.modal-progress-bar-fill').style.transform = 'scaleX(' + (pct / 100) + ')';

    overlay.classList.add('open');
  }

  function initCopyButtons() {
    var btns = document.querySelectorAll('.copy-btn, .copy-chip, #copyInstallCmd, #installCopy');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-copy-value');
        if (!val) {
          if (btn.id === 'copyInstallCmd') val = 'npm install -g helixbox-cli';
          else if (btn.id === 'installCopy') val = 'git clone https://github.com/devndesigner6/helix-box.git';
          else val = btn.previousElementSibling ? btn.previousElementSibling.textContent.trim() : '';
        }
        
        navigator.clipboard.writeText(val).then(function () {
          var copySvg = btn.querySelector('.copy-icon-svg');
          var checkSvg = btn.querySelector('.check-icon-svg');
          var label = btn.querySelector('span:not(.copy-icon-container)') || btn;
          
          var origWidth = btn.getBoundingClientRect().width;
          btn.style.width = origWidth + 'px';
          
          btn.classList.add('copied');
          if (label) label.textContent = 'copied';
          if (copySvg) copySvg.style.display = 'none';
          if (checkSvg) checkSvg.style.display = 'inline-block';
          
          setTimeout(function () {
            btn.classList.remove('copied');
            if (label) label.textContent = 'copy';
            if (copySvg) copySvg.style.display = 'inline-block';
            if (checkSvg) checkSvg.style.display = 'none';
            btn.style.width = '';
          }, 2000);
        });
      });
    });
  }

  function initStreamingTagline() {
    var taglineEl = document.querySelector('.manual-tagline');
    if (!taglineEl) return;
    var text = taglineEl.textContent.trim();
    taglineEl.textContent = '';
    taglineEl.style.opacity = '1';
    
    var words = text.split(/(\s+)/);
    var currentWordIdx = 0;
    var currentText = '';
    
    var caret = document.createElement('span');
    caret.className = 'streaming-caret';
    caret.textContent = '▏';
    taglineEl.appendChild(caret);
    
    function stream() {
      if (currentWordIdx < words.length) {
        var nextPart = words[currentWordIdx];
        currentText += nextPart;
        
        taglineEl.innerHTML = '';
        var textNode = document.createTextNode(currentText);
        taglineEl.appendChild(textNode);
        taglineEl.appendChild(caret);
        
        currentWordIdx++;
        setTimeout(stream, 40);
      } else {
        setTimeout(function () {
          caret.style.opacity = '0';
        }, 1500);
      }
    }
    
    setTimeout(stream, 400);
  }

  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  function initFadeObserver() {
    if (!window.IntersectionObserver) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view', 'visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.toc-row, .section, .manual-title, .manual-tagline').forEach(function (el) {
      observer.observe(el);
    });
  }

  function initFigureCycle() {
    var panels = document.querySelectorAll('.fig-panel');
    var dots = document.querySelectorAll('.fig-dot');
    var caption = document.getElementById('figCaption');
    if (!panels.length) return;

    var captions = [
      "FIG. 001 — Remote execution forward pass: Spawns a lightweight connection layer via secure relays to execute tasks in local PTY terminal.",
      "FIG. 002 — Mobile client pairing code validation: Scans QR code or enters credentials to negotiate an encrypted session password.",
      "FIG. 003 — Micro-billing sync curve: Auto-settles Testnet USDC transactions in background threads based on compute ticks."
    ];

    var activeIdx = 0;

    function showPanel(idx) {
      panels.forEach(function (p, i) {
        if (i === idx) {
          p.classList.add('is-active');
        } else {
          p.classList.remove('is-active');
        }
      });
      dots.forEach(function (d, i) {
        if (i === idx) {
          d.classList.add('is-active');
        } else {
          d.classList.remove('is-active');
        }
      });
      if (caption) {
        caption.textContent = captions[idx];
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        activeIdx = i;
        showPanel(activeIdx);
      });
    });

    setInterval(function () {
      activeIdx = (activeIdx + 1) % panels.length;
      showPanel(activeIdx);
    }, 6000);

    // Initial show
    showPanel(activeIdx);
  }

})();
