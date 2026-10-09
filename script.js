/* =========================
   AUTH GUARD
========================= */
if (typeof checkAuth === "function") checkAuth();


/* =========================
   FORMAT TK (স্মার্ট)
========================= */

function formatTK(value) {

    const number = Number(value);

    if (Number.isInteger(number)) {
        return number.toLocaleString("en-IN");
    }

    return number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


/* =========================
   FORMAT EURO
========================= */

function formatEuro(value) {

    const number = Number(value);

    if (Number.isInteger(number)) {
        return number.toString();
    }

    return number.toFixed(2);
}


/* =========================
   FORMAT INPUT AMOUNT
========================= */

function formatInputAmount(value) {

    const digits = value.replace(/\D/g, "");

    if (!digits) {
        return "";
    }

    return Number(digits).toLocaleString("en-IN");
}


/* =========================
   INPUT FORMATTER
========================= */

function setupAmountFormatter(input) {

    if (!input) return;

    input.addEventListener("input", function () {

        const value = this.value;
        const cursor = this.selectionStart || 0;

        const digitsBeforeCursor =
            value.slice(0, cursor).replace(/\D/g, "").length;

        const formatted = formatInputAmount(value);

        this.value = formatted;

        if (digitsBeforeCursor === 0) {
            this.setSelectionRange(0, 0);
            return;
        }

        let newCursor = formatted.length;
        let digitCount = 0;

        for (let i = 0; i < formatted.length; i++) {

            if (/\d/.test(formatted[i])) {

                digitCount++;

                if (digitCount === digitsBeforeCursor) {
                    newCursor = i + 1;
                    break;
                }
            }
        }

        this.setSelectionRange(newCursor, newCursor);
    });
}


/* =========================
   INPUTS
========================= */

const amountInput =
    document.getElementById("amount");

const splitAmountInput =
    document.getElementById("splitAmount");

const rateInput =
    document.getElementById("rate");


setupAmountFormatter(amountInput);
setupAmountFormatter(splitAmountInput);


/* =========================
   RATE INPUT FILTER
========================= */

if (rateInput) {

    rateInput.addEventListener("keydown", function (event) {

        if (
            event.key === "e" ||
            event.key === "E" ||
            event.key === "+" ||
            event.key === "-"
        ) {
            event.preventDefault();
            return;
        }
    });


    rateInput.addEventListener("input", function () {

        let value = this.value;

        value = value.replace(/,/g, ".");
        value = value.replace(/[^0-9.]/g, "");

        const firstDot = value.indexOf(".");

        if (firstDot !== -1) {

            value =
                value.substring(0, firstDot + 1) +
                value
                    .substring(firstDot + 1)
                    .replace(/\./g, "");
        }

        this.value = value;


        const rate = parseFloat(value);

        const display =
            document.getElementById("splitRateDisplay");

        if (display) {

            if (rate && rate > 0) {
                display.innerText = rate.toFixed(2);
            } else {
                display.innerText = "—";
            }
        }
    });
}


/* =========================
   GETTERS
========================= */

function getAmount() {

    if (!amountInput) return 0;

    return parseFloat(
        amountInput.value.replace(/,/g, "")
    );
}


function getRate() {

    if (!rateInput) return 0;

    return parseFloat(
        rateInput.value.replace(/,/g, ".")
    );
}


function getSplitAmount() {

    if (!splitAmountInput) return 0;

    return parseFloat(
        splitAmountInput.value.replace(/,/g, "")
    );
}


/* =========================================================
   CORE CALCULATION
========================================================= */

function splitTKForEuro(euro, rate) {

    const bonus = euro >= 501 ? 7.80 : 5.90;

    const euroAfterBonus = euro - bonus;

    const bdBeforePercentage = euroAfterBonus * rate;

    const bdFinal = bdBeforePercentage * 1.025;

    return Math.floor((bdFinal + 1e-9) * 100) / 100;
}


function findEuroForRemainingTK(remainingTK, rate) {

    for (let euro = 0.50; euro <= 999.00; euro += 0.50) {

        const requiredTK = splitTKForEuro(euro, rate);

        if (requiredTK >= remainingTK - 0.000001) {
            return { euro: euro, tk: requiredTK };
        }
    }

    return null;
}


/* =========================================================
   BUTTON 1 — খরচ, বোনাস সহ
========================================================= */

function calculate() {

    const amount = getAmount();
    const rate = getRate();

    const resultBox = document.getElementById("result");
    const bdResult = document.getElementById("bdResult");
    const infoText = document.getElementById("infoText");


    if (!amount || !rate || amount <= 0 || rate <= 0) {

        resultBox.innerText = "—";
        bdResult.innerText = "৳ —";
        infoText.innerText = "সঠিক Amount এবং Exchange Rate দিন।";
        return;
    }


    let finalEuro = 0;

    for (let euro = 0.50; euro <= 999.00; euro += 0.50) {

        const requiredTK = splitTKForEuro(euro, rate);

        if (requiredTK >= amount - 0.000001) {
            finalEuro = euro;
            break;
        }
    }


    if (finalEuro <= 0) {

        resultBox.innerText = "—";
        bdResult.innerText = "৳ —";
        infoText.innerText = "এই Amount-এর জন্য হিসাব করা সম্ভব হয়নি।";
        return;
    }


    const finalTK = splitTKForEuro(finalEuro, rate);

    resultBox.innerText = formatEuro(finalEuro) + " €";
    bdResult.innerText = "৳ " + formatTK(finalTK);
    infoText.innerText = "খরচ ও বোনাসসহ হিসাব সম্পন্ন হয়েছে।";
}


/* =========================================================
   BUTTON 2 — খরচ ছাড়া
========================================================= */

function calculateWithoutBonus() {

    const amount = getAmount();
    const rate = getRate();

    const resultBox = document.getElementById("result");
    const bdResult = document.getElementById("bdResult");
    const infoText = document.getElementById("infoText");


    if (!amount || !rate || amount <= 0 || rate <= 0) {

        resultBox.innerText = "—";
        bdResult.innerText = "৳ —";
        infoText.innerText = "সঠিক Amount এবং Exchange Rate দিন।";
        return;
    }


    let finalEuro = 0;
    let finalTK = 0;

    for (let euro = 0.50; euro <= 999.00; euro += 0.50) {

        const calculatedTK =
            Math.floor((euro * rate * 1.025) * 100) / 100;

        if (calculatedTK >= amount - 0.000001) {
            finalEuro = euro;
            finalTK = calculatedTK;
            break;
        }
    }


    if (finalEuro <= 0) {

        resultBox.innerText = "—";
        bdResult.innerText = "৳ —";
        infoText.innerText = "এই Amount-এর জন্য হিসাব করা সম্ভব হয়নি।";
        return;
    }


    resultBox.innerText = formatEuro(finalEuro) + " €";
    bdResult.innerText = "৳ " + formatTK(finalTK);
    infoText.innerText = "5.90 / 7.80 Euro খরচ আলাদা দিতে হবে।";
}


/* =========================================================
   BUTTON 3 — বোনাস ছাড়া
========================================================= */

function calculateBonusOnly() {

    const amount = getAmount();
    const rate = getRate();

    const resultBox = document.getElementById("result");
    const bdResult = document.getElementById("bdResult");
    const infoText = document.getElementById("infoText");


    if (!amount || !rate || amount <= 0 || rate <= 0) {

        resultBox.innerText = "—";
        bdResult.innerText = "৳ —";
        infoText.innerText = "সঠিক Amount এবং Exchange Rate দিন।";
        return;
    }


    const euro = amount / rate;

    const bonus = euro <= 500 ? 5.90 : 7.80;

    const finalEuro = euro + bonus;

    resultBox.innerText = formatEuro(finalEuro) + " €";
    bdResult.innerText = "৳ " + formatTK(amount);
    infoText.innerText = "Bonus যোগ করে Euro হিসাব দেখানো হয়েছে।";
}


/* =========================================================
   SPLIT CALCULATOR
========================================================= */

function calculateSplit() {

    const splitAmount = getSplitAmount();
    const rate = getRate();

    const resultBox = document.getElementById("splitResult");
    const rateDisplay = document.getElementById("splitRateDisplay");


    if (rate && rate > 0) {
        rateDisplay.innerText = rate.toFixed(2);
    } else {
        rateDisplay.innerText = "—";
    }


    if (!splitAmount || !rate || splitAmount <= 0 || rate <= 0) {

        resultBox.innerHTML = `
            <div class="split-warning">
                ⚠️ আগে Split TK Amount এবং Exchange Rate সঠিকভাবে দিন।
            </div>
        `;
        return;
    }


    let remaining = Math.round(splitAmount * 100) / 100;

    const rows = [];


    for (let i = 0; i < 3; i++) {

        if (remaining <= 0.004) {
            remaining = 0;
            break;
        }


        const tkFor999 = splitTKForEuro(999, rate);


        if (remaining > tkFor999 + 0.000001) {

            rows.push({ tk: tkFor999, euro: 999 });

            remaining =
                Math.round((remaining - tkFor999) * 100) / 100;

            continue;
        }


        const finalChunk =
            findEuroForRemainingTK(remaining, rate);


        if (finalChunk) {

            rows.push({
                tk: finalChunk.tk,
                euro: finalChunk.euro
            });

            remaining = 0;

        } else {

            rows.push({ tk: tkFor999, euro: 999 });

            remaining =
                Math.round((remaining - tkFor999) * 100) / 100;
        }

        break;
    }


    let html = "";
    let totalTK = 0;
    let totalEuro = 0;


    rows.forEach(function (row, index) {

        totalTK += row.tk;
        totalEuro += row.euro;

        const euroText = formatEuro(row.euro);

        html += `
            <div class="split-row">

                <div class="split-number">
                    ${index + 1}
                </div>

                <div class="split-data">

                    <div class="split-tk">
                        ৳ ${formatTK(row.tk)}
                    </div>

                    <div class="split-euro">
                        ${euroText} €
                    </div>

                </div>

            </div>
        `;
    });


    totalTK = Math.round(totalTK * 100) / 100;
    totalEuro = Math.round(totalEuro * 100) / 100;


    if (remaining > 0.004) {

        html += `
            <div class="split-warning">
                ⚠️ ৩টি ভাগের মধ্যে পুরো Amount cover করা সম্ভব হয়নি।
                <br><br>
                বাকি: <strong>৳ ${formatTK(remaining)}</strong>
            </div>
        `;
    }


    html += `
        <div class="split-total">

            <div>
                <span>মোট TK</span>
                <strong>৳ ${formatTK(totalTK)}</strong>
            </div>

            <div>
                <span>মোট Euro</span>
                <strong>${formatEuro(totalEuro)} €</strong>
            </div>

        </div>
    `;


    resultBox.innerHTML = html;
}


/* =========================================================
   ENTER KEY
========================================================= */

if (amountInput) {
    amountInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            calculate();
        }
    });
}


if (rateInput) {
    rateInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            calculate();
        }
    });
}


if (splitAmountInput) {
    splitAmountInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            calculateSplit();
        }
    });
}
