let fileUrl = "https://getsamplefiles.com/download/mp4/sample-1.mp4";
const testButton = document.getElementById("testButton");
testButton.addEventListener("click", startTest);
let testTime = 15;
google.charts.load("current", { packages: ["corechart", "gauge"] });
google.charts.setOnLoadCallback(drawChart);

function startTest() {
  downloadSpeed.textContent = "";
  downloadFile(fileUrl);
}

function drawChart(speed = 0) {
  let downloadSpeed = speed;
  let data = google.visualization.arrayToDataTable([
    ["Label", "Value"],
    ["Download Speed", downloadSpeed],
  ]);

  let options = {
    min: 0,
    max: 100,
    width: 300,
    height: 300,
    minorTicks: 5,
    majorTicks: ["0", "20", "40", "60", "80", "100"],
  };
  let chart = new google.visualization.Gauge(
    document.getElementById("chart_div")
  );
  chart.draw(data, options);
}

async function downloadFile(url) {
  let uniqueUrl = url + "?t=" + new Date().getTime();
  const response = await fetch(uniqueUrl);
  const reader = response.body.getReader();
  let receivedLength = 0;
  let startTime = new Date();
  while (true) {
    const { done, value } = await reader.read();
    receivedLength += value.length;
    let currentTime = new Date();
    let timeElapsed = (currentTime - startTime) / 1000;
    let speed = (8 / 1000000) * (receivedLength / timeElapsed);
    drawChart(speed);
    if (done || timeElapsed > testTime) {
      break;
    }
  }
  currentTime = new Date();
  timeElapsed = (currentTime - startTime) / 1000;
  let averageSpeed = (8 / 1000000) * (receivedLength / timeElapsed);
  drawChart(averageSpeed);
  averageSpeed = averageSpeed.toFixed(2);
  downloadSpeed.textContent = `${averageSpeed} mbps`;
}

