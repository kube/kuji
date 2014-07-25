var request = require('superagent'),
    expect = require('expect.js'),
    kuji = require('./kuji.js'),
    dependsOn = kuji._dependsOn;


describe('kuji.graph Tests', function () {
    
    it('runs all tasks', function (done) {
        var tasks = [],
            counter = 0,
            iterations = 100;

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


    it('test if _dependsOn() add dependencies to task', function () {
        var dependencies = ['a', 'b', 'c'];

        // Create a function with some dependencies
        var task = dependsOn(dependencies, function () {
        });

        // Compare two arrays
        expect(task.dependencies.length).to.equal(dependencies.length);
        for (var key in task.dependencies)
            expect(task.dependencies[key]).to.equal(dependencies[key]);
    });


    it('handles a single-dependency task', function (done) {
        var respectedOrder = false;

        // If respectedOrder is still false when B is ran
        // then promise does not work
        kuji.graph({
            a: function (next) {
                setTimeout(function () {
                    respectedOrder = true;
                    next();
                }, 10);
            },
            b: dependsOn('a', function () {
                expect(respectedOrder).to.be(true);
                done();
            })
        });
    });


    it('cannot run a task two times', function () {
        var times = 0;

        // Call next two times should not run
        // the promise more than once
        kuji.graph({
            a: function (next) {
                next();
                next();
            },
            b: dependsOn('a', function () {
                times++;
                expect(times).to.be(1);
                
            })
        });
    });
});