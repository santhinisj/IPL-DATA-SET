/*jshint esversion: 6 */

var csv = require("fast-csv");
const path = require('path');
const dataset1 = path.resolve('data/matches.csv');
const dataset2 = path.resolve('data/deliveries.csv');

let matchesPerYear = function(dataset1) {
    return new Promise(function(resolve, reject) {
        const matchPerYear = {}
        let stream = csv.fromPath(dataset1, {
                headers: true
            })
            .on("data", function(row) {
                stream.pause();
                if (row.season !== '') {
                    matchPerYear[row.season] = matchPerYear[row.season] ? Number(matchPerYear[row.season]) + 1 : 1;
                }
                stream.resume();

            })
            .on('end', function() {
                // console.log(matchPerYear);
                console.log("finished matches");

                resolve(matchPerYear);
            });
    });
}; //end of matchesPerYear
matchesPerYear(dataset1);

let winnersPerYear = function(dataset1) {
    return new Promise(function(resolve, reject) {
        const season_and_winners = {};
        let stream = csv.fromPath(dataset1, {
                headers: true
            })
            .on("data", function(match) {
                stream.pause();
                if (!(match.season == undefined || match.winner == undefined) && match.winner.length > 0) {
                    if (season_and_winners.hasOwnProperty(match.winner))
                        if (season_and_winners[match.winner].hasOwnProperty(match.season))
                            season_and_winners[match.winner][match.season]++;
                        else
                            season_and_winners[match.winner][match.season] = 1;
                    else {
                        season_and_winners[match.winner] = {};
                        season_and_winners[match.winner][match.season] = 1;
                    }
                }
                stream.resume();
            })
            .on('end', function() {
                // console.log(season_and_winners);
                console.log("finished winners");

                resolve(season_and_winners);
            });
    });
}; //end of winnersPerYear
winnersPerYear(dataset1);

let getIds = function(year, dataset1) {
    return new Promise(function(resolve, reject) {
        let team_ids = [];
        let stream = csv.fromPath(dataset1, {
                headers: true
            })
            .on("data", function(match) {
                stream.pause();
                if (match.season == year) {
                    team_ids.push(match.id);
                }
                stream.resume();
            })
            .on('end', function() {
                // console.log(team_ids);
                resolve(team_ids);
            });

    });
};
// getIds(2016, dataset1);

let checkArray = function(id, team_ids) {
    let value = false;
    return new Promise(function(resolve, reject) {
        // console.log("inside checkarray");
        for (var each of team_ids) {
            if (id === each) {
                value = true;
            }
        }
        resolve(value);
    });

};

let extraRunsPerTeam = function(dataset1, dataset2) {
    // change to 2017 for testing
    let team_ids = getIds(2017, dataset1);
    return new Promise(function(resolve, reject) {
        let extra_runs = {};
        let stream = csv.fromPath(dataset2, {
                headers: true
            })
            .on("data", function(delivery) {
                stream.pause();
                team_ids.then(function(ids) {
                    checkArray(delivery.match_id, ids).then(function(val) {
                        let idIsPresent = val;
                        // console.log(idIsPresent);
                        if (idIsPresent && (delivery != undefined)) {
                            extra_runs[delivery.bowling_team] = extra_runs.hasOwnProperty(delivery.bowling_team) ? parseInt(extra_runs[delivery.bowling_team]) + parseInt(delivery.extra_runs) :
                                delivery.extra_runs;
                        }
                        stream.resume();
                    });
                });
            })
            .on('end', function() {
                // console.log(extra_runs);
                console.log("finished extra runs");

                resolve(extra_runs);
            });
    });
};

