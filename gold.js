// ================================================================
//  PAK RATES – gold.js  (Full GoldAPI integration)
//  Fetches live XAU rates for PKR, AED, INR, SGD, CAD, USD
// ================================================================

const TOLA = 11.6638;   // grams per tola
const OZ = 31.1035;   // grams per troy ounce

// ----------------------------------------------------------------
// SECTION 1 – PKR fallback values
// (These are shown instantly before the API responds)
// ----------------------------------------------------------------
let p1g24k = 31109, p1g22k = 28516, p1g21k = 27220,
    p1g18k = 23332, p1g16k = 20638, p1g12k = 15555;

let p1t24k, p1t22k, p1t21k, p1t18k, p1t16k, p1t12k;
let p10g24k, p10g22k, p10g21k, p10g18k, p10g16k, p10g12k;
let p1o24k = 881930, p1o22k, p1o21k, p1o18k, p1o16k, p1o12k;

/** Derive tola / 10g / ounce PKR values from per-gram prices */
function derivePKR() {
    p1t24k = p1g24k * TOLA; p1t22k = p1g22k * TOLA;
    p1t21k = p1g21k * TOLA; p1t18k = p1g18k * TOLA;
    p1t16k = p1g16k * TOLA; p1t12k = p1g12k * TOLA;

    p10g24k = p1g24k * 10; p10g22k = p1g22k * 10;
    p10g21k = p1g21k * 10; p10g18k = p1g18k * 10;
    p10g16k = p1g16k * 10; p10g12k = p1g12k * 10;

    p1o22k = p1o24k * (22 / 24); p1o21k = p1o24k * (21 / 24);
    p1o18k = p1o24k * (18 / 24); p1o16k = p1o24k * (16 / 24);
    p1o12k = p1o24k * (12 / 24);
}
derivePKR(); // run once so all variables are ready

// ----------------------------------------------------------------
// SECTION 2 – City / country dropdown references (same as before)
// ----------------------------------------------------------------


var selcountry = document.querySelector("#selcountry");
var dubaitab = document.querySelector(".dubaitab");
var indiatab = document.querySelector(".indiatab");
var singaporetab = document.querySelector(".singaporetab");
var canadatab = document.querySelector(".canadatab");
var usatab = document.querySelector(".usatab");

// ----------------------------------------------------------------
// SECTION 3 – Helper: format a number with currency symbol
// ----------------------------------------------------------------
function fmt(sym, val) {
    return `${sym} ${Math.round(val).toLocaleString()}`;
}

// ----------------------------------------------------------------
// SECTION 4 – Generate the 4 data rows for any gold table
//   sym  = currency symbol string  e.g. "Rs.", "AED", "$"
//   g24 … g12 = per-gram prices for each karat
//   oz24 = per-ounce 24k price
// ----------------------------------------------------------------
function buildRows(sym, g24, g22, g21, g18, g12, oz24) {
    const t24 = g24 * TOLA, t22 = g22 * TOLA, t21 = g21 * TOLA,
        t18 = g18 * TOLA, t12 = g12 * TOLA;
    const oz22 = oz24 * (22 / 24), oz21 = oz24 * (21 / 24),
        oz18 = oz24 * (18 / 24), oz12 = oz24 * (12 / 24);
    return `
        <tr>
            <td class="col1">1 Tola</td>
            <td>${fmt(sym, t24)}</td><td>${fmt(sym, t22)}</td>
            <td>${fmt(sym, t21)}</td><td>${fmt(sym, t18)}</td><td>${fmt(sym, t12)}</td>
        </tr>
        <tr>
            <td class="col1">10 Gram</td>
            <td>${fmt(sym, g24 * 10)}</td><td>${fmt(sym, g22 * 10)}</td>
            <td>${fmt(sym, g21 * 10)}</td><td>${fmt(sym, g18 * 10)}</td><td>${fmt(sym, g12 * 10)}</td>
        </tr>
        <tr>
            <td class="col1">per gram</td>
            <td>${fmt(sym, g24)}</td><td>${fmt(sym, g22)}</td>
            <td>${fmt(sym, g21)}</td><td>${fmt(sym, g18)}</td><td>${fmt(sym, g12)}</td>
        </tr>
        <tr>
            <td class="col1">per ounce</td>
            <td>${fmt(sym, oz24)}</td><td>${fmt(sym, oz22)}</td>
            <td>${fmt(sym, oz21)}</td><td>${fmt(sym, oz18)}</td><td>${fmt(sym, oz12)}</td>
        </tr>`;
}


function setTable(selector, sym, g24, g22, g21, g18, g12, oz24) {
    const table = document.querySelector(selector);
    if (!table) return;
    const headerHTML = table.querySelector("tr").outerHTML; // preserve <th> row
    table.innerHTML = headerHTML + buildRows(sym, g24, g22, g21, g18, g12, oz24);
}

