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
