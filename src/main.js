const buttonCreate = document.querySelector(".createChart");
const buttonSort = document.querySelector(".sortChart");

buttonCreate.addEventListener("click", () => buildChart("buildChart"));
buttonSort.addEventListener("click", () => buildChart("sortVals"));

function buildChart(action) {
  const input = document.querySelector(".сhartInp");
  const container = document.querySelector(".colums-container");
  container.querySelectorAll("div").forEach((colum) => colum.remove());

  const massNumb = input.value.split(" ").filter(function (val) {
    if (val !== " " && isFinite(Number(val))) {
      return val;
    }
  });

  if (action == "sortVals") {
    massNumb.sort((a, b) => {
      return a - b;
    });
  }
  const clone = [...massNumb];
  const sortMass = clone.sort((a, b) => {
    return a - b;
  });
  const columSize = 100 / massNumb.length;
  const sizeColums = {};
  sortMass.forEach((element, i) => {
    sizeColums[element] = (i + 1) * columSize;
  });

  for (let i = 0; i < massNumb.length; i++) {
    let newColum = document.createElement("div");
    newColum.classList.add(`box-${i}`);
    newColum.style.minHeight = `${sizeColums[massNumb[i]]}px`;
    newColum.style.order = `${i}`;
    let newSpan = document.createElement("span");
    newSpan.textContent = massNumb[i];
    newColum.appendChild(newSpan);
    container.appendChild(newColum);
  }
}
