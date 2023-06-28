const MINIMUM_HEIGHT = 20;
const ANIMATION_INTERVAL = 400;
const CLICK_INTERVAL = 1000;

function init() {
  const buttonCreate = document.getElementById("createChart");
  const buttonSortForward = document.getElementById("sortForward");
  const buttonSortBack = document.getElementById("sortBack");
  const input = document.querySelector(".сhartInp");
  const container = document.querySelector(".container");

  let intervalTimerId = null;
  let clickIntervalId = null;
  let position = 0;
  let cycleNumber = 1;
  let columnsArray = [];
  let arraySortMap = [];
  let counterClick = 0;

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
    const columns = container.querySelectorAll(".column");
    if (columns.length !== 0) {
      clearHistory();
    }

    const validArray = getValidArray();
    printColumns(validArray);

    columnsArray = getColumns();
    if (validArray.length > 1) showBtnSort(true);
  }

  function sortChartForward() {
    const columnLength = columnsArray.length - 1;

    const lastNumberForSort = columnLength - cycleNumber;
    if (position > lastNumberForSort) {
      position = 0;
      cycleNumber++;
    }

    const firstColumnArray = columnsArray[position];
    const secondColumnArray = columnsArray[position + 1];
    const firstColumn = firstColumnArray[0];
    const secondColumn = secondColumnArray[0];
    const firstNumber = Number(firstColumnArray[0].textContent);
    const secondNumber = Number(secondColumnArray[0].textContent);

    const isReplace = firstNumber > secondNumber;

    if (isReplace) {
      //we can't do these moves in replaceElements function because we need change
      //values without a delay in the synchronized actions
      [columnsArray[position][0], columnsArray[position + 1][0]] = [
        secondColumn,
        firstColumn,
      ];
    }
    arraySortMap.push(isReplace);

    firstColumn.classList.add("columnSort");
    secondColumn.classList.add("columnSort");

    intervalTimerId = setTimeout(
      () => replaceElements(firstColumnArray, secondColumnArray, isReplace),
      ANIMATION_INTERVAL
    );
    position++;
  }

  function sortChartBack() {
    const lastNumberForSort = columnsArray.length + 1 - cycleNumber;
    if (position === 0) {
      position = lastNumberForSort;
      cycleNumber--;
    }

    const firstColumnArray = columnsArray[position];
    const secondColumnArray = columnsArray[position - 1];
    const firstColumn = firstColumnArray[0];
    const secondColumn = secondColumnArray[0];
    const isReplace = arraySortMap[arraySortMap.length - 1];

    if (isReplace) {
      [columnsArray[position][0], columnsArray[position - 1][0]] = [
        secondColumn,
        firstColumn,
      ];
    }
    arraySortMap.pop();

    firstColumn.classList.add("columnSort");
    secondColumn.classList.add("columnSort");

    intervalTimerId = setTimeout(
      () => replaceElements(firstColumnArray, secondColumnArray, isReplace),
      ANIMATION_INTERVAL
    );

    position--;
  }

  function replaceElements(firstColumnArray, secondColumnArray, isReplace) {
    const firstColumn = firstColumnArray[0];
    const secondColumn = secondColumnArray[0];

    if (isReplace) {
      const firstCord = firstColumnArray[1];
      const secondCord = secondColumnArray[1];

      firstColumn.style.left = `${firstCord}px`;
      secondColumn.style.left = `${secondCord}px`;

      intervalTimerId = setTimeout(() => {
        firstColumn.classList.remove("columnSort");
        secondColumn.classList.remove("columnSort");
      }, ANIMATION_INTERVAL);
    } else {
      firstColumn.classList.remove("columnSort");
      secondColumn.classList.remove("columnSort");
    }
  }

  function clickСounter(button) {
    if (clickIntervalId === null) {
      clickIntervalId = setInterval(() => {
        if (counterClick > 0) {
          const columnLength = columnsArray.length - 1;
          let isEndSorting = cycleNumber > columnLength - 1;

          if (isEndSorting) {
            counterClick = 0;
            return;
          }

          counterClick--;
          sortChartForward();
        }
        if (counterClick < 0) {
          let isStartSorting = position === 0 && cycleNumber === 1;

          if (isStartSorting) {
            counterClick = 0;
            return;
          }

          counterClick++;
          sortChartBack();
        }

        if (counterClick === 0) {
          clearInterval(clickIntervalId);
          clickIntervalId = null;
        }
      }, CLICK_INTERVAL);
    }
    if (button.target.id === "sortForward") {
      if (counterClick < 0) counterClick = 0;
      counterClick++;
    }
    if (button.target.id === "sortBack") {
      if (counterClick > 0) counterClick = 0;
      counterClick--;
    }
  }

  function getColumns() {
    const columns = container.querySelectorAll(".column");
    return Array.from(columns).map(function (column) {
      return [column, column.offsetLeft];
    });
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
    counterClick = 0;
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
    const buttonSortForward = document.getElementById("sortForward");
    const buttonSortBack = document.getElementById("sortBack");
    buttonSortForward.disabled = !isShow;
    buttonSortBack.disabled = !isShow;
  }

  buttonCreate.addEventListener("click", createChart);
  input.addEventListener("input", validation);
  buttonSortForward.addEventListener("click", clickСounter);
  buttonSortBack.addEventListener("click", clickСounter);
}
init();
