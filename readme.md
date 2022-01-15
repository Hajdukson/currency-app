# Currency app (college project)

This application uses [NBP API](http://api.nbp.pl/) to GET current exchange rates from [table C](http://api.nbp.pl/api/exchangerates/tables/c)

## Features

- calculates the amount of PLN to selected currency and reverse
  You can see live demo [here](https://michal-hajduk-currency-app.netlify.app/)

# Examples of code

1. Validation of input[type=number] field

```javascript
const errorMessage = document.querySelector(
  ".exchangeForm__inputAndSubmit--error"
);
const succes = document.getElementById("succes");
const info = document.getElementById("error");
const input = document.getElementById("amount");

let validateValue = (value) => {
  let regex = /[0-9]*/;
  let isNumber = regex.test(value);
  if (!isNumber) {
    errorMessage.textContent = errorHanddler("Wprowadź tylko liczby.");
    return false;
  }

  let val = parseFloat(value);

  if (isNaN(val) || val === 0) {
    errorMessage.textContent = errorHanddler("Pole nie może być puste.");
    return false;
  } else if (val < 0) {
    errorMessage.textContent = errorHanddler("Kwota nie może być ujemna.");
    return false;
  }
  info.style.visibility = "hidden";
  succes.style.visibility = "visible";
  errorMessage.style.visibility = "hidden";
  input.classList.remove("error");
  input.className = "succes";
  return true;
};

let errorHanddler = (message) => {
  info.style.visibility = "visible";
  succes.style.visibility = "hidden";
  input.className = "error";
  errorMessage.style.visibility = "visible";
  return message;
};

export { validateValue };
```

2. That peice is resposible for a getting API and loadding them to a table

```javascript
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
```

3. You can choose between two radio buttons that determine which value will be returned

```javascript
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
```

4. Event lisner responsible for submitting

```javascript
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
});
```

Feel free to check out the rest of the code
