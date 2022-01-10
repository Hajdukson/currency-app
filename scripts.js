// http://api.nbp.pl/
window.addEventListener("DOMContentLoaded", (e) => {
  var datas;

  var changeOperations = document.querySelector(".exchangeForm__operations");
  var radios = document.querySelectorAll("input[name='operation']");
  var exchangeForm = document.querySelector(".exchangeForm");
  var selctions = document.getElementById("slection");
  var finalCalculation = document.querySelector(
    ".exchangeForm__finalCalculation"
  );
  var resultMessage = document.querySelector(".result__text");
  var resultValue = document.querySelector(".result__value");
  var selectionValue;

  // const api_url_tableA =
  //   "http://api.nbp.pl/api/exchangerates/tables/a/?format=json";
  // const api_url_tableB =
  //   "http://api.nbp.pl/api/exchangerates/tables/b/?format=json";
  const api_url_tableC =
    "https://api.nbp.pl/api/exchangerates/tables/c/?format=json";

  async function getApi(url) {
    const response = await fetch(url);
    var data = await response.json();
    datas = data.values().next().value;
    showTable(datas);
    determinValuesOfSelectTag(datas);
  }

  function showTable(data) {
    let tab = `<tr>
          <th>Waluta</th>
          <th>Kod</th>
          <th>Kurs kupna</th>
          <th>Kurs sprzedarzy</th>
          </tr>`;

    for (let c of data.rates) {
      tab += `<tr> 
          <td class="table__currency">${c.currency} </td>
          <td class="table__item">${c.code}</td>
          <td class="table__item">${c.bid.toFixed(4)}</td>
          <td class="table__item">${c.ask.toFixed(4)}</td>
          </tr>`;
    }
    document.getElementById("currenciesTable").innerHTML = tab;
  }

  function determinValuesOfSelectTag(data, target = selectedRadio) {
    resultMessage.hidden = true;
    for (let c of data.rates) {
      selctions.remove(c.code + "(" + c.currency + ")");
    }

    for (let c of data.rates) {
      selectionValue = document.createElement("option");
      selectionValue.append(
        document.createTextNode(c.code + "(" + c.currency + ")")
      );
      if (target == "sell") {
        selectionValue.value = c.bid;
      } else if (target == "buy") {
        selectionValue.value = c.ask;
      }
      selctions.append(selectionValue);
    }

    if (target == "sell") {
      resultMessage.textContent = "Otrzymasz";
    } else if (target == "buy") {
      resultMessage.textContent = "Musisz zapłacić";
    }
  }

  let result = (selection, amount, e) => selection.value * amount;

  function checkRadioButtons() {
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        finalCalculation.hidden = false;
        return radios[i].value;
      }
    }
    return;
  }

  changeOperations.addEventListener("change", (e) => {
    finalCalculation.hidden = false;
    resultValue.hidden = true;
    let target = e.target.value;
    determinValuesOfSelectTag(datas, target);
  });

  selctions.addEventListener("change", (e) => {
    resultMessage.hidden = true;
    resultValue.hidden = true;
  });

  exchangeForm.addEventListener("submit", (e) => {
    let amount = document.getElementById("amount").value;
    resultMessage.hidden = false;
    resultValue.hidden = false;
    console.log(document.createTextNode(result(selctions, amount, e)));
    resultValue.textContent = result(selctions, amount, e).toFixed(4);
  });

  var selectedRadio = checkRadioButtons();
  getApi(api_url_tableC);
});
