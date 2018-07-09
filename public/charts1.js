/* jshint esversion:6 */
// Create the chart
console.log("charts1");
let winnersPerYear = (window.data);
let years = [];
let matches = [];
for (let value in winnersPerYear) {
    if (value !== 'undefined') {
        years.push(value);
        matches.push(winnersPerYear[value]);
    }
}

let container = document.createElement('div');
document.body.appendChild(container);
window.chart = new Highcharts.Chart({
    chart: {
        renderTo: container,
        height: 400,
        type: 'column'
    },
    title: {
        text: 'IPL MATCHES IN YEARS'
    },
    xAxis: {
        categories: years
    },
    yAxis: {
        text: 'year',
        data: matches
    },
    series: [{
        text: 'Year',
        data: matches
    }]
});