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
  const input = document.querySelector(".сhartInp");
  const validArray = getValidArray(input.value);

  printColumns(validArray);
  if (validArray.length > 1) showBtnSort(true);
}

function sortChart() {
  const columnsArray = Array.from(document.getElementsByClassName("column"));

  const arrayNumb = columnsArray.map((column) => Number(column.textContent));
  arrayNumb.sort((a, b) => {
    return a - b;
  });

  arrayNumb.forEach((number, i) => {
    const filterColumns = columnsArray.filter(
      (column) => column.textContent == number && column.style.order == ""
    );
    const firstColumn = filterColumns[0];
    firstColumn.style.order = i;
  });

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
  const buttonSort = document.getElementById("sortChart");

  buttonSort.disabled = !isShow;
}

buttonCreate.addEventListener("click", createChart);
buttonSort.addEventListener("click", sortChart);
input.addEventListener("input", validation);
