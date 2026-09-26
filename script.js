/*
================================
GET INPUTS
================================
*/

function getInputs() {

  const amount =
    parseFloat(
      document.getElementById("amount").value
    );

  const rate =
    parseFloat(
      document.getElementById("rate").value
    );

  return {
    amount,
    rate
  };
}


/*
================================
BUTTON 1
CALCULATE
================================

আগের হিসাব:

Amount × 97.5%

তারপর
+ 50

তারপর Rate দিয়ে ভাগ

তারপর
Euro অনুযায়ী 5.90 / 7.80

তারপর Round Up
================================
*/

function calculateWithBonus() {

  const {
    amount,
    rate
  } =
  getInputs();

  const resultBox =
    document.getElementById("result");

  const bdResultBox =
    document.getElementById("bdResult");


  if (
    !amount ||
    !rate ||
    amount <= 0 ||
    rate <= 0
  ) {

    resultBox.innerText = "—";
    bdResultBox.innerText = "৳ —";

    return;
  }


  const afterReduction =
    amount * 0.975;


  const converted =
    (afterReduction + 50) / rate;


  const bonus =
    converted > 501 ?
    7.80 :
    5.90;


  const total =
    converted + bonus;


  const finalResult =
    Math.ceil(total - 1e-9);


  resultBox.innerText =
    finalResult + " €";


  const bdBonus =
    finalResult >= 501 ?
    7.80 :
    5.90;


  const euroAfterBonus =
    finalResult - bdBonus;


  const bdBeforePercentage =
    euroAfterBonus * rate;


  const bdFinal =
    bdBeforePercentage * 1.025;


  bdResultBox.innerText =
    "৳ " + bdFinal.toFixed(2);
}


/*
================================
BUTTON 2
WITHOUT BONUS
================================

আগের Without Bonus:

Amount × 97.5%

+ 50

÷ Rate

Round Up
================================
*/

function calculateWithoutBonus() {

  const {
    amount,
    rate
  } =
  getInputs();

  const resultBox =
    document.getElementById("result");

  const bdResultBox =
    document.getElementById("bdResult");


  if (
    !amount ||
    !rate ||
    amount <= 0 ||
    rate <= 0
  ) {

    resultBox.innerText = "—";
    bdResultBox.innerText = "৳ —";

    return;
  }


  const afterReduction =
    amount * 0.975;


  const amountWith50 =
    afterReduction + 50;


  const converted =
    amountWith50 / rate;


  const finalResult =
    Math.ceil(converted - 1e-9);


  resultBox.innerText =
    finalResult + " €";


  const bdBeforePercentage =
    finalResult * rate;


  const bdFinal =
    bdBeforePercentage * 1.025;


  bdResultBox.innerText =
    "৳ " + bdFinal.toFixed(2);
}


/*
================================
BUTTON 3
BONUS ছাড়া
================================

নতুন হিসাব:

Amount ÷ Rate = Euro

Euro 500 পর্যন্ত
+ 5.90

Euro 501 থেকে
+ 7.80
================================
*/

function calculateThird() {

  const {
    amount,
    rate
  } =
  getInputs();

  const resultBox =
    document.getElementById("result");

  const bdResultBox =
    document.getElementById("bdResult");


  if (
    !amount ||
    !rate ||
    amount <= 0 ||
    rate <= 0
  ) {

    resultBox.innerText = "—";
    bdResultBox.innerText = "৳ —";

    return;
  }


  /*
      TK ÷ Rate
  */

  const euro =
    amount / rate;


  /*
      500 পর্যন্ত = 5.90
      501 থেকে = 7.80
  */

  const bonus =
    euro <= 500 ?
    5.90 :
    7.80;


  /*
      Final Euro
  */

  const finalEuro =
    euro + bonus;


  /*
      2 decimal
  */

  resultBox.innerText =
    finalEuro.toFixed(2) + " €";


  /*
      এই হিসাবের মূল TK
      amount-ই BD amount
  */

  bdResultBox.innerText =
    "৳ " + amount.toFixed(2);
}


/*
================================
ENTER KEY
================================
*/

document
  .getElementById("amount")
  .addEventListener(
    "keydown",
    function(event) {

      if (event.key === "Enter") {

        calculateWithBonus();

      }

    }
  );


document
  .getElementById("rate")
  .addEventListener(
    "keydown",
    function(event) {

      if (event.key === "Enter") {

        calculateWithBonus();

      }

    }
  );