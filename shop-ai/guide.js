/* Kearsarge fit guide: SCRIPTED DEMO, not a live AI model.
   It reads plain sentences for height, build, usual size, waist, activities and
   brands, keeps a small fit profile, and answers with personalized product picks.
   To make it real, replace KG_GUIDE.reply() with a call to a server that talks to
   a language model, passing the profile and catalog as context. */
(function () {
  var S = window.KG_SHOP;
  var SIZES = ['XS', 'S', 'M', 'L', 'XL'];

  function parseHeight(t) {
    var m = t.match(/\b([45])\s*(?:'|’|ft|foot|feet)\s*(\d{1,2})?\s*(?:"|”|in|inch|inches)?/i) ||
            t.match(/\b([45])\s+(\d{1,2})\b(?!\s*(?:lb|lbs|kg|waist))/i);
    if (m) { var ft = +m[1], inch = m[2] ? +m[2] : 0; if (inch < 12) return ft * 12 + inch; }
    var cm = t.match(/\b(1[4-9]\d)\s*cm\b/i);
    if (cm) return Math.round(+cm[1] / 2.54);
    return null;
  }
  function parseSize(t) {
    t = t.replace(/\b(medium build|small frame|large frame)\b/ig, '');
    var map = { 'extra small': 'XS', 'x-small': 'XS', 'xsmall': 'XS', 'xs': 'XS', 'small': 'S', 'medium': 'M', 'med': 'M', 'large': 'L', 'extra large': 'XL', 'x-large': 'XL', 'xl': 'XL' };
    var m = t.toLowerCase().match(/\b(extra small|x-small|xsmall|xs|small|medium|med|large|extra large|x-large|xl)\b/) ||
            t.match(/\b(?:size|wear|wearing|buy|in an?|an?)\s+(S|M|L)\b/) || t.match(/^\s*(XS|S|M|L|XL)\s*$/i) ||
            t.match(/\b(?:vuori|patagonia|lululemon|true classic|nike|ten thousand|rhone|arcteryx|arc'teryx|uniqlo)\s+(XS|S|M|L|XL)\b/i);
    if (!m) return null;
    var k = m[1].toLowerCase();
    return map[k] || k.toUpperCase();
  }
  function parseWaist(t) { var m = t.match(/\b(2[6-9]|3[0-9]|4[0-2])\s*(?:"|in|inch|inches)?\s*waist\b/i) || t.match(/\bwaist\s*(?:is|of|:)?\s*(2[6-9]|3[0-9]|4[0-2])\b/i); return m ? +m[1] : null; }
  function parseBuild(t) {
    if (/\b(lean|slim|skinny|thin|wiry|small frame)\b/i.test(t)) return 'lean';
    if (/\b(built|muscular|athletic|lift|lifts|lifting|jacked|broad|stocky|big chest|big arms|thick)\b/i.test(t)) return 'built';
    if (/\b(average|normal|medium build)\b/i.test(t)) return 'average';
    return null;
  }
  var ACTS = [
    ['sun-trail', /\b(hik\w*|trail|backpack\w*|sun|fish\w*|boat\w*|sail\w*|beach|desert|outdoor\w*)\b/i],
    ['train', /\b(gym|lift\w*|ruck\w*|pull-?ups?|train\w*|crossfit|workout|weights)\b/i],
    ['bottoms', /\b(shorts?|pants?|joggers?|inseam|run\w*)\b/i],
    ['layers', /\b(cold|fleece|layer\w*|jacket|wind|rain|shell|winter)\b/i],
    ['glove', /\b(gloves?|hands?)\b/i]
  ];
  function parseActs(t) { return ACTS.filter(function (a) { return a[1].test(t); }).map(function (a) { return a[0]; }); }
  function parseBrand(t) {
    var m = t.match(/\b(vuori|patagonia|lululemon|true classic|nike|ten thousand|rhone|arcteryx|arc'teryx|uniqlo)\b/i);
    return m ? m[1] : null;
  }
  function complaint(t) {
    if (/\b(tight|squeez\w*|small)\b.*\b(chest|shoulders?|arms?|lats?)\b|\b(chest|shoulders?|arms?)\b.*\btight\b/i.test(t)) return 'tight';
    if (/\b(too long|long|hangs|baggy|tent)\b/i.test(t)) return 'long';
    return null;
  }

  var heightBand = function (inches) { return inches <= 65 ? S.HEIGHTS[0] : S.HEIGHTS[1]; };
  var fmtHeight = function (inches) { return Math.floor(inches / 12) + "'" + (inches % 12) + '"'; };

  // Recommend a chest size from what they wear plus what goes wrong with it.
  function chestFor(p) {
    if (!p.size) return null;
    var i = SIZES.indexOf(p.size);
    if (p.complaint === 'tight' || (p.build === 'built' && p.size === 'XS')) i = Math.min(i + 1, SIZES.length - 1);
    if (p.complaint === 'long' && p.build === 'lean' && i > 0 && p.size !== 'XS') i = i - 1;
    return SIZES[i];
  }
  function waistFor(p) { return p.waist || { XS: 28, S: 30, M: 32, L: 34, XL: 36 }[chestFor(p) || 'M']; }
  function inseamFor(p, prod) { if (!prod.inseams) return null; return p.height && p.height <= 65 ? prod.inseams[0] : prod.inseams[Math.min(1, prod.inseams.length - 1)]; }

  function sizeLabel(p, prod) {
    if (prod.fit === 'top') return chestFor(p) + ' chest · ' + heightBand(p.height) + ' length';
    if (prod.fit === 'bottom') return waistFor(p) + (p.waist ? '' : ' (est.)') + ' waist · ' + inseamFor(p, prod) + ' inseam';
    return ({ XS: 'S', S: 'S', M: 'M', L: 'L', XL: 'L' })[chestFor(p) || 'M'];
  }
  function cartSize(p, prod) {
    if (prod.fit === 'top') return chestFor(p) + ' / ' + heightBand(p.height);
    if (prod.fit === 'bottom') return waistFor(p) + ' waist / ' + inseamFor(p, prod) + ' inseam';
    return sizeLabel(p, prod);
  }
  function why(p, prod) {
    var h = fmtHeight(p.height), out = [];
    if (prod.fit === 'top') {
      out.push('Length cut for ' + heightBand(p.height) + ', so at ' + h + ' it ends at your waist.');
      if (chestFor(p) !== p.size) out.push('You said ' + p.size + ' is tight, so the chest goes up to ' + chestFor(p) + ' without adding length.');
      else out.push('Same ' + p.size + ' chest you already buy. Just less shirt.');
    } else if (prod.fit === 'bottom') {
      out.push('The ' + inseamFor(p, prod) + ' inseam is the one we\'d put on a ' + h + ' leg.');
      if (!p.waist) out.push('Waist is a guess from your shirt size. Tell me your waist to lock it in.');
    } else {
      out.push('Men\'s palm width with shorter fingers.');
    }
    return out;
  }

  function pick(p) {
    var acts = p.acts.length ? p.acts : ['sun-trail', 'train'];
    var list = [];
    acts.forEach(function (a) {
      if (a === 'glove') list.push(S.product('golden-trout-sun-glove'));
      else S.PRODUCTS.filter(function (x) { return x.collection === a; }).slice(0, 2).forEach(function (x) { list.push(x); });
    });
    var seen = {}; return list.filter(function (x) { if (!x || seen[x.id]) return false; seen[x.id] = 1; return true; }).slice(0, 4);
  }
  function kit(p) {
    var outdoor = p.acts.indexOf('train') === -1 || p.acts.indexOf('sun-trail') > -1;
    return outdoor
      ? ['onion-valley-sun-hoodie', 'rae-lakes-trail-short', 'independence-wind-shell'].map(S.product)
      : ['bullfrog-training-tee', 'rae-lakes-trail-short', 'pothole-fleece'].map(S.product);
  }
  function findProduct(t) {
    var low = t.toLowerCase();
    return S.PRODUCTS.filter(function (x) {
      var first = x.name.toLowerCase().split(' ')[0];
      return low.indexOf(x.name.toLowerCase()) > -1 || (first.length > 4 && low.indexOf(first) > -1) ||
        (/\bhoodie\b/.test(low) && x.id === 'onion-valley-sun-hoodie') || (/\btee\b|\bt-shirt\b|\bshirt\b/.test(low) && x.id === 'bullfrog-training-tee') ||
        (/\bfleece\b/.test(low) && x.id === 'pothole-fleece') || (/\bpants?\b/.test(low) && x.id === 'kearsarge-pass-pant');
    })[0];
  }

  /* reply(text, profile) -> { text, cards?, chips?, kit? }  Mutates profile. */
  function reply(text, p) {
    var t = text.trim();
    var h = parseHeight(t), s = parseSize(t), b = parseBuild(t), w = parseWaist(t), acts = parseActs(t), brand = parseBrand(t), c = complaint(t);
    if (h) p.height = h; if (s) p.size = s; if (b) p.build = b; if (w) p.waist = w; if (c) p.complaint = c; if (brand) p.brand = brand;
    acts.forEach(function (a) { if (p.acts.indexOf(a) === -1) p.acts.push(a); });

    if (/start over/i.test(t)) { Object.keys(p).forEach(function (k) { delete p[k]; }); p.acts = []; return { reset: true, text: 'Clean slate. How tall are you?', chips: ['5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"'] }; }
    if (/\b(return|exchange|refund)\w*/i.test(t)) return { text: 'Fit exchanges would be free. If the length is off, we swap it. (Mock store: nothing ships yet.)', chips: ['Show me picks'] };
    if (/\b(ship|shipping|deliver)\w*/i.test(t)) return { text: 'Shipping is a placeholder in this mock: free over $100.', chips: ['Show me picks'] };
    if (/\b(fabric|material|made of|smell|odor)\b/i.test(t)) return { text: 'Fabric is still being wear-tested, so I won\'t promise one yet. The fit is the part that\'s different here.', chips: ['Show me picks'] };
    if (p.height && p.height > 68) return { text: 'At ' + fmtHeight(p.height) + ', regular brands are cut for you. Kearsarge is built for 5\'8" and under, so we\'re probably not your best fit.', chips: ['I meant 5\'8"', 'Start over'] };

    var early = findProduct(t);
    if (early && !p.height) return { text: 'Here\'s the ' + early.name + '. Tell me your height and I\'ll size it for you.', cards: [early], chips: ['5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"'] };
    if (!p.height) return { text: brand ? 'Got it, ' + brand + '. How tall are you?' : 'How tall are you? Something like 5\'6" works.', chips: ['5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"'] };
    if (!p.size) return { text: 'At ' + fmtHeight(p.height) + ', what size tee do you usually buy?', chips: ['XS', 'S', 'M', 'L', 'XL'] };
    if (!p.complaint && !p.asked) { p.asked = true; return { text: 'And what goes wrong in a ' + p.size + '?', chips: ['Too long', 'Tight in the chest', 'Both', 'Fits fine'] }; }
    if (/\bboth\b/i.test(t)) p.complaint = 'tight';

    var named = findProduct(t);
    if (named && /\b(fit|size|what size|will|would|how)\b/i.test(t)) {
      return { text: 'For you: ' + named.name + ' in ' + sizeLabel(p, named) + '.', why: why(p, named), cards: [named], chips: ['Build me a kit', 'Show me picks'] };
    }
    if (/add the whole kit/i.test(t)) return { addKit: true, text: 'Added all three to your bag, each in your size.' };
    if (/\b(kit|outfit|everything|full)\b/i.test(t)) {
      var k = kit(p);
      return { text: 'Here\'s a kit for you at ' + fmtHeight(p.height) + (p.build ? ' with a ' + ({ built: 'built', lean: 'lean', average: 'average' })[p.build] + ' frame' : '') + '. All sized for you.', cards: k, kit: true, chips: ['Add the whole kit', 'Something for the gym'] };
    }

    var picks = pick({ acts: acts.length ? acts : p.acts });
    var lead;
    if (p.shown) lead = acts.length ? 'Here\'s what I\'d grab for that, in your size.' : 'A few more in your size.';
    else {
      lead = 'Here\'s your fit: ' + chestFor(p) + ' chest, ' + heightBand(p.height) + ' length.';
      if (p.complaint === 'tight' && chestFor(p) !== p.size) lead = 'You\'re a ' + chestFor(p) + ' chest with ' + heightBand(p.height) + ' length. Up from ' + p.size + ' for room, without the extra length.';
      if (p.brand) lead += ' Compared with your ' + p.brand + ' ' + p.size + ': same idea, shorter body and sleeves.';
      p.shown = true;
    }
    return { text: lead, cards: picks, chips: ['Build me a kit', 'Something for the gym', 'Shorts', 'Will the hoodie fit me?'] };
  }

  window.KG_GUIDE = { reply: reply, sizeLabel: sizeLabel, cartSize: cartSize, why: why, fmtHeight: fmtHeight, heightBand: heightBand, chestFor: chestFor, kit: kit };
})();
