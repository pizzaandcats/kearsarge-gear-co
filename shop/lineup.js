/* Kearsarge size lineup: four drawn guys, 5'3" to 5'8", wearing the same size.
   Where the hem, cuffs and chest land is computed from the product's size spec
   (data.js -> spec) and each guy's measurements, so switching sizes moves them.
   Body proportions are standard anthropometric ratios, tuned so the XS lands where
   the fit log says it does on the 5'5" fit model (hem about 8.5" below the navel,
   cuff about 1.5" past the wrist bone). It's a guide, not a body scan.

   KG_LINEUP.mount(el, { product, size, onPick(size, guy) }) */
(function () {
  var GUYS = [
    { id: 'leo', name: 'Leo', h: 63, lb: 125, chest: 35.5, waist: 28, build: 'Slim. Runs and climbs.', buys: 'Buys XS. Still long in the body and sleeves.', skin: '#e9c7a2', hair: '#2b2018', lean: true },
    { id: 'marco', name: 'Marco', h: 65, lb: 160, chest: 37.5, waist: 31, build: 'Lifts. Big arms, thick neck.', buys: 'Buys S. Tight in the arms, long everywhere else.', skin: '#c68c5a', hair: '#1d1712', musc: true },
    { id: 'theo', name: 'Theo', h: 66, lb: 145, chest: 38.5, waist: 31, build: 'Average build. Hikes most weekends.', buys: 'Buys S or M. The hem covers his seat.', skin: '#8a5a3c', hair: '#14100c' },
    { id: 'ray', name: 'Ray', h: 68, lb: 180, chest: 42.5, waist: 35, build: 'Stocky. Rucks and fishes.', buys: 'Buys L. Sleeves past his knuckles.', skin: '#f1d2b4', hair: '#6b4a2e' }
  ];
  var SLOT = 25, LEFT = 5, TOP = 75, W = LEFT + SLOT * 4;
  var Y = function (h) { return +(TOP - h).toFixed(2); };
  var fmtH = function (i) { return Math.floor(i / 12) + "'" + (i % 12) + '"'; };
  var fmtIn = function (n) { var w = Math.floor(n), f = n - w; return (f >= 0.7 ? w + '¾' : f >= 0.45 ? w + '½' : f >= 0.2 ? w + '¼' : w) + '"'; };

  /* ---------- Fit math ---------- */
  function fit(g, spec, i, regular) {
    var girth = spec.chest[i] * 2, ease = girth - g.chest;
    var front = regular ? spec.regular.front[i] : spec.front[i];
    var sleeve = spec.sleeve[i] + (regular ? spec.regular.sleeveExtra : 0);
    var hemH = 0.83 * g.h - (front - 3 - Math.max(0, g.chest - 37.5) * 0.25);
    var belowNavel = 0.60 * g.h - hemH;
    var arm = 0.438 * g.h + Math.max(0, g.chest - 37.5) * 0.15;
    var pastWrist = sleeve - arm;
    var chest = ease < -1.5 ? ['bad', 'Tight', 'Pulls across the chest and arms.'] : ease < 1.5 ? ['good', 'Fitted', 'Close through the chest and arms, not tight.'] : ease < 3.5 ? ['ok', 'Relaxed', 'A little extra room in the chest.'] : ['bad', 'Boxy', 'Too much fabric. It billows.'];
    var hem = belowNavel < 5.5 ? ['bad', 'Short', 'Rides up when he reaches.'] : belowNavel <= 9.5 ? ['good', 'Mid-hip', 'Stays under a pack hip belt.'] : belowNavel <= 11 ? ['ok', 'A touch long', 'Starts to cover his seat.'] : ['bad', 'Long', 'Covers his seat. Bunches under a hip belt.'];
    var slv = pastWrist < 0.5 ? ['bad', 'Short', 'Wrists show when he reaches.'] : pastWrist <= 2.6 ? ['good', 'On his hand', 'Thumbholes land on his hand.'] : pastWrist <= 3.5 ? ['ok', 'A touch long', 'Starts to bunch at the wrist.'] : ['bad', 'Long', 'Past his knuckles. He pushes them up.'];
    return { ease: ease, hemH: hemH, belowNavel: belowNavel, pastWrist: pastWrist, chest: chest, hem: hem, sleeve: slv };
  }
  // His size: the chest that lands closest to a fitted ease.
  function bestSize(g, spec) {
    var best = 0, d = 99;
    spec.chest.forEach(function (c, i) { var e = Math.abs(c * 2 - g.chest - 0.5); if (e < d) { d = e; best = i; } });
    return best;
  }
  function badge(g, spec, i) {
    if (i === bestSize(g, spec)) return ['good', 'His size'];
    var f = fit(g, spec, i);
    if (f.chest[0] === 'bad') return ['bad', f.chest[1] === 'Tight' ? 'Too tight' : 'Too big'];
    if (f.hem[0] === 'bad' || f.sleeve[0] === 'bad') return ['bad', 'Too long'];
    if (f.chest[1] === 'Relaxed') return ['ok', 'Roomy'];
    return ['ok', 'Also works'];
  }

  /* ---------- Drawing (units are inches) ---------- */
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, gg = n >> 8 & 255, b = n & 255;
    var f = function (v) { return Math.max(0, Math.min(255, Math.round(v * (1 + amt)))); };
    return '#' + ((1 << 24) + (f(r) << 16) + (f(gg) << 8) + f(b)).toString(16).slice(1);
  }
  function pts(a) { return a.map(function (p) { return p[0].toFixed(2) + ',' + Y(p[1]); }).join(' '); }
  function figure(g, x0, f, rf, color, selected) {
    var H = g.h, m = g.musc ? 1 : 0;
    var shW = g.chest * 0.41 + m * 0.8, chW = g.chest * 0.335 + m * 0.4, wW = g.waist * 0.36, hipW = wW + (g.lean ? 1.2 : 1.4);
    var neckW = 4.2 + m * 0.8, HSP = 0.83 * H, shY = 0.805 * H, pitH = 0.735 * H, navel = 0.6 * H, hipH = 0.51 * H, crotch = 0.47 * H, knee = 0.285 * H, ankle = 0.045 * H;
    var elbowH = 0.63 * H, wristH = 0.485 * H;
    var bodyW = function (h) { if (h >= navel) return Math.max(wW, chW * (g.musc ? 0.86 : 0.93)); if (h >= hipH) return wW + (hipW - wW) * (navel - h) / (navel - hipH); return hipW; };
    var pants = '#3a3e44', out = '';

    // Legs and shoes
    [-1, 1].forEach(function (s) {
      var c = x0 + s * hipW / 4;
      out += '<polygon fill="' + pants + '" points="' + pts([[x0 + s * hipW / 2, 0.56 * H], [c + s * 2.2, knee], [c + s * 1.7, ankle], [c - s * 1.5, ankle], [c - s * 1.9, knee], [x0 + s * 0.2, crotch], [x0, 0.56 * H]]) + '"/>';
      out += '<ellipse cx="' + (c + s * 0.6).toFixed(2) + '" cy="' + Y(ankle - 0.9) + '" rx="2.6" ry="1.1" fill="#2a2119"/>';
    });
    out += '<polygon fill="' + pants + '" points="' + pts([[x0 - hipW / 2, 0.56 * H], [x0 + hipW / 2, 0.56 * H], [x0 + hipW / 2, crotch + 1.5], [x0 - hipW / 2, crotch + 1.5]]) + '"/>';

    // Arms in skin (show at the wrist and hand)
    var arm = function (s) {
      var sx = x0 + s * (shW / 2 - 1.2), ex = x0 + s * (chW / 2 + 2.1 + m * 0.4), wx = x0 + s * (hipW / 2 + 2.3 + m * 0.3);
      return { s: [sx, shY], e: [ex, elbowH], w: [wx, wristH] };
    };
    var hands = '';
    [-1, 1].forEach(function (s) {
      var a = arm(s);
      hands += '<line x1="' + a.e[0].toFixed(2) + '" y1="' + Y(a.e[1]) + '" x2="' + a.w[0].toFixed(2) + '" y2="' + Y(a.w[1]) + '" stroke="' + g.skin + '" stroke-width="2.6" stroke-linecap="round"/>';
      hands += '<ellipse cx="' + (a.w[0] + s * 0.25).toFixed(2) + '" cy="' + Y(a.w[1] - 3.1) + '" rx="1.55" ry="3.2" fill="' + g.skin + '"/>';
    });
    out += hands;

    // A hoodie (torso + sleeves) for a given fit result
    var hoodie = function (r, fill, stroke, dash) {
      var easeV = Math.max(0.1, Math.min(2.6, r.ease * 0.22 + 0.5));
      var hemW = bodyW(r.hemH) / 2 + easeV, waistHalf = bodyW(navel) / 2 + easeV * 0.9;
      var torso = [[x0 - neckW / 2 - 0.4, HSP - 0.2], [x0 - shW / 2 - 0.2, shY + 0.1], [x0 - chW / 2 - easeV, pitH], [x0 - waistHalf, navel], [x0 - hemW, r.hemH],
        [x0 + hemW, r.hemH], [x0 + waistHalf, navel], [x0 + chW / 2 + easeV, pitH], [x0 + shW / 2 + 0.2, shY + 0.1], [x0 + neckW / 2 + 0.4, HSP - 0.2]];
      var d = dash ? ' stroke-dasharray="1 0.8"' : '';
      var s = '<polygon points="' + pts(torso) + '" fill="' + (dash ? 'rgba(176,96,60,.22)' : fill) + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="' + (dash ? 0.36 : 0.2) + '"' + d : '') + ' stroke-linejoin="round"/>';
      [-1, 1].forEach(function (k) {
        var a = arm(k), dx = a.w[0] - a.e[0], dy = a.w[1] - a.e[1], len = Math.sqrt(dx * dx + dy * dy);
        var ux = dx / len, uy = dy / len;
        var cuff = [a.w[0] + ux * r.pastWrist, a.w[1] + uy * r.pastWrist];
        var nx = -uy, ny = ux; if (nx * k < 0) { nx = -nx; ny = -ny; }
        var wE = (g.musc ? 5 : 4.3) + Math.max(0, easeV - 0.6) * 0.6, wC = 3.3 + Math.max(0, easeV - 0.6) * 0.3;
        var sh = [x0 + k * (shW / 2 + 0.25), shY + 0.15], pit = [x0 + k * (chW / 2 + easeV - 0.4), pitH - 0.6];
        var poly = [sh, [a.e[0] + nx * wE / 2, a.e[1] + ny * wE / 2], [cuff[0] + nx * wC / 2, cuff[1] + ny * wC / 2], [cuff[0] - nx * wC / 2, cuff[1] - ny * wC / 2], [a.e[0] - nx * wE / 2, a.e[1] - ny * wE / 2], pit];
        s += '<polygon points="' + pts(poly) + '" fill="' + (dash ? 'rgba(176,96,60,.22)' : fill) + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="' + (dash ? 0.36 : 0.2) + '"' + d : '') + ' stroke-linejoin="round"/>';
      });
      return s;
    };
    if (rf) out += hoodie(rf, 'none', '#b0603c', true);
    out += hoodie(f, color, shade(color, -0.18));
    if (f.chest[1] === 'Tight') { // strain lines
      for (var k = 0; k < 3; k++) out += '<path d="M' + (x0 - chW / 2 + 1).toFixed(2) + ',' + Y(pitH - 1 - k * 1.6) + ' q' + (chW / 2 - 1).toFixed(2) + ',-0.7 ' + (chW - 2).toFixed(2) + ',0" fill="none" stroke="' + shade(color, -0.3) + '" stroke-width="0.18"/>';
    }
    // Hood (down) and zipper
    var hood = shade(color, -0.1);
    out += '<path d="M' + (x0 - neckW / 2 - 2).toFixed(2) + ',' + Y(HSP - 0.4) + ' C' + (x0 - neckW / 2 - 2.4).toFixed(2) + ',' + Y(HSP + 2.6) + ' ' + (x0 + neckW / 2 + 2.4).toFixed(2) + ',' + Y(HSP + 2.6) + ' ' + (x0 + neckW / 2 + 2).toFixed(2) + ',' + Y(HSP - 0.4) + ' Z" fill="' + hood + '"/>';
    out += '<rect x="' + (x0 - neckW / 2).toFixed(2) + '" y="' + Y(H - 7.6) + '" width="' + neckW.toFixed(2) + '" height="' + (H - 7.6 - HSP + 0.6).toFixed(2) + '" fill="' + g.skin + '"/>';
    out += '<path d="M' + (x0 - neckW / 2 - 0.6).toFixed(2) + ',' + Y(HSP + 0.2) + ' Q' + x0 + ',' + Y(HSP - 1.4) + ' ' + (x0 + neckW / 2 + 0.6).toFixed(2) + ',' + Y(HSP + 0.2) + '" fill="none" stroke="' + shade(color, -0.25) + '" stroke-width="0.6"/>';
    out += '<line x1="' + x0 + '" y1="' + Y(HSP - 0.6) + '" x2="' + x0 + '" y2="' + Y(HSP - 8) + '" stroke="' + shade(color, -0.35) + '" stroke-width="0.22"/>';
    out += '<rect x="' + (x0 - 0.45) + '" y="' + Y(HSP - 0.4) + '" width="0.9" height="0.9" rx="0.2" fill="' + shade(color, -0.25) + '"/>';
    // Head and hair
    out += '<ellipse cx="' + x0 + '" cy="' + Y(H - 4.3) + '" rx="3.1" ry="4.3" fill="' + g.skin + '"/>';
    out += '<path d="M' + (x0 - 3.15) + ',' + Y(H - 3.6) + ' C' + (x0 - 3.3) + ',' + Y(H + 0.6) + ' ' + (x0 + 3.3) + ',' + Y(H + 0.6) + ' ' + (x0 + 3.15) + ',' + Y(H - 3.6) + ' C' + (x0 + 2) + ',' + Y(H - 2.2) + ' ' + (x0 - 2) + ',' + Y(H - 2.2) + ' ' + (x0 - 3.15) + ',' + Y(H - 3.6) + ' Z" fill="' + g.hair + '"/>';
    var ground = '<ellipse cx="' + x0 + '" cy="' + Y(0.1) + '" rx="' + (hipW / 2 + 4) + '" ry="1.1" fill="' + (selected ? 'rgba(31,85,104,.28)' : 'rgba(42,33,25,.08)') + '"/>';
    return '<g class="lu-fig' + (selected ? ' sel' : '') + '">' + ground + out + '</g>';
  }

  /* ---------- Module ---------- */
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var CSS = '.lu{background:#fff;border-radius:22px;padding:22px;display:grid;gap:16px}' +
    '.lu-top{display:flex;flex-wrap:wrap;gap:12px 20px;align-items:center;justify-content:space-between}' +
    '.lu-sizes{display:inline-flex;background:var(--bone);border-radius:999px;padding:4px}' +
    '.lu-sizes button{border:0;background:transparent;min-width:52px;min-height:42px;border-radius:999px;font:700 15px var(--sans);color:var(--ink);cursor:pointer}' +
    '.lu-sizes button[aria-selected=true]{background:var(--ink);color:var(--bone)}' +
    '.lu-toggle{display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:600;color:var(--ink);cursor:pointer}' +
    '.lu-toggle input{width:20px;height:20px;accent-color:var(--sun)}.lu-toggle i{display:inline-block;width:22px;border-top:2px dashed var(--sun)}' +
    '.lu-stage svg{display:block;width:100%;height:auto;max-height:520px}' +
    '.lu-fig{transition:opacity .2s}.lu-dim .lu-fig:not(.sel){opacity:.55}' +
    '.lu-hit{cursor:pointer;fill:transparent}.lu-hit:focus{outline:none}.lu-hit:focus-visible{stroke:var(--sun);stroke-width:.4}' +
    '.lu-names{display:grid;grid-template-columns:repeat(4,1fr);margin-left:' + (LEFT / W * 100).toFixed(2) + '%;gap:4px;margin-top:-6px}' +
    '.lu-name{border:0;background:transparent;border-radius:12px;padding:6px 2px;cursor:pointer;text-align:center;font:inherit;color:var(--ink-2)}' +
    '.lu-name b{display:block;font-size:15px;color:var(--ink)}.lu-name small{display:block;font-size:12px}' +
    '.lu-name.sel{background:var(--bone)}' +
    '.lu-pill{display:inline-block;margin-top:4px;font-size:11px;font-weight:700;border-radius:999px;padding:2px 7px;white-space:nowrap}' +
    '.lu-pill.good{background:#dcebe4;color:#1d5a40}.lu-pill.ok{background:#f4e7cf;color:#7a5414}.lu-pill.bad{background:#f7dcd0;color:#9a3a14}' +
    '.lu-card{background:var(--bone);border-radius:16px;padding:18px;display:grid;gap:12px}' +
    '.lu-who{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px}.lu-who h3{font-size:24px}.lu-who span{font-size:14px;color:var(--muted)}' +
    '.lu-buys{font-size:15px;margin-top:-4px}' +
    '.lu-rows{display:grid;gap:8px}.lu-row{display:grid;grid-template-columns:76px 1fr;gap:10px;align-items:start;font-size:15px}' +
    '.lu-row > b{color:var(--ink);font-size:14px;padding-top:2px}.lu-row .lu-pill{margin:0 6px 0 0}' +
    '.lu-reg{font-size:14px;color:#9a3a14}' +
    '.lu-cta{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;border-top:1px solid var(--rule);padding-top:12px}' +
    '.lu-cta p{font-size:16px;color:var(--ink)}.lu-cta p b{font-family:var(--display);font-weight:500;font-size:26px}' +
    '.lu-note{font-size:12px;color:var(--muted)}' +
    '@media(max-width:560px){.lu{padding:16px 12px;border-radius:18px}.lu-name small{font-size:11px}.lu-pill{font-size:10px;padding:2px 5px}.lu-row{grid-template-columns:64px 1fr;font-size:14px}.lu-cta .btn{width:100%}}';

  function mount(el, opts) {
    var spec = opts.product.spec, color = opts.color || '#d8c3a0';
    var guy0 = GUYS.filter(function (x) { return x.id === opts.guy; })[0] || GUYS[1];
    var state = { size: opts.size && spec.sizes.indexOf(opts.size) > -1 ? spec.sizes.indexOf(opts.size) : bestSize(guy0, spec), guy: guy0.id, reg: false };
    if (!document.getElementById('lu-css')) { var st = document.createElement('style'); st.id = 'lu-css'; st.textContent = CSS; document.head.appendChild(st); }
    el.classList.add('lu');
    el.innerHTML = '<div class="lu-top"><div class="lu-sizes" role="tablist" aria-label="Size">' + spec.sizes.map(function (s, i) { return '<button type="button" role="tab" data-i="' + i + '">' + s + '</button>'; }).join('') + '</div>' +
      '<label class="lu-toggle"><input type="checkbox"> <i></i> Compare a regular sun hoodie</label></div>' +
      '<div class="lu-stage"></div><div class="lu-names"></div><div class="lu-card" aria-live="polite"></div>' +
      '<p class="lu-note">Drawn to scale from our size spec and each guy\'s measurements. The regular hoodie is a best-selling merino sun hoodie in the same size. S is our sample spec; the other sizes are a proposed grade, confirmed on samples.</p>';

    function render() {
      var gi = 0;
      GUYS.forEach(function (g, i) { if (g.id === state.guy) gi = i; });
      var svg = '<svg viewBox="0 0 ' + W + ' ' + (TOP + 1) + '" role="img" aria-label="Four men from 5 foot 3 to 5 foot 8 wearing size ' + spec.sizes[state.size] + '">';
      [[60, "5'0\""], [64, "5'4\""], [68, "5'8\""]].forEach(function (r) {
        svg += '<line x1="' + LEFT + '" x2="' + W + '" y1="' + Y(r[0]) + '" y2="' + Y(r[0]) + '" stroke="#e3d6c2" stroke-width="0.18" stroke-dasharray="0.8 0.8"/><text x="0.2" y="' + (Y(r[0]) + 0.6) + '" font-size="1.7" fill="#7a6c5d" font-family="DM Sans, sans-serif">' + r[1] + '</text>';
      });
      svg += '<line x1="' + LEFT + '" x2="' + W + '" y1="' + Y(0) + '" y2="' + Y(0) + '" stroke="#d9b98c" stroke-width="0.3"/>';
      GUYS.forEach(function (g, i) {
        var x0 = LEFT + SLOT * i + SLOT / 2;
        svg += figure(g, x0, fit(g, spec, state.size), state.reg ? fit(g, spec, state.size, true) : null, color, i === gi);
        svg += '<rect class="lu-hit" tabindex="0" role="button" aria-label="' + g.name + ', ' + fmtH(g.h) + '" data-g="' + g.id + '" x="' + (LEFT + SLOT * i) + '" y="' + Y(g.h + 1) + '" width="' + SLOT + '" height="' + (g.h + 1) + '"/>';
      });
      el.querySelector('.lu-stage').innerHTML = svg + '</svg>';
      Array.prototype.forEach.call(el.querySelectorAll('.lu-sizes button'), function (b) { b.setAttribute('aria-selected', +b.getAttribute('data-i') === state.size); });

      el.querySelector('.lu-names').innerHTML = GUYS.map(function (g, i) {
        var b = badge(g, spec, state.size);
        return '<button type="button" class="lu-name' + (i === gi ? ' sel' : '') + '" data-g="' + g.id + '"><b>' + g.name + '</b><small>' + fmtH(g.h) + ' · ' + g.lb + ' lb</small><span class="lu-pill ' + b[0] + '">' + b[1] + '</span></button>';
      }).join('');

      var g = GUYS[gi], f = fit(g, spec, state.size), best = bestSize(g, spec), sz = spec.sizes[state.size];
      var row = function (label, v) { return '<div class="lu-row"><b>' + label + '</b><span><span class="lu-pill ' + v[0] + '">' + v[1] + '</span>' + esc(v[2]) + '</span></div>'; };
      var reg = '';
      if (state.reg) {
        var rf = fit(g, spec, state.size, true);
        reg = '<p class="lu-reg">A regular sun hoodie in ' + sz + ': hem ' + fmtIn(f.hemH - rf.hemH) + ' lower, cuffs ' + fmtIn(rf.pastWrist - f.pastWrist) + ' further down his hand. ' + (rf.hem[0] === 'bad' ? 'It covers his seat.' : '') + '</p>';
      }
      el.querySelector('.lu-card').innerHTML =
        '<div class="lu-who"><h3>' + g.name + ' in ' + sz + '</h3><span>' + fmtH(g.h) + ' · ' + g.lb + ' lb · ' + fmtIn(g.chest) + ' chest · ' + esc(g.build) + '</span></div>' +
        '<p class="lu-buys">' + esc(g.buys) + '</p>' +
        '<div class="lu-rows">' + row('Chest', f.chest) + row('Body', f.hem) + row('Sleeves', f.sleeve) + '</div>' + reg +
        '<div class="lu-cta"><p>Built like ' + g.name + '? <b>' + spec.sizes[best] + '</b></p>' +
        '<button type="button" class="btn" data-pick="' + spec.sizes[best] + '">' + (opts.pickLabel ? opts.pickLabel(spec.sizes[best]) : 'That\'s me: ' + spec.sizes[best]) + '</button></div>';
    }
    var choose = function (id) { state.guy = id; var g = GUYS.filter(function (x) { return x.id === id; })[0]; if (opts.followGuy !== false) state.size = bestSize(g, spec); render(); };
    el.addEventListener('click', function (e) {
      var s = e.target.closest('.lu-sizes button'); if (s) { state.size = +s.getAttribute('data-i'); render(); return; }
      var g = e.target.closest('[data-g]'); if (g) { choose(g.getAttribute('data-g')); return; }
      var p = e.target.closest('[data-pick]');
      if (p && opts.onPick) { var guy = GUYS.filter(function (x) { return x.id === state.guy; })[0]; opts.onPick(p.getAttribute('data-pick'), guy, p); }
    });
    el.addEventListener('keydown', function (e) { var g = e.target.closest('.lu-hit'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); choose(g.getAttribute('data-g')); } });
    el.querySelector('.lu-toggle input').addEventListener('change', function (e) { state.reg = e.target.checked; render(); });
    render();
    return {
      setSize: function (sz) { var i = spec.sizes.indexOf(sz); if (i > -1) { state.size = i; render(); } },
      setColor: function (c) { color = c; render(); }
    };
  }

  window.KG_LINEUP = { mount: mount, GUYS: GUYS, fit: fit, bestSize: bestSize };
})();
