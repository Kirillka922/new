inpBarChart.addEventListener("blur", function (ev) {
  contBarChart.innerHTML = "";
  let sortVals = [];
  let massNumb = ev.target.value.split(" ").filter(function (val) {
    if (val !== " " && !isNaN(Number(val) % 2)) return Number(val);
  });
  let lenBarChart = Math.round(100 / massNumb.length);

  sortVals = massNumb.sort((a, b) => {
    return a - b;
  });

  for (let i = 0; i < sortVals.length; i++) {
    let oneBarElement = document.createElement("div");
    oneBarElement.classList.add("element");
    oneBarElement.style.height = `${(i + 1) * lenBarChart}px`;
    oneBarElement.innerHTML = `<p class="textContent">${sortVals[i]}</p>`;
    contBarChart.appendChild(oneBarElement);
  }
});
