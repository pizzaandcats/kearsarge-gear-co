/* Shared shop chrome: pre-sale bar, header, footer, bag drawer, product cards,
   and photo placeholders. The bag lives in localStorage. Nothing is ever charged. */
(function () {
  var S = window.KG_SHOP;
  var BAG_KEY = 'kg_mock_cart_v2';
  var money = function (n) { return '$' + n.toFixed(0); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* Photo slot: the photo if PHOTOS[id].src is set, otherwise a labeled gray box. */
  function ph(id, o) {
    o = o || {};
    var x = S.PHOTOS[id] || { ratio: '4:5', px: '', shot: '' };
    var r = x.ratio.split(':');
    var style = o.fill ? '' : ' style="aspect-ratio:' + r[0] + ' / ' + r[1] + '"';
    if (x.src) return '<div class="ph has-img' + (o.cls ? ' ' + o.cls : '') + '"' + style + '><img src="' + esc(x.src) + '" alt="' + esc(o.alt || '') + '"' + (o.eager ? '' : ' loading="lazy"') + '></div>';
    return '<div class="ph' + (o.cls ? ' ' + o.cls : '') + '"' + style + ' role="img" aria-label="' + esc(o.alt || 'Photo placeholder ' + id) + '">' +
      '<span class="ph-id">' + esc(id) + '</span><span class="ph-ratio">' + esc(x.ratio) + (x.px ? ' · ' + esc(x.px) : '') + '</span>' +
      (o.brief === false ? '' : '<span class="ph-shot">' + esc(x.shot) + '</span>') + '</div>';
  }

  var LOGO = '<a class="logo" href="index.html" aria-label="Kearsarge home"><span class="logo-script">Kearsarge</span>' +
    '<svg class="logo-swash" viewBox="0 0 360 30" preserveAspectRatio="none" aria-hidden="true"><path d="M0,18 C60,4 120,4 180,16 C240,28 300,26 360,8 C300,30 240,32 180,20 C120,8 60,8 2,20 Z"/></svg></a>';

  function header(over) {
    return '<div class="mockbar"><b>Pre-sale</b> Reserve from our first, limited run. Ships ' + esc(S.SHIP) + '. <a href="collection.html">Shop the pre-sale</a></div>' +
      '<header class="sh-header' + (over ? ' over' : '') + '">' +
      '<button class="icon-btn menu-btn" type="button" aria-label="Menu" aria-expanded="false">&#9776;</button>' +
      '<nav class="nav-left" aria-label="Shop"><a href="collection.html">Shop</a><a href="collection.html?a=trail">Trail</a><a href="collection.html?a=train">Train</a><a href="index.html#fit">Fit</a></nav>' +
      LOGO +
      '<div class="nav-right"><a href="index.html#story">Our Story</a>' +
      '<button class="cart-btn" type="button" aria-label="Open bag">Bag <span class="cart-count">0</span></button></div>' +
      '</header>';
  }

  function footer() {
    return '<footer class="sh-footer"><div class="wrap">' +
      '<div class="foot-brand">' + LOGO + '<p>Fits like it was made for you.<br>Performance apparel for the trail and the gym,<br>cut for men 5\'8" and under.</p></div>' +
      '<div class="foot-cols">' +
      '<div><b>Shop</b><a href="collection.html">The First Run</a><a href="collection.html?a=trail">Trail</a><a href="collection.html?a=train">Train</a>' + S.COLLECTIONS.map(function (c) { return '<a href="collection.html?c=' + c.id + '">' + esc(c.name) + '</a>'; }).join('') + '</div>' +
      '<div><b>Help</b><a href="index.html#fit">Finding your size</a><a href="product.html?p=palisade-sun-hoodie#size-chart">Size chart</a><a href="#">Pre-orders and shipping</a><a href="#">Contact</a></div>' +
      '<div><b>Kearsarge</b><a href="index.html#story">Our story</a><a href="index.html#journal">Journal</a><a href="shots.html">Shot list</a></div>' +
      '</div></div><div class="wrap foot-meta">&copy; 2026 Kearsarge. Los Angeles, California. A mock storefront for a design test: nothing is for sale and gray boxes stand in for photos.</div></footer>';
  }

  function drawer() {
    return '<div class="scrim" hidden></div><aside class="cart" aria-label="Bag" aria-hidden="true">' +
      '<div class="cart-head"><h2>Your bag</h2><button class="icon-btn cart-close" type="button" aria-label="Close bag">&times;</button></div>' +
      '<div class="cart-items"></div>' +
      '<div class="cart-foot"><div class="cart-sub"><span>Subtotal</span><b class="cart-total">$0</b></div>' +
      '<p class="cart-pre">Pre-order. Ships ' + esc(S.SHIP) + '.</p>' +
      '<button class="btn btn-block checkout" type="button">Check out</button>' +
      '<p class="cart-note" role="status" aria-live="polite"></p></div></aside>';
  }

  function getBag() { try { return JSON.parse(localStorage.getItem(BAG_KEY) || '[]'); } catch (e) { return []; } }
  function setBag(c) { try { localStorage.setItem(BAG_KEY, JSON.stringify(c)); } catch (e) {} renderBag(); }

  function add(item) {
    var c = getBag();
    var hit = c.filter(function (x) { return x.id === item.id && x.color === item.color && x.size === item.size; })[0];
    if (hit) hit.qty += 1; else c.push({ id: item.id, color: item.color, size: item.size, qty: 1 });
    setBag(c);
    open();
  }

  function renderBag() {
    var c = getBag().filter(function (x) { return S.product(x.id) && S.COLORS[x.color]; });
    var count = c.reduce(function (n, x) { return n + x.qty; }, 0);
    document.querySelectorAll('.cart-count').forEach(function (el) { el.textContent = count; });
    var box = document.querySelector('.cart-items');
    if (!box) return;
    if (!c.length) box.innerHTML = '<p class="cart-empty">Your bag is empty.</p>';
    else {
      box.innerHTML = c.map(function (x, i) {
        var p = S.product(x.id);
        return '<div class="cart-line"><div class="cart-art">' + ph(S.flat(p, x.color), { brief: false, fill: true }) + '</div>' +
          '<div><b>' + esc(p.name) + '</b><small>' + esc(S.COLORS[x.color].name) + ' · ' + esc(x.size) + '</small>' +
          '<div class="qty"><button type="button" data-i="' + i + '" data-d="-1" aria-label="One less">&minus;</button><span>' + x.qty + '</span>' +
          '<button type="button" data-i="' + i + '" data-d="1" aria-label="One more">+</button></div></div>' +
          '<span class="cart-price">' + money(p.price * x.qty) + '</span></div>';
      }).join('');
    }
    var total = c.reduce(function (n, x) { return n + S.product(x.id).price * x.qty; }, 0);
    document.querySelector('.cart-total').textContent = money(total);
  }

  function open() {
    document.querySelector('.cart').classList.add('open');
    document.querySelector('.cart').setAttribute('aria-hidden', 'false');
    document.querySelector('.scrim').hidden = false;
    document.body.classList.add('locked');
    document.querySelector('.cart-close').focus();
  }
  function close() {
    document.querySelector('.cart').classList.remove('open');
    document.querySelector('.cart').setAttribute('aria-hidden', 'true');
    document.querySelector('.scrim').hidden = true;
    document.body.classList.remove('locked');
    document.querySelector('.cart-note').textContent = '';
  }

  // Product card: flat lay, with the on-model shot on hover (desktop)
  function card(p) {
    return '<a class="card" href="product.html?p=' + p.id + '">' +
      '<div class="card-img">' + ph(S.flat(p), { brief: false, fill: true, alt: p.name }) + '<div class="card-alt">' + ph(p.code + '-MODEL', { brief: false, fill: true, alt: '' }) + '</div>' +
      (p.badge ? '<span class="badge">' + esc(p.badge) + '</span>' : '') + '</div>' +
      '<div class="card-body"><b>' + esc(p.name) + '</b><span class="price">' + money(p.price) + '</span></div>' +
      '<div class="card-meta"><span class="dots">' + p.colors.map(function (k) { return '<i style="background:' + S.COLORS[k].hex + '" title="' + esc(S.COLORS[k].name) + '"></i>'; }).join('') + '</span>' +
      '<span>' + p.colors.length + ' colors</span></div></a>';
  }

  // Mount chrome
  var over = document.body.hasAttribute('data-hero');
  document.body.insertAdjacentHTML('afterbegin', header(over));
  document.body.insertAdjacentHTML('beforeend', footer() + drawer());

  var hdr = document.querySelector('.sh-header');
  document.querySelector('.menu-btn').addEventListener('click', function () {
    var on = hdr.classList.toggle('menu-open');
    this.setAttribute('aria-expanded', on ? 'true' : 'false');
  });
  if (over) {
    var mb = document.querySelector('.mockbar');
    var place = function () { hdr.style.top = hdr.classList.contains('solid') ? '0px' : mb.offsetHeight + 'px'; };
    var onScroll = function () { hdr.classList.toggle('solid', window.scrollY > 40); place(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', place);
    onScroll();
  }
  document.querySelector('.cart-btn').addEventListener('click', open);
  document.querySelector('.cart-close').addEventListener('click', close);
  document.querySelector('.scrim').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  document.querySelector('.cart-items').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-i]'); if (!b) return;
    var c = getBag(); var i = +b.getAttribute('data-i');
    c[i].qty += +b.getAttribute('data-d');
    if (c[i].qty <= 0) c.splice(i, 1);
    setBag(c);
  });
  document.querySelector('.checkout').addEventListener('click', function () {
    document.querySelector('.cart-note').innerHTML = 'This is a mock store, so nothing is charged. <a href="../lp-outdoors/">Join the list</a> to hear when the pre-sale opens.';
  });
  renderBag();

  window.KG_UI = { card: card, add: add, money: money, esc: esc, ph: ph };
})();
