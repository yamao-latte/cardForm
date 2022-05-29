
let fincode = Fincode('p_test_ZGQyMTgzZDItNzgwYi00NjYxLWJhMTEtMjQxMmJkYmY4YWEwZjYwNDMyNzctNDYwMS00ODY3LTk1NzktZmQ1YjRjNDI3YjEwc18yMjA1MjgwMTUwNQ')
appearance = {layout: "vertical"}
console.log(fincode);
let ui = fincode.ui(appearance);

ui.create("payments", appearance);

ui.mount("fincode",'400');

const items = { amount: "150" };
let elements;
let payment;

initialize();
checkStatus();
      
// document
//     .querySelector("#fincode")
//     .addEventListener("submit", handleSubmit);

document.getElementById("submit").addEventListener('click', handleSubmit);      
// Fetches a payment intent and captures the client secret
async function initialize() {
    const response = await fetch("/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
    });
    const data= await response.json()
    console.log(data);
    payment={
        access_id: data.access_id,
        amount: data.amount,
        order_id: data.id,
        pay_type: data.pay_type
    }
    console.log(response.body);
    // response.json()
    // const { data } = response.json();
    // console.log(data);
}

async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let transaction;
    await ui.getFormData().then(result => {
        console.log(result);
        transaction={
            method: result.method,
            pay_times: result.payTimes,
            card_no: result.cardNo,
            security_code: result.CVC,
            expire: result.expire,
            access_id: payment.access_id,
            amount: payment.amount,
            id: payment.order_id,
            pay_type: payment.pay_type
            }
        
    });


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
    setTimeout(() => {setLoading(false);}, 1000);
    return false;
}
      
      // Fetches the payment intent status after payment submission
async function checkStatus() {
    const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
    );
    if (!clientSecret) {
        return;
    }
    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
    switch (paymentIntent.status) {
        case "succeeded":
        showMessage("Payment succeeded!");
        break;
        case "processing":
        showMessage("Your payment is processing.");
        break;
        case "requires_payment_method":
        showMessage("Your payment was not successful, please try again.");
        break;
        default:
        showMessage("Something went wrong.");
        break;
    }
}

      // ------- UI helpers -------
      
      function showMessage(messageText) {
        const messageContainer = document.querySelector("#fincode");      
        messageContainer.classList.remove("hidden");
        messageContainer.textContent = messageText;
      
        setTimeout(function () {
          messageContainer.classList.add("hidden");
          messageText.textContent = "";
        }, 4000);
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