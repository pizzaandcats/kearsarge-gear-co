# Kearsarge Gear Co. landing page

Static site. No build step. GitHub Pages serves it from `main`.

```
index.html            Landing page (four test versions, picked by ?v=)
thank-you/index.html  Post-signup fit survey + optional deposit box
assets/kg-config.js   Settings: Kit form, prices, survey endpoint, deposit link
assets/kearsarge.css  Shared styles
```

The `assets/img`, `assets/fonts` and `assets/site.css` files are left over from Mountain Retro and aren't used by these pages.

## Test versions (one link per ad)

| Link | Product | Pitch |
|---|---|---|
| `/?v=hoodie-short` (also the default) | Sun hoodie | Built for shorter guys |
| `/?v=hoodie-lift` | Sun hoodie | Built for shorter guys who lift |
| `/?v=tee-short` | Training tee | Built for shorter guys |
| `/?v=tee-lift` | Training tee | Built for shorter guys who lift |

Add your usual `utm_source`, `utm_campaign` and `utm_content` to each ad link. The version and UTM tags are saved with each survey answer, and the version is sent to Kit as the custom field `kg_variant`.

## Before going live

1. **Kit form.** Create an inline form in Kit. From its HTML embed code, copy the `<form action="...">` URL into `KIT_FORM_ACTION` in `assets/kg-config.js`. Set the form's success action to redirect to `https://YOURDOMAIN/thank-you/`. Add a custom field named `kg_variant` in Kit so the test version is stored. Until this is done, emails are not saved and the survey page shows a red "Setup needed" bar.
2. **Prices.** `PRICE` in `assets/kg-config.js` sets the launch price shown for each product. The survey asks whether they'd buy at that price.
3. **Survey storage.** See below. Until it's set up, the survey page shows a red bar and says answers were not saved.
4. **Deposit (optional).** Paste a Shopify or Stripe payment link into `DEPOSIT_URL`. The deposit box only appears after someone answers the survey. The page copy promises the deposit is refundable any time before shipping, so set up the checkout to match.
5. **Founder note.** Replace the dashed placeholder in `index.html`.
6. **Photos.** Every gray box is a placeholder. The before-and-after fit photos matter most.

## Survey storage: Google Sheets

Use a **new** sheet for Kearsarge. Don't reuse the Mountain Retro poll endpoint.

1. Create a Google Sheet. Row 1 headers:
   `submitted_at | email | variant | utm_source | utm_campaign | utm_content | height | build | usual_size | problems | first_product | price_shown | price_check`
2. Extensions > Apps Script. Replace the code with:

```js
const COLS = ['submitted_at','email','variant','utm_source','utm_campaign','utm_content','height','build','usual_size','problems','first_product','price_shown','price_check'];

function doPost(e) {
  let d = {};
  try { d = JSON.parse(e.postData.contents); } catch (err) {}
  if (!/^(hoodie|tee)-(short|lift)$/.test(d.variant || '')) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false })).setMimeType(ContentService.MimeType.JSON);
  }
  const row = COLS.map(k => String(d[k] == null ? '' : d[k]).slice(0, 300));
  SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow(row);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
```

3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone. Copy the `/exec` URL into `SURVEY_ENDPOINT`.
4. Fill in the survey once on the live page and confirm a row lands in the sheet.

Notes:
- The survey only says "Got it" after the endpoint answers `{"ok": true}`.
- The email saved with the answers comes from the address typed on the landing page in the same browser, or `?ck_subscriber_id=` in the link (saved as `kit:<id>`).
- A browser that already sent answers isn't asked again. This is a soft limit, not fraud protection.
