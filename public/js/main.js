
let fincode = Fincode('p_test_aaaa');
appearance = {
    layout: "vertical",
    // hideLabel: true,
    labelExpire: '有効期限(MM／YY)'
}
console.log(fincode);
let ui = fincode.ui(appearance);

ui.create("payments", appearance);

ui.mount("fincode",'300');

let elements;
let payment;
let card;

initialize();
// checkStatus();
      
// document
//     .querySelector("#fincode")
//     .addEventListener("submit", handleSubmit);

document.getElementById("submit").addEventListener('click', handleSubmit);
document.getElementById("submit-customer").addEventListener('click', handleSubmitCustomer);


// Fetches a payment intent and captures the client secret
async function initialize() {
    const items = { amount: getParam('amount') };
    const response = await fetch("/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
    });
    const data= await response.json()
    console.log('response:');
    console.log(data);
    payment={
        access_id: data.access_id,
        amount: data.amount,
        order_id: data.id,
        pay_type: data.pay_type
    }
    console.log(response.body);
}

async function createCustomers() {
    const items = { name: getParam('name') };
    const response = await fetch("/create-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
    });
    const data= await response.json()
    console.log('response:');
    console.log(data);
    card={
        id: data.id,
        name: data.access_id,
    }
    console.log(response.body);
}


// お支払いボタンを押したときの挙動
async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let transaction;

    // fincode.uiからカード情報を取得する
    await ui.getFormData().then(result => {
        console.log(result);
        transaction={
            method: result.method,
            pay_times: result.payTimes,
            card_no: result.cardNo,
            security_code: result.CVC,
            expire: result.expire,
            access_id: payment.access_id,
            // amount: payment.amount,
            id: payment.order_id,
            pay_type: payment.pay_type
            }
        
    });

    // 決済実行を行う。
    fincode.payments(transaction,
        function (status, response) {
            if (status === 200) {
                console.log(response);
                // リクエスト正常時の処理
                document.getElementById("button-text").innerText="購入が完了しました！"
            } else {
                console.log(response);
                // リクエストエラー時の処理
                document.getElementById("button-text").innerText="購入が完了しませんでした"
            }
        },
        function () {
            // 通信エラー処理。
        })
    // ボタンでローディング画面を表示する
    setTimeout(() => {setLoading(false);}, 1000);
}

// カード登録ボタンを押したときの挙動
async function handleSubmitCustomer(e) {
    await createCustomers();
    setLoadingCard(true);
    let transaction;
    // fincode.uiからカード情報を取得する
    await ui.getFormData().then(result => {
        console.log(result);
        transaction={
            customer_id: card.id,
            default_flag: '1',
            method: result.method,
            card_no: result.cardNo,
            security_code: result.CVC,
            expire: result.expire,
            }
        
    });

    // 決済実行を行う。
    fincode.cards(transaction,
        function (status, response) {
            if (status === 200) {
                console.log(response);
                // リクエスト正常時の処理
                document.getElementById("button-text2").innerText="カード登録が完了しました！"
            } else {
                console.log(response);
                // リクエストエラー時の処理
                document.getElementById("button-text2").innerText="カード登録が完了しませんでした"
            }
        },
        function () {
            // 通信エラー処理。
        })
    // ボタンでローディング画面を表示する
    setTimeout(() => {setLoadingCard(false);}, 1000);
}


      
// Show a spinner on payment submission
function setLoading(isLoading) {
    if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("#submit").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("#submit").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
}
function setLoadingCard(isLoading) {
    if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("#submit-customer").disabled = true;
        document.querySelector("#spinner2").classList.remove("hidden");
        document.querySelector("#button-text2").classList.add("hidden");
    } else {
        document.querySelector("#submit-customer").disabled = false;
        document.querySelector("#spinner2").classList.add("hidden");
        document.querySelector("#button-text2").classList.remove("hidden");
    }
}

/**
 * Get the URL parameter value
 *
 * @param  name {string} パラメータのキー文字列
 * @return  url {url} 対象のURL文字列（任意）
 */
 function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}