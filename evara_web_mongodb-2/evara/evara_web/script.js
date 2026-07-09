/* ============================================================
   Evara - shared front-end logic (localStorage based, no backend)
   Loaded on every page. All handlers are guarded so it is safe
   to include even on pages that don't use a given feature.
   ============================================================ */

/* ---------------- Product catalog ---------------- */
const products = [
    {id:1, name: "Colorful Pattern Shirts", price: 238.85, category:"Clothing", img:"https://billalben.github.io/evara-ecommerce/assets/img/product-1-2.jpg"},
    {id:2, name: "Picture Shirts", price: 588, category:"Clothing", img:"https://billalben.github.io/evara-ecommerce/assets/img/product-2-2.jpg"},
    {id:3, name: "Shoes", price: 600.90, category:"Footwear", img:"https://billalben.github.io/evara-ecommerce/assets/img/product-3-2.jpg"},
    {id:4, name: "Pant for women", price: 300, category:"Clothing", img:"https://billalben.github.io/evara-ecommerce/assets/img/product-4-2.jpg"},
    {id:5, name: "Hats", price: 200, category:"Accessories", img:"https://billalben.github.io/evara-ecommerce/assets/img/product-5-2.jpg"},
    {id:6, name: "Floral Shirt", price: 400, category:"Clothing", img:"https://billalben.github.io/evara-ecommerce/assets/img/product-6-2.jpg"},
    {id:7, name: "Kalamkari top", price:  800, category:"Clothing", img:"https://billalben.github.io/evara-ecommerce/assets/img/product-7-2.jpg"},
    {id:8, name: "Sweat shirt", price: 1200, category:"Clothing", img:"https://billalben.github.io/evara-ecommerce/assets/img/product-8-2.jpg"},
    {id:9, name: "Beach Shirt", price: 500, category:"Clothing", img:"https://billalben.github.io/evara-ecommerce/assets/img/product-9-2.jpg"},
    {id:10, name: "Sandals", price: 350, category:"Footwear", img:"https://billalben.github.io/evara-ecommerce/assets/img/product-10-2.jpg"},
    {id:11, name: "Bag", price: 3000, category:"Accessories", img:"https://billalben.github.io/evara-ecommerce/assets/img/product-11-2.jpg"},
    {id:12, name: "Casual Top", price: 250, category:"Clothing", img:"https://billalben.github.io/evara-ecommerce/assets/img/product-12-2.jpg"},
    {id:13, name: "Blue Frock",                price: 699,  category:"Dresses", img:"https://cdn.dummyjson.com/product-images/tops/blue-frock/thumbnail.webp"},
    {id:14, name: "Girl Summer Dress",         price: 549,  category:"Dresses", img:"https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/thumbnail.webp"},
    {id:15, name: "Gray Dress",                price: 899,  category:"Dresses", img:"https://cdn.dummyjson.com/product-images/tops/gray-dress/thumbnail.webp"},
    {id:16, name: "Short Frock",               price: 749,  category:"Dresses", img:"https://cdn.dummyjson.com/product-images/tops/short-frock/thumbnail.webp"},
    {id:17, name: "Tartan Dress",              price: 1199, category:"Dresses", img:"https://cdn.dummyjson.com/product-images/tops/tartan-dress/thumbnail.webp"},
    {id:18, name: "Black Women's Gown",        price: 1899, category:"Dresses", img:"https://cdn.dummyjson.com/product-images/womens-dresses/black-women's-gown/thumbnail.webp"},
    {id:19, name: "Corset Leather With Skirt", price: 1599, category:"Dresses", img:"https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/thumbnail.webp"},
    {id:20, name: "Corset With Black Skirt",   price: 1499, category:"Dresses", img:"https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/thumbnail.webp"},
    {id:21, name: "Dress Pea",                 price: 999,  category:"Dresses", img:"https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/thumbnail.webp"},
    {id:22, name: "Marni Red & Black Suit",    price: 1799, category:"Dresses", img:"https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/thumbnail.webp"},
];

/* Deterministic ratings/reviews so cards look like a real store */
const _ratings = [4.5,4,4.7,3.9,4.2,4.8,4.1,4.6,4.3,4,4.9,4.4];
const _reviews = [128,86,342,54,210,176,93,288,141,67,402,119];
products.forEach((p,i) => { p.rating = p.rating ?? _ratings[i] ?? 4.3; p.reviews = p.reviews ?? _reviews[i] ?? 100; });
/* Department: the dresses (id 13+) are Women's, the rest Men's */
products.forEach(p => { p.dept = p.dept || (p.id <= 12 ? "men" : "women"); });

