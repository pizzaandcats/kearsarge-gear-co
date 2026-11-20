/* Mock catalog for a design test. One world (the trail), six pieces, four colors.
   Product names are stops on the trail over Kearsarge Pass (Eastern Sierra).
   Product images are drawn flat lays (art.js) until there's a real product shoot. */
(function () {
  var COLORS = {
    sand: { name: 'Sand', hex: '#d4c2a1' },
    sage: { name: 'Sage', hex: '#959e86' },
    granite: { name: 'Granite', hex: '#78736b' },
    slate: { name: 'Slate', hex: '#4e606a' }
  };

  var COLLECTIONS = [
    { id: 'tops', name: 'Tops', blurb: 'Shorter in the body and sleeves. Never smaller.' },
    { id: 'bottoms', name: 'Bottoms', blurb: 'Inseams that end where your legs do.' },
    { id: 'layers', name: 'Layers', blurb: 'Fleece and wind, cut short in the body and sleeves.' }
  ];

  var PRODUCTS = [
    {
      id: 'onion-valley-sun-hoodie', name: 'Onion Valley Sun Hoodie', collection: 'tops', price: 88, badge: 'The first one',
      art: 'hoodie', tagline: 'The sun hoodie, cut short.',
      colors: ['sand', 'sage', 'slate'], fit: 'top',
      features: [
        ['Thumbholes on your hand.', 'Sleeves are 2" shorter, taken out below the elbow. Fabric stays over the back of your hand.', 'cuff'],
        ['A hood that turns with you.', '1" shorter at the crown. Closer at the cheeks, out of your peripheral vision.', 'hood'],
        ['Zipper never touches your neck.', 'A zipper garage at the top and a soft guard behind the whole zip.', 'zip'],
        ['A collar that keeps its shape.', 'Taped neckline, so it doesn\'t stretch out after a season.', 'collar'],
        ['No seam under your pack straps.', 'Shoulder seams sit just off the top of the shoulder.', 'shoulder'],
        ['Hem stays under the hip belt.', 'About 3" shorter in the body, with a drop tail in back.', 'hem']
      ],
      // Size spec. XS is the sample spec; S to L are a proposed grade, confirmed on samples.
      spec: {
        sizes: ['XS', 'S', 'M', 'L'],
        chest: [18.75, 19.75, 20.75, 21.75],   // flat, 1" below armhole
        front: [26.5, 27, 27.5, 28],           // high point of shoulder to hem
        sleeve: [30, 30.5, 31, 31.5],          // center back neck to cuff
        body: ['Up to 38"', '38" to 40"', '40" to 42"', '42" to 44"'],
        // A best-selling merino sun hoodie: XS and S front length from its published chart,
        // M and L extended at the same step. Sleeve from a worn XS measured against ours.
        regular: { front: [29.4, 30.1, 30.8, 31.5], sleeveExtra: 2 }
      },
      details: {
        Fit: 'Cut for men 5\'3" to 5\'8". About 3" shorter in the body and 2" shorter in the sleeves than a typical sun hoodie. Fitted through the chest and arms, with room for shoulders that lift.',
        Fabric: 'Lightweight four-way stretch knit. Placeholder: the final fabric is picked after wear testing.',
        Details: 'Quarter zip with a zipper garage and soft guard. Thumbholes. Taped neckline. Drop tail. Shoulder seams off the top of the shoulder.',
        Care: 'Machine wash cold. Hang dry.'
      }
    },
    {
      id: 'bullfrog-trail-tee', name: 'Bullfrog Trail Tee', collection: 'tops', price: 48,
      art: 'tee', tagline: 'XS too tight. S too long. Fixed.',
      colors: ['granite', 'sand', 'slate'], fit: 'top',
      features: [
        ['Room in the chest.', 'Cut for shoulders and arms that work, not for a mannequin.', 'chest'],
        ['Sleeves cut for a short arm.', 'They sit on the arm. They don\'t hang off it.', 'sleeve'],
        ['A collar that holds its shape.', 'Wash after wash.', 'collar'],
        ['Hem at your belt.', 'Not halfway down your zipper.', 'hem']
      ],
      details: { Fit: 'Shorter body and sleeves. Room in the chest and arms.', Fabric: 'Stretch performance knit (placeholder).', Care: 'Machine wash cold. Tumble dry low.' }
    },
    {
      id: 'rae-lakes-trail-short', name: 'Rae Lakes Trail Short', collection: 'bottoms', price: 58,
      art: 'short', tagline: 'Ends above the knee. No inseam math.',
      colors: ['granite', 'sage'], fit: 'bottom', inseams: ['6"'], waists: ['S', 'M', 'L', 'XL'], waistHint: 'S 28-29, M 30-31, L 32-34, XL 35-37',
      details: { Fit: 'One 6" inseam, cut for a shorter leg, so the hem lands above the knee.', Fabric: 'Stretch woven, quick drying (placeholder).', Details: 'Zip pocket. Drawcord waist.', Care: 'Machine wash cold. Hang dry.' }
    },
    {
      id: 'kearsarge-pass-pant', name: 'Kearsarge Pass Pant', collection: 'bottoms', price: 98,
      art: 'pant', tagline: 'A trail pant you don\'t have to hem.',
      colors: ['granite', 'sand'], fit: 'bottom', inseams: ['26"', '28"'], waists: ['28', '30', '32', '34'],
      details: { Fit: 'Two inseams, 26" and 28". Knee placed for a shorter leg.', Fabric: 'Stretch woven (placeholder).', Care: 'Machine wash cold. Hang dry.' }
    },
    {
      id: 'pothole-fleece', name: 'Pothole Fleece', collection: 'layers', price: 118,
      art: 'fleece', tagline: 'A fleece that ends at your waist.',
      colors: ['sage', 'granite'], fit: 'top',
      details: { Fit: 'Shorter body and sleeves. Room to layer over the sun hoodie.', Fabric: 'Grid fleece (placeholder).', Care: 'Machine wash cold. Tumble dry low.' }
    },
    {
      id: 'independence-wind-shell', name: 'Independence Wind Shell', collection: 'layers', price: 128,
      art: 'shell', tagline: 'A hood sized to your head, not a taller guy\'s.',
      colors: ['slate', 'sand'], fit: 'top',
      details: { Fit: 'Shorter body and sleeves. Hood sized for a shorter frame.', Fabric: 'Lightweight ripstop (placeholder).', Details: 'Full zip. Chest pocket.', Care: 'Machine wash cold. Hang dry.' }
    }
  ];

  window.KG_SHOP = {
    COLORS: COLORS, COLLECTIONS: COLLECTIONS, PRODUCTS: PRODUCTS,
    CHESTS: ['XS', 'S', 'M', 'L'],
    WAISTS: ['28', '30', '32', '34'],
    // The only two photos in the store, both toned to match.
    PHOTOS: {
      hero: 'https://images.unsplash.com/photo-1791779992382-a02b7b5afde7?auto=format&fit=crop&w=2200&q=75',
      pass: 'https://images.unsplash.com/photo-1794264123830-985d9c8ef522?auto=format&fit=crop&w=2200&q=75'
    },
    product: function (id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; },
    collection: function (id) { return COLLECTIONS.filter(function (c) { return c.id === id; })[0]; }
  };
})();
