// Line chart for avocado price over time using Chart.js and PapaParse
let priceLineChart = null;

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

  const chartCanvas = document.getElementById('priceLineChart');
  if (!chartCanvas) return;
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
}

// Wait for Papa.parse in bag-size-pie.js to finish, then call this
window.renderPriceLineChart = renderPriceLineChart;
