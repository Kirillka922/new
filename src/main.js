"use strict";
const MINIMUM_HEIGHT = 20;
const ANIMATION_INTERVAL = 500;

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
    const columnsNodeList = container.querySelectorAll(".column");
    if (columnsNodeList.length !== 0) {
      clearHistory();
    }

    const validArray = getValidArray();
    printColumns(validArray);
    updateColumnsArray();

    if (validArray.length > 1) showBtnSort(true);
  }

  function sortChartBack() {
    if (position === 0 && cycleNumber === 1) return;

    const lastNumberForSort = columnsArray.length + 1 - cycleNumber;
    if (position === 0) {
      position = lastNumberForSort;
      cycleNumber--;
    }

    replaceElements(position--);
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

    replaceElements(position++);
  }

  function replaceElements(oldPosition) {
    const firstColumn = columnsArray[oldPosition];
    const secondColumn = columnsArray[position];
    let isReplace = false;

    if (oldPosition > position) {
      isReplace = arraySortMap.pop();
    }
    if (oldPosition < position) {
      isReplace =
        Number(firstColumn.textContent) > Number(secondColumn.textContent);
      arraySortMap.push(isReplace);
    }
    if (isReplace) {
      [columnsArray[oldPosition], columnsArray[position]] = [
        secondColumn,
        firstColumn,
      ];
    }
    recolorColumns(firstColumn, secondColumn);

    if (isReplace) {
      [firstColumn.style.left, secondColumn.style.left] = [
        secondColumn.style.left,
        firstColumn.style.left,
      ];
    }
  }

  function recolorColumns(firstColumn, secondColumn) {
    firstColumn.classList.add("sortFirstElem");
    secondColumn.classList.add("sortSecondElem");

    intervalTimerId = setTimeout(() => {
      firstColumn.classList.remove("sortFirstElem");
      secondColumn.classList.remove("sortSecondElem");
    }, ANIMATION_INTERVAL);
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

  function updateColumnsArray() {
    const columnsNodeList = container.querySelectorAll(".column");
    columnsArray = Array.from(columnsNodeList);
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
