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
function createNewTransform(node, length, time) {
  node.style.transform = `translate(${length}px)`;
  node.style.transition = `transform ${time}s`;
}

function countFuturePosit(node) {
  let numb = Number(node.textContent);
  const container = document.querySelector(".container");
  const columnsArray = container.getElementsByClassName("column");

  for (let column of columnsArray) {
    if (numb > column.style.order) {
      node = column;
    }
  }
  return node;
}

function sortChartOrder() {
  const container = document.querySelector(".container");
  const columnsArray = container.querySelectorAll(".column");

  for (let column of columnsArray) {
    let lastNode = countFuturePosit(column);
    let newPosition = lastNode.getBoundingClientRect().left;
    let lastPosition = column.getBoundingClientRect().left;

    createNewTransform(column, -newPosition - lastPosition, 0);

    lastPosition = column.getBoundingClientRect().left;
    createNewTransform(column, newPosition + lastPosition, 1);

    column.style.order = column.textContent;
  }

  showBtnSort(false);
}
function changePositionDom() {
  const container = document.querySelector(".container");
  const columns = container.getElementsByClassName("column");

  for (let j = 1; j < columns.length; j++) {
    const firstColumn = columns[j - 1];
    const secondColumn = columns[j];
    const firstNumber = Number(firstColumn.textContent);
    const secondNumber = Number(secondColumn.textContent);

    if (firstNumber > secondNumber) {
      let startFirst = firstColumn.getBoundingClientRect().left;
      let startSecond = secondColumn.getBoundingClientRect().left;
      firstColumn.before(secondColumn);
      const finistFirst = firstColumn.getBoundingClientRect().left;
      const finishSecond = secondColumn.getBoundingClientRect().left;

      createNewTransform(firstColumn, -startSecond + startFirst, 0);
      createNewTransform(secondColumn, startSecond - startFirst, 0);

      startFirst = firstColumn.getBoundingClientRect().left;
      startSecond = secondColumn.getBoundingClientRect().left;

      createNewTransform(firstColumn, finistFirst - startSecond, 1);
      createNewTransform(secondColumn, finishSecond - finishSecond, 1);

      return true;
    }
  }
  return false;
}
function sortChartDom() {
  const timer = setInterval(function () {
    if (!changePositionDom()) clearInterval(timer);
  }, 1000);

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
