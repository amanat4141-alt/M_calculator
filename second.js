/*
    সাধারণ হিসাব

    Euro < 501 হলে
    Bonus = 5.90

    Euro >= 501 হলে
    Bonus = 7.80

    তারপর:

    Euro - Bonus
    × Rate
    + 2.5%
*/


function calculateEuro() {

  const euro = parseFloat(
    document.getElementById("euro").value
  );

  const rate = parseFloat(
    document.getElementById("rate").value
  );

  const resultBox =
    document.getElementById("result");


  // Input check

  if (
    !euro ||
    !rate ||
    euro <= 0 ||
    rate <= 0
  ) {

    resultBox.innerText = "৳ —";

    return;
  }


  /*
      501 বা তার বেশি হলে
      7.80 বাদ হবে

      501 এর নিচে হলে
      5.90 বাদ হবে
  */

  const bonus =
    euro >= 501 ?
    7.80 :
    5.90;


  // Euro থেকে Bonus বাদ

  const euroAfterBonus =
    euro - bonus;


  // Rate দিয়ে গুণ

  const bdBeforePercentage =
    euroAfterBonus * rate;


  // 2.5% যোগ

  const bdFinal =
    bdBeforePercentage * 1.025;


  // Result

  resultBox.innerText =
    "৳ " + bdFinal.toFixed(2);
}


/*
    খরচ আলাদা হিসাব

    এখানে কোনো 5.90 / 7.80
    বাদ হবে না।

    Euro × Rate
    + 2.5%
*/


function calculateSeparateCost() {

  const euro = parseFloat(
    document.getElementById("euro").value
  );

  const rate = parseFloat(
    document.getElementById("rate").value
  );

  const resultBox =
    document.getElementById("costResult");


  // Input check

  if (
    !euro ||
    !rate ||
    euro <= 0 ||
    rate <= 0
  ) {

    resultBox.innerText = "৳ —";

    return;
  }


  // Euro × Rate

  const bdBeforePercentage =
    euro * rate;


  // 2.5% যোগ

  const bdFinal =
    bdBeforePercentage * 1.025;


  // Result

  resultBox.innerText =
    "৳ " + bdFinal.toFixed(2);
}


/*
    Enter চাপলে সাধারণ হিসাব হবে
*/

document
  .getElementById("euro")
  .addEventListener(
    "keydown",
    function(event) {

      if (event.key === "Enter") {
        calculateEuro();
      }

    }
  );


document
  .getElementById("rate")
  .addEventListener(
    "keydown",
    function(event) {

      if (event.key === "Enter") {
        calculateEuro();
      }

    }
  );
  