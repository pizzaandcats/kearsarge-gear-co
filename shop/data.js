/* Mock catalog. Everything here is dummy content for a design experiment.
   Product names are stops on the trail over Kearsarge Pass (Eastern Sierra). */
(function () {
  var U = function (id, o) {
    o = o || {};
    var q = 'auto=format&fit=crop&q=72&w=' + (o.w || 900) + '&h=' + (o.h || 1125);
    if (o.fp) q += '&crop=focalpoint&fp-x=' + o.fp[0] + '&fp-y=' + o.fp[1] + '&fp-z=' + o.fp[2];
    return 'https://images.unsplash.com/photo-' + id + '?' + q;
  };

  var COLORS = {
    sand: { name: 'Sand', hex: '#d8c3a0' }, sea: { name: 'Sea', hex: '#1f5568' },
    sage: { name: 'Sage', hex: '#8fa28a' }, sun: { name: 'Sunset', hex: '#d9622b' },
    ink: { name: 'Ink', hex: '#2a2119' }, bone: { name: 'Bone', hex: '#efe6d6' },
    granite: { name: 'Granite', hex: '#6f6a64' }, pine: { name: 'Pine', hex: '#33473a' }
  };

  var COLLECTIONS = [
    { id: 'sun-trail', name: 'Sun & Trail', blurb: 'Sun hoodies and long sleeves for long days outside.', image: U('1791779992382-a02b7b5afde7', { w: 1200, h: 1500 }) },
    { id: 'train', name: 'Train', blurb: 'Tees and tanks for lifting, rucking and pull-ups.', image: U('1604897391146-c98ab268e252', { w: 1200, h: 1500 }) },
    { id: 'bottoms', name: 'Shorts & Pants', blurb: 'Inseams that end where your legs do.', image: U('1667388624717-895854eea032', { w: 1200, h: 1500 }) },
    { id: 'layers', name: 'Layers', blurb: 'Fleece and shells cut short in the body and sleeves.', image: U('1762224691220-96a3335008a6', { w: 1200, h: 1500 }) }
  ];

  var TOP_FIT = 'top', BOTTOM_FIT = 'bottom', GLOVE_FIT = 'glove';

  var PRODUCTS = [
    {
      id: 'onion-valley-sun-hoodie', name: 'Onion Valley Sun Hoodie', collection: 'sun-trail', price: 88, badge: 'Best seller',
      tagline: 'The sun hoodie, cut short.',
      colors: ['sand', 'sea', 'sage'], fit: TOP_FIT,
      images: [U('1791779992382-a02b7b5afde7'), U('1695187101014-d34735a4a951'), U('1582394895085-82cd4fd55141'), U('1695187101014-d34735a4a951', { fp: [0.55, 0.62, 2.2] })],
      features: [
        ['Sleeves end at your wrist.', 'Thumbholes land on your hand, not your knuckles.', U('1695187101014-d34735a4a951', { w: 720, h: 900, fp: [0.55, 0.62, 2.2] })],
        ['Hood turns with your head.', 'Closer at the cheeks. Clear at the edges.', U('1695187101014-d34735a4a951', { w: 720, h: 900, fp: [0.35, 0.25, 2.0] })],
        ['Room in the shoulders.', 'Cut short, not small.', U('1791779992382-a02b7b5afde7', { w: 720, h: 900, fp: [0.55, 0.45, 2.4] })],
        ['Hem stays at your waist.', 'Under the hip belt. Not down your thighs.', U('1582394895085-82cd4fd55141', { w: 720, h: 900, fp: [0.5, 0.4, 2.0] })]
      ],
      details: {
        Fit: 'Shorter in the body and sleeves than a standard size. Room in the chest and shoulders.',
        Fabric: 'Lightweight stretch knit. Placeholder: final fabric picked after wear testing.',
        Details: 'Quarter zip with a zipper garage. Thumbholes. Hood that sits close.',
        Care: 'Machine wash cold. Hang dry.'
      }
    },
    {
      id: 'flower-lake-sun-crew', name: 'Flower Lake Sun Crew', collection: 'sun-trail', price: 72,
      tagline: 'All the sun, none of the hood.',
      colors: ['bone', 'sea'], fit: TOP_FIT,
      images: [U('1506527115643-b3b387978fad'), U('1553593155-9e0dc045405c'), U('1505782388-8632b3423dbb')],
      details: { Fit: 'Long sleeve crew, cut short in the body and sleeves.', Fabric: 'Lightweight stretch knit (placeholder).', Care: 'Machine wash cold. Hang dry.' }
    },
    {
      id: 'golden-trout-sun-glove', name: 'Golden Trout Sun Glove', collection: 'sun-trail', price: 32, badge: 'New',
      tagline: 'Men\'s palms. Shorter fingers.',
      colors: ['sand', 'granite'], fit: GLOVE_FIT,
      images: [U('1695187101014-d34735a4a951', { fp: [0.6, 0.6, 2.6] }), U('1791779992382-a02b7b5afde7')],
      details: { Fit: 'A men\'s hand width with finger lengths cut for smaller hands.', Fabric: 'Stretch knit back, synthetic palm (placeholder).', Care: 'Hand wash. Hang dry.' }
    },
    {
      id: 'bullfrog-training-tee', name: 'Bullfrog Training Tee', collection: 'train', price: 48, badge: 'Best seller',
      tagline: 'XS too tight. S too long. Fixed.',
      colors: ['ink', 'granite', 'sand'], fit: TOP_FIT,
      images: [U('1604897391146-c98ab268e252'), U('1790267461841-6b66de790590'), U('1791732604582-60dcebafcae4')],
      features: [
        ['Room in the chest.', 'No compression-shirt squeeze.', U('1604897391146-c98ab268e252', { w: 720, h: 900, fp: [0.5, 0.75, 2.0] })],
        ['Room in the lats.', 'Hem stays down on pull-ups.', U('1790267461841-6b66de790590', { w: 720, h: 900 })],
        ['Sleeves cut for a short arm.', 'They sit on the arm. They don\'t hang off it.', U('1604897391146-c98ab268e252', { w: 720, h: 900, fp: [0.25, 0.8, 2.4] })],
        ['Collar holds its shape.', 'Wash after wash.', U('1791732604582-60dcebafcae4', { w: 720, h: 900 })]
      ],
      details: { Fit: 'Shorter body and sleeves. Room in the chest, lats and arms.', Fabric: 'Stretch performance knit (placeholder).', Care: 'Machine wash cold. Tumble dry low.' }
    },
    {
      id: 'gilbert-training-tank', name: 'Gilbert Training Tank', collection: 'train', price: 38,
      tagline: 'Armholes that don\'t hang to your ribs.',
      colors: ['ink', 'bone'], fit: TOP_FIT,
      images: [U('1605296867304-46d5465a13f1'), U('1677165733273-dcc3724c00e8')],
      details: { Fit: 'Shorter body. Armholes cut for a shorter torso.', Fabric: 'Stretch performance knit (placeholder).', Care: 'Machine wash cold.' }
    },
    {
      id: 'rae-lakes-trail-short', name: 'Rae Lakes Trail Short', collection: 'bottoms', price: 58, badge: 'Best seller',
      tagline: 'Pick your inseam: 5, 6 or 7 inches.',
      colors: ['ink', 'sage', 'sand'], fit: BOTTOM_FIT, inseams: ['5"', '6"', '7"'],
      images: [U('1667388624717-895854eea032'), U('1597892653980-3cec697283fe'), U('1739416729276-23deaf06a982')],
      details: { Fit: 'Three inseams so the hem lands above the knee on a shorter leg.', Fabric: 'Stretch woven, quick drying (placeholder).', Details: 'Zip pocket. Liner optional.', Care: 'Machine wash cold. Hang dry.' }
    },
    {
      id: 'kearsarge-pass-pant', name: 'Kearsarge Pass Pant', collection: 'bottoms', price: 98,
      tagline: 'A trail pant you don\'t have to hem.',
      colors: ['granite', 'sand', 'pine'], fit: BOTTOM_FIT, inseams: ['27"', '28"', '29"'],
      images: [U('1784715595696-bb7cb69fdec1'), U('1505782388-8632b3423dbb')],
      details: { Fit: 'Inseams from 27 to 29 inches. Knee placed for a shorter leg.', Fabric: 'Stretch woven (placeholder).', Care: 'Machine wash cold. Hang dry.' }
    },
    {
      id: 'charlotte-jogger', name: 'Charlotte Jogger', collection: 'bottoms', price: 88,
      tagline: 'The everyday jogger, cuffs at your ankle.',
      colors: ['granite', 'ink'], fit: BOTTOM_FIT, inseams: ['26"', '27"', '28"'],
      images: [U('1555412590-954a889ccb90'), U('1581382576286-b6c8f871fb07')],
      details: { Fit: 'Ankle cuffs that land at your ankle, not your shoe.', Fabric: 'Stretch knit (placeholder).', Care: 'Machine wash cold.' }
    },
    {
      id: 'pothole-fleece', name: 'Pothole Fleece', collection: 'layers', price: 118, badge: 'New',
      tagline: 'A fleece that ends at your waist.',
      colors: ['ink', 'pine', 'sand'], fit: TOP_FIT,
      images: [U('1762224691220-96a3335008a6'), U('1762224690890-ab0283ca2900'), U('1762224691127-56e7b1dce731')],
      details: { Fit: 'Shorter body and sleeves. Room to layer.', Fabric: 'Grid fleece (placeholder).', Care: 'Machine wash cold. Tumble dry low.' }
    },
    {
      id: 'independence-wind-shell', name: 'Independence Wind Shell', collection: 'layers', price: 128,
      tagline: 'Packs into its own pocket. Fits like it was made for you.',
      colors: ['sun', 'sea'], fit: TOP_FIT,
      images: [U('1525721956353-b1a070c55a60'), U('1586399254847-02e1369bac88')],
      details: { Fit: 'Shorter body and sleeves. Hood sized to your head, not a taller guy\'s.', Fabric: 'Lightweight ripstop (placeholder).', Care: 'Machine wash cold. Hang dry.' }
    }
  ];

  window.KG_SHOP = {
    U: U, COLORS: COLORS, COLLECTIONS: COLLECTIONS, PRODUCTS: PRODUCTS,
    HEIGHTS: ['5\'3"–5\'5"', '5\'6"–5\'8"'],
    CHESTS: ['XS', 'S', 'M', 'L', 'XL'],
    WAISTS: ['28', '29', '30', '31', '32', '34', '36'],
    GLOVES: ['S', 'M', 'L'],
    product: function (id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; },
    collection: function (id) { return COLLECTIONS.filter(function (c) { return c.id === id; })[0]; }
  };
})();
