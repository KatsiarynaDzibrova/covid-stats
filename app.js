const res = jQuery.getJSON("https://api.covid19api.com/total/dayone/country/belarus/status/confirmed", callbackFuncWithData);

let rangeBegin, rangeEnd;
let startDate;
let chart;
let dates, cases;

function callbackFuncWithData(json) {
  let daysNumber = 90;
  [dates, cases] = parseAllData(json);
  startDate = new Date(dates[0]);
  console.log(startDate);
  console.log(dates);
  rangeBegin = dates.length - daysNumber;
  rangeEnd = dates.length;
  const labels = dates.slice(rangeBegin);
  const data = cases.slice(rangeBegin);

  makeChart(labels, data);

  $('#range_begin').attr('min', dates[0]);
  $('#range_begin').attr('max', dates[dates.length - 1]);
  $('#range_begin').attr('value', labels[0]);

  document.getElementById('range_begin').addEventListener('change', onInput);
}

function parseAllData(json) {
  let dates = Array(json.length);
  dates[0] = json[0].Date.slice(0, 10);
  let cases = Array(json.length);
  cases[0] = json[0].Cases;
  for (let i = 1; i < json.length; ++i) {
    let dayData = json[i];
    dates[i] = dayData.Date.slice(0, 10);
    cases[i] = dayData.Cases - json[i - 1].Cases;
  }
  return [dates, cases];
}

function makeChart(labels, data) {
  const ctx = document.getElementById('myChart');
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'New confirmed cases',
        data: data,
        borderWidth: 1
      }]
    },
    options: {
      elements: {
        rectangle: {
          borderWidth: 2,
          borderSkipped: 'bottom'
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          }
        }]
      }
    }
  });
}

function onInput(e) {
  const newRangeBegin = new Date(e.target.value);
  console.log(newRangeBegin);
  rangeBegin = daysDiff(startDate, newRangeBegin);
  console.log(rangeBegin, rangeEnd);
  updateChartRange();
}

function updateChartRange() {
  chart.data.labels = dates.slice(rangeBegin, rangeEnd);
  chart.data.datasets.forEach((dataset) => {
    dataset.data = cases.slice(rangeBegin, rangeEnd);
  });
  chart.update();
}

function daysDiff(d1, d2) {
  const t2 = d2.getTime();
  const t1 = d1.getTime();

  return (t2 - t1) / (24 * 3600 * 1000);
}
