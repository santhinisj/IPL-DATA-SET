/*jshint esversion: 6 */
const expect = require("chai").expect;
const path = require('path');
const dataset1 = path.resolve("test/matches_test.csv");
const dataset2 = path.resolve("test/deliveries_test.csv");
const fileName = path.resolve("src/solutions.js");
const operations = require(fileName);

describe('operations', function() {
    it("should return the number of matches per year", function(done) {
        let expectedResult = {
            2017: 3,
            2008: 2,
            2009: 2,
            2010: 2
        };
        operations.matchesPerYear(dataset1).then(function(data) {
            try {
                expect(data).to.deep.equal(expectedResult);
                done(); // success: call done with no parameter to indicate that it() is done()
            } catch (e) {
                done(e); // failure: call done with an error Object to indicate that it() failed
            }
        });

    }); //end of it
    it("should return the matches won by all teams per year", function(done) {
        let expectedResult = {
            'Kolkata Knight Riders': {
                2017: 1,
                2010: 1
            },
            'Mumbai Indians': {
                2017: 2,
                2010: 1
            },
            'Royal Challengers Bangalore': {
                2008: 1,
                2009: 1
            },
            'Kings XI Punjab': {
                2008: 1
            },
            'Deccan Chargers': {
                2009: 1
            }
        };
        operations.winnersPerYear(dataset1).then(function(data) {
            try {
                expect(data).to.deep.equal(expectedResult);
                done();
            } catch (e) {
                done(e);
            }

        });

    }); //end of it
    it("should return an array of all the team ids", function(done) {
        let year = 2017;
        let expectedResult = ['57', '58', '59'];
        operations.getIds(year, dataset1).then(function(data) {
            try {
                expect(data).to.deep.equal(expectedResult);
                done();
            } catch (e) {
                done(e);
            }
        });
    }); //end of it

    it("should return a boolean if an id is present in a list of teamids", function(done) {
        let id = 57;
        let team_ids = [57, 68, 100];
        operations.checkArray(id, team_ids).then(function(data) {
            try {
                expect(data).to.deep.equal(true);
                done();
            } catch (e) {
                done(e);
            }
        });
    }); //end of it

    it("should return the extra runs conceded per team for 2016", function(done) {
        let expectedResult = { 'Royal Challengers Bangalore': 4 };
        operations.extraRunsPerTeam(dataset1, dataset2).then(function(data) {
            try {
                expect(data).to.deep.equal(expectedResult);
                done();
            } catch (e) {
                done(e);
            }
        });
    }); //end of it

    it("should return the top economical bowlers for year 2015", function(done) {
        let expectedResult = [{
                name: 'TS Mills',
                economy_rate: 7
            },
            {
                name: 'A Choudhary',
                economy_rate: 14
            }
        ];
        operations.topEconomicalBowlers(dataset1, dataset2).then(function(data) {
            try {
                expect(data).to.deep.equal(expectedResult);
                done();
            } catch (e) {
                done(e);
            }
        });
    }); // end of it

    it("should return the batting average in 2016", function(done) {
        let expectedResult = [{
                batsman: 'DA Warner',
                batting_average: 17
            },
            {
                batsman: 'S Dhawan',
                batting_average: Infinity
            },
            {
                batsman: 'MC Henriques',
                batting_average: Infinity
            }
        ];
        operations.battingAverage(dataset1, dataset2).then(function(data) {
            try {
                expect(data).to.deep.equal(expectedResult);
                done();
            } catch (e) {
                done(e);
            }
        });
    });
}); //end of describe