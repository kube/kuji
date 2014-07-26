var request = require('superagent'),
    expect = require('expect.js'),
    kuji = require('./kuji.js'),
    dependsOn = kuji._dependsOn;


describe('kuji._dependsOn', function () {
    
    it('adds dependencies to task', function (done) {
        var dependencies = ['a', 'b', 'c'];

        // Create a function with some dependencies
        var task = dependsOn(dependencies, function () {
        });

        // Compare two arrays
        expect(task.dependencies.length).to.equal(dependencies.length);
        for (var key in task.dependencies)
            expect(task.dependencies[key]).to.equal(dependencies[key]);
        done();
    });
});


describe('kuji.graph', function () {
    
    it('runs all tasks, in order', function (done) {
        var tasks = [],
            counter = 0,
            iterations = 40;

        // Increment counter with all powers of 2
        for (var i = 0; i < iterations; i++)
            tasks.push((function (i) {
                return function () {
                    expect(counter).to.equal(Math.pow(2, i) - 1);
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


    it('handles inline single-dependency tasks', function (done) {
        var counter = 0;

        kuji.graph({
            a: function (next) {
                setTimeout(function () {
                    expect(counter).to.be(0);
                    counter++;
                    next();
                }, 10);
            },
            b: dependsOn('a', function (next) {
                setTimeout(function () {
                    expect(counter).to.be(1);
                    counter += 2;
                    next();
                }, 10);
            }),
            c: dependsOn('b', function () {
                expect(counter).to.be(3);
                done();
            })
        });
    });


    it('handles multiple-dependencies tasks', function (done) {
        var counter = 0;

        kuji.graph({
            a: function (next) {
                setTimeout(function () {
                    expect(counter).to.be(0);
                    counter++;
                    next();
                }, 100);
            },
            b: function (next) {
                setTimeout(function () {
                    expect(counter).to.be(1);
                    counter += 2;
                    next();
                }, 100);
            },
            c: function (next) {
                setTimeout(function () {
                    expect(counter).to.be(3);
                    counter += 4;
                    next();
                }, 100);
            },
            d: dependsOn(['a', 'b'], function (next) {
                setTimeout(function () {
                    // Check if A and B have incremented the counter
                    expect(counter & 3).to.be(3);
                    counter += 8;
                    next();
                }, 100);
            }),
            e: dependsOn(['d', 'c'], function () {
                expect(counter).to.be(15);
                done();
            })
        });
    });
});