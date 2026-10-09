/* =========================
   AUTH GUARD (safe)
========================= */
if (typeof checkAuth === "function") {
  checkAuth();
}

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


/* =========================================================
   INPUT FORMATTER — দশমিক সহ (Euro-এর জন্য)
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


/* =========================================================
   INPUT FORMATTER — শুধু পূর্ণ সংখ্যা (TK-এর জন্য)
========================================================= */

function setupIntegerFormatter(input) {

  if (!input) return;

  input.addEventListener("input", function() {

    const value = this.value;
    const cursor = this.selectionStart || 0;

    const digitsBeforeCursor =
      value.slice(0, cursor).replace(/\D/g, "").length;

    const digits = value.replace(/\D/g, "");
    const formatted = digits ?
      Number(digits).toLocaleString("en-IN") :
      "";

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

const euroInput =
  document.getElementById("euro");

const tkInput =
  document.getElementById("tk");

const rateInput =
  document.getElementById("rate");


/* =========================
   ATTACH FORMATTERS
   Euro → decimal (50.50 ✅)
   TK   → integer (5000 ✅)
========================= */

setupDecimalFormatter(euroInput, 2);
setupIntegerFormatter(tkInput);


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


function getTK() {

  if (!tkInput) return 0;

  return parseFloat(
    tkInput.value.replace(/,/g, "")
  );
}


function getRate() {

  if (!rateInput) return 0;

  return parseFloat(
    rateInput.value.replace(/,/g, ".")
  );
}


/* =========================
   CHARGE TIERS (অপরিবর্তিত)
========================= */

function getCharge(euro) {

  if (euro >= 1 && euro <= 12) return 1;
  if (euro >= 13 && euro <= 23) return 2;
  if (euro >= 24 && euro <= 59) return 3;
  if (euro >= 60 && euro <= 149) return 4;
  if (euro >= 150) return 5;

  return 0;
}


/* =========================================================
   BUTTON 1 — Euro → TK
========================================================= */

function calculateEuro() {

  const euro = getEuro();
  const rate = getRate();

  const resultBox =
    document.getElementById("euroResult");


  if (!euro || !rate || euro <= 0 || rate <= 0) {
    resultBox.innerText = "৳ —";
    return;
  }


  const charge = getCharge(euro);

  const euroAfterCharge = euro - charge;

  const bdAmount = euroAfterCharge * rate;


  resultBox.innerText =
    "৳ " + formatTK(bdAmount);
}


/* =========================================================
   LIVE TK CALCULATION — ২% সহ (৳ কালো)
========================================================= */

function showTKCalculation() {

  const tk = getTK();

  const calculationBox =
    document.getElementById("tkCalculation");


  if (!tk || tk <= 0) {

    calculationBox.innerText =
      "পাঠাবো যত টাকা";

    return;
  }


  const totalTK = tk * 1.02;


  calculationBox.innerHTML =
    '<span class="sym-black">৳</span> ' + formatTK(totalTK);
}


/* =========================================================
   BUTTON 2 — TK → Euro
========================================================= */

function calculateTK() {

  const tk = getTK();
  const rate = getRate();

  const resultBox =
    document.getElementById("tkResult");


  if (!tk || !rate || tk <= 0 || rate <= 0) {
    resultBox.innerText = "€ —";
    return;
  }


  const totalTK = tk * 1.02;

  const euroBeforeCharge = totalTK / rate;

  const charge = getCharge(euroBeforeCharge);

  const finalEuro = euroBeforeCharge + charge;


  resultBox.innerText =
    "€ " + formatEuro(finalEuro);
}


/* =========================
   LIVE UPDATE
========================= */

if (tkInput) {
  tkInput.addEventListener("input", showTKCalculation);
}


/* =========================
   ENTER KEY
========================= */

if (euroInput) {
  euroInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateEuro();
    }
  });
}


if (tkInput) {
  tkInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateTK();
    }
  });
}


if (rateInput) {
  rateInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateEuro();
      calculateTK();
    }
  });
}
