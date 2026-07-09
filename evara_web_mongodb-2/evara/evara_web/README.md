# Evara — E-commerce Demo

An Evara e-commerce website (HTML/CSS/JS) with a small **Node/Express** backend
that persists user accounts.

## Features
- Home, Shop, Wishlist, Information pages
- Shop **department tabs (All / Men / Women)** with live item count
- Product **search**, **sort** (price / name), and **star ratings**
- Cart with quantities
- Checkout with shipping address + **dummy payment** (Card / UPI / Cash on Delivery)
- Order confirmation and order history
- Register / Login / Update profile / Change password
- Live "deal of the day" countdown timer
- Information page (About Us, Delivery, Privacy, Terms, Contact, Support)
- Modern responsive design with sticky header and search
- Currency in ₹

## What runs where
- **Frontend** — runs in the browser. Cart, wishlist, and orders are stored in the
  browser's `localStorage` (per device/browser).
- **Backend** (`server.js`) — an Express server that serves the site **and** stores
  registered users in `data/users.json` with scrypt-hashed passwords.

---

## Prerequisites
- **Node.js** v16 or newer (includes `npm`) — check with `node -v`
  Download: https://nodejs.org

---

## ▶️ Run locally (after cloning)

```bash
# 1. Clone the repo
git clone https://github.com/sanjana-18-feb/evara_web.git
cd evara_web

# 2. Install dependencies (first time only)
npm install

# 3. Start the server
npm start
```

Then open **http://localhost:3000** in your browser.

To stop the server, press **Ctrl + C** in the terminal.

> **Use port 3000** (the Express server). Registration/login call the server's
> `/api` routes, so opening the raw HTML files directly (or a plain static server)
> will not save accounts. `npm install` is only needed once; after that just `npm start`.

Local accounts are saved to `data/users.json` on your machine and persist between
restarts. (This file is git-ignored, so it never gets committed.)

### Run offline (no internet)
Register, login, cart, and checkout **work fully offline** when you run it locally,
because the page talks to your own machine (`localhost`), not the cloud:

1. Run `npm start` and open **http://localhost:3000**.
2. Accounts are saved by the server to `data/users.json`; cart, wishlist, and your
   session are saved in the browser's `localStorage`. No internet is needed for any
   of this.

Requirements & caveats:
- The **local server must be running** (`npm start`). Opening the HTML files directly
  as `file://` will not save accounts, because there is no server to receive the
  `/api` calls. The live Render URL also needs internet (the server is in the cloud).
- **Images, icons, and the web font load from the internet (CDNs)**, so offline they
  will not appear — the site still *functions* (login/cart/checkout all work), it just
  looks unstyled in places. To make it 100% offline including images, the assets would
  need to be downloaded into the project and referenced locally.

---

## Run on a server (deploy)

This is a Node app, so it needs a host that **runs Node** (not a static-only host
like GitHub Pages). Below are steps for **Render** (free tier), but any Node host
works the same way.

### Deploy to Render
1. Push your code to GitHub.
2. Go to https://render.com → **New + → Web Service** → connect this repo.
3. Configure:
   | Setting | Value |
   |---------|-------|
   | Runtime | Node |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | Free (or paid) |
4. Leave **Environment Variables** empty and click **Deploy Web Service**.
5. When the status shows **Live**, open the URL Render gives you
   (e.g. `https://evara-web.onrender.com`).

The server reads `process.env.PORT` automatically, so no extra configuration is
needed on any host.

### Run on your own server / VPS
```bash
git clone https://github.com/sanjana-18-feb/evara_web.git
cd evara_web
npm install
PORT=80 npm start        # or any port your host expects
```
For production, keep it running with a process manager such as **pm2**:
```bash
npm install -g pm2
pm2 start server.js --name evara
pm2 save
```

### Notes for free hosting tiers
- **Sleeping:** Free services (e.g. Render Free) sleep after ~15 min of inactivity.
  The first visit then takes ~30–60s to wake (you may need to refresh). To avoid
  this, ping the URL every ~10 min with a free uptime monitor (UptimeRobot,
  cron-job.org), or upgrade to a paid instance.
- **Account persistence:** Free tiers use an **ephemeral filesystem**, so
  `data/users.json` resets on every redeploy/restart and registered accounts are
  lost. For durable accounts, use a paid persistent disk or move account storage
  to a hosted database (e.g. MongoDB Atlas).

---

## Auth API
| Method | Route           | Body                                   |
|--------|-----------------|----------------------------------------|
| POST   | `/api/register` | `{username, email, password, confirm}` |
| POST   | `/api/login`    | `{email, password}`                    |
| POST   | `/api/profile`  | `{email, username}`                    |
| POST   | `/api/password` | `{email, current, next}`               |

## Project structure
```
evara_web/
├── server.js            # Express backend (serves site + /api routes)
├── package.json         # dependencies & npm scripts
├── script.js            # shared frontend logic + product catalog (loaded on every page)
├── style.css            # shared styles / design system
├── index.html           # Home
├── shop.html            # Shop (products, Men/Women tabs, search, sort)
├── cart.html            # Cart
├── checkout.html        # Checkout (address + dummy payment)
├── order-confirmation.html
├── wishlist.html
├── info.html            # Information (About, Delivery, Privacy, Terms, Contact, Support)
├── login.html           # Login / Register
├── my_acc.html          # Account dashboard, orders, profile
├── *.css                # per-page styles (shop, cart, login, checkout)
└── data/users.json      # saved users (git-ignored, created at runtime)
```
