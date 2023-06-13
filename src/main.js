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
    const identForColumn = (1 + i) * 5;
    newColumn.style.left = `${leftForColumn + identForColumn}px`;
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
  if (checSortAttrib()) return;
  setSortAttrib();

  const iterationNumb = 0;
  const cycleNumber = 0;
  sortingElements(iterationNumb, cycleNumber);

  showBtnSort(false);
}

function sortingElements(position, cycleNumber) {
  let seInterv = setInterval(() => runSorting(), 1000);

  const columnsArray = Array.from(getColumns());

  function runSorting() {
    console.log("hi");
    if (!checSortAttrib()) {
      clearInterval(seInterv);
      return;
    }

    if (cycleNumber > columnsArray.length - 1) {
      removeSortAttribute();
      clearInterval(seInterv);
      showBtnCreate(true);

      return false;
    }

    const firstColumn = columnsArray[position];
    const secondColumn = columnsArray[position + 1];
    const firstNumber = Number(firstColumn.textContent); //we need to get numbers inside of columns for check
    const secondNumber = Number(secondColumn.textContent);

    if (firstNumber > secondNumber) {
      replacementColumns(firstColumn, secondColumn);
      [columnsArray[position], columnsArray[position + 1]] = [
        columnsArray[position + 1],
        columnsArray[position],
      ];
    }
    position++;
    const lengthRow = columnsArray.length - 1 - cycleNumber - 1;

    if (position > lengthRow) {
      position = 0;
      cycleNumber++;
    }
  }
}

function replacementColumns(firstColumn, secondColumn) {
  const firstCord =
    firstColumn.getBoundingClientRect().left + window.pageXOffset; //if we will have a long row of columns we need to exclude scroll
  const secondCord =
    secondColumn.getBoundingClientRect().left + window.pageXOffset;
  [firstColumn.style.left, secondColumn.style.left] = [
    `${secondCord}px`,
    `${firstCord}px`,
  ];
}

function compareNewArray() {
  const massVals = [];
  getColumns().forEach((column, i) => {
    massVals[i] = column.textContent;
  });
  return massVals.toString() == getValidArray().toString();
}

function getColumns() {
  const container = document.querySelector(".container");
  return container.querySelectorAll(".column");
}

function checSortAttrib() {
  const columns = getColumns();
  if (!columns[0]) return false;
  if (columns[0].hasAttribute("sort")) return true;
  return false;
}

function setSortAttrib() {
  const columns = getColumns();
  columns[0].setAttribute("sort", "true");
}

function removeSortAttribute() {
  const columns = getColumns();
  columns[0].removeAttribute("sort");
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