/* ---------------- Helpers / storage ---------------- */
const money = (n) => "₹" + Number(n).toLocaleString("en-IN", {maximumFractionDigits: 2});

/* Build a row of Font-Awesome stars for a rating like 4.3 */
function starsHtml(rating) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) html += '<i class="fa fa-star"></i>';
        else if (rating >= i - 0.5) html += '<i class="fa fa-star-half-o"></i>';
        else html += '<i class="fa fa-star-o"></i>';
    }
    return `<span class="stars">${html}</span>`;
}

const store = {
    get(key, fallback) {
        try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
        catch { return fallback; }
    },
    set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
};

const getCart      = () => store.get("cart", []);
const setCart      = (c) => store.set("cart", c);
const getWishlist  = () => store.get("wishlist", []);
const setWishlist  = (w) => store.set("wishlist", w);
const getOrders    = () => store.get("orders", []);
const setOrders    = (o) => store.set("orders", o);

/* Accounts live on the backend; the browser only keeps a lightweight
   session {username, email} so the rest of the app keeps working. */
const getSession   = () => store.get("session", null);
const setSession   = (s) => store.set("session", s);
const currentEmail = () => getSession()?.email || null;
const currentUser  = () => getSession();

/* Same-origin API (the Express server serves these pages too). */
const API = "";
async function apiPost(path, body) {
    const r = await fetch(API + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    return r.json();
}

/* ---------------- Auth (backed by the server) ---------------- */
async function registerUser(username, email, password, confirm) {
    // quick client-side checks for instant feedback (server re-validates)
    if (!username || !email || !password) return {ok:false, msg:"Please fill all fields."};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return {ok:false, msg:"Enter a valid email address."};
    if (password.length < 4) return {ok:false, msg:"Password must be at least 4 characters."};
    if (password !== confirm) return {ok:false, msg:"Passwords do not match."};
    try {
        const data = await apiPost("/api/register", {username, email, password, confirm});
        if (data.ok) setSession(data.user);
        return data;
    } catch {
        return {ok:false, msg:"Could not reach the server. Make sure it is running (npm start)."};
    }
}

async function loginUser(email, password) {
    if (!email || !password) return {ok:false, msg:"Please enter email and password."};
    try {
        const data = await apiPost("/api/login", {email, password});
        if (data.ok) setSession(data.user);
        return data;
    } catch {
        return {ok:false, msg:"Could not reach the server. Make sure it is running (npm start)."};
    }
}

async function forgotPassword(email) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return {ok:false, msg:"Enter a valid email address."};
    try {
        return await apiPost("/api/forgot", {email});
    } catch {
        return {ok:false, msg:"Could not reach the server. Make sure it is running (npm start)."};
    }
}

async function resetPassword(email, token, password, confirm) {
    if (!email || !token) return {ok:false, msg:"Enter your email and reset code."};
    if (!password || password.length < 4) return {ok:false, msg:"New password must be at least 4 characters."};
    if (password !== confirm) return {ok:false, msg:"Passwords do not match."};
    try {
        return await apiPost("/api/reset", {email, token, password, confirm});
    } catch {
        return {ok:false, msg:"Could not reach the server. Make sure it is running (npm start)."};
    }
}

async function updateProfile(username) {
    const s = getSession();
    if (!s) return {ok:false, msg:"You are not logged in."};
    try {
        const data = await apiPost("/api/profile", {email: s.email, username});
        if (data.ok) setSession(data.user);
        return data;
    } catch {
        return {ok:false, msg:"Could not reach the server."};
    }
}

async function changePassword(current, next) {
    const s = getSession();
    if (!s) return {ok:false, msg:"You are not logged in."};
    try {
        return await apiPost("/api/password", {email: s.email, current, next});
    } catch {
        return {ok:false, msg:"Could not reach the server."};
    }
}

function logoutUser() {
    localStorage.removeItem("session");
    window.location.href = "index.html";
}

function requireLogin(redirectBackTo) {
    if (!currentEmail()) {
        alert("Please log in to continue.");
        window.location.href = "login.html";
        return false;
    }
    return true;
}

