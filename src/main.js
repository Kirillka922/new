const buttonCreate = document.getElementById("createChart");
const buttonSortDom = document.getElementById("sortColumnsDom");
const input = document.querySelector(".сhartInp");

function printColumns(array) {
  const container = document.querySelector(".container");
  container.querySelectorAll(".column").forEach((column) => column.remove());

  for (let i = 0; i < array.length; i++) {
    const newColumn = document.createElement("div");
    newColumn.classList.add("column");
    newColumn.style.left = `${50 * i + 8 + 5 * i}px`;
    newColumn.style.height = `${(array[i] / Math.max(...array)) * 100 + 20}px`;
    newColumn.textContent = array[i];
    container.appendChild(newColumn);
  }
}

function createChart() {
  const columns = getColumns();
  if (columns.length !== 0) {
    if (isSortAttrib()) return;
  }
  const input = document.querySelector(".сhartInp");
  const validArray = getValidArray(input.value);

  printColumns(validArray);
  if (validArray.length > 1) showBtnSort(true);
  showBtnCreate(false);
}

function replacementCord(firstColumn, secondColumn) {
  const firstCord = firstColumn.getBoundingClientRect().left;
  const secondCord = secondColumn.getBoundingClientRect().left;
  [firstColumn.style.left, secondColumn.style.left] = [
    `${secondCord}px`,
    `${firstCord}px`,
  ];
}

function getColumns() {
  const container = document.querySelector(".container");
  return container.querySelectorAll(".column");
}

function getColumsWithSort() {
  const columns = getColumns();

  let columnsArray = Array.from(columns);
  columnsArray = columnsArray.map((column) => [
    column,
    column.getBoundingClientRect().left,
  ]);
  columnsArray.sort(function (a, b) {
    return a[1] - b[1];
  });
  return columnsArray;
}

function isSortAttrib() {
  const columns = getColumns();
  for (let i = 0; i < columns.length; i++) {
    if (columns[i].hasAttribute("sort")) return true;
  }
  return false;
}

function sortingElements(position, cycleNumber) {
  const columnsArray = getColumsWithSort();

  if (cycleNumber > columnsArray.length - 1) {
    const columns = getColumns();
    for (let i = 0; i < columns.length; i++) {
      columns[i].removeAttribute("sort");
    }
    showBtnCreate(true);
  }

  if (cycleNumber > columnsArray.length - 1) return false;

  const firstColumn = columnsArray[position - 1][0];
  const secondColumn = columnsArray[position][0];
  const firstNumber = Number(firstColumn.textContent);
  const secondNumber = Number(secondColumn.textContent);

  position++;
  const lengthRow = columnsArray.length - cycleNumber - 1;
  if (position > lengthRow) {
    position = 1;
    cycleNumber++;
  }

  if (firstNumber > secondNumber) {
    replacementCord(firstColumn, secondColumn);

    setTimeout(() => sortingElements(position, cycleNumber), 2000);
  } else {
    sortingElements(position, cycleNumber);
  }
}

function sortChartDom() {
  if (isSortAttrib()) return;
  const columns = getColumns();
  for (let i = 0; i < columns.length; i++) {
    columns[i].setAttribute("sort", "true");
  }
  const iterationNumb = 1;
  const cycleNumber = 0;
  sortingElements(iterationNumb, cycleNumber);

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
  const buttonSortDom = document.getElementById("sortColumnsDom");

  buttonSortDom.disabled = !isShow;
}

buttonCreate.addEventListener("click", createChart);
buttonSortDom.addEventListener("click", sortChartDom);
input.addEventListener("input", validation);
