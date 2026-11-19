/* Kearsarge fit guide, one product at a time. SCRIPTED DEMO, not a live AI model.
   KG_FIT.answer(product, text, profile) is the brain. To make it real, replace it
   with a call to a small server that sends the product's specs, size chart, FAQ and
   the shopper's profile to a language model and returns the same shape:
   { text, why?, chips?, size?, label? }.
   KG_FIT.open(product, { mode, onSize }) opens the panel on a product page. */
(function () {
  var S = window.KG_SHOP;
  var SIZES = ['XS', 'S', 'M', 'L', 'XL'];
  var HEIGHT_CHIPS = ['5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"'];

  /* ---------- Parsing ---------- */
  function parseHeight(t) {
    var m = t.match(/\b([456])\s*(?:'|’|ft|foot|feet)\s*(\d{1,2})?\s*(?:"|”|in|inch|inches)?/i) ||
            t.match(/\b([456])\s+(\d{1,2})\b(?!\s*(?:lb|lbs|kg|waist))/i);
    if (m) { var ft = +m[1], inch = m[2] ? +m[2] : 0; if (inch < 12) return ft * 12 + inch; }
    var cm = t.match(/\b(1[4-9]\d)\s*cm\b/i);
    return cm ? Math.round(+cm[1] / 2.54) : null;
  }
  function parseSize(t) {
    t = t.replace(/\b(medium build|small frame|large frame)\b/ig, '');
    var map = { 'extra small': 'XS', 'x-small': 'XS', 'xsmall': 'XS', 'xs': 'XS', 'small': 'S', 'medium': 'M', 'med': 'M', 'large': 'L', 'extra large': 'XL', 'x-large': 'XL', 'xl': 'XL' };
    var m = t.toLowerCase().match(/\b(extra small|x-small|xsmall|xs|small|medium|med|extra large|x-large|large|xl)\b/) ||
            t.match(/\b(?:size|wear|wearing|buy|in an?|an?)\s+(S|M|L)\b/) || t.match(/^\s*(XS|S|M|L|XL)\s*$/i) ||
            t.match(/\b(?:vuori|patagonia|lululemon|true classic|nike|ten thousand|rhone|arcteryx|arc'teryx|uniqlo)\s+(XS|S|M|L|XL)\b/i);
    if (!m) return null;
    var k = m[1].toLowerCase();
    return map[k] || k.toUpperCase();
  }
  function parseWaist(t, awaiting) {
    var m = t.match(/\b(2[6-9]|3[0-9]|4[0-2])\s*(?:"|in|inch|inches)?\s*waist\b/i) || t.match(/\bwaist\s*(?:is|of|:)?\s*(2[6-9]|3[0-9]|4[0-2])\b/i) ||
            (awaiting ? t.match(/\b(2[6-9]|3[0-9]|4[0-2])\b/) : null);
    return m ? +m[1] : null;
  }
  function parseBuild(t) {
    if (/\b(lean|slim|skinny|thin|wiry)\b/i.test(t)) return 'lean';
    if (/\b(built|muscular|athletic|lift|lifts|lifting|jacked|broad|stocky|big chest|big arms|thick)\b/i.test(t)) return 'built';
    return null;
  }
  function complaint(t) {
    if (/\bboth\b/i.test(t)) return 'tight';
    if (/\b(tight|squeez\w*|snug)\b.*\b(chest|shoulders?|arms?|lats?)\b|\b(chest|shoulders?|arms?|lats?)\b.*\b(tight|snug)\b|^\s*tight\b/i.test(t)) return 'tight';
    if (/\b(too long|long|hangs|baggy|tent\w*)\b/i.test(t)) return 'long';
    if (/\b(fits? fine|fine|good|ok|okay|nothing)\b/i.test(t)) return 'fine';
    return null;
  }

  /* ---------- Sizing ---------- */
  var an = function (sz) { return 'an ' + sz; }; // XS, S, M, L, XL all start with a vowel sound
  var heightBand = function (inches) { return inches <= 65 ? S.HEIGHTS[0] : S.HEIGHTS[1]; };
  var fmtHeight = function (inches) { return Math.floor(inches / 12) + "'" + (inches % 12) + '"'; };
  function chestFor(p) {
    if (!p.size) return null;
    var i = SIZES.indexOf(p.size);
    if (p.complaint === 'tight' || (p.build === 'built' && p.size === 'XS')) i = Math.min(i + 1, SIZES.length - 1);
    return SIZES[i];
  }
  function inseamFor(p, prod) { return p.height <= 65 ? prod.inseams[0] : prod.inseams[Math.min(1, prod.inseams.length - 1)]; }
  function gloveFor(p) { return p.glove || ({ XS: 'S', S: 'S', M: 'M', L: 'L', XL: 'L' })[p.size]; }
  function sizeFor(p, prod) {
    if (prod.fit === 'top') return { h: heightBand(p.height), c: chestFor(p) };
    if (prod.fit === 'bottom') return { w: String(Math.max(28, Math.min(36, p.waist))), i: inseamFor(p, prod) };
    return { g: gloveFor(p) };
  }
  function labelFor(size, prod) {
    if (prod.fit === 'top') return size.c + ' chest · ' + size.h + ' length';
    if (prod.fit === 'bottom') return size.w + ' waist · ' + size.i + ' inseam';
    return size.g;
  }
  // What the guide still needs for this product, or null when it can size it.
  function missing(p, prod) {
    if (prod.fit === 'glove') return p.glove || p.size ? null : 'glove';
    if (!p.height) return 'height';
    if (prod.fit === 'top') { if (!p.size) return 'size'; if (!p.complaint) return 'complaint'; return null; }
    return p.waist ? null : 'waist';
  }
  var ASK = {
    height: function () { return { text: 'How tall are you? Something like 5\'6" works.', chips: HEIGHT_CHIPS }; },
    size: function (p) { return { text: 'At ' + fmtHeight(p.height) + ', what size tee do you usually buy?', chips: SIZES }; },
    complaint: function (p) { return { text: 'And what goes wrong in ' + an(p.size) + ' from a regular brand?', chips: ['Too long', 'Tight in the chest', 'Both', 'Fits fine'] }; },
    waist: function () { return { text: 'What waist do you wear in pants?', chips: ['29', '30', '31', '32', '33', '34'] }; },
    glove: function () { return { text: 'What glove size do you wear? Your usual tee size works too.', chips: ['S', 'M', 'L'] }; }
  };
  function why(p, prod, size) {
    var out = [];
    if (prod.fit === 'top') {
      out.push('The ' + size.h + ' length is cut for your height, so at ' + fmtHeight(p.height) + ' it ends at your waist instead of past it.');
      if (size.c !== p.size) out.push('You said ' + p.size + ' is tight, so the chest goes up to ' + size.c + ' without adding length.');
      else out.push('Same ' + p.size + ' chest you already buy. Just less shirt.');
    } else if (prod.fit === 'bottom') {
      out.push('The ' + size.i + ' inseam is the one we\'d put on a ' + fmtHeight(p.height) + ' leg.');
      out.push('Your ' + size.w + ' waist, same as you wear now.');
    } else {
      out.push('Men\'s palm width with fingers cut shorter, in every size.');
    }
    return out;
  }
  function result(p, prod, lead) {
    var size = sizeFor(p, prod), label = labelFor(size, prod);
    return { text: (lead || 'Your size in the ' + prod.name + ':'), label: label, size: size, why: why(p, prod, size), chips: faqChips(prod).slice(1) };
  }

  /* ---------- Product questions ---------- */
  function faqChips(prod) {
    if (prod.fit === 'top') return ['Find my size', 'How long is it?', 'What\'s the fabric?', 'Returns'];
    if (prod.fit === 'bottom') return ['Find my size', 'Where does the hem land?', 'What\'s the fabric?', 'Returns'];
    return ['Find my size', 'What\'s the fabric?', 'How do I wash it?', 'Returns'];
  }
  function faq(prod, t, p) {
    var d = prod.details, more = { chips: faqChips(prod) };
    var r = function (text) { return { text: text, chips: more.chips } };
    if (/\b(return|exchange|refund|swap)\w*/i.test(t)) return r('If the ' + prod.name + ' doesn\'t fit, exchanges for fit would be free. Mock store, so nothing ships yet.');
    if (/\b(ship|shipping|deliver\w*|arrive)\b/i.test(t)) return r('Shipping is a placeholder in this mock: free over $100.');
    if (/\b(fabric|material|made of|made from|feel|smell|odor|stink|breath\w*|stretch)\b/i.test(t))
      return r(d.Fabric ? 'Fabric: ' + d.Fabric.replace(/\s*\(placeholder\)\.?$/, '') + '. That\'s a placeholder until wear testing picks the final fabric.' : 'The fabric isn\'t final yet.');
    if (/\b(wash|care|dry|dryer|shrink\w*)\b/i.test(t)) return r(d.Care ? 'Care: ' + d.Care + (/shrink/i.test(t) ? ' Shrink numbers come after wash testing.' : '') : 'Care instructions aren\'t final yet.');
    if (/\b(pocket|zip|liner|hood|thumb)\w*/i.test(t)) {
      if (d.Details) return r(d.Details);
      return r('I don\'t have that detail for the ' + prod.name + ' yet. In the real store, this would go to a person.');
    }
    if (/\b(how long|length|where does it (end|hit|land)|hem|inseam|crop\w*|short enough)\b/i.test(t)) {
      if (prod.fit === 'top') return r('Two lengths: one for 5\'3"–5\'5", one for 5\'6"–5\'8". You pick by height, so it ends at your waist instead of halfway down your zipper.' + (p.height ? ' At ' + fmtHeight(p.height) + ', that\'s the ' + heightBand(p.height) + ' length.' : ''));
      if (prod.fit === 'bottom') return r(d.Fit + ' Inseams: ' + prod.inseams.join(', ') + '.' + (p.height ? ' At ' + fmtHeight(p.height) + ', go ' + inseamFor(p, prod) + '.' : ''));
      return r(d.Fit);
    }
    if (/\b(who|tall|height range|too short|under|over)\b.*\b(for|fit|tall)\b/i.test(t)) return r('It\'s built for men 5\'3" to 5\'8". Shorter where it counts, not tighter.');
    if (/\b(fit|cut|baggy|slim|loose|boxy)\b/i.test(t) && !/\b(my size|fit me|my fit)\b/i.test(t)) return r(d.Fit);
    return null;
  }

  /* answer(prod, text, profile) -> { text, why?, chips?, size?, label? }. Mutates profile. */
  function answer(prod, text, p) {
    var t = (text || '').trim();
    if (/start over|reset/i.test(t)) { Object.keys(p).forEach(function (k) { delete p[k]; }); p.await = 'height'; return { text: 'Clean slate. How tall are you?', chips: HEIGHT_CHIPS }; }

    var h = parseHeight(t), s = parseSize(t), b = parseBuild(t), c = complaint(t), w = parseWaist(t, p.await === 'waist');
    if (p.await === 'glove' && s) { p.glove = ({ XS: 'S', S: 'S', M: 'M', L: 'L', XL: 'L' })[s]; s = null; }
    if (h) p.height = h; if (s) p.size = s; if (b) p.build = b; if (w) p.waist = w;
    if (c && (p.await === 'complaint' || s)) p.complaint = c;
    var gaveFitInfo = h || s || w || (c && p.complaint === c && (p.await === 'complaint' || s)) || (p.glove && p.await === 'glove');

    if (!gaveFitInfo) { var f = faq(prod, t, p); if (f) return f; }
    if (p.height && p.height > 68 && prod.fit !== 'glove') return { text: 'At ' + fmtHeight(p.height) + ', regular brands are cut for you. Kearsarge is built for 5\'8" and under, so the ' + prod.name + ' will probably run short on you.', chips: ['I meant 5\'8"', 'Start over'] };

    var wantsSize = gaveFitInfo || /\b(size|fit me|my fit|sizing|what should i (get|buy)|which)\b/i.test(t) || p.await;
    if (!wantsSize) return { text: 'I don\'t have an answer on that for the ' + prod.name + ' yet. In the real store, this would go to a person.', chips: faqChips(prod) };

    var need = missing(p, prod);
    if (need) { p.await = need; return ASK[need](p); }
    delete p.await;
    return result(p, prod, h || s || w || c ? 'Got it. Your size in the ' + prod.name + ':' : null);
  }

  // First message when the panel opens.
  function greet(prod, p, mode) {
    if (!missing(p, prod)) {
      var who = prod.fit === 'glove' ? '' : 'You\'re ' + fmtHeight(p.height) + (p.size ? ', usually ' + an(p.size) : '') + '. ';
      return result(p, prod, who + 'Your size in the ' + prod.name + ':');
    }
    if (mode === 'size') return answer(prod, 'Find my size', p);
    return { text: 'Questions about the ' + prod.name + '? I can find your size in a couple of quick questions, or answer anything about it.', chips: faqChips(prod) };
  }

  /* ---------- Panel UI (product pages) ---------- */
  var CSS = '.fg-scrim{position:fixed;inset:0;background:rgba(30,24,18,.45);z-index:60;opacity:0;pointer-events:none;transition:opacity .2s}' +
    '.fg-scrim.on{opacity:1;pointer-events:auto}' +
    '.fg{position:fixed;z-index:61;background:var(--bone);display:flex;flex-direction:column;box-shadow:0 10px 40px rgba(0,0,0,.25);transition:transform .25s ease;' +
    'left:0;right:0;bottom:0;height:86vh;height:86dvh;border-radius:20px 20px 0 0;transform:translateY(105%)}' +
    '.fg.on{transform:none}' +
    '@media(min-width:760px){.fg{left:auto;top:0;bottom:0;width:420px;height:auto;border-radius:0;transform:translateX(105%)}}' +
    '.fg-head{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--rule)}' +
    '.fg-head img{width:44px;height:44px;border-radius:10px;object-fit:cover}' +
    '.fg-head b{display:block;color:var(--ink);font-size:16px;line-height:1.2}.fg-head small{color:var(--muted);font-size:13px}' +
    '.fg-x{margin-left:auto;border:0;background:transparent;font-size:26px;line-height:1;color:var(--ink);cursor:pointer;padding:4px 8px}' +
    '.fg-thread{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}' +
    '.fg-msg{max-width:88%;padding:10px 14px;border-radius:18px;font-size:16px;line-height:1.45;animation:fgpop .18s ease-out}' +
    '.fg-bot{align-self:flex-start;background:#fff;color:var(--ink);border-bottom-left-radius:6px}' +
    '.fg-me{align-self:flex-end;background:var(--sea);color:#fff;border-bottom-right-radius:6px}' +
    '.fg-res{align-self:stretch;background:#fff;border-radius:16px;padding:14px;border:2px solid var(--sea);animation:fgpop .18s ease-out}' +
    '.fg-res .lbl{font-family:var(--display);font-weight:800;font-size:24px;color:var(--ink);line-height:1.1;margin:2px 0 6px}' +
    '.fg-res ul{margin:0 0 12px;padding-left:18px;font-size:15px;color:var(--ink-2)}' +
    '.fg-res .btn{width:100%;min-height:48px}' +
    '.fg-typing{align-self:flex-start;background:#fff;border-radius:18px;padding:12px 14px;display:flex;gap:4px}' +
    '.fg-typing i{width:7px;height:7px;border-radius:50%;background:var(--muted);animation:fgblink 1s infinite}.fg-typing i:nth-child(2){animation-delay:.15s}.fg-typing i:nth-child(3){animation-delay:.3s}' +
    '.fg-chips{display:flex;flex-wrap:wrap;gap:8px}' +
    '.fg-chip{border:1.5px solid var(--ink);background:transparent;border-radius:999px;padding:7px 13px;font:600 14px var(--sans);color:var(--ink);cursor:pointer}' +
    '.fg-chip:hover{background:var(--ink);color:var(--bone)}' +
    '.fg-form{display:flex;gap:8px;padding:10px 12px 4px;border-top:1px solid var(--rule)}' +
    '.fg-form input{flex:1;min-width:0;min-height:46px;border:1.5px solid var(--ink);border-radius:999px;padding:0 16px;font:500 16px var(--sans);background:#fff;color:var(--ink)}' +
    '.fg-send{width:46px;height:46px;border:0;border-radius:50%;background:var(--sun);color:#fff;font-size:20px;cursor:pointer}' +
    '.fg-note{text-align:center;font-size:11px;color:var(--muted);padding:2px 12px calc(10px + env(safe-area-inset-bottom,0px))}' +
    '@keyframes fgpop{from{transform:translateY(6px);opacity:0}to{transform:none;opacity:1}}@keyframes fgblink{0%,80%,100%{opacity:.25}40%{opacity:1}}' +
    '@media(prefers-reduced-motion:reduce){.fg,.fg-scrim{transition:none}.fg-msg,.fg-res{animation:none}}';

  var KEY = 'kg_fit_profile';
  function loadProfile() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function saveProfile(p) { try { var c = {}; Object.keys(p).forEach(function (k) { if (k !== 'await') c[k] = p[k]; }); localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} }
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); };

  var el, prod, profile, onSize, lastFocus;
  function build() {
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var scrim = document.createElement('div'); scrim.className = 'fg-scrim'; document.body.appendChild(scrim);
    el = document.createElement('aside'); el.className = 'fg'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Fit and questions');
    el.innerHTML = '<div class="fg-head"><img alt=""><div><b></b><small>Fit &amp; questions</small></div><button class="fg-x" type="button" aria-label="Close">&times;</button></div>' +
      '<div class="fg-thread" aria-live="polite"></div>' +
      '<form class="fg-form" autocomplete="off"><input type="text" enterkeyhint="send" aria-label="Ask about this product"><button class="fg-send" type="submit" aria-label="Send">&#8593;</button></form>' +
      '<p class="fg-note">Scripted demo, not a live AI.</p>';
    document.body.appendChild(el);
    scrim.addEventListener('click', close);
    el.querySelector('.fg-x').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && el.classList.contains('on')) close(); });
    el.querySelector('.fg-form').addEventListener('submit', function (e) {
      e.preventDefault(); var i = el.querySelector('.fg-form input'), v = i.value.trim(); if (!v) return; i.value = ''; send(v);
    });
    el.querySelector('.fg-thread').addEventListener('click', function (e) {
      var chip = e.target.closest('.fg-chip'); if (chip) { chip.parentNode.remove(); send(chip.textContent); return; }
      var use = e.target.closest('[data-use]');
      if (use) { var size = JSON.parse(use.getAttribute('data-use')); if (onSize) onSize(size, use.getAttribute('data-label')); close(); }
    });
  }
  function thread() { return el.querySelector('.fg-thread'); }
  function scroll() { var th = thread(); th.scrollTop = th.scrollHeight; }
  function me(text) { var d = document.createElement('div'); d.className = 'fg-msg fg-me'; d.textContent = text; thread().appendChild(d); scroll(); }
  function bot(r, instant) {
    var th = thread();
    var render = function () {
      var d = document.createElement('div'); d.className = 'fg-msg fg-bot'; d.textContent = r.text; th.appendChild(d);
      if (r.size) {
        var res = document.createElement('div'); res.className = 'fg-res';
        res.innerHTML = '<p class="eyebrow">Your size</p><p class="lbl">' + esc(r.label) + '</p><ul>' + r.why.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>' +
          '<button class="btn" type="button" data-use="' + esc(JSON.stringify(r.size)) + '" data-label="' + esc(r.label) + '">Use this size</button>';
        th.appendChild(res);
      }
      if (r.chips && r.chips.length) {
        var c = document.createElement('div'); c.className = 'fg-chips';
        c.innerHTML = r.chips.map(function (x) { return '<button class="fg-chip" type="button">' + esc(x) + '</button>'; }).join('');
        th.appendChild(c);
      }
      scroll();
    };
    if (instant) return render();
    var t = document.createElement('div'); t.className = 'fg-typing'; t.innerHTML = '<i></i><i></i><i></i>'; th.appendChild(t); scroll();
    setTimeout(function () { t.remove(); render(); }, 380);
  }
  function send(text) {
    Array.prototype.forEach.call(thread().querySelectorAll('.fg-chips'), function (x) { x.remove(); });
    me(text);
    var r = answer(prod, text, profile); saveProfile(profile); bot(r);
  }
  function open(product, opts) {
    opts = opts || {};
    if (!el) build();
    prod = product; onSize = opts.onSize; profile = loadProfile(); lastFocus = document.activeElement;
    el.querySelector('.fg-head img').src = product.images[0].replace(/w=\d+&h=\d+/, 'w=120&h=120');
    el.querySelector('.fg-head b').textContent = product.name;
    thread().innerHTML = '';
    bot(greet(prod, profile, opts.mode), true); saveProfile(profile);
    el.classList.add('on'); el.previousElementSibling.classList.add('on'); document.body.classList.add('locked');
    setTimeout(function () { if (window.matchMedia('(min-width: 760px)').matches) el.querySelector('.fg-form input').focus(); else el.querySelector('.fg-x').focus(); }, 260);
  }
  function close() {
    if (!el) return;
    el.classList.remove('on'); el.previousElementSibling.classList.remove('on'); document.body.classList.remove('locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  // Size for a product from the saved profile, or null if the guide doesn't know enough.
  function savedSize(product) { var p = loadProfile(); if (missing(p, product) || (p.height > 68 && product.fit !== 'glove')) return null; var s = sizeFor(p, product); return { size: s, label: labelFor(s, product) }; }

  window.KG_FIT = { answer: answer, greet: greet, open: open, close: close, savedSize: savedSize };
})();
