const buttonCreate = document.getElementById("createChart");
const buttonSortOrder = document.getElementById("sortColumnsOrder");
const buttonSortDom = document.getElementById("sortColumnsDom");
const input = document.querySelector(".сhartInp");

function printColumns(array) {
  const container = document.querySelector(".container");
  container.querySelectorAll(".column").forEach((column) => column.remove());

  for (let i = 0; i < array.length; i++) {
    const newColumn = document.createElement("div");
    newColumn.classList.add("column");
    newColumn.style.height = `${(array[i] / Math.max(...array)) * 100 + 20}px`;
    newColumn.textContent = array[i];
    container.appendChild(newColumn);
  }
}

function createChart() {
  const input = document.querySelector(".сhartInp");
  const validArray = getValidArray(input.value);

  printColumns(validArray);
  if (validArray.length > 1) showBtnSort(true);
}

function sortChartOrder() {
  const container = document.querySelector(".container");
  const columnsArray = container.querySelectorAll(".column");

  columnsArray.forEach((column) => {
    column.style.order = column.textContent;
  });
  showBtnSort(false);
}

function sortChartDom() {
  const container = document.querySelector(".container");
  const columns = container.getElementsByClassName("column");

  for (let i = 0; i < columns.length; i++) {
    for (let j = 1; j < columns.length - i; j++) {
      const firstColumn = columns[j - 1];
      const secondColumn = columns[j];
      const firstNumber = Number(firstColumn.textContent);
      const secondNumber = Number(secondColumn.textContent);

      if (firstNumber > secondNumber) {
        firstColumn.before(secondColumn);
      }
    }
  }
  showBtnSort(false);
}

function getValidArray(value) {
  const arrayNumb = value.split(" ").filter(function (val) {
    if (val !== " " && isFinite(Number(val))) {
      return val;
    }
  });

  return arrayNumb.map((string) => Number(string));
}

function clearHistory() {
  showBtnCreate(false);
  showBtnSort(false);
  printColumns([]);
}

function validation() {
  const input = document.querySelector(".сhartInp");
  const array = getValidArray(input.value);

  if (array.length > 0) showBtnCreate(true);
  if (array.length == 0) clearHistory();
  if (array.length == 1) showBtnSort(false);
}

function showBtnCreate(isOpen) {
  const buttonCreate = document.getElementById("createChart");

  buttonCreate.disabled = !isOpen;
}

function showBtnSort(isShow) {
  const buttonSortOrder = document.getElementById("sortColumnsOrder");
  const buttonSortDom = document.getElementById("sortColumnsDom");

  buttonSortDom.disabled = !isShow;
  buttonSortOrder.disabled = !isShow;
}

buttonCreate.addEventListener("click", createChart);
buttonSortOrder.addEventListener("click", sortChartOrder);
buttonSortDom.addEventListener("click", sortChartDom);
input.addEventListener("input", validation);
