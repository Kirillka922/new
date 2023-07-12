const MINIMUM_HEIGHT = 20;
const ANIMATION_INTERVAL = 500;

const createNewChartBtn = document.getElementById("createNewChart");
const chartInput = document.querySelector(".сhartInp");
const chartsContainer = document.getElementById("chartsContainer");

class Chart {
  constructor(chartsContainer, chartInput) {
    this.intervalTimerId = null;
    this.position = 0;
    this.cycleNumber = 1;
    this.columnsArray = [];
    this.arraySortMap = [];
    this.chartInput = chartInput;

    this.chartContainer = this.#createDiv("chartContainer", chartsContainer);
    this.buttonCreate = this.#createButton("Построить график");
    this.buttonSortBack = this.#createButton("Сортировать назад");
    this.buttonSortForward = this.#createButton("Сортировать вперед");
    this.buttonRemove = this.#createButton("Remove");
    this.buttonRemove.disabled = false;
    this.columnsContainer = this.#createDiv("container", this.chartContainer);

    this.chartInput.addEventListener("input", () => this.#validation());
    this.buttonCreate.addEventListener("click", () => this.#createChart());
    this.buttonSortForward.addEventListener("click", () =>
      this.#sortChartForward()
    );
    this.buttonSortBack.addEventListener("click", () => this.#sortChartBack());
    this.buttonRemove.addEventListener("click", () => this.#removeChart());
    this.#createChart();
  }

  #printColumns(array) {
    this.columnsContainer
      .querySelectorAll(".column")
      .forEach((column) => column.remove());

    for (let i = 0; i < array.length; i++) {
      const heightColumn =
        (array[i] / Math.max(...array)) * 100 + MINIMUM_HEIGHT;
      const newColumn = document.createElement("div");
      newColumn.classList.add("column");
      newColumn.style.height = `${heightColumn}px`;
      newColumn.textContent = array[i];
      this.columnsContainer.appendChild(newColumn);
      const leftForColumn = newColumn.offsetWidth * i;
      const indentForColumn = 1 + i;
      newColumn.style.left = `${leftForColumn + indentForColumn}px`;
    }
  }

  #createChart() {
    if (this.columnsContainer.length !== 0) {
      this.#clearHistory();
    }

    const validArray = this.#getValidArray();
    this.#printColumns(validArray);
    this.#getColumnsArray();

    if (validArray.length > 1) this.#showBtnSort(true);
  }

  #sortChartBack() {
    if (this.position === 0 && this.cycleNumber === 1) return;

    const lastNumberForSort = this.columnsArray.length + 1 - this.cycleNumber;
    if (this.position === 0) {
      this.position = lastNumberForSort;
      this.cycleNumber = this.cycleNumber - 1;
    }
    this.#replaceElements(-1);
    this.position = this.position - 1;
  }

  #sortChartForward() {
    const columnLength = this.columnsArray.length - 1;

    if (this.cycleNumber > columnLength - 1) {
      return;
    }

    const lastNumberForSort = columnLength - this.cycleNumber;
    if (this.position > lastNumberForSort) {
      this.position = 0;
      this.cycleNumber = this.cycleNumber + 1;
    }

    this.#replaceElements(1);
    this.position = this.position + 1;
  }

  #replaceElements(operation) {
    const firstColumn = this.columnsArray[this.position];
    const secondColumn = this.columnsArray[this.position + operation];
    let isReplace = false;

    if (operation > 0) {
      isReplace =
        Number(firstColumn.textContent) > Number(secondColumn.textContent);
      this.arraySortMap.push(isReplace);
    } else {
      isReplace = this.arraySortMap.pop();
    }

    this.#recolorColumns(firstColumn, secondColumn);

    if (isReplace) {
      [
        this.columnsArray[this.position],
        this.columnsArray[this.position + operation],
      ] = [secondColumn, firstColumn];

      [firstColumn.style.left, secondColumn.style.left] = [
        secondColumn.style.left,
        firstColumn.style.left,
      ];
    }
  }

  #recolorColumns(firstColumn, secondColumn) {
    firstColumn.classList.add("sortFirstElem");
    secondColumn.classList.add("sortSecondElem");

    this.intervalTimerId = setTimeout(() => {
      firstColumn.classList.remove("sortFirstElem");
      secondColumn.classList.remove("sortSecondElem");
    }, ANIMATION_INTERVAL);
  }

  #getColumnsArray() {
    const columnsList = this.columnsContainer.querySelectorAll(".column");
    this.columnsArray = Array.from(columnsList);
  }

  #clearHistory() {
    this.#showBtnSort(false);
    this.#showBtnCreate(false);
    this.#printColumns([]);
    this.arraySortMap = [];
    this.position = 0;
    this.cycleNumber = 1;
    clearTimeout(this.intervalTimerId);
  }

  #validation() {
    const arrayNumbers = this.#getValidArray();

    if (arrayNumbers.length > 0) this.#showBtnCreate(true);
    if (arrayNumbers.length == 0) this.#clearHistory();
    if (arrayNumbers.length == 1) this.#showBtnSort(false);
  }

  #getValidArray() {
    const arrayNumb = this.chartInput.value.split(" ").filter(function (val) {
      if (val !== " " && isFinite(Number(val))) {
        return val;
      }
    });
    return arrayNumb.map((string) => Number(string));
  }

  #showBtnCreate(isOpen) {
    this.buttonCreate.disabled = !isOpen;
  }

  #showBtnSort(isShow) {
    this.buttonSortForward.disabled = !isShow;
    this.buttonSortBack.disabled = !isShow;
  }

  #createButton(textButton) {
    const newButton = document.createElement("button");
    newButton.setAttribute("disabled", "true");
    const textNode = document.createTextNode(textButton);
    newButton.appendChild(textNode);
    this.chartContainer.appendChild(newButton);
    return newButton;
  }

  #createDiv(className, container) {
    const newDiv = document.createElement("div");
    newDiv.classList.add(className);
    container.appendChild(newDiv);
    return newDiv;
  }

  #removeChart() {
    this.chartContainer.remove();
  }
}

createNewChartBtn.addEventListener(
  "click",
  () => new Chart(chartsContainer, chartInput)
);