/* ---------------- Cart ---------------- */
function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    if (!product) return;
    const cart = getCart();
    const line = cart.find(i => i.id == productId);
    if (line) line.qty += 1;
    else cart.push({...product, qty: 1});
    setCart(cart);
    updateBadges();
    alert(`${product.name} added to cart.`);
    if (document.getElementById("cartItems")) renderCart();
}

function changeQty(productId, delta) {
    const cart = getCart();
    const line = cart.find(i => i.id == productId);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) {
        setCart(cart.filter(i => i.id != productId));
    } else {
        setCart(cart);
    }
    updateBadges();
    renderCart();
}

function removeFromCart(productId) {
    setCart(getCart().filter(i => i.id != productId));
    updateBadges();
    renderCart();
}

function cartTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((t, i) => t + i.price * i.qty, 0);
    const shipping = subtotal > 0 && subtotal < 1000 ? 49 : 0;
    return {subtotal, shipping, total: subtotal + shipping, count: cart.reduce((t,i)=>t+i.qty,0)};
}

function renderCart() {
    const container = document.getElementById("cartItems");
    if (!container) return;
    const cart = getCart();
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<h1>Your Cart is Empty</h1>";
        const sub = document.getElementById("subtotal");
        if (sub) sub.innerHTML = "";
        return;
    }

    cart.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
            <img src="${item.img}"/>
            <p>${item.category}</p>
            <h3>${item.name}</h3>
            <h2>${money(item.price)}</h2>
            <div class="qty-control">
                <button onclick="changeQty(${item.id}, -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${item.id}, 1)">+</button>
            </div>
            <p class="line-total">Total: ${money(item.price * item.qty)}</p>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        container.appendChild(div);
    });

    const {subtotal, shipping, total} = cartTotals();
    const sub = document.getElementById("subtotal");
    if (sub) {
        sub.innerHTML = `
            <div class="summary-box">
                <p>Subtotal: <span>${money(subtotal)}</span></p>
                <p>Shipping: <span>${shipping === 0 ? "FREE" : money(shipping)}</span></p>
                <h3>Total: <span>${money(total)}</span></h3>
                <button class="checkout-btn" onclick="goToCheckout()">Proceed to Checkout</button>
            </div>`;
    }
}

function goToCheckout() {
    if (getCart().length === 0) { alert("Your cart is empty."); return; }
    if (!requireLogin()) return;
    window.location.href = "checkout.html";
}

/* ---------------- Wishlist ---------------- */
function inWishlist(id) { return getWishlist().some(i => i.id == id); }

function toggleWishlist(productId) {
    const product = products.find(p => p.id == productId);
    if (!product) return;
    let wl = getWishlist();
    if (wl.some(i => i.id == productId)) {
        wl = wl.filter(i => i.id != productId);
    } else {
        wl.push(product);
    }
    setWishlist(wl);
    updateBadges();
    if (document.getElementById("productList")) renderProducts(currentlyShown, "productList");
    if (document.getElementById("wishlistItems")) renderWishlist();
}

function renderWishlist() {
    const container = document.getElementById("wishlistItems");
    if (!container) return;
    const wl = getWishlist();
    container.innerHTML = "";
    if (wl.length === 0) {
        container.innerHTML = "<h1>Your Wishlist is Empty</h1>";
        return;
    }
    wl.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("product-item");
        div.innerHTML = `
            <img src="${item.img}"/>
            <p>${item.category}</p>
            <h3>${item.name}</h3>
            <h2>${money(item.price)}</h2>
            <button onclick="addToCart(${item.id})">Add to Cart</button>
            <button class="remove-btn" onclick="toggleWishlist(${item.id})">Remove</button>
        `;
        container.appendChild(div);
    });
}

/* ---------------- Product list (shop) ---------------- */
let currentlyShown = products;