// ----------------------------------------------------------------
// SECTION 5 – Update the Pakistan table (uses IDs from HTML)
// ----------------------------------------------------------------
function updatePakistanTable() {
    const set = (id, val) => {
        const el = document.querySelector(id);
        if (el) el.innerText = "Rs. " + Math.round(val).toLocaleString();
    };
    set("#p1t24k", p1t24k); set("#p1t22k", p1t22k); set("#p1t21k", p1t21k);
    set("#p1t18k", p1t18k); set("#p1t12k", p1t12k);
    set("#p10g24k", p10g24k); set("#p10g22k", p10g22k); set("#p10g21k", p10g21k);
    set("#p10g18k", p10g18k); set("#p10g12k", p10g12k);
    set("#p1g24k", p1g24k); set("#p1g22k", p1g22k); set("#p1g21k", p1g21k);
    set("#p1g18k", p1g18k); set("#p1g12k", p1g12k);
    set("#p1o24k", p1o24k); set("#p1o22k", p1o22k); set("#p1o21k", p1o21k);
    set("#p1o18k", p1o18k); set("#p1o12k", p1o12k);
}

// ----------------------------------------------------------------
// SECTION 6 – Update International Rate Bar
// ----------------------------------------------------------------
function updateIntlBar(usdPerOz) {
    const price = parseFloat(usdPerOz).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const gram = (usdPerOz / OZ).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const tola = (usdPerOz / OZ * TOLA).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const now = new Date().toLocaleTimeString('en-PK', {
        hour: '2-digit', minute: '2-digit'
    });

    document.querySelector("#intlprice").innerText = `$ ${price}`;
    document.querySelector("#intlgram").innerText = `$ ${gram}`;
    document.querySelector("#intltola").innerText = `$ ${tola}`;
    document.querySelector("#intltime").innerText = `Last updated: ${now}`;
}

// ----------------------------------------------------------------
// SECTION 7 – Render fallback data immediately (offline-first)
// ----------------------------------------------------------------
updatePakistanTable();

