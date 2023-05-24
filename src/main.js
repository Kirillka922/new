const buttonCreate = document.getElementById("createChart");
const buttonSort = document.getElementById("sortChart");
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
  const validArray = getValidArray();
  printColumns(validArray);
  if (validArray.length > 1) showBtnSort(true);
}

function sortChart() {
  const sortArray = getValidArray().sort((a, b) => {
    return a - b;
  });
  printColumns(sortArray);
}

function filterArray(array) {
  const arrayNumb = array.split(" ").filter(function (val) {
    if (val !== " " && isFinite(Number(val))) {
      return val;
    }
  });
  return arrayNumb.map((string) => Number(string));
}

function getValidArray() {
  const input = document.querySelector(".сhartInp");
  return filterArray(input.value);
}

function clearHistory() {
  showBtnCreate(false);
  showBtnSort(false);
  printColumns([]);
}

function validation() {
  const array = getValidArray();
  if (array.length > 0) showBtnCreate(true);
  if (array.length == 0) clearHistory();
  if (array.length == 1) showBtnSort(false);
}

function showBtnCreate(isOpen) {
  const buttonCreate = document.getElementById("createChart");
  if (isOpen) {
    buttonCreate.disabled = false;
  } else {
    buttonCreate.disabled = true;
  }
}

function showBtnSort(isShow) {
  const buttonSort = document.getElementById("sortChart");
  isShow ? (buttonSort.disabled = false) : (buttonSort.disabled = true);
}

buttonCreate.addEventListener("click", createChart);
buttonSort.addEventListener("click", sortChart);
input.addEventListener("input", validation);
