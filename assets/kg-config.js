/* ---------------------------------------------------------------
   KEARSARGE SETTINGS (shared by the landing page and the survey)

   KIT_FORM_ACTION  The form "action" URL from your Kit form's HTML
                    embed code. While empty, emails are NOT saved; the
                    page still moves on to the survey so you can test.
   PRICE            Launch prices shown in the test. Change freely.
   SURVEY_ENDPOINT  Web app URL that saves survey answers (see README).
                    While empty, answers are NOT saved.
   DEPOSIT_URL      Optional checkout link for a refundable deposit
                    (Shopify or Stripe payment link). While empty, the
                    deposit box stays hidden.
   DEPOSIT_AMOUNT   Shown on the deposit button.
   --------------------------------------------------------------- */
window.KG = {
  KIT_FORM_ACTION: "",
  PRICE: { hoodie: "$88", tee: "$48" },
  SURVEY_ENDPOINT: "",
  DEPOSIT_URL: "",
  DEPOSIT_AMOUNT: "$10"
};