extraRunsPerTeam(dataset1, dataset2);
let topEconomicalBowlers = function(dataset1, dataset2) {
    let balls_array = {};
    let runs_array = {};
    let bowler_object = [];
    // change year to 2017 for testing
    let team_ids = getIds(2017, dataset1);
    return new Promise(function(resolve, reject) {
        let stream = csv.fromPath(dataset2, {
                headers: true
            })
            .on("data", function(delivery) {
                stream.pause();
                team_ids.then(function(ids) {
                    checkArray(delivery.match_id, ids).then(function(val) {
                        let idIsPresent = val;
                        if (idIsPresent && (delivery != undefined)) {
                            if (balls_array.hasOwnProperty(delivery.bowler)) {
                                balls_array[delivery.bowler] = parseInt(balls_array[delivery.bowler]) + 1;
                                runs_array[delivery.bowler] = parseInt(runs_array[delivery.bowler]) + parseInt(delivery.total_runs);
                                if (delivery.wide_runs > 0)
                                    balls_array[delivery.bowler] = parseInt(balls_array[delivery.bowler]) - 1;
                                if (delivery.noball_runs > 0)
                                    balls_array[delivery.bowler] = parseInt(balls_array[delivery.bowler]) - 1;

                            } else {
                                balls_array[delivery.bowler] = 1;
                                runs_array[delivery.bowler] = parseInt(delivery.total_runs);
                                if (delivery.wide_runs > 0)
                                    balls_array[delivery.bowler] = parseInt(balls_array[delivery.bowler]) - 1;
                                if (delivery.noball_runs > 0)
                                    balls_array[delivery.bowler] = parseInt(balls_array[delivery.bowler]) - 1;

                            }
                        }
                        stream.resume();

                    });
                });
            })
            .on('end', function() {
                for (let each in balls_array) {
                    bowler_object.push({ 'name': each, 'economy_rate': Math.floor(runs_array[each] / (balls_array[each] / 6)) });
                }
                bowler_object.sort(function(a, b) {
                    return (parseInt(a.economy_rate) - parseInt(b.economy_rate));
                });
                // console.log(bowler_object);
                console.log("finished top eco bowlers");
                resolve(bowler_object);
            });
    });

};

topEconomicalBowlers(dataset1, dataset2);

let battingAverage = function(dataset1, dataset2) {
    let batting_avg_arr = []
    let total_runs_batsman = [];
    let player_dismissal = [];
    // change year to 2017 for testing
    let team_ids = getIds(2017, dataset1);
    return new Promise(function(resolve, reject) {
        let stream = csv.fromPath(dataset2, {
                headers: true
            })
            .on("data", function(delivery) {
                stream.pause();
                team_ids.then(function(ids) {
                    checkArray(delivery.match_id, ids).then(function(val) {
                        let idIsPresent = val;
                        if (idIsPresent && (delivery != undefined)) {
                            if (total_runs_batsman.hasOwnProperty(delivery.batsman)) {
                                total_runs_batsman[delivery.batsman] = parseInt(total_runs_batsman[delivery.batsman]) + parseInt(delivery.total_runs);
                                if (delivery.player_dismissed != '') {
                                    player_dismissal[delivery.batsman] = parseInt(player_dismissal[delivery.batsman]) + 1;
                                } else
                                    player_dismissal[delivery.batsman] = 0;
                            } else {
                                total_runs_batsman[delivery.batsman] = delivery.total_runs;
                                if (delivery.player_dismissed != '') {
                                    player_dismissal[delivery.batsman] = 1;
                                } else
                                    player_dismissal[delivery.batsman] = 0;

                            }
                        }
                    });

                });
                stream.resume();

            })
            .on('end', function() {
                for (let each in player_dismissal) {
                    let calculateAverage = player_dismissal[each] == 0 ? Infinity : (total_runs_batsman[each] / player_dismissal[each]);
                    batting_avg_arr.push({ 'batsman': each, 'batting_average': calculateAverage });
                }
                // console.log(batting_avg_arr);
                console.log("finished batting average");
                resolve(batting_avg_arr);
            });
    });


};
/*-------------------------------------- EXPORTS ------------------------------------- */

module.exports = {
    matchesPerYear,
    winnersPerYear,
    getIds,
    checkArray,
    extraRunsPerTeam,
    topEconomicalBowlers,
    battingAverage,
};