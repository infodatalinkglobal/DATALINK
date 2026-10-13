# Datalink — WhatsApp AI Agents for Ghanaian Businesses 🇬🇭

Marketing website for **Datalink**, selling one flagship service:
**The WhatsApp Customer Enquiry & Lead Qualification Agent** — an AI agent
(built with the Anthropic Claude API) that answers customer enquiries 24/7
on a business's WhatsApp number, qualifies leads (hot / warm / cold), logs
everything to a client-owned Google Sheet, alerts the owner about hot leads,
hands off to a human when needed, and responds in English or Twi.

## Pricing shown on the site

| Item | Price |
| --- | --- |
| Pilot setup fee (one-time) | GH₵300 |
| Pilot period | 30 days free |
| Starter (after pilot) | GH₵150/month — up to 500 conversations |
| Standard (after pilot) | GH₵250/month — up to 2,000 conversations |
| Growth (after pilot) | GH₵400/month — up to 10,000 conversations |
| Guarantee | Full setup-fee refund if not working within 7 days |

## Project structure

```
index.html       Home — hero + animated WhatsApp demo, problems, how it works
services.html    Flagship service, what's included, plans table, ROI examples
portfolio.html   Live demo conversations (boutique, pharmacy, real estate, salon)
about.html       Founder story, mission, 9-question FAQ accordion
contact.html     Pilot sign-up form + direct WhatsApp contact + timeline
css/style.css    Single shared stylesheet (mobile-first, responsive)
js/main.js       Nav, chat animations, tabs, FAQ accordion, form validation
```

Pure static HTML/CSS/JS — no build step, no dependencies.

## Placeholders to fill in before launch

Search the HTML files for `PLACEHOLDER` / `PERSONALISE` comments:

1. **WhatsApp number** — replace every `233XXXXXXXXX` (floating button on all
   5 pages + the "WhatsApp Me Now" button on contact.html).
2. **Email address** — replace `hello@example.com` on contact.html.
3. **Formspree form ID** — replace `YOUR_FORMSPREE_ID` in the form `action`
   on contact.html (free at https://formspree.io).
4. **Founder name/story** — about.html (`PERSONALISE` comments).

## Run locally

Just open `index.html` in a browser, or:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy to GitHub Pages

1. Push this repository to GitHub (branch `main`).
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
4. Choose branch **main** and folder **/ (root)**, then **Save**.
5. Wait 1–2 minutes. Your site will be live at
   `https://<your-username>.github.io/<repo-name>/`.
6. (Optional) Add a custom domain under **Settings → Pages → Custom domain**.
