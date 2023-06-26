const buttonCreate = document.getElementById("createChart");
const buttonSortForward = document.getElementById("sortForward");
const buttonSortBack = document.getElementById("sortBack");
const input = document.querySelector(".сhartInp");
const MINIMUM_HEIGHT = 20;
const STATIC_INDENT = 1;
const ANIMATION_INTERVAL = 1000;

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
  sortChartDom();
}

function sortChartDom() {
  let intervalTimerId;
  buttonSortForward.addEventListener("click", sortForward);
  buttonSortBack.addEventListener("click", sortChartBack);
  const container = document.querySelector(".container");

  const sortObserverId = new MutationObserver(() => {
    buttonSortForward.removeEventListener("click", sortForward, false);
    buttonSortBack.removeEventListener("click", sortChartBack, false);
    container.removeAttribute("sort");
    if (intervalTimerId) clearTimeout(intervalTimerId);
  });
  sortObserverId.observe(container, { childList: true });

  let position = 0;
  let cycleNumber = 1;
  const columnsArray = Array.from(getColumns());
  const arraySortMap = [];
  let isReplace = true;

  function sortForward() {
    if (checkSortAttrib()) return;
    const columnLength = columnsArray.length - 1;

    if (cycleNumber > columnLength - 1) return;

    const container = document.querySelector(".container");
    container.setAttribute("sort", "true");

    const lastNumberForSort = columnLength - cycleNumber;
    if (position > lastNumberForSort) {
      position = 0;
      cycleNumber++;
    }

    const firstColumn = columnsArray[position];
    const secondColumn = columnsArray[position + 1];
    const firstNumber = Number(firstColumn.textContent);
    const secondNumber = Number(secondColumn.textContent);

    isReplace = firstNumber > secondNumber;

    if (isReplace) {
      [columnsArray[position], columnsArray[position + 1]] = [
        columnsArray[position + 1],
        columnsArray[position],
      ];
    }
    firstColumn.classList.add("columnSort");
    secondColumn.classList.add("columnSort");

    intervalTimerId = setTimeout(() => {
      replaceElements(firstColumn, secondColumn);
      arraySortMap.push(isReplace);
    }, ANIMATION_INTERVAL);

    position++;
  }

  function sortChartBack() {
    if (checkSortAttrib()) return;

    if (position === 0 && cycleNumber === 1) return;

    const container = document.querySelector(".container");
    container.setAttribute("sort", "true");

    const lastNumberForSort = columnsArray.length + 1 - cycleNumber;
    if (position === 0) {
      position = lastNumberForSort;
      cycleNumber--;
    }

    const firstColumn = columnsArray[position];
    const secondColumn = columnsArray[position - 1];

    isReplace = arraySortMap[arraySortMap.length - 1];

    if (isReplace) {
      [columnsArray[position], columnsArray[position - 1]] = [
        secondColumn,
        firstColumn,
      ];
    }

    firstColumn.classList.add("columnSort");
    secondColumn.classList.add("columnSort");

    intervalTimerId = setTimeout(() => {
      replaceElements(firstColumn, secondColumn);
      arraySortMap.pop();
    }, ANIMATION_INTERVAL);

    position--;
  }

  function replaceElements(firstColumn, secondColumn) {
    const container = document.querySelector(".container");
    if (isReplace) {
      const firstCord = firstColumn.offsetLeft;
      const secondCord = secondColumn.offsetLeft;
      [firstColumn.style.left, secondColumn.style.left] = [
        `${secondCord}px`,
        `${firstCord}px`,
      ];
      intervalTimerId = setTimeout(() => {
        firstColumn.classList.remove("columnSort");
        secondColumn.classList.remove("columnSort");

        container.removeAttribute("sort");
      }, ANIMATION_INTERVAL);
    } else {
      firstColumn.classList.remove("columnSort");
      secondColumn.classList.remove("columnSort");

      container.removeAttribute("sort");
    }
  }
}

function checkSortAttrib() {
  const container = document.querySelector(".container");
  if (container.hasAttribute("sort")) return true;
  return false;
}

function getColumns() {
  const container = document.querySelector(".container");
  return container.querySelectorAll(".column");
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
  const buttonSortForward = document.getElementById("sortForward");
  const buttonSortBack = document.getElementById("sortBack");
  buttonSortForward.disabled = !isShow;
  buttonSortBack.disabled = !isShow;
}

buttonCreate.addEventListener("click", createChart);
input.addEventListener("input", validation);
