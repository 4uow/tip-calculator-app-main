const billInput = document.querySelector("#bill");
const tipRadios = document.querySelectorAll('input[name="tip"][type="radio"]');
const peopleInput = document.querySelector("#number-of-people");
const customTipInput = document.querySelector("#tip-custom");
const resetButton = document.querySelector("#reset");
const form = document.querySelector("#tip-form");
const tipAmountOutput = document.querySelector("#tip-amount");
const totalAmountOutput = document.querySelector("#total");


const errorMessageForPeople = document.createElement("span");
errorMessageForPeople.id = "people-error";
errorMessageForPeople.className = "error-message";
errorMessageForPeople.hidden = true;

const peopleLabel = document.querySelector("label[for='number-of-people']");

const LabelRow = document.createElement("div");

LabelRow.className = "label-row";

Object.assign(LabelRow.style,{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
});

peopleLabel.before(LabelRow);
LabelRow.appendChild(peopleLabel);
LabelRow.appendChild(errorMessageForPeople);


Object.assign(errorMessageForPeople.style, {
    color: "rgb(238, 17, 119)",
    fontSize: "0.8rem",
});

function updateCalculations(){
    const bill = billInput.valueAsNumber;
    const people = peopleInput.valueAsNumber;
    const selectedTip = document.querySelector('input[name="tip"][type="radio"]:checked');
    const tipPercent = customTipInput.value !== "" ? customTipInput.valueAsNumber : Number(selectedTip?.value ?? 0);

    const correctPeopleInput = peopleInput.value !== "" && (Number.isInteger(people) && people > 0);

    tipRadios.forEach((radio) => {
        const span = radio.nextElementSibling;
        span.style.backgroundColor = radio.checked ? "#9FE8DF" : "";
        span.style.color = radio.checked ? "#00474B" : "";
    });

    errorMessageForPeople.textContent = people === 0 ? "Can't be zero" : "Must be a positive integer";

    errorMessageForPeople.hidden = peopleInput.value === "" || correctPeopleInput;

    const hasInput = billInput.value !== "" || peopleInput.value !== "" || customTipInput.value !== "" || selectedTip !== null;

    resetButton.disabled = !hasInput;

    tipAmountOutput.textContent = "$0.00";
    totalAmountOutput.textContent = "$0.00";

    if (!correctPeopleInput || bill <= 0 || !Number.isFinite(bill) || people <= 0 || !Number.isFinite(people) || tipPercent < 0 || !Number.isFinite(tipPercent) ) {
        return;
    }

    const tipAmount = (bill * tipPercent / 100)/ people;

    const totalAmount = (bill / people) + tipAmount;

    if(!Number.isFinite(tipAmount) || !Number.isFinite(totalAmount)){
        return;
    }

    tipAmountOutput.textContent = `$${tipAmount.toFixed(2)}`;
    totalAmountOutput.textContent = `$${totalAmount.toFixed(2)}`;

};

billInput.addEventListener("input", updateCalculations);
peopleInput.addEventListener("input", updateCalculations);
customTipInput.addEventListener("input", updateCalculations);

tipRadios.forEach((radio) => {
    radio.addEventListener("change", 
        () => {customTipInput.value = "";updateCalculations();});
    
});

customTipInput.addEventListener("input", () => {
    tipRadios.forEach((radio) => {
        radio.checked = false;
    });

    updateCalculations();
});

form.addEventListener("reset",() => {
    setTimeout(updateCalculations, 0);
})

form.addEventListener("submit",(event) => {
    event.preventDefault();
    updateCalculations();
});

updateCalculations();