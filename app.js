/*jshint esversion:6 */
let express = require('express');
let app = express();
let appValues = require('./src/solutions');
app.set('view engine', 'ejs');
app.use(express.static('public'));
const path = require('path');
const dataset1 = path.resolve('data/matches.csv');
const dataset2 = path.resolve('data/deliveries.csv');

// extraRunsPerTeam = appValues.extraRunsPerTeam;
// topEconomicalBowlers = appValues.topEconomicalBowlers;
// battingAverage = appValues.extraRunsPerTeam;

//1
appValues.matchesPerYear(dataset1).then(function(data) {
    matchesPerYear = data;
});
app.get('/1', function(req, res) {
    res.render('index1', { matchesPerYear: JSON.stringify(matchesPerYear) });
});

//2
appValues.winnersPerYear(dataset1).then(function(data) {
    winnersPerYear = data;
});

app.get('/2', function(req, res) {
    res.render('index2', { winnersPerYear: JSON.stringify(winnersPerYear) });
});


//3
appValues.extraRunsPerTeam(dataset1, dataset2).then(function(data) {
    extraRunsPerTeam = data;
});

app.get('/3', function(req, res) {
    res.render('index3', { extraRunsPerTeam: JSON.stringify(extraRunsPerTeam) });
});


//4
appValues.topEconomicalBowlers(dataset1, dataset2).then(function(data) {
    topEconomicalBowlers = data;
});

app.get('/4', function(req, res) {
    res.render('index4', { topEconomicalBowlers: JSON.stringify(topEconomicalBowlers) });
});

//5
appValues.battingAverage(dataset1, dataset2).then(function(data) {
    battingAverage = data;
});

app.get('/5', function(req, res) {
    res.render('index5', { battingAverage: JSON.stringify(battingAverage) });
});


app.listen(3000);