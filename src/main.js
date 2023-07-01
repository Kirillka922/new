const MINIMUM_HEIGHT = 20;
const ANIMATION_INTERVAL = 700;

function init() {
  const buttonCreate = document.getElementById("createChart");
  const buttonSortForward = document.getElementById("sortForward");
  const buttonSortBack = document.getElementById("sortBack");
  const input = document.querySelector(".сhartInp");
  const container = document.querySelector(".container");

  let intervalTimerId = null;
  let position = 0;
  let cycleNumber = 1;
  let columnsArray = [];
  let arraySortMap = [];

  function printColumns(array) {
    container.querySelectorAll(".column").forEach((column) => column.remove());

    for (let i = 0; i < array.length; i++) {
      const heightColumn =
        (array[i] / Math.max(...array)) * 100 + MINIMUM_HEIGHT;
      const newColumn = document.createElement("div");
      newColumn.classList.add("column");
      newColumn.style.height = `${heightColumn}px`;
      newColumn.textContent = array[i];
      container.appendChild(newColumn);
      const leftForColumn = newColumn.offsetWidth * i;
      const indentForColumn = 1 + i;
      newColumn.style.left = `${leftForColumn + indentForColumn}px`;
    }
  }

  function createChart() {
    columns = container.querySelectorAll(".column");
    if (columns.length !== 0) {
      clearHistory();
    }

    const validArray = getValidArray();
    printColumns(validArray);

    columns = container.querySelectorAll(".column");
    columns = Array.from(columns);
    columnsArray = columns.map(function (column) {
      // it will be our data storage structure
      return { column: column, left: column.offsetLeft };
    });

    if (validArray.length > 1) showBtnSort(true);
  }

  function recolorColumn(column) {
    const isClassSort = column.classList.contains("columnSort");
    if (isClassSort) {
      column.classList.remove("columnSort");
      column.classList.add("columnEndSort");
      intervalTimerId = setTimeout(
        () => column.classList.remove("columnEndSort"),
        ANIMATION_INTERVAL
      );
    }
  }

  function sortChartForward() {
    const columnLength = columnsArray.length - 1;
    if (cycleNumber > columnLength - 1) {
      return;
    }

    const lastNumberForSort = columnLength - cycleNumber;
    if (position > lastNumberForSort) {
      position = 0;
      cycleNumber++;
    }

    if (position > 0) {
      const column = columnsArray[position - 1].column;
      recolorColumn(column);
    }
    const isNewIteration = position === 0 && cycleNumber > 1;

    if (!lastNumberForSort < 3 && isNewIteration) {
      const column = columnsArray[lastNumberForSort + 1].column;
      recolorColumn(column);
    }
    if (!lastNumberForSort < 4 && isNewIteration) {
      const column = columnsArray[lastNumberForSort].column;
      recolorColumn(column);
    }

    const firstColumnArray = columnsArray[position];
    const secondColumnArray = columnsArray[position + 1];
    const firstColumn = firstColumnArray.column;
    const secondColumn = secondColumnArray.column;
    const firstNumber = Number(firstColumn.textContent);
    const secondNumber = Number(secondColumn.textContent);

    const isReplace = firstNumber > secondNumber;

    arraySortMap.push(isReplace);

    if (isReplace) {
      [columnsArray[position].column, columnsArray[position + 1].column] = [
        secondColumn,
        firstColumn,
      ];
    }

    position++;

    firstColumn.classList.add("columnSort");
    secondColumn.classList.add("columnSort");

    intervalTimerId = setTimeout(
      () => replaceElements(firstColumnArray, secondColumnArray, isReplace),
      ANIMATION_INTERVAL
    );
  }

  function sortChartBack() {
    if (position === 0 && cycleNumber === 1) return;

    const lastNumberForSort = columnsArray.length + 1 - cycleNumber;
    if (position === 0) {
      position = lastNumberForSort;
      cycleNumber--;
    }

    if (position !== columnsArray.length - 1) {
      const column = columnsArray[position + 1].column;
      recolorColumn(column);
    }

    const isEndIteration = position === lastNumberForSort;

    if (lastNumberForSort > 1 && isEndIteration) {
      const column = columnsArray[0].column;
      recolorColumn(column);
    }
    if (lastNumberForSort > 2 && isEndIteration) {
      const column = columnsArray[1].column;
      recolorColumn(column);
    }

    const firstColumnArray = columnsArray[position];
    const secondColumnArray = columnsArray[position - 1];
    const firstColumn = firstColumnArray.column;
    const secondColumn = secondColumnArray.column;
    const isReplace = arraySortMap[arraySortMap.length - 1];

    arraySortMap.pop();

    if (isReplace) {
      [columnsArray[position].column, columnsArray[position - 1].column] = [
        secondColumn,
        firstColumn,
      ];
    }

    position--;

    firstColumn.classList.add("columnSort");
    secondColumn.classList.add("columnSort");

    intervalTimerId = setTimeout(
      () => replaceElements(firstColumnArray, secondColumnArray, isReplace),
      ANIMATION_INTERVAL
    );
  }

  function replaceElements(firstColumnArray, secondColumnArray, isReplace) {
    if (isReplace) {
      firstColumnArray.column.style.left = `${firstColumnArray.left}px`;
      secondColumnArray.column.style.left = `${secondColumnArray.left}px`;

      intervalTimerId = setTimeout(() => {
        secondColumnArray.column.classList.remove("columnSort");
        firstColumnArray.column.classList.remove("columnSort");
      }, ANIMATION_INTERVAL);
    } else {
      intervalTimerId = setTimeout(() => {
        secondColumnArray.column.classList.remove("columnSort");
        firstColumnArray.column.classList.remove("columnSort");
      }, ANIMATION_INTERVAL);
    }
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
    arraySortMap = [];
    position = 0;
    cycleNumber = 1;
    clearTimeout(intervalTimerId);
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
    buttonSortForward.disabled = !isShow;
    buttonSortBack.disabled = !isShow;
  }

  buttonCreate.addEventListener("click", createChart);
  input.addEventListener("input", validation);
  buttonSortForward.addEventListener("click", sortChartForward);
  buttonSortBack.addEventListener("click", sortChartBack);
}
init();
