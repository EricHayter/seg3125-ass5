// Line chart for avocado price over time using Chart.js and PapaParse


let priceLineChart = null;
let priceWindowDates = [];
let priceWindowAllData = [];

function renderPriceLineChart(allData) {
  // Group by date, average price for each date
  const dateMap = {};
  allData.forEach(row => {
    const date = row['Date'];
    const price = parseFloat(row['AveragePrice']);
    if (!date || isNaN(price)) return;
    if (!dateMap[date]) dateMap[date] = { sum: 0, count: 0 };
    dateMap[date].sum += price;
    dateMap[date].count += 1;
  });
  // Sort dates
  const dates = Object.keys(dateMap).sort();
  const avgPrices = dates.map(date => dateMap[date].sum / dateMap[date].count);

  // Save for dropdowns
  priceWindowDates = dates;
  priceWindowAllData = avgPrices;

  setupPriceWindowDropdowns();
  updatePriceLineChart();
}

function setupPriceWindowDropdowns() {
  const startSel = document.getElementById('priceWindowStart');
  const endSel = document.getElementById('priceWindowEnd');
  if (!startSel || !endSel || priceWindowDates.length === 0) return;
  startSel.innerHTML = '';
  endSel.innerHTML = '';
  priceWindowDates.forEach((date, idx) => {
    const opt1 = document.createElement('option');
    opt1.value = idx;
    opt1.textContent = date;
    startSel.appendChild(opt1);
    const opt2 = document.createElement('option');
    opt2.value = idx;
    opt2.textContent = date;
    endSel.appendChild(opt2);
  });
  startSel.value = 0;
  endSel.value = priceWindowDates.length - 1;

  startSel.onchange = function() {
    if (parseInt(startSel.value) > parseInt(endSel.value)) {
      startSel.value = endSel.value;
    }
    updatePriceLineChart();
  };
  endSel.onchange = function() {
    if (parseInt(endSel.value) < parseInt(startSel.value)) {
      endSel.value = startSel.value;
    }
    updatePriceLineChart();
  };
}

window.setLineChartLang = function(lang) {
  lang = lang || (window.currentLang || 'en');
  if (!window.priceLineChart || !window.translations || !window.translations[lang]) return;
  const t = window.translations[lang];
  // Update axis titles and dataset label
  if (window.priceLineChart.options && window.priceLineChart.options.scales) {
    if (window.priceLineChart.options.scales.x && window.priceLineChart.options.scales.x.title) {
      window.priceLineChart.options.scales.x.title.text = t.lineXAxis;
    }
    if (window.priceLineChart.options.scales.y && window.priceLineChart.options.scales.y.title) {
      window.priceLineChart.options.scales.y.title.text = t.lineYAxis;
    }
  }
  if (window.priceLineChart.data && window.priceLineChart.data.datasets && window.priceLineChart.data.datasets[0]) {
    window.priceLineChart.data.datasets[0].label = t.lineTitle;
  }
  if (typeof window.priceLineChart.update === 'function') {
    window.priceLineChart.update();
  }
};

function updatePriceLineChart() {
  const startSel = document.getElementById('priceWindowStart');
  const endSel = document.getElementById('priceWindowEnd');
  const chartCanvas = document.getElementById('priceLineChart');
  if (!startSel || !endSel || !chartCanvas) return;
  const minIdx = parseInt(startSel.value);
  const maxIdx = parseInt(endSel.value);
  const dates = priceWindowDates.slice(minIdx, maxIdx + 1);
  const avgPrices = priceWindowAllData.slice(minIdx, maxIdx + 1);
  const ctx = chartCanvas.getContext('2d');
  if (priceLineChart) priceLineChart.destroy();
  priceLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Average Price',
        data: avgPrices,
        borderColor: '#FF6F61',
        backgroundColor: 'rgba(255,111,97,0.12)',
        tension: 0.2,
        pointRadius: 2,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        x: {
          title: { display: true, text: 'Date' },
          ticks: { maxTicksLimit: 10, autoSkip: true }
        },
        y: {
          title: { display: true, text: 'Average Price (USD)' },
          beginAtZero: false
        }
      }
    }
  });
  // Expose globally for language switching
  window.priceLineChart = priceLineChart;
}

// Wait for Papa.parse in bag-size-pie.js to finish, then call this
window.renderPriceLineChart = renderPriceLineChart;
