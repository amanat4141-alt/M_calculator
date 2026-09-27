/*
================================
CHARGE RULE
================================

1 - 12   = 1
13 - 23  = 2
24 - 59  = 3
60 - 149 = 4
150+     = 5
*/


function getCharge(euro) {

    if (euro >= 1 && euro <= 12) {
        return 1;
    }

    if (euro >= 13 && euro <= 23) {
        return 2;
    }

    if (euro >= 24 && euro <= 59) {
        return 3;
    }

    if (euro >= 60 && euro <= 149) {
        return 4;
    }

    if (euro >= 150) {
        return 5;
    }

    return 0;
}


/*
================================
EURO CALCULATION
================================

Euro - Charge
× Rate
= BD
*/


function calculateEuro() {

    const euro = parseFloat(
        document.getElementById("euro").value
    );

    const rate = parseFloat(
        document.getElementById("rate").value
    );

    const resultBox =
        document.getElementById("euroResult");


    if (
        !euro ||
        !rate ||
        euro <= 0 ||
        rate <= 0
    ) {

        resultBox.innerText = "৳ —";

        return;
    }


    const charge =
        getCharge(euro);


    const euroAfterCharge =
        euro - charge;


    const bdAmount =
        euroAfterCharge * rate;


    resultBox.innerText =
        "৳ " + bdAmount.toFixed(2);
}


/*
================================
TK 2% CALCULATION
================================

TK input দিলে সাথে সাথে
2% যোগ করা amount দেখাবে।

10000
↓
10200

2000
↓
2040
*/


function showTKCalculation() {

    const tk = parseFloat(
        document.getElementById("tk").value
    );

    const calculationBox =
        document.getElementById("tkCalculation");


    if (
        !tk ||
        tk <= 0
    ) {

        calculationBox.innerText = "";

        return;
    }


    const totalTK =
        tk * 1.02;


    calculationBox.innerText =
        totalTK.toFixed(0);
}


/*
================================
TK CALCULATION
================================

TK + 2%
÷ Rate
= Euro

তারপর Euro অনুযায়ী
Charge যোগ হবে।
*/


function calculateTK() {

    const tk = parseFloat(
        document.getElementById("tk").value
    );

    const rate = parseFloat(
        document.getElementById("rate").value
    );

    const resultBox =
        document.getElementById("tkResult");


    if (
        !tk ||
        !rate ||
        tk <= 0 ||
        rate <= 0
    ) {

        resultBox.innerText = "€ —";

        return;
    }


    /*
        TK এর সাথে 2% যোগ
    */

    const totalTK =
        tk * 1.02;


    /*
        Rate দিয়ে Euro বের
    */

    const euroBeforeCharge =
        totalTK / rate;


    /*
        Euro অনুযায়ী Charge
    */

    const charge =
        getCharge(euroBeforeCharge);


    /*
        Final Euro
    */

    const finalEuro =
        euroBeforeCharge + charge;


    /*
        Final Answer
    */

    resultBox.innerText =
        "€ " + finalEuro.toFixed(3);
}


/*
================================
TK INPUT
================================

টাইপ করলেই 2% যোগ করা
amount দেখাবে।
*/

document
    .getElementById("tk")
    .addEventListener(
        "input",
        showTKCalculation
    );


/*
================================
ENTER KEY
================================
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
    .getElementById("tk")
    .addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {
                calculateTK();
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