function renderProducts(list, productListId) {
    const container = document.getElementById(productListId);
    if (!container) return;
    currentlyShown = list;
    const countEl = document.getElementById("itemCount");
    if (countEl) countEl.textContent = list.length;
    container.innerHTML = "";
    if (list.length === 0) {
        container.innerHTML = "<p class='para'>No products found.</p>";
        return;
    }
    list.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("product-item");
        const liked = inWishlist(product.id);
        div.innerHTML = `
            <span class="wish-toggle ${liked ? "liked" : ""}" title="Wishlist"
                  onclick="toggleWishlist(${product.id})">
                <i class="fa ${liked ? "fa-heart" : "fa-heart-o"}"></i>
            </span>
            <div class="pi-img"><img src="${product.img}"/></div>
            <p class="cat">${product.category}</p>
            <h3>${product.name}</h3>
            <div class="rating">${starsHtml(product.rating)}<span class="rev">${product.rating} (${product.reviews})</span></div>
            <h2>${money(product.price)}</h2>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        container.appendChild(div);
    });
}

let shopDept = "all";  // all | men | women

function sortList(list, c) {
    const l = [...list];
    if (c === "price") return l.sort((a, b) => a.price - b.price);
    if (c === "price-desc") return l.sort((a, b) => b.price - a.price);
    if (c === "name") return l.sort((a, b) => a.name.localeCompare(b.name));
    return l;
}

/* Combined shop view: department tab + search box + sort */
function shopRender() {
    let list = products.filter(p => shopDept === "all" || p.dept === shopDept);
    const q = (document.getElementById("productSearch")?.value || "").trim().toLowerCase();
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q));
    list = sortList(list, document.getElementById("sortOptions")?.value);
    renderProducts(list, "productList");
}

/* ---------------- Orders / Checkout ---------------- */
function placeOrder(address, payment) {
    const cart = getCart();
    if (cart.length === 0) return {ok:false, msg:"Your cart is empty."};
    const {subtotal, shipping, total} = cartTotals();
    const id = "EVR" + String(Date.now()).slice(-8);
    const order = {
        id,
        userEmail: currentEmail(),
        items: cart,
        address,
        payment,
        subtotal, shipping, total,
        date: new Date().toLocaleString("en-IN"),
        status: payment.method === "cod" ? "Confirmed (Pay on Delivery)" : "Paid",
    };
    const orders = getOrders();
    orders.push(order);
    setOrders(orders);
    setCart([]);
    updateBadges();
    return {ok:true, order};
}

function userOrders() {
    return getOrders().filter(o => o.userEmail === currentEmail()).reverse();
}

/* ---------------- Dynamic header (auth link + badges) ---------------- */
function updateAuthLink() {
    const link = document.querySelector(".header1 a");
    if (!link) return;
    const user = currentUser();
    if (user) {
        link.innerHTML = `<i class="fa fa-user-circle" aria-hidden="true"></i> Hi, ${user.username}`;
        link.href = "my_acc.html";
        if (!document.getElementById("logoutLink")) {
            const out = document.createElement("a");
            out.id = "logoutLink";
            out.innerHTML = '<i class="fa fa-sign-out" aria-hidden="true"></i> Logout';
            out.href = "#";
            out.style.marginLeft = "16px";
            out.onclick = (e) => { e.preventDefault(); logoutUser(); };
            link.after(out);
        }
    } else {
        link.innerHTML = '<i class="fa fa-user-o" aria-hidden="true"></i> Log In / Sign Up';
        link.href = "login.html";
    }
}

function updateBadges() {
    const {count} = cartTotals();
    setBadge(document.querySelector('.header2 .fa-shopping-bag'), count);
    setBadge(document.querySelector('.header2 .fa-heart-o, .header2 .fa-heart'), getWishlist().length);
}
function setBadge(icon, n) {
    if (!icon) return;
    const host = icon.closest(".icon-wrap") || icon.parentElement;
    host.style.position = "relative";
    let badge = host.querySelector(".count-badge");
    if (n > 0) {
        if (!badge) {
            badge = document.createElement("span");
            badge.className = "count-badge";
            host.appendChild(badge);
        }
        badge.textContent = n;
    } else if (badge) {
        badge.remove();
    }
}

/* ---------------- Header: search button + grouped icons (all pages) ---------------- */
function wireHeader() {
    const search = document.querySelector(".search");
    if (!search) return;
    const input = search.querySelector("input");
    const go = () => {
        const q = (input?.value || "").trim();
        window.location.href = "shop.html" + (q ? "?search=" + encodeURIComponent(q) : "");
    };
    if (input) {
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });
        if (!search.querySelector(".search-btn")) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "search-btn";
            btn.textContent = "Search";
            btn.addEventListener("click", go);
            input.after(btn);
        }
    }
    // group wishlist + cart icons to the far right of the header
    if (!document.querySelector(".header-icons")) {
        const header2 = document.querySelector(".header2");
        const icons = document.createElement("div");
        icons.className = "header-icons";

        const heart = search.querySelector(".fa-heart-o, .fa-heart");
        if (heart) {
            const wrap = document.createElement("span");
            wrap.className = "icon-wrap";
            wrap.title = "Wishlist";
            wrap.style.cursor = "pointer";
            heart.remove();
            wrap.appendChild(heart);
            wrap.addEventListener("click", () => window.location.href = "wishlist.html");
            icons.appendChild(wrap);
        }
        const cart = search.querySelector("a");
        if (cart) { cart.classList.add("icon-wrap"); icons.appendChild(cart); }

        if (header2) header2.appendChild(icons);
    }
}

/* ---------------- Newsletter, hero & footer quick links ---------------- */
function wireMiscButtons() {
    const sub = document.querySelector(".fo_d3 button");
    if (sub) {
        sub.addEventListener("click", () => {
            const input = document.querySelector(".fo_d3 input");
            const email = (input?.value || "").trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("Please enter a valid email."); return; }
            alert("Thanks for subscribing! Your ₹25 coupon is on its way.");
            if (input) input.value = "";
        });
    }
    // "Shop Now" buttons
    document.querySelectorAll(".banner button, .button1").forEach(btn => {
        if (/shop now/i.test(btn.textContent))
            btn.addEventListener("click", () => window.location.href = "shop.html");
    });
    // Featured / Popular / New tabs + category cards -> shop
    document.querySelectorAll(".static_button button").forEach(btn =>
        btn.addEventListener("click", () => window.location.href = "shop.html"));
    document.querySelectorAll(".po_products > div").forEach(div =>
        div.addEventListener("click", () => window.location.href = "shop.html"));

    // Footer quick links
    const links = {
        "View Cart": "cart.html", "My Wishlist": "wishlist.html", "Sign In": "login.html",
        "Track My Order": "my_acc.html", "Order": "my_acc.html", "Help": "my_acc.html",
    };
    document.querySelectorAll(".footer2 p").forEach(p => {
        const dest = links[p.textContent.trim()];
        if (dest) { p.classList.add("clickable"); p.addEventListener("click", () => window.location.href = dest); }
    });
}

/* ---------------- Countdown timer (home page) ---------------- */
function startCountdown() {
    const counts = document.querySelectorAll(".count");
    if (!counts.length) return;
    let target = parseInt(localStorage.getItem("dealEndsAt") || "0", 10);
    const now = Date.now();
    if (!target || target < now) {
        target = now + 3 * 24 * 60 * 60 * 1000; // 3 days from now
        localStorage.setItem("dealEndsAt", String(target));
    }
    const tick = () => {
        let diff = Math.max(0, target - Date.now());
        const d = Math.floor(diff / 86400000); diff -= d * 86400000;
        const h = Math.floor(diff / 3600000);  diff -= h * 3600000;
        const m = Math.floor(diff / 60000);    diff -= m * 60000;
        const s = Math.floor(diff / 1000);
        const vals = [d, h, m, s].map(v => String(v).padStart(2, "0"));
        counts.forEach(block => {
            block.querySelectorAll("div p").forEach((p, i) => { if (vals[i] !== undefined) p.textContent = vals[i]; });
        });
    };
    tick();
    setInterval(tick, 1000);
}

/* ---------------- Page init ---------------- */
document.addEventListener("DOMContentLoaded", () => {
    updateAuthLink();
    wireHeader();
    wireMiscButtons();
    updateBadges();
    startCountdown();

    // Shop page
    if (document.getElementById("productList")) {
        const params = new URLSearchParams(location.search);
        const q = params.get("search");
        const dept = params.get("dept");
        if (dept && ["men", "women", "all"].includes(dept)) shopDept = dept;
        if (q) {
            const navInput = document.getElementById("productSearch");
            if (navInput) navInput.value = q;
        }

        // department tabs (All / Men / Women)
        document.querySelectorAll(".dept-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.dept === shopDept);
            btn.addEventListener("click", () => {
                shopDept = btn.dataset.dept;
                document.querySelectorAll(".dept-btn").forEach(b => b.classList.toggle("active", b === btn));
                shopRender();
            });
        });

        document.getElementById("searchButton")?.addEventListener("click", shopRender);
        document.getElementById("productSearch")?.addEventListener("keydown", (e) => { if (e.key === "Enter") shopRender(); });
        document.getElementById("sortOptions")?.addEventListener("change", shopRender);

        shopRender();
    }

    if (document.getElementById("cartItems")) renderCart();
    if (document.getElementById("wishlistItems")) renderWishlist();
});