// ----------------------------------------------------------------
// SECTION 8 – GoldAPI fetch helper (reusable for any currency)
// ----------------------------------------------------------------
async function fetchGoldAPI(currency) {
    try {
        // Sirf URL call karein, koi API key ya Headers ki zaroorat nahi!
        const res = await fetch(`https://gold-backend-mu.vercel.app/api/gold?currency=${currency}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        return data;
    } catch (err) {
        console.warn(`[GoldAPI] Failed – using fallback.`, err);
        return null;
    }
}

// ----------------------------------------------------------------
// SECTION 9 – Fetch PKR → update Pakistan + all city tables
// ----------------------------------------------------------------
async function fetchPKR() {
    try {
        const goldRes = await fetch("https://api.gold-api.com/price/XAU");
        const goldJson = await goldRes.json();
        const usdPerOz = parseFloat(goldJson.price);

        const fxRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const fxData = await fxRes.json();
        const exchangeRate = fxData.rates.PKR;

        updateIntlBar(usdPerOz);
        fetchHistoryTable(exchangeRate);


        storeTodayRate(usdPerOz, exchangeRate);

        p1g24k = (usdPerOz / OZ) * exchangeRate;
        p1g22k = p1g24k * (22 / 24);
        p1g21k = p1g24k * (21 / 24);
        p1g18k = p1g24k * (18 / 24);
        p1g16k = p1g24k * (16 / 24);
        p1g12k = p1g24k * (12 / 24);
        p1o24k = usdPerOz * exchangeRate;

        derivePKR();
        updatePakistanTable();
        showLiveBadge();

    } catch (err) {
        console.warn("fetchPKR failed — using fallback", err);
    }
}
// ----------------------------------------------------------------
// SECTION 10 – Fetch international country rates
// ----------------------------------------------------------------
async function fetchCountryRates() {
    try {
        const goldRes = await fetch("https://api.gold-api.com/price/XAU");
        const goldJson = await goldRes.json();
        const usdPerOz = parseFloat(goldJson.price);
        const usdGram = usdPerOz / 31.1035;

        const fxRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const allRates = (await fxRes.json()).rates;

        const countries = [
            { currency: "AED", selector: ".dubaitab", sym: "AED" },
            { currency: "INR", selector: ".indiatab", sym: "₹" },
            { currency: "SGD", selector: ".singaporetab", sym: "SGD" },
            { currency: "CAD", selector: ".canadatab", sym: "CAD" },
            { currency: "USD", selector: ".usatab", sym: "$" },
        ];

        countries.forEach(({ currency, selector, sym }) => {
            const rate = allRates[currency] || 1;
            const g24 = usdGram * rate;
            const g22 = g24 * (22 / 24);
            const g21 = g24 * (21 / 24);
            const g18 = g24 * (18 / 24);
            const g12 = g24 * (12 / 24);
            const oz24 = usdPerOz * rate;
            setTable(selector, sym, g24, g22, g21, g18, g12, oz24);
        });

    } catch (err) {
        console.warn("fetchCountryRates failed", err);
    }
}

// ----------------------------------------------------------------
// SECTION 11 – Small "LIVE" badge shown on the Pakistan table
// ----------------------------------------------------------------
function showLiveBadge() {
    const h1 = document.querySelector("#pakistan h1");
    if (!h1 || document.querySelector(".live-badge")) return;
    const badge = document.createElement("span");
    badge.className = "live-badge";
    badge.innerText = "● LIVE";
    badge.style.cssText =
        "margin-left:12px;font-size:0.6em;background:green;color:#fff;" +
        "padding:2px 8px;border-radius:30px;vertical-align:middle;";
    h1.appendChild(badge);
}

// ----------------------------------------------------------------
// SECTION 12 – Kick off all API calls
// ----------------------------------------------------------------
fetchPKR();
fetchCountryRates();



// ================================================================
//  COUNTRY SWITCHER
// ================================================================
function showOnlyCountry(target) {
    [dubaitab, indiatab, singaporetab, canadatab, usatab].forEach(t => {
        t.style.display = "none";
    });
    target.style.display = "table";
}

selcountry.addEventListener("change", function () {
    const v = selcountry.value;
    if (v === "Dubai") showOnlyCountry(dubaitab);
    else if (v === "India") showOnlyCountry(indiatab);
    else if (v === "Singapore") showOnlyCountry(singaporetab);
    else if (v === "Canada") showOnlyCountry(canadatab);
    else showOnlyCountry(usatab);
});

// ================================================================
//  GOLD CALCULATOR
// ================================================================
var selnum = document.querySelector(".selnum");
var selunit = document.querySelector(".selunit");
var cal24 = document.querySelector(".cal24");
var cal22 = document.querySelector(".cal22");
var cal21 = document.querySelector(".cal21");
var cal18 = document.querySelector(".cal18");
var cal16 = document.querySelector(".cal16");
var cal12 = document.querySelector(".cal12");

function calcGold() {
    const qty = parseFloat(selnum.value) || 0;
    let r24, r22, r21, r18, r16, r12;

    if (selunit.value === "Grams") {
        r24 = p1g24k; r22 = p1g22k; r21 = p1g21k;
        r18 = p1g18k; r16 = p1g16k; r12 = p1g12k;
    } else if (selunit.value === "Tola") {
        r24 = p1t24k; r22 = p1t22k; r21 = p1t21k;
        r18 = p1t18k; r16 = p1t16k; r12 = p1t12k;
    } else { // Ounce
        r24 = p1o24k; r22 = p1o22k; r21 = p1o21k;
        r18 = p1o18k; r16 = p1o16k; r12 = p1o12k;
    }

    cal24.innerText = `Rs. ${Math.round(qty * r24).toLocaleString()}`;
    cal22.innerText = `Rs. ${Math.round(qty * r22).toLocaleString()}`;
    cal21.innerText = `Rs. ${Math.round(qty * r21).toLocaleString()}`;
    cal18.innerText = `Rs. ${Math.round(qty * r18).toLocaleString()}`;
    cal16.innerText = `Rs. ${Math.round(qty * r16).toLocaleString()}`;
    cal12.innerText = `Rs. ${Math.round(qty * r12).toLocaleString()}`;
}

addEventListener("input", function () { calcGold(); });

// ================================================================
//  ZAKAT CALCULATOR
// ================================================================
var weight = document.querySelector(".weight");
var zakatunit = document.querySelector(".zakatunit");
var selzakatkarot = document.querySelector(".selzakatkarot");
var printzakat = document.querySelector(".printzakat");
var calculate = document.querySelector(".submit");

const ZAKAT_RATE = 0.025;
const KARAT_MAP = {
    "24 karat": 24, "22 karat": 22, "21 karat": 21,
    "18 karat": 18, "16 karat": 16, "12 karat": 12
};

// Nisab constants
const NISAB_TOLA = 7.5;
const NISAB_GRAMS = 87.48;
const NISAB_OUNCE = 2.8125; // 87.48 / 31.1035

function calculateZakat() {
    const qty = parseFloat(weight.value) || 0;
    const karat = KARAT_MAP[selzakatkarot.value] || 24;
    const ratio = karat / 24;
    let baseRate = 0;
    let nisab = 0;


    if (zakatunit.value === "Grams") {
        baseRate = p1g24k;
        nisab = NISAB_GRAMS;   // 87.48 grams
    } else if (zakatunit.value === "Tola") {
        baseRate = p1t24k;
        nisab = NISAB_TOLA;    // 7.5 tola
    } else { // Ounce
        baseRate = p1o24k;
        nisab = NISAB_OUNCE;   // 2.8125 ounce
    }

    if (qty < nisab) {
        zakatres.innerText =
            `                                <p>zakat applicable on min 7.5tola or 87.47 grams</p>
`;
        return;
    }

    // Zakat calculate karo
    const zakat = qty * baseRate * ratio * ZAKAT_RATE;
    printzakat.innerText = `Rs. ${Math.round(zakat).toLocaleString()}`;
}

calculate.addEventListener("click", calculateZakat);

// ================================================================
//  UNIT CONVERTER
// ================================================================
var uweight = document.querySelector(".uweight");
var ufrom = document.querySelector(".ufrom");
var uto = document.querySelector(".uto");
var convertedweight = document.querySelector(".convertedweight");
var submit2 = document.querySelector(".submit2");

function convertUnit() {
    const val = parseFloat(uweight.value) || 0;
    const from = ufrom.value;
    const to = uto.value;
    let result = 0;

    if (from === "Grams") {
        if (to === "Tola") result = val / TOLA;
        if (to === "Ounce") result = val / OZ;
        if (to === "Grams") result = val;
    } else if (from === "Tola") {
        if (to === "Grams") result = val * TOLA;
        if (to === "Ounce") result = val * TOLA / OZ;
        if (to === "Tola") result = val;
    } else { // Ounce
        if (to === "Grams") result = val * OZ;
        if (to === "Tola") result = val * OZ / TOLA;
        if (to === "Ounce") result = val;
    }

    convertedweight.innerText = +result.toFixed(6); // trim trailing zeros
}

submit2.addEventListener("click", convertUnit);

// ================================================================
//  SECTION 13 – 5-Day History Table (With LocalStorage Cache)
// ================================================================
async function fetchHistoryTable(currentExchangeRate) {
    const table = document.querySelector(".historytab");
    if (!table) return;

    const pastDates = [];
    const displayDates = [];

    for (let i = 1; i <= 5; i++) {
        let d = new Date();
        d.setDate(d.getDate() - i);
        let year = d.getFullYear();
        let month = String(d.getMonth() + 1).padStart(2, '0');
        let day = String(d.getDate()).padStart(2, '0');
        pastDates.push(`${year}${month}${day}`);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        displayDates.push(d.toLocaleDateString('en-GB', options));
    }

    let rowsHTML = `
        <tr>
            <th>Date</th>
            <th>PKR per Tola (24K)</th>
            <th>International (USD/oz)</th>
        </tr>`;

    for (let i = 0; i < pastDates.length; i++) {
        const dateStr = pastDates[i];
        const cacheKey = `gold_history_${dateStr}`;

        let historyData = null;
        try {
            historyData = JSON.parse(localStorage.getItem(cacheKey));
        } catch (e) { }

        if (historyData && historyData.price && !isNaN(historyData.price)) {
            const pkrTola = historyData.pkrTola ||
                Math.round((historyData.price / OZ) * TOLA * currentExchangeRate);
            const usdOz = parseFloat(historyData.price).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            rowsHTML += `
                <tr>
                    <td>${displayDates[i]}</td>
                    <td>Rs. ${pkrTola.toLocaleString()}</td>
                    <td>$ ${usdOz}</td>
                </tr>`;
        } else {

            rowsHTML += `
                <tr>
                    <td>${displayDates[i]}</td>
                    <td colspan="2" style="color:gray; font-style:italic;">
                        No data — visit site daily to build history
                    </td>
                </tr>`;
        }
    }

    table.innerHTML = rowsHTML;
}
// ================================================================
//  SECTION 14 – Auto Store Today's Rate at End of Day
// ================================================================
function storeTodayRate(usdPerOz, exchangeRate) {
    const now = new Date();

    // Aaj ki date ka key
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateKey = `gold_history_${year}${month}${day}`;

    // Sirf store karo agar pehle se nahi hai
    // Ya agar already stored hai to update karte raho (latest rate)
    const pkrTola = Math.round((usdPerOz / OZ) * TOLA * exchangeRate);

    const todayData = {
        price: usdPerOz,
        pkrTola: pkrTola,
        high: usdPerOz * 1.003,
        low: usdPerOz * 0.997,
        storedAt: now.toISOString()
    };

    localStorage.setItem(dateKey, JSON.stringify(todayData));
    console.log(`✅ Today's rate stored: ${dateKey} = Rs. ${pkrTola}`);
}