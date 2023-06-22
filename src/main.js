const buttonCreate = document.getElementById("createChart");
const buttonSortDom = document.getElementById("sortColumnsDom");
const input = document.querySelector(".сhartInp");
const MINIMUM_HEIGHT = 20;
const STATIC_INDENT = 1;

function printColumns(array) {
  const container = document.querySelector(".container");
  container.querySelectorAll(".column").forEach((column) => column.remove());

  for (let i = 0; i < array.length; i++) {
    const heightColumn = (array[i] / Math.max(...array)) * 100 + MINIMUM_HEIGHT;
    const newColumn = document.createElement("div");
    newColumn.classList.add("column");
    newColumn.style.height = `${heightColumn}px`;
    newColumn.textContent = array[i];
    container.appendChild(newColumn);
    const leftForColumn = newColumn.offsetWidth * i;
    const indentForColumn = (1 + i) * STATIC_INDENT;
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

  const container = document.querySelector(".container");
  container.setAttribute("sort", "true");
  sortChart();

  showBtnSort(false);
}

function sortChart() {
  let position = 0;
  //it is easier to start with a number one because cycle number can't be 0
  //in opposite case we should correct a cycle number later
  let cycleNumber = 1;
  const columnsArray = Array.from(getColumns());

  function runSorting() {
    if (!checkSortAttrib()) {
      clearInterval(sortTimerId);
      return;
    }
    const lengthArray = columnsArray.length - 1;

    if (cycleNumber > lengthArray) {
      const container = document.querySelector(".container");
      container.removeAttribute("sort");
      clearInterval(sortTimerId);
      showBtnCreate(true);
      return;
    }

    const firstColumn = columnsArray[position];

    firstColumn.addEventListener("transitionend", replaceElements, {
      once: true,
    });

    const firstNumber = Number(firstColumn.textContent);
    firstColumn.classList.add("columnSort");

    const secondColumn = columnsArray[position + 1];
    const secondNumber = Number(secondColumn.textContent);
    secondColumn.classList.add("columnSort");

    if (firstNumber > secondNumber) {
      [columnsArray[position], columnsArray[position + 1]] = [
        columnsArray[position + 1],
        columnsArray[position],
      ];
    }

    function replaceElements() {
      if (firstNumber > secondNumber) {
        firstColumn.addEventListener(
          "transitionend",
          function () {
            firstColumn.classList.remove("columnSort");
            secondColumn.classList.remove("columnSort");
          },
          {
            once: true,
          }
        );

        //if we will have a long row of columns we need to exclude scroll
        const firstCord = firstColumn.offsetLeft;
        const secondCord = secondColumn.offsetLeft;
        [firstColumn.style.left, secondColumn.style.left] = [
          `${secondCord}px`,
          `${firstCord}px`,
        ];
      } else {
        firstColumn.classList.remove("columnSort");
        secondColumn.classList.remove("columnSort");
      }
    }

    position++;

    const lastNumberForSort = lengthArray - cycleNumber;

    if (position > lastNumberForSort) {
      position = 0;
      cycleNumber++;
    }
  }

  const sortTimerId = setInterval(() => runSorting(), 2000);
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
  const container = document.querySelector(".container");
  container.removeAttribute("sort");
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
