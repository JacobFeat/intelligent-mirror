const czasArr = [];
const temparatura1Arr = [];

const tempEle = document.querySelector(".temp");
const czasEle = document.querySelector(".czas");

const ctx = document.getElementById("myChart").getContext("2d");

fetch("Temperatura.JSON")
  .then((res) => res.json())
  .then((data) => {
    data.forEach(({ czas, temperatura }) => {
      czasArr.push(czas);
      temparatura1Arr.push(temperatura);
    });
  })
  .then(() => {
    tempEle.innerText = temparatura1Arr;
    czasEle.innerText = czasArr;
    setData(czasArr, temparatura1Arr);
  })
  .catch((err) => {
    console.log(err);
  });

function setData(x, y) {
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: x,
      datasets: [
        {
          label: "# of Votes",
          data: y,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
