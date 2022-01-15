// http://api.nbp.pl/
import { validateValue } from "./validation.js";
window.addEventListener("DOMContentLoaded", (e) => {
  let loadedData;
  const amount = document.getElementById("amount");
  const changeOperations = document.querySelector(".exchangeForm__operations");
  const radios = document.querySelectorAll("input[name='operation']");
  const exchangeForm = document.querySelector(".exchangeForm");
  const selctions = document.getElementById("slection");
  const finalCalculation = document.querySelector(
    ".exchangeForm__finalCalculation"
  );
  const resultMessage = document.querySelector(".result__text");
  const resultValue = document.querySelector(".result__value");
  let selectionValue;

  // const api_url_tableA =
  //   "http://api.nbp.pl/api/exchangerates/tables/a/?format=json";
  // const api_url_tableB =
  //   "http://api.nbp.pl/api/exchangerates/tables/b/?format=json";
  const api_url_tableC = "https://api.nbp.pl/api/exchangerates/tables/c";

  async function getApi(url) {
    try {
      const response = await fetch(url);
      let data = await response.json();
      data = data.values().next().value;
      loadedData = data;
      showTable(data);
      determinValuesOfSelectTag(data);
    } catch {
      console.log("Error occured while loading NBP API. (404 not found)");
      let table = document.querySelector(".table");
      let header = document.querySelector(".table__header");
      let tableContent = document.querySelector(".table__content");
      table.removeChild(tableContent);
      header.textContent = "Can not load a table. 404 not found.";
    }
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
          <td class="table__content--currency">${c.currency} </td>
          <td class="table__content--item">${c.code}</td>
          <td class="table__content--item">${c.bid.toFixed(4)}</td>
          <td class="table__content--item">${c.ask.toFixed(4)}</td>
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

    resultMessage.textContent = "Średnio otrzymasz";
  }

  // let result = (selection, amount, e) => selection.value * amount;

  function checkRadioButtons() {
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        let radio = radios[i].value;
        finalCalculation.hidden = false;
        // if (target == "sell") {
        //   amount.placeholder = "Kwota jaką chcesz wymienić";
        // } else {
        //   amount.placeholder = "Kwota jaką chcesz otrzymać";
        // }
        return radios[i].value;
      }
    }
    return;
  }

  var operationValue;
  changeOperations.addEventListener("change", (e) => {
    finalCalculation.hidden = false;
    resultValue.hidden = true;
    let target = e.target.value;
    operationValue = target;
    // if (target == "sell") {
    //   amount.placeholder = "Kwota jaką chcesz wymienić";
    // } else {
    //   amount.placeholder = "Kwota jaką chcesz otrzymać";
    // }
    finalCalculation.hidden = false;
    determinValuesOfSelectTag(loadedData, target);
  });

  function result(selectedOpr, amount, selectedCurrency) {
    if (selectedOpr == "sell") {
      return (amount * selectedCurrency.value).toFixed(2).toString() + " PLN";
    }
    let result = selectedCurrency.options[selectedCurrency.selectedIndex].text;
    return (
      (amount / selectedCurrency.value).toFixed(2).toString() +
      " " +
      result.substring(0, 3)
    );
  }

  selctions.addEventListener("change", (e) => {
    hideMessage();
  });

  exchangeForm.addEventListener("submit", (e) => {
    let value = amount.value;
    if (!validateValue(value)) {
      resultValue.textContent = "";
      hideMessage();
      return;
    }
    resultMessage.hidden = false;
    resultValue.hidden = false;
    resultValue.textContent = result(operationValue, value, selctions);
    // resultValue.textContent = result(selctions, value, e).toFixed(2) + " PLN";
  });

  let hideMessage = () => {
    resultMessage.hidden = true;
    resultValue.hidden = true;
  };

  var selectedRadio = checkRadioButtons();
  getApi(api_url_tableC);
});
