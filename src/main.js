const buttonCreate = document.getElementById("createChart");
const buttonSortOrder = document.getElementById("sortColumnsOrder");
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
  }
}

function createChart() {
  const input = document.querySelector(".сhartInp");
  const validArray = getValidArray(input.value);

  printColumns(validArray);
  if (validArray.length > 1) showBtnSort(true);
}

function sort(array) {
  let lengthArray = array.length;
  let isEndSort = false;

  do {
    isEndSort = true;

    for (let i = 0; i < lengthArray; i++) {
      const firstElem = array[i];
      const secondElem = array[i + 1];

      if (firstElem > secondElem) {
        const removedElem = array.splice(i, 1);
        array.splice(i + 1, 0, ...removedElem);
        isEndSort = false;
      }
    }
    lengthArray--;
  } while (!isEndSort);

  return array;
}

function sortChartOrder() {
  const container = document.querySelector(".container");
  const columnsArray = Array.from(container.getElementsByClassName("column"));

  const arrayNumb = columnsArray.map((column) => Number(column.textContent));
  const sortArray = sort(arrayNumb);

  sortArray.forEach((number, i) => {
    for (let column of columnsArray) {
      if (column.textContent == number && column.style.order == "") {
        column.style.order = i;
      }
    }
  });

  showBtnSort(false);
}

function sortChartDom() {
  const container = document.querySelector(".container");
  const columns = container.getElementsByClassName("column");
  const arrayColumns = Array.from(columns);
  let isChange = false;

  for (let i = 0; i < arrayColumns.length; i++) {
    const firstColum = arrayColumns[i];
    const secondColum = arrayColumns[i + 1];

    if (!secondColum) break;
    const firstNumber = Number(firstColum.textContent);
    const secondNumber = Number(secondColum.textContent);

    if (firstNumber > secondNumber) {
      firstColum.before(secondColum);
      isChange = true;
    }
  }
  if (isChange) sortChartDom();
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
  const buttonSortOrder = document.getElementById("sortColumnsOrder");
  const buttonSortDom = document.getElementById("sortColumnsDom");

  buttonSortDom.disabled = !isShow;
  buttonSortOrder.disabled = !isShow;
}

buttonCreate.addEventListener("click", createChart);
buttonSortOrder.addEventListener("click", sortChartOrder);
buttonSortDom.addEventListener("click", sortChartDom);
input.addEventListener("input", validation);
