/* =========================
   AUTH GUARD (safe)
========================= */
if (typeof checkAuth === "function") {
  checkAuth();
}

/* =========================
   FORMAT TK (স্মার্ট)
   পূর্ণ সংখ্যা → 5,100
   দশমিক থাকলে → 5,100.50
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


/* =========================================================
   INPUT FORMATTER — দশমিক সহ (Euro-এর জন্য)
   50.50 → 50.50
   1000.50 → 1,000.50
========================================================= */

function setupDecimalFormatter(input, maxDecimals) {

  if (!input) return;

  maxDecimals = maxDecimals || 2;

  input.addEventListener("input", function() {

    let value = this.value;

    value = value.replace(/,/g, ".");
    value = value.replace(/[^0-9.]/g, "");

    const firstDot = value.indexOf(".");

    if (firstDot !== -1) {

      const intPart = value.substring(0, firstDot);

      const decPart = value
        .substring(firstDot + 1)
        .replace(/\./g, "")
        .substring(0, maxDecimals);

      value = intPart + "." + decPart;
    }

    if (value.includes(".")) {

      const [intPart, decPart] = value.split(".");

      const formattedInt = intPart ?
        Number(intPart).toLocaleString("en-IN") :
        "0";

      this.value = formattedInt + "." + decPart;

    } else {

      this.value = value ?
        Number(value).toLocaleString("en-IN") :
        "";
    }
  });
}


/* =========================
   INPUTS
========================= */

const euroInput =
  document.getElementById("euro");

const rateInput =
  document.getElementById("rate");


/* =========================
   ATTACH FORMATTER
   Euro → decimal (300.00 ✅)
========================= */

setupDecimalFormatter(euroInput, 2);


/* =========================
   RATE INPUT FILTER
   কমা (,) → ডট (.)
========================= */

if (rateInput) {

  rateInput.addEventListener("keydown", function(event) {

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


  rateInput.addEventListener("input", function() {

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
  });
}


/* =========================
   GET VALUES
========================= */

function getEuro() {

  if (!euroInput) return 0;

  return parseFloat(
    euroInput.value.replace(/,/g, "")
  );
}


function getRate() {

  if (!rateInput) return 0;

  return parseFloat(
    rateInput.value.replace(/,/g, ".")
  );
}


/* =========================================================
   BUTTON 1 — বোনাস সহ
   (calculation অপরিবর্তিত)
========================================================= */

function calculateEuro() {

  const euro = getEuro();
  const rate = getRate();

  const resultBox =
    document.getElementById("result");


  if (!euro || !rate || euro <= 0 || rate <= 0) {
    resultBox.innerText = "৳ —";
    return;
  }


  const bonus = euro >= 501 ? 7.80 : 5.90;

  const euroAfterBonus = euro - bonus;

  const bdBeforePercentage =
    euroAfterBonus * rate;

  const bdFinal =
    bdBeforePercentage * 1.025;


  resultBox.innerText =
    "৳ " + formatTK(bdFinal);
}


/* =========================================================
   BUTTON 2 — খরচ আলাদা
   (calculation অপরিবর্তিত)
========================================================= */

function calculateSeparateCost() {

  const euro = getEuro();
  const rate = getRate();

  const resultBox =
    document.getElementById("costResult");


  if (!euro || !rate || euro <= 0 || rate <= 0) {
    resultBox.innerText = "৳ —";
    return;
  }


  const bdBeforePercentage =
    euro * rate;

  const bdFinal =
    bdBeforePercentage * 1.025;


  resultBox.innerText =
    "৳ " + formatTK(bdFinal);
}


/* =========================
   ENTER KEY
========================= */

if (euroInput) {
  euroInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateEuro();
      calculateSeparateCost();
    }
  });
}


if (rateInput) {
  rateInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateEuro();
      calculateSeparateCost();
    }
  });
}
