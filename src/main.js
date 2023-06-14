const buttonCreate = document.getElementById("createChart");
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
    const leftForColumn = newColumn.offsetWidth * i;
    const staticIndent = 6;
    const indentForColumn = (1 + i) * staticIndent;
    newColumn.style.left = `${leftForColumn + indentForColumn}px`;
  }
}

function createChart() {
  const columns = getColumns();

  if (columns.length !== 0) {
    clearHistory();
  }
  const validArray = getValidArray();

  printColumns(validArray);
  if (validArray.length > 1) showBtnSort(true);
}

function sortChartDom() {
  if (checkSortAttrib()) return;
  setSortAttrib();
  sortChart();

  showBtnSort(false);
}

function sortChart() {
  let position = 0;
  let cycleNumber = 1; //it is easier to start with a number one because cycle number can't be 0
  //in opposite case we should correct a cycle number later
  let seInterv = setInterval(() => runSorting(), 1000);

  let columnsArray = Array.from(getColumns());

  function runSorting() {
    if (!checkSortAttrib()) {
      clearInterval(seInterv);
      return;
    }

    if (cycleNumber > columnsArray.length - 1) {
      removeSortAttribute();
      clearInterval(seInterv);
      showBtnCreate(true);
      paintNextElements([]);

      return false;
    }
    const firstColumn = columnsArray[position];
    const secondColumn = columnsArray[position + 1];
    paintNextElements(firstColumn, secondColumn);

    const firstNumber = Number(firstColumn.textContent); //we need to get numbers inside of columns for check
    const secondNumber = Number(secondColumn.textContent);

    if (firstNumber > secondNumber) {
      columnsArray = replacementColumns(columnsArray, position);
    }
    position++;
    const lengthArray = columnsArray.length - 1;
    const lastNumberForSort = lengthArray - cycleNumber;

    if (position > lastNumberForSort) {
      position = 0;
      cycleNumber++;
    }
  }
}

function paintNextElements(...arguments) {
  const allColumns = getColumns();
  allColumns.forEach((column) => {
    column.classList.remove("columnSort");
  });

  if (arguments.length > 1) {
    arguments.forEach((column) => {
      column.classList.add("columnSort");
    });
  }
}

function replacementColumns(columnsArray, position) {
  const firstColumn = columnsArray[position];
  const secondColumn = columnsArray[position + 1];

  [columnsArray[position], columnsArray[position + 1]] = [
    columnsArray[position + 1],
    columnsArray[position],
  ];

  const firstCord =
    firstColumn.getBoundingClientRect().left + window.pageXOffset; //if we will have a long row of columns we need to exclude scroll
  const secondCord =
    secondColumn.getBoundingClientRect().left + window.pageXOffset;
  [firstColumn.style.left, secondColumn.style.left] = [
    `${secondCord}px`,
    `${firstCord}px`,
  ];

  return columnsArray;
}

function getColumns() {
  const container = document.querySelector(".container");
  return container.querySelectorAll(".column");
}

function checkSortAttrib() {
  const container = document.querySelector(".container");
  if (container.hasAttribute("sort")) return true;
  return false;
}

function setSortAttrib() {
  const container = document.querySelector(".container");
  container.setAttribute("sort", "true");
}

function removeSortAttribute() {
  const container = document.querySelector(".container");
  container.removeAttribute("sort");
}

function getValidArray() {
  const input = document.querySelector(".сhartInp");

  const arrayNumb = input.value.split(" ").filter(function (val) {
    if (val !== " " && isFinite(Number(val))) {
      return val;
    }
  });

  return arrayNumb.map((string) => Number(string));
}

function clearHistory() {
  showBtnSort(false);
  printColumns([]);
  removeSortAttribute();
}

function validation() {
  const array = getValidArray();

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
