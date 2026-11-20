/* Kearsarge flat lays: every product drawn the same way, top-down on the same
   paper, in the same four colors. Placeholder until a real product shoot.
   KG_ART.svg(product, colorKey, { crop: 'cuff' | [x,y,w,h], square: bool, label }) */
(function () {
  var n = 0;
  function shade(hex, amt) {
    var v = parseInt(hex.slice(1), 16), r = v >> 16, g = v >> 8 & 255, b = v & 255;
    var f = function (c) { return Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt))); };
    return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  }

  // Shared pieces (viewBox 0 0 100 125). F = fabric fill, D = darker, L = lighter, E = seam/edge.
  var HOOD = 'M41.5,27.5 C39,15 44,6.5 50,6.5 C56,6.5 61,15 58.5,27.5 Z';
  var HOOD_IN = 'M45,27.5 C44,19 46.8,12.5 50,12.5 C53.2,12.5 56,19 55,27.5 Z';
  var LONG_L = 'M28,31 L17,52 L13,88 L21.5,90 L24.5,58 L30,46 Z';
  var LONG_R = 'M72,31 L83,52 L87,88 L78.5,90 L75.5,58 L70,46 Z';
  var SHORT_L = 'M28,31 L18,44.5 L25.5,50 L30,44 Z';
  var SHORT_R = 'M72,31 L82,44.5 L74.5,50 L70,44 Z';
  var body = function (len) { return 'M42,27 L28,31 L30,46 L30,' + len + ' Q50,' + (len + 3) + ' 70,' + len + ' L70,46 L72,31 L58,27 Z'; };

  // Center each garment in a 4:5 frame (crops use the untransformed drawing)
  var FRAME = {
    hoodie: 'translate(50 64) scale(1.04) translate(-50 -52)', tee: 'translate(50 62) scale(1.2) translate(-50 -58)',
    short: 'translate(50 62) scale(1.42) translate(-50 -53)', pant: 'translate(50 62) scale(.98) translate(-50 -73.5)',
    fleece: 'translate(50 62) scale(1.06) translate(-50 -57)', shell: 'translate(50 64) scale(1.02) translate(-50 -52)'
  };
  var CROPS = {
    hoodie: { cuff: [8, 70, 20, 25], hood: [31, 1, 38, 47.5], zip: [43, 23, 14, 17.5], collar: [37, 21, 26, 32.5], shoulder: [16, 22, 32, 40], hem: [36, 82, 28, 35] },
    tee: { chest: [26, 22, 48, 60], sleeve: [12, 22, 38, 47.5], collar: [31, 14, 38, 47.5], hem: [30, 60, 40, 50] },
    short: { pocket: [52, 30, 34, 42.5], waist: [26, 22, 48, 60] },
    pant: { knee: [20, 60, 40, 50], waist: [26, 22, 48, 60] },
    fleece: { collar: [31, 12, 38, 47.5], cuff: [4, 60, 34, 42.5] },
    shell: { hood: [31, 1, 38, 47.5], pocket: [26, 26, 34, 42.5] }
  };

  function draw(kind, F, ids) {
    var D = shade(F, -0.16), DD = shade(F, -0.32), E = shade(F, -0.24);
    var fill = 'fill="url(#' + ids.g + ')" stroke="' + E + '" stroke-width=".35" stroke-linejoin="round"';
    var seam = 'fill="none" stroke="' + E + '" stroke-width=".3"';
    var stitch = 'fill="none" stroke="' + E + '" stroke-width=".22" stroke-dasharray=".8 .6"';
    var tex = ids.t ? ' <g fill="url(#' + ids.t + ')">' : '';
    var s = '';
    if (kind === 'hoodie' || kind === 'fleece' || kind === 'shell' || kind === 'tee') {
      var len = kind === 'tee' ? 90 : kind === 'shell' ? 97 : kind === 'fleece' ? 94 : 95;
      var hood = kind === 'hoodie' || kind === 'shell';
      if (hood) s += '<path d="' + HOOD + '" ' + fill + '/>';
      if (kind === 'tee') s += '<path d="' + SHORT_L + '" ' + fill + '/><path d="' + SHORT_R + '" ' + fill + '/>';
      else s += '<path d="' + LONG_L + '" ' + fill + '/><path d="' + LONG_R + '" ' + fill + '/>';
      s += '<path d="' + body(len) + '" ' + fill + '/>';
      if (ids.t) s += '<path d="' + body(len) + '" fill="url(#' + ids.t + ')"/>' + (kind !== 'tee' ? '<path d="' + LONG_L + '" fill="url(#' + ids.t + ')"/><path d="' + LONG_R + '" fill="url(#' + ids.t + ')"/>' : '');
      // seams: shoulder (set off the top), armhole, hem stitch
      s += '<path d="M42.6,29 L29.2,33" ' + seam + '/><path d="M57.4,29 L70.8,33" ' + seam + '/>';
      s += '<path d="M29.2,33 Q31.5,40 30,46" ' + seam + '/><path d="M70.8,33 Q68.5,40 70,46" ' + seam + '/>';
      s += '<path d="M30.4,' + (len - 2.6) + ' Q50,' + (len + 0.4) + ' 69.6,' + (len - 2.6) + '" ' + stitch + '/>';
      if (kind === 'tee') {
        s += '<path d="M42,27 Q50,25 58,27 Q50,33.5 42,27 Z" fill="' + DD + '"/>';
        s += '<path d="M42,27 Q50,33.5 58,27" fill="none" stroke="' + D + '" stroke-width="1.6"/>';
        s += '<path d="M19.6,46 L26.3,50.8" ' + stitch + '/><path d="M80.4,46 L73.7,50.8" ' + stitch + '/>';
      } else {
        // cuffs
        s += '<path d="M13.4,85 L21.8,87" fill="none" stroke="' + E + '" stroke-width=".3"/><path d="M86.6,85 L78.2,87" fill="none" stroke="' + E + '" stroke-width=".3"/>';
      }
      if (kind === 'hoodie') {
        s += '<path d="' + HOOD_IN + '" fill="' + DD + '"/>';
        s += '<ellipse cx="17" cy="81.5" rx=".6" ry="1.7" transform="rotate(10 17 81.5)" fill="' + DD + '"/><ellipse cx="83" cy="81.5" rx=".6" ry="1.7" transform="rotate(-10 83 81.5)" fill="' + DD + '"/>';
        s += '<line x1="50" y1="27.5" x2="50" y2="52" stroke="' + DD + '" stroke-width=".55"/><path d="M48.6,52 L51.4,52" stroke="' + E + '" stroke-width=".3"/>';
        s += '<rect x="48.5" y="26.2" width="3" height="3.2" rx=".6" fill="' + D + '" stroke="' + E + '" stroke-width=".25"/>';
        s += '<rect x="49.3" y="31" width="1.4" height="2.6" rx=".4" fill="' + DD + '"/>';
        s += '<path d="M42,27.5 Q50,31 58,27.5" fill="none" stroke="' + E + '" stroke-width=".55"/>';
      }
      if (kind === 'fleece') {
        s += '<path d="M42,27 L42,20.5 Q50,19 58,20.5 L58,27 Q50,29.5 42,27 Z" ' + fill + '/>';
        s += '<line x1="50" y1="19.6" x2="50" y2="50" stroke="' + DD + '" stroke-width=".55"/><rect x="49.2" y="21" width="1.6" height="3" rx=".4" fill="' + DD + '"/>';
      }
      if (kind === 'shell') {
        s += '<path d="' + HOOD_IN + '" fill="' + DD + '"/>';
        s += '<path d="M42,27.5 Q50,31 58,27.5" fill="none" stroke="' + E + '" stroke-width=".7"/>';
        s += '<line x1="50" y1="27.5" x2="50" y2="' + (len + 1.4) + '" stroke="' + DD + '" stroke-width=".6"/><rect x="49.2" y="29.5" width="1.6" height="3" rx=".4" fill="' + DD + '"/>';
        s += '<path d="M35,40 L44,38" stroke="' + DD + '" stroke-width=".5"/><rect x="43.4" y="37.6" width="1" height="2" rx=".3" fill="' + DD + '"/>';
        s += '<circle cx="31.5" cy="' + (len - 1) + '" r=".8" fill="' + DD + '"/><circle cx="68.5" cy="' + (len - 1) + '" r=".8" fill="' + DD + '"/>';
      }
    } else {
      var long = kind === 'pant';
      var legs = long ? 'M28,37 L26,117 L43,117 L50,56 L57,117 L74,117 L72,37 Z' : 'M28,37 L24,73 Q36,76 48,74 L50,53 L52,74 Q64,76 76,73 L72,37 Z';
      s += '<path d="' + legs + '" ' + fill + '/>';
      s += '<path d="M28,30 L72,30 L72,37.5 L28,37.5 Z" ' + fill + '/><path d="M28,30 L72,30 L72,37.5 L28,37.5 Z" fill="' + D + '" opacity=".35"/>';
      s += '<path d="M30.5,37.5 Q35,44 31.6,51" ' + seam + '/><path d="M69.5,37.5 Q65,44 68.4,51" ' + seam + '/>';
      s += '<path d="M50,37.5 L50,49 Q49,52 46.5,53" ' + seam + '/>';
      if (long) {
        s += '<path d="M28.5,82 Q35,79.5 41,82" ' + seam + '/><path d="M71.5,82 Q65,79.5 59,82" ' + seam + '/>';
        s += '<path d="M26.2,114.4 L43.1,114.4" ' + stitch + '/><path d="M56.9,114.4 L73.8,114.4" ' + stitch + '/>';
        s += '<rect x="30" y="31" width="1" height="6.5" fill="' + E + '" opacity=".6"/><rect x="69" y="31" width="1" height="6.5" fill="' + E + '" opacity=".6"/>';
      } else {
        s += '<path d="M48.6,35 L47.6,41.5 M51.4,35 L52.4,41.5" stroke="' + DD + '" stroke-width=".45" fill="none"/>';
        s += '<path d="M24.4,70.2 Q36,73.2 48.1,71.2" ' + stitch + '/><path d="M75.6,70.2 Q64,73.2 51.9,71.2" ' + stitch + '/>';
        s += '<path d="M60,57 L69.5,55.6" stroke="' + DD + '" stroke-width=".5"/><rect x="68.8" y="55" width="1" height="2" rx=".3" fill="' + DD + '"/>';
      }
    }
    return s;
  }

  function svg(p, colorKey, o) {
    o = o || {};
    var S = window.KG_SHOP, F = S.COLORS[colorKey || p.colors[0]].hex;
    var id = 'a' + (++n), ids = { g: id + 'g', f: id + 'f', t: (p.art === 'fleece' || p.art === 'shell') ? id + 't' : null };
    var vb = '0 0 100 125';
    var crop = typeof o.crop === 'string' ? (CROPS[p.art] || {})[o.crop] : o.crop;
    if (crop) vb = crop.join(' ');
    else if (o.square) vb = '-12.5 0 125 125';
    var defs = '<defs><linearGradient id="' + ids.g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + shade(F, 0.1) + '"/><stop offset="1" stop-color="' + shade(F, -0.08) + '"/></linearGradient>' +
      '<filter id="' + ids.f + '" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy=".9" stdDeviation="1.1" flood-color="#3b2f22" flood-opacity=".22"/></filter>';
    if (ids.t) {
      var gap = p.art === 'fleece' ? 2.2 : 1.4, op = p.art === 'fleece' ? 0.22 : 0.12;
      defs += '<pattern id="' + ids.t + '" width="' + gap + '" height="' + gap + '" patternUnits="userSpaceOnUse"><path d="M' + gap + ',0 L0,0 0,' + gap + '" fill="none" stroke="' + shade(F, -0.35) + '" stroke-width=".18" opacity="' + op + '"/></pattern>';
    }
    defs += '</defs>';
    return '<svg class="art" viewBox="' + vb + '" role="img" aria-label="' + (o.label || p.name + ', ' + S.COLORS[colorKey || p.colors[0]].name) + '">' + defs +
      '<g filter="url(#' + ids.f + ')"' + (crop ? '' : ' transform="' + FRAME[p.art] + '"') + '>' + draw(p.art, F, ids) + '</g></svg>';
  }

  window.KG_ART = { svg: svg, CROPS: CROPS };
})();
