const form = document.querySelector("#tip-form");
const billInput = document.querySelector("#bill");
const peopleInput = document.querySelector("#number-of-people");
const customTipInput = document.querySelector("#tip-custom");
const tipRadios = document.querySelectorAll('input[name="tip"][type="radio"]');
const tipAmountOutput = document.querySelector("#tip-amount");
const totalAmountOutput = document.querySelector("#total");
const resetButton = document.querySelector("#reset");
const peopleLabel = document.querySelector("label[for='number-of-people']");
const peopleWrapper = peopleInput.closest(".input-wrapper");

const labelRow = document.createElement("div");
labelRow.className = "label-row";

Object.assign(labelRow.style, {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

peopleLabel.before(labelRow);
labelRow.appendChild(peopleLabel);

peopleLabel.style.marginBottom = "0";

const errorMessage = document.createElement("span");
errorMessage.id = "people-error";
errorMessage.className = "error-message";
errorMessage.hidden = true;

Object.assign(errorMessage.style,{
  color: "rgb(238, 17, 119)",
  fontSize: "0.8rem",
})

labelRow.appendChild(errorMessage);

peopleInput.setAttribute("aria-describedby", "people-error");

function updataCalculations() {
  const bill = billInput.valueAsNumber;
  const people = peopleInput.valueAsNumber;

  const selectedTip = form.querySelector('input[name="tip"][type="radio"]:checked');

  const tipPercent = customTipInput.value !== "" ? customTipInput.valueAsNumber : Number(selectedTip?.value ?? 0);

  const invalidPeople = peopleInput.value !== ""  && (!Number.isInteger(people) || people <= 0);
  
  errorMessage.hidden = !invalidPeople;
  errorMessage.textContent = people === 0 ? "Can't be zero" : "Must be a positive integer";

  peopleWrapper.style.outline = invalidPeople ? "2px solid rgb(238, 17, 119)" : "none";

  peopleInput.ariaInvalid = invalidPeople;

  tipRadios.forEach((radio) => {
    const span = radio.nextElementSibling;

    span.style.backgroundColor = radio.checked ? "#9FE8DF" : "";

    span.style.color = radio.checked ? "hsl(183, 100%, 15%)" : "";

  });

  const hasInput = billInput.value !== "" || peopleInput.value !== "" || customTipInput.value !== "" || selectedTip !== null;

  resetButton.disabled = !hasInput;
  

  tipAmountOutput.textContent = "$0.00";
  totalAmountOutput.textContent = "$0.00";

  if(
    !Number.isFinite(bill) || bill <= 0 || !Number.isFinite(people) || people <= 0 || !Number.isFinite(tipPercent) || tipPercent < 0
  ){
    reurn;
  }

  const tipPerPerson = (bill * tipPercent/ 100) / people;
  const totalPerPerson = (bill / people) + tipPerPerson;

  if(
    !Number.isFinite(tipPerPerson) || !Number.isFinite(totalPerPerson)
){
    return;
}

  tipAmountOutput.textContent = `$${tipPerPerson.toFixed(2)}`;
  totalAmountOutput.textContent = `$${totalPerPerson.toFixed(2)}`;

}

billInput.addEventListener("input", updataCalculations);
peopleInput.addEventListener("input", updataCalculations);

tipRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    customTipInput.value = "";
    updataCalculations();
  });
})

customTipInput.addEventListener("input", () => {
  tipRadios.forEach((radio) => {
    radio.checked = false;
  });

  updataCalculations();
});

form.addEventListener("reset", () => {
  setTimeout(updataCalculations, 0);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  updataCalculations();
});

updataCalculations();