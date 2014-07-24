var request = require('superagent'),
    expect = require('expect.js'),
    kuji = require('./kuji.js'),
    dependsOn = kuji._dependsOn;


describe('kuji.graph Tests', function () {
    
    it('runs all tasks', function (done) {
        var tasks = [],
            counter = 0,
            iterations = 1000;

        // Increment counter with all powers of 2
        for (var i = 0; i < iterations; i++)
            tasks.push((function (i) {
                return function () {
                    counter += Math.pow(2, i);
                }
            })(i));

        // Check if all have been incremented
        tasks.push(function () {
            expect(counter).to.equal(Math.pow(2, iterations) - 1);
            done();
        });

        kuji.graph(tasks);
    });


    it('test dependsOn() to return good objects', function () {
        var dependencies = ['a', 'b', 'c'];

        // Create a function that returns its own dependencies
        var task = dependsOn(dependencies, function () {
        });

        // Compare two arrays
        expect(task.dependencies.length).to.equal(dependencies.length);
        for (var key in task.dependencies)
            expect(task.dependencies[key]).to.equal(dependencies[key]);
    });

});