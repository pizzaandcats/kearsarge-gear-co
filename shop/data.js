/* Mock catalog for a design test. One world (the Eastern Sierra trail), one first run.
   Names follow one pattern: a Sierra place + the construction + the garment.
   Photos: every image slot is listed in PHOTOS with an ID, ratio and shot brief.
   Paste a URL into `src` and the gray placeholder becomes the photo. */
(function () {
  var SHIP = '[Ship window TBD]';

  var COLORS = {
    tufa: { name: 'Tufa', hex: '#d6c9b1' },
    sagebrush: { name: 'Sagebrush', hex: '#939c84' },
    granite: { name: 'Granite', hex: '#77736c' },
    tarn: { name: 'Tarn', hex: '#4c5d67' }
  };

  var COLLECTIONS = [
    { id: 'tops', name: 'Sun Hoodies & Tees', blurb: 'Shorter in the body and sleeves. Never smaller.' },
    { id: 'layers', name: 'Fleece & Shells', blurb: 'Mid-layers and wind protection, cut to end at your waist.' },
    { id: 'bottoms', name: 'Pants & Shorts', blurb: 'Inseams that end where your legs do.' },
    { id: 'gloves', name: 'Gloves', blurb: 'Fingers cut for a smaller hand.' }
  ];

  var PRODUCTS = [
    {
      id: 'palisade-sun-hoodie', code: 'PAL', name: 'Palisade Quarter-Zip Sun Hoodie', short: 'Palisade Sun Hoodie',
      collection: 'tops', price: 88, badge: 'First run', colors: ['sagebrush', 'tufa', 'tarn'], fit: 'top',
      blurb: 'Built for long, exposed days above the trees, the Palisade is a lightweight quarter-zip sun hoodie proportioned for men 5\'3" to 5\'8". Shorter in the body and sleeves, fitted through the chest and arms, with a hood that turns when you do.',
      uses: ['Hiking', 'Backpacking', 'Desert days'],
      features: [
        ['Thumbholes on your hand.', 'Sleeves are 2" shorter, taken out below the elbow. The fabric stays over the back of your hand.', 'cuff'],
        ['A hood that turns with you.', '1" shorter at the crown and closer at the cheeks, out of your peripheral vision.', 'hood'],
        ['Zipper never touches your neck.', 'A zipper garage at the top and a soft guard behind the whole zip.', 'zip'],
        ['A collar that keeps its shape.', 'A taped neckline, so it doesn\'t stretch out after a season.', 'collar'],
        ['No seam under your pack straps.', 'Shoulder seams sit just off the top of the shoulder.', 'shoulder'],
        ['Hem stays under the hip belt.', 'About 3" shorter in the body, with a drop tail in back.', 'hem']
      ],
      // Graded chart from the Size Lineup Module Spec v1 (flat, inches). S is the sample;
      // the other sizes are a proposed grade, confirmed on samples.
      spec: {
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        sample: 'S',
        chest: [17.25, 18.75, 20.25, 21.75, 23.25],
        front: [26, 26.5, 27, 27.5, 28],
        sleeve: [29.25, 30, 30.75, 31.5, 32.25],
        body: ['34" to 37"', '37" to 40"', '40" to 43"', '43" to 46"', '46" to 49"'],
        // A best-selling merino sun hoodie: XS and S front length from its published chart,
        // M to XL extended at the same step. Sleeve from a worn XS measured against our sample.
        regular: { front: [29.4, 30.1, 30.8, 31.5, 32.2], sleeveExtra: 2 }
      },
      details: {
        'Design details': ['Quarter zip with a zipper garage and a soft guard behind the zip', 'Thumbhole slits that keep fabric over the back of the hand', 'Taped neckline that holds its shape', 'Shoulder seams set off the top of the shoulder, clear of pack straps', 'Drop tail hem'],
        'Fabric & care': ['Lightweight four-way stretch knit (placeholder: final fabric chosen after wear testing)', 'Machine wash cold, hang dry']
      }
    },
    {
      id: 'tioga-trail-tee', code: 'TIO', name: 'Tioga Articulated Trail Tee', short: 'Tioga Trail Tee',
      collection: 'tops', price: 48, colors: ['granite', 'tufa', 'tarn'], fit: 'top',
      blurb: 'A technical tee for the trail and everything around it. Shorter in the body so the hem sits at your belt, with room through the chest and shoulders.',
      uses: ['Hiking', 'Training', 'Travel'],
      details: {
        'Design details': ['Shorter body, hem at the belt', 'Sleeves cut for a shorter arm', 'Collar that holds its shape'],
        'Fabric & care': ['Stretch performance knit (placeholder)', 'Machine wash cold, tumble dry low']
      }
    },
    {
      id: 'rock-creek-fleece', code: 'RCK', name: 'Rock Creek Half-Zip Fleece', short: 'Rock Creek Fleece',
      collection: 'layers', price: 118, colors: ['sagebrush', 'granite'], fit: 'top',
      blurb: 'A light grid fleece for cold starts and high camp. Cut to end at your waist and sized to layer over the Palisade without bunching.',
      uses: ['Backpacking', 'Camp', 'Shoulder season'],
      details: {
        'Design details': ['Half zip with a stand collar', 'Shorter body and sleeves', 'Room to layer over the sun hoodie'],
        'Fabric & care': ['Grid fleece (placeholder)', 'Machine wash cold, tumble dry low']
      }
    },
    {
      id: 'mono-wind-shell', code: 'MNO', name: 'Mono Hooded Wind Shell', short: 'Mono Wind Shell',
      collection: 'layers', price: 128, colors: ['tarn', 'tufa'], fit: 'top',
      blurb: 'A featherweight shell for ridgelines and wind-scoured passes. The hood is sized to your head, not a taller man\'s, so it stays put when the weather turns.',
      uses: ['Hiking', 'Backpacking', 'Travel'],
      details: {
        'Design details': ['Full zip', 'Hood sized for a shorter frame', 'Chest pocket', 'Shorter body and sleeves'],
        'Fabric & care': ['Lightweight ripstop (placeholder)', 'Machine wash cold, hang dry']
      }
    },
    {
      id: 'whitney-trail-pant', code: 'WHT', name: 'Whitney Stretch Trail Pant', short: 'Whitney Trail Pant',
      collection: 'bottoms', price: 98, colors: ['granite', 'tufa'], fit: 'bottom', inseams: ['26"', '28"'], waists: ['28', '30', '32', '34'],
      blurb: 'A trail pant you never have to hem. Two inseams, 26" and 28", with the knee placed for a shorter leg so it bends where you do.',
      uses: ['Hiking', 'Backpacking', 'Travel'],
      details: {
        'Design details': ['Two inseams: 26" and 28"', 'Knee articulation placed for a shorter leg', 'Even waists, 28 to 34'],
        'Fabric & care': ['Stretch woven (placeholder)', 'Machine wash cold, hang dry']
      }
    },
    {
      id: 'kern-trail-short', code: 'KRN', name: 'Kern Trail Short', short: 'Kern Trail Short',
      collection: 'bottoms', price: 58, colors: ['granite', 'sagebrush'], fit: 'bottom', inseams: ['6"'], waists: ['S', 'M', 'L', 'XL'], waistHint: 'S 28-29, M 30-31, L 32-34, XL 35-37',
      blurb: 'One 6" inseam, cut for a shorter leg, so the hem lands above the knee. No inseam math.',
      uses: ['Hiking', 'Training', 'Summer'],
      details: {
        'Design details': ['6" inseam, cut for a shorter leg', 'Zip pocket', 'Drawcord waist'],
        'Fabric & care': ['Stretch woven, quick drying (placeholder)', 'Machine wash cold, hang dry']
      }
    },
    {
      id: 'lamarck-sun-glove', code: 'LMK', name: 'Lamarck Sun Glove', short: 'Lamarck Sun Glove',
      collection: 'gloves', price: 32, colors: ['tufa', 'granite'], fit: 'glove',
      blurb: 'A light sun glove with a men\'s palm and shorter fingers. Most men\'s gloves run long in the fingers; most women\'s run narrow in the hand. This one doesn\'t.',
      uses: ['Hiking', 'Desert days', 'Scrambling'],
      details: {
        'Design details': ['Men\'s palm width with shorter fingers', 'Covers the back of the hand from the sun'],
        'Fabric & care': ['Lightweight stretch knit (placeholder)', 'Machine wash cold, hang dry']
      }
    }
  ];

  /* ---------- Photo slots ---------- */
  var ART = {
    flat: 'Studio flat lay, top-down, on warm off-white paper (#efe9df). Garment centered and neatly folded at the sleeves, soft even light, gentle shadow. No props, no logos.',
    model: 'Studio, plain light gray seamless backdrop, soft directional light from the front left. Model about 5\'5" with an athletic build, calm expression, standing straight, 3/4 body. No logos.',
    detail: 'Studio macro close-up on the garment, soft light, shallow depth of field, warm off-white or light gray background.'
  };
  var PHOTOS = {
    'HOME-HERO': { ratio: '16:9', px: '2400×1350', shot: 'Eastern Sierra trail in early light: granite, pines, a high pass in the distance. A man around 5\'5" in the Palisade Sun Hoodie (Sagebrush) hikes toward camera with his dog, 3/4 body, relaxed stride. Leave calm space on the left for the headline. Also crop a 4:5 version for phones.' },
    'HOME-FEATURE': { ratio: '4:5', px: '2000×2500', shot: 'The Palisade Sun Hoodie on a man around 5\'5" at a granite trailhead, hood down, quarter zip half open, midday light. Waist up, slight 3/4 angle.' },
    'HOME-STORY': { ratio: '3:2', px: '2400×1600', shot: 'Kearsarge Pass, Eastern Sierra: wide landscape of the switchbacks and the lakes below, late afternoon. No people, or one small figure for scale.' },
    'HOME-JOURNAL': { ratio: '3:2', px: '2400×1600', shot: 'Two hikers, one around 5\'5", taking a break on a granite slab with a dog. Packs off, candid, natural light. Muted color.' }
  };
  PRODUCTS.forEach(function (p) {
    p.colors.forEach(function (c) {
      PHOTOS[p.code + '-FLAT-' + c.toUpperCase()] = { ratio: '4:5', px: '2000×2500', shot: p.short + ' in ' + COLORS[c].name + '. ' + ART.flat };
    });
    PHOTOS[p.code + '-MODEL'] = { ratio: '4:5', px: '2000×2500', shot: p.short + ' in ' + COLORS[p.colors[0]].name + ', worn. ' + ART.model + (p.fit === 'bottom' ? ' Frame from the waist down to the shoes.' : p.fit === 'glove' ? ' Frame the hands and forearms.' : '') };
    PHOTOS[p.code + '-BACK'] = { ratio: '4:5', px: '2000×2500', shot: p.short + ' in ' + COLORS[p.colors[0]].name + ', back view. ' + ART.model };
    (p.features || []).forEach(function (f) {
      PHOTOS[p.code + '-DETAIL-' + f[2].toUpperCase()] = { ratio: '4:5', px: '2000×2500', shot: p.short + ': ' + f[0].replace(/\.$/, '') + '. ' + f[1] + ' ' + ART.detail };
    });
  });
  Object.keys(PHOTOS).forEach(function (k) { PHOTOS[k].src = PHOTOS[k].src || ''; });

  window.KG_SHOP = {
    SHIP: SHIP, COLORS: COLORS, COLLECTIONS: COLLECTIONS, PRODUCTS: PRODUCTS, PHOTOS: PHOTOS,
    CHESTS: ['XS', 'S', 'M', 'L', 'XL'],
    WAISTS: ['28', '30', '32', '34'],
    GLOVES: ['S', 'M', 'L'],
    product: function (id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; },
    collection: function (id) { return COLLECTIONS.filter(function (c) { return c.id === id; })[0]; },
    flat: function (p, c) { return p.code + '-FLAT-' + (c || p.colors[0]).toUpperCase(); }
  };
})();
