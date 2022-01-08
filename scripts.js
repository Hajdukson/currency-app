// http://api.nbp.pl/
window.addEventListener("DOMContentLoaded", (e) => {
  var exchangeForm = document.querySelector(".exchange-form");
  var types = document.querySelectorAll('input[name="operation"]');
  var bids = document.getElementById("bids");
  var bidValue;
  var asks = document.getElementById("asks");
  var askValue;

  // const api_url_tableA =
  //   "http://api.nbp.pl/api/exchangerates/tables/a/?format=json";
  // const api_url_tableB =
  //   "http://api.nbp.pl/api/exchangerates/tables/b/?format=json";
  const api_url_tableC =
    "http://api.nbp.pl/api/exchangerates/tables/c/?format=json";

  async function getApi(url) {
    const response = await fetch(url);
    var data = await response.json();
    var datas = data.values().next().value;
    showTable(datas);
    determineSelectionLists(datas);
  }

  function showTable(data) {
    // if slected == pln{
    // data.push() --> PLN currency
    // }
    let tab = `<tr>
          <th>Waluta</th>
          <th>Kod</th>
          <th>Kurs zakupu</th>
          <th>Kurs sprzedarzy</th>
          </tr>`;

    for (let c of data.rates) {
      tab += `<tr> 
          <td>${c.currency} </td>
          <td>${c.code}</td>
          <td>${c.bid}</td>
          <td>${c.ask}</td>
          </tr>`;
    }
    document.getElementById("currenciesTable").innerHTML = tab;
  }

  function determineSelectionLists(data) {
    for (let c of data.rates) {
      bidValue = document.createElement("option");
      bidValue.append(document.createTextNode(c.code + "(" + c.currency + ")"));
      bidValue.value = c.bid;
      bids.append(bidValue);
      askValue = document.createElement("option");
      askValue.append(document.createTextNode(c.code + "(" + c.currency + ")"));
      askValue.value = c.ask;
      asks.append(askValue);
    }
  }

  getApi(api_url_tableC);

  exchangeForm.addEventListener("change", (e) => {
    let target = e.target;
    if (target.id == "sell") {
      console.log("sell");
    } else {
      console.log("buy");
    }
  });
  exchangeForm.addEventListener("submit", (e) => {
    let amount = document.getElementById("amount").value;
    let selectedType;
    for (let rb of types) {
      if (rb.checked) {
        selectedType = rb.value;
        break;
      }
    }
    calculate(bids, asks, amount, selectedType, e);
  });

  function calculate(sellCurency, buyCurrency, amount, type, e) {
    console.log(sellCurency.value);
    console.log(buyCurrency.value);
    console.log(amount);
    console.log(type);
  }
});
