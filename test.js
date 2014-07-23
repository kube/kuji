var request = require('superagent'),
    expect = require('expect.js'),
    kuji = require('./kuji.js');


describe('kuji.graph Tests', function () {
    
    it('runs all tasks', function (done) {
        var tasks = [],
            counter = 0,
            power = 20;

        // Increment counter with all powers of 2
        for (var i = 0; i < power; i++)
            tasks.push((function (i) {
                return function () {
                    counter += Math.pow(2, i);
                }
            })(i));

        // Check if all have been incremented
        tasks.push(function () {
            expect(counter).to.equal(Math.pow(2, power) - 1);
            done();
        });

        kuji.graph(tasks);
    });

});