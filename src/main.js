function createBa() {}

inpBarChart.addEventListener("blur", function (ev) {
  contBarChart.innerHTML = "";
  let sortVals = {};
  let massNumb = ev.target.value.split(" ").filter(function (val) {
    if (val !== " " && !isNaN(Number(val) % 2)) return val;
  });
  let lenBarChart = Math.round(100 / massNumb.length);
  for (let i = 0; i < massNumb.length; i++) {
    sortVals[massNumb[i]] = i + 1;
  }
  for (let i = 0; i < massNumb.length; i++) {
    let powerOfWal = Object.keys(sortVals).indexOf(massNumb[i]) + 1;
    let oneBarElement = document.createElement("div");
    oneBarElement.classList.add("element");
    oneBarElement.style.height = `${powerOfWal * lenBarChart}px`;
    oneBarElement.innerHTML = `<p class="textContent">${massNumb[i]}</p>`;
    contBarChart.appendChild(oneBarElement);
  }
});
