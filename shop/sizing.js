/* Kearsarge size lineup: five men, one per size, at true relative height.
   Ported from the "Kearsarge Sun Hoody Size Lineup" prototype (spec: Size Lineup Module Spec v1).
   KG_SIZING.mount(el, { base, size, notes, onSize(size), cta(size) -> html })
     notes:  false hides the footnote under the chart
     size:   'best' or 'XS'..'XL' to start on
     onSize: called when the shopper picks a size (toggle or tapping a man)
     cta:    returns the HTML under the chart for the current size ('best' or a letter)
   Returns { setSize(size), size() }. */
(function () {
  var MAX_IN = 74;   // top of the scale, in inches (6'2")
  var SHOE_IN = 1;   // heights are shown in shoes
  var MIN_H = 380;   // below this, the row scrolls sideways instead of shrinking
  var MAX_H = 560;
  var SIZES = ['XS', 'S', 'M', 'L', 'XL'];
  // aspect = image width / height (widest of front and back), from the cutouts
  var MEN = [
    { id: 'runner',   name: 'Theo',   build: 'Runner',   size: 'XS', hIn: 63, lb: 125, chest: 36,   aspect: 0.3688 },
    { id: 'lifter',   name: 'Luca',   build: 'Lifter',   size: 'S',  hIn: 64, lb: 155, chest: 38.5, aspect: 0.3769 },
    { id: 'hiker',    name: 'Henrik', build: 'Hiker',    size: 'M',  hIn: 67, lb: 165, chest: 41,   aspect: 0.3691 },
    { id: 'wrestler', name: 'Jules',  build: 'Wrestler', size: 'L',  hIn: 65, lb: 170, chest: 44,   aspect: 0.4000 },
    { id: 'rucker',   name: 'Mateo',  build: 'Rucker',   size: 'XL', hIn: 68, lb: 195, chest: 47,   aspect: 0.4304 }
  ];
  // garment chest (around): XS 34.5, S 37.5, M 40.5, L 43.5, XL 46.5. Bands are provisional until the sample try-on.
  var FIT = {
    runner:   { XS: 'Fitted',    S: 'Relaxed',   M: 'Loose',   L: 'Baggy',   XL: 'Baggy' },
    lifter:   { XS: 'Snug',      S: 'Fitted',    M: 'Relaxed', L: 'Loose',   XL: 'Baggy' },
    hiker:    { XS: 'Tight',     S: 'Snug',      M: 'Fitted',  L: 'Relaxed', XL: 'Loose' },
    wrestler: { XS: 'Too small', S: 'Tight',     M: 'Snug',    L: 'Fitted',  XL: 'Relaxed' },
    rucker:   { XS: 'Too small', S: 'Too small', M: 'Tight',   L: 'Snug',    XL: 'Fitted' }
  };
  // shirt images on hand: man -> sizes. Missing cells show the shirtless base.
  var SHIRTS = {
    runner: ['XS', 'S', 'M', 'L', 'XL'],
    lifter: ['XS', 'S', 'M', 'L', 'XL'],
    hiker: ['XS', 'S', 'M', 'L', 'XL'],
    wrestler: ['S', 'M', 'L', 'XL'],
    rucker: ['M', 'L', 'XL']
  };
  var hasShirt = function (id, size) { return (SHIRTS[id] || []).indexOf(size) > -1; };

  var decoded = {};
  function decodeSrc(src) {
    if (!decoded[src]) {
      var im = new Image(); im.src = src;
      decoded[src] = (im.decode ? im.decode() : Promise.resolve()).catch(function () {});
    }
    return decoded[src];
  }

  var ftIn = function (i) { return Math.floor(i / 12) + '\'' + (i % 12) + '"'; };
  var cm = function (i) { return Math.round(i * 2.54); };
  var kg = function (lb) { return Math.round(lb * 0.4536); };
  var chestTxt = function (c) { return Number.isInteger(c) ? c + '"' : Math.floor(c) + '½"'; };

  function seg(label, key, items) {
    return '<div class="szl-seg" role="group" aria-label="' + label + '">' + items.map(function (it) {
      return '<button type="button" data-' + key + '="' + it[0] + '" aria-pressed="false">' + it[1] + '</button>';
    }).join('') + '</div>';
  }

  function mount(root, o) {
    o = o || {};
    var base = o.base || 'img/lineup/';
    var st = { size: SIZES.indexOf(o.size) > -1 ? o.size : 'best', view: 'front', units: 'imperial' };

    root.classList.add('szl');
    root.innerHTML =
      '<div class="szl-controls">' +
        seg('Size shown', 'size', [['best', 'Best fit']].concat(SIZES.map(function (s) { return [s, s]; }))) +
        seg('View', 'view', [['front', 'Front'], ['back', 'Back']]) +
        seg('Units', 'units', [['imperial', 'Imperial'], ['metric', 'Metric']]) +
      '</div>' +
      '<div class="szl-chart">' +
        '<div class="szl-scroller"><div class="szl-track"><div class="szl-grid"></div></div></div>' +
        '<div class="szl-ruler" aria-hidden="true"></div>' +
      '</div>' +
      '<p class="szl-swipe">Swipe to see all five.</p>' +
      '<div class="szl-cta" aria-live="polite"></div>' +
      (o.notes === false ? '' : '<p class="szl-notes">Heights are shown in shoes, about 1" over barefoot height. Images are AI-generated stand-ins until real fit photos are shot.</p>');

    var q = function (s) { return root.querySelector(s); };
    var qa = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
    var chart = q('.szl-chart'), scroller = q('.szl-scroller'), track = q('.szl-track');

    MEN.forEach(function (m) {
      var col = document.createElement('div');
      col.className = 'szl-col';
      col.setAttribute('role', 'button');
      col.tabIndex = 0;
      col.setAttribute('aria-label', 'Show every man in ' + m.name + '\'s size, ' + m.size);
      col.innerHTML =
        '<div class="szl-figwrap"><div class="szl-fig">' +
          '<img class="szl-front" src="' + base + m.id + '-front.webp" alt="">' +
          '<img class="szl-back" src="' + base + m.id + '-back.webp" alt="">' +
          '<span class="szl-tag">Too small</span>' +
        '</div></div>' +
        '<div class="szl-lab"></div>';
      var pick = function () { choose(m.size); };
      col.addEventListener('click', pick);
      col.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      track.appendChild(col);
    });

    function layout() {
      var avail = scroller.clientWidth;
      if (!avail) return;
      // width each figure needs per pixel of stage height, plus a gap of 6% of H per column
      var perH = MEN.reduce(function (s, m) { return s + m.aspect * (m.hIn + SHOE_IN) / MAX_IN + 0.06; }, 0);
      var H = Math.min(MAX_H, avail / perH);
      var scrolls = H < MIN_H;
      if (scrolls) H = MIN_H;
      root.style.setProperty('--szl-h', Math.round(H) + 'px');
      chart.classList.toggle('scrolls', scrolls);
      qa('.szl-col').forEach(function (col, i) {
        var m = MEN[i], figH = H * (m.hIn + SHOE_IN) / MAX_IN;
        col.querySelector('.szl-fig').style.height = figH + 'px';
        col.style.width = Math.max(figH * m.aspect + H * 0.06, 84) + 'px';
      });
      track.style.width = scrolls ? (perH * H) + 'px' : '';
    }

    function renderScale() {
      var grid = q('.szl-grid'), ruler = q('.szl-ruler'), g = '<div class="szl-floor"></div>', r = '<div class="szl-spine"></div>';
      var pos = function (inches) { return (inches / MAX_IN * 100) + '%'; };
      var c, cls;
      if (st.units === 'imperial') {
        for (var ft = 1; ft * 12 <= MAX_IN; ft++) {
          g += '<div class="szl-gridline" style="bottom:' + pos(ft * 12) + '"></div>';
          r += '<div class="szl-rlabel" style="bottom:' + pos(ft * 12) + '">' + ft + '\'</div>';
        }
        // a tick every inch, a longer one at each half foot, the longest at each foot
        for (var i = 1; i <= 72; i++) {
          cls = i % 12 === 0 ? 'major' : (i % 6 === 0 ? 'mid' : 'minor');
          r += '<div class="szl-tick ' + cls + '" style="bottom:' + pos(i) + '"></div>';
        }
      } else {
        // a tick every 5 cm, a longer one every 10 cm, labeled lines every 50 cm
        for (c = 50; c <= 150; c += 50) {
          g += '<div class="szl-gridline" style="bottom:' + pos(c / 2.54) + '"></div>';
          r += '<div class="szl-rlabel" style="bottom:' + pos(c / 2.54) + '">' + c + '</div>';
        }
        r += '<div class="szl-rlabel unit" style="bottom:' + pos(180 / 2.54) + '">cm</div>';
        for (c = 5; c <= 180; c += 5) {
          cls = c % 50 === 0 ? 'major' : (c % 10 === 0 ? 'mid' : 'minor');
          r += '<div class="szl-tick ' + cls + '" style="bottom:' + pos(c / 2.54) + '"></div>';
        }
      }
      grid.innerHTML = g; ruler.innerHTML = r;
    }

    function renderLabels() {
      qa('.szl-col').forEach(function (col, i) {
        var m = MEN[i], imp = st.units === 'imperial';
        var h = imp ? ftIn(m.hIn) : cm(m.hIn) + ' cm';
        var w = imp ? m.lb + ' lb' : kg(m.lb) + ' kg';
        var c = imp ? chestTxt(m.chest) + ' chest' : cm(m.chest) + ' cm chest';
        var badge;
        if (st.size === 'best') badge = '<span class="szl-fit fitted">Wears ' + m.size + '</span>';
        else {
          var f = FIT[m.id][st.size];
          badge = '<span class="szl-fit ' + (f === 'Fitted' ? 'fitted' : (f === 'Too small' ? 'off' : '')) + '">' + f + '</span>';
        }
        col.querySelector('.szl-lab').innerHTML =
          '<div class="szl-name">' + m.name + '</div><div class="szl-build">' + m.build + '</div>' +
          '<div class="szl-stat">' + h + '</div><div class="szl-stat">' + w + '</div><div class="szl-stat">' + c + '</div>' + badge;

        var tooSmall = st.size !== 'best' && FIT[m.id][st.size] === 'Too small';
        var shown = st.size === 'best' ? m.size : st.size;
        var dressed = !tooSmall && hasShirt(m.id, shown);
        // too-small cells show a gray silhouette of the man in his own size, so its shape matches his dressed images
        var silhouette = tooSmall && hasShirt(m.id, m.size);
        var srcs = {};
        ['front', 'back'].forEach(function (v) {
          srcs[v] = dressed ? base + 'shirts/' + m.id + '-' + shown + '-' + v + '.webp'
                  : silhouette ? base + 'shirts/' + m.id + '-' + m.size + '-' + v + '.webp'
                  : base + m.id + '-' + v + '.webp';
        });
        // swap only after the new images are decoded, so a base image never flashes in between
        var token = (col._token = (col._token || 0) + 1);
        Promise.all([decodeSrc(srcs.front), decodeSrc(srcs.back)]).then(function () {
          if (token !== col._token) return;
          ['front', 'back'].forEach(function (v) {
            var img = col.querySelector('.szl-' + v);
            if (img.getAttribute('src') !== srcs[v]) img.setAttribute('src', srcs[v]);
            img.alt = (v === 'back' ? '' : m.name + ', ' + m.build.toLowerCase() + ' build, ' + ftIn(m.hIn) + ', ' + (dressed ? 'in size ' + shown : (tooSmall ? 'size ' + shown + ' is too small' : 'base image')));
          });
          col.classList.toggle('too-small', tooSmall);
        });
      });
    }

    function apply() {
      chart.classList.toggle('show-back', st.view === 'back');
      ['size', 'view', 'units'].forEach(function (k) {
        qa('[data-' + k + ']').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-' + k) === st[k])); });
      });
      renderScale(); renderLabels();
      q('.szl-cta').innerHTML = o.cta ? o.cta(st.size) : '';
    }

    function choose(sz) {
      st.size = sz; apply();
      // on phones the row scrolls: bring the man who wears this size into view
      var idx = MEN.map(function (m) { return m.size; }).indexOf(sz);
      if (idx > -1 && chart.classList.contains('scrolls')) {
        var col = qa('.szl-col')[idx];
        scroller.scrollTo({ left: col.offsetLeft - (scroller.clientWidth - col.offsetWidth) / 2, behavior: 'smooth' });
      }
      if (sz !== 'best' && o.onSize) o.onSize(sz);
    }

    qa('[data-size]').forEach(function (b) { b.addEventListener('click', function () { choose(b.getAttribute('data-size')); }); });
    qa('[data-view]').forEach(function (b) { b.addEventListener('click', function () { st.view = b.getAttribute('data-view'); apply(); }); });
    qa('[data-units]').forEach(function (b) { b.addEventListener('click', function () { st.units = b.getAttribute('data-units'); apply(); }); });
    if (window.ResizeObserver) new ResizeObserver(layout).observe(scroller); else window.addEventListener('resize', layout);

    layout(); apply();
    // warm the cache once the page has settled
    setTimeout(function () {
      MEN.forEach(function (m) { ['front', 'back'].forEach(function (v) {
        decodeSrc(base + m.id + '-' + v + '.webp');
        (SHIRTS[m.id] || []).forEach(function (sz) { decodeSrc(base + 'shirts/' + m.id + '-' + sz + '-' + v + '.webp'); });
      }); });
    }, 1500);

    return {
      setSize: function (sz) { if (SIZES.indexOf(sz) > -1 || sz === 'best') { st.size = sz; apply(); } },
      size: function () { return st.size; }
    };
  }

  window.KG_SIZING = { mount: mount, MEN: MEN, FIT: FIT, SIZES: SIZES };
})();
