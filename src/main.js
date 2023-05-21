const buttonCreate = document.getElementById("createChart");
const buttonSort = document.getElementById("sortChart");

function createChart(mass = undefined) {
  const input = document.querySelector(".сhartInp");
  const container = document.querySelector(".container");

  container.querySelectorAll(".colum").forEach((colum) => colum.remove());
  const massNumb = mass ? mass : filterMass(input.value);

  for (let i = 0; i < massNumb.length; i++) {
    const newColum = document.createElement("div");
    newColum.classList.add("colum");
    newColum.style.height = `${
      (massNumb[i] / Math.max(...massNumb)) * 100 + 20
    }px`;

    newColum.textContent = massNumb[i];
    container.appendChild(newColum);
  }
}

function sortChart() {
  const input = document.querySelector(".сhartInp");
  const result = filterMass(input.value);
  result.sort((a, b) => {
    return a - b;
  });
  return createChart(result);
}

function filterMass(mass) {
  const massNumb = mass.split(" ").filter(function (val) {
    if (val !== " " && isFinite(Number(val))) {
      return val;
    }
  });
  return massNumb.map((string) => Number(string));
}

function unblockBtnSort() {
  const buttonSort = document.getElementById("sortChart");
  buttonSort.disabled = false;
}

buttonSort.addEventListener("click", () => sortChart());
buttonCreate.addEventListener("click", function () {
  createChart();
  unblockBtnSort(); //i thought that i can perform this action at the "createChart" function but our function doesn't need to know about the button!
});
