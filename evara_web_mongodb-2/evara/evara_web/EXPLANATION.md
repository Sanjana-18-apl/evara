# 🛍️ Evara — How I Built It (explanation notes)

A reading script for explaining this project in an interview or demo.
Go from the quick pitch down to the technical detail as the conversation needs.

---

## 1. Quick pitch (30 seconds)
"Evara is a fully functional e-commerce website I built from scratch. It has product
browsing with Men/Women categories, search and sort, a shopping cart, a complete
checkout flow with a dummy payment step, and user accounts with login/registration.
The front end is plain HTML, CSS, and JavaScript, and I added a small Node.js + Express
backend to handle user accounts. It's deployed live on Render."

---

## 2. Tech stack — and *why*
- **HTML, CSS, JavaScript (vanilla)** — no framework. Shows I understand the
  fundamentals: the DOM, events, and rendering, without a framework doing it for me.
- **Node.js + Express** — a lightweight backend to handle user registration and login.
- **localStorage** (browser storage) — for cart, wishlist, and orders, so the shopping
  experience works instantly without a database.
- **Git/GitHub** for version control and **Render** for hosting.

---

## 3. Architecture — what runs where (the key design decision)
- **The front end runs in the browser.** Products are defined in a JavaScript array, and
  I *dynamically render* product cards, cart items, and orders with JavaScript — nothing
  is hardcoded per product.
- **Cart, wishlist, and orders live in `localStorage`**, so they persist in the browser
  without a server round-trip.
- **User accounts run on the Express backend.** Register/login send a `fetch` request to
  my API (`/api/register`, `/api/login`), and the server saves the user to a JSON file
  (`data/users.json`).
- **One Node process serves both** the website pages and the API.

> "I deliberately kept the shopping logic on the client for speed and simplicity, and
> only moved **accounts** to the server, because accounts are the one thing that genuinely
> needs to persist beyond a single browser."

```
Browser (HTML/CSS/JS)  ──fetch("/api/login")──►  Express server  ──►  data/users.json
   cart/wishlist/orders in localStorage              (Node.js)        (hashed passwords)
```

---

## 4. Security detail (good to mention)
"I don't store passwords in plain text. On the server I hash each password using Node's
built-in `crypto` library with **scrypt** and a unique random **salt** per user, and
compare them using a timing-safe comparison. Even if someone opened the data file, they
couldn't read the actual passwords."

---

## 5. Feature walkthrough
- **Shop page:** products render dynamically from a JS catalog, with **star ratings**,
  prices in ₹, and Add-to-Cart buttons.
- **Men / Women category tabs** that filter the catalog and work *together* with the
  search box and sort dropdown; the "items found" count updates live.
- **Cart:** add/remove items, change quantities (same item increments instead of
  duplicating), and a running subtotal + shipping + total.
- **Checkout flow:** enter a shipping address, choose a payment method
  (Card / UPI / Cash on Delivery), place the order — I simulate a payment delay, generate
  an order ID, save the order, clear the cart, and show a confirmation page.
- **Accounts:** register, login, logout, update profile, change password — with a
  dashboard showing the user's past orders.
- **Wishlist, an Information page** (About/Privacy/Terms/etc.), and a live **countdown
  timer** on the home page.

---

## 6. Design approach
"I designed the UI to feel like a real, modern store, using Amazon as a reference:
a sticky header with a prominent search bar, clean product cards with ratings, a
consistent color system (teal brand + amber call-to-action buttons), the Poppins font,
and a responsive layout for mobile using CSS Grid and media queries. I used CSS variables
so the theme is easy to maintain."

---

## 7. Deployment
"I pushed the code to GitHub and deployed it on **Render** as a Node web service —
build command `npm install`, start command `npm start`. The server reads the port from
an environment variable so it works on any host, and it auto-redeploys whenever I push
to the main branch."

---

## 8. Challenges & trade-offs (shows maturity)
- "It started fully client-side. When I wanted registrations to actually persist, I added
  the Express backend, but kept the storage layer isolated so the rest of the app barely
  changed."
- "On Render's free tier the server sleeps after inactivity and the file storage is
  ephemeral, so I understand that for production I'd move accounts to a real database and
  add token-based sessions."

---

## 9. What I'd improve next
- A real **database** (e.g. MongoDB) instead of a JSON file.
- Secure **session tokens** (JWT or cookies) instead of trusting the client.
- A real **payment gateway**.
- An **admin panel** to manage products.
- Host the **images locally** so it can run completely offline.

---

## Likely interview follow-ups
- **"Why no framework?"** → "I wanted to prove I understand the fundamentals first —
  DOM, fetch, state — before reaching for React."
- **"How would you scale it?"** → See sections 8 & 9 (database, sessions, payment gateway).
- **"How is the cart stored?"** → "In the browser's localStorage, as a JSON array of
  items with quantities; I read/write it on every cart action."
- **"Is it secure?"** → "Passwords are scrypt-hashed with a salt. For production I'd add
  real sessions and HTTPS-only cookies."

---

## Strongest points to emphasize
1. The **client/server split** — what I put on the client vs. the server, and *why*.
2. **Password hashing** with scrypt + salt.
3. **Dynamic rendering** of products/cart/orders from JavaScript (not hardcoded HTML).
