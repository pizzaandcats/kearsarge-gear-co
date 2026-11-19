/* Shared signup handling for the lp-* pages.
   Each page sets <body data-page="outdoors|gym|fitness">.
   Price comes from KG.PRICE[page] in assets/kg-config.js. */
(function () {
  var KG = window.KG || {};
  var page = document.body.getAttribute('data-page') || '';
  var params = new URLSearchParams(location.search);
  var price = (KG.PRICE && KG.PRICE[page]) || '';
  document.querySelectorAll('.js-price').forEach(function (el) { el.textContent = price; });
  document.querySelectorAll('.js-variant').forEach(function (el) { el.value = page; });
  try {
    sessionStorage.setItem('kg_meta', JSON.stringify({
      variant: page,
      utm_source: params.get('utm_source') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content: params.get('utm_content') || ''
    }));
  } catch (e) {}

  var KIT = (KG.KIT_FORM_ACTION || '').trim();
  document.querySelectorAll('.js-signup').forEach(function (form) {
    if (KIT) form.action = KIT;
    form.addEventListener('submit', function (e) {
      var input = form.querySelector('input[type=email]');
      var status = form.querySelector('.status');
      if (!input.value || !input.checkValidity()) {
        e.preventDefault();
        if (status) status.textContent = 'Enter a valid email address.';
        input.focus();
        return;
      }
      try { localStorage.setItem('kg_email', input.value.trim()); } catch (err) {}
      if (KIT) return; // Kit saves it, then redirects to /thank-you/ (set in Kit).
      e.preventDefault(); // Not connected yet: go straight to the survey.
      location.href = '../thank-you/?v=' + encodeURIComponent(page) + '&unsaved=1';
    });
  });
})();
