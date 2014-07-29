
                                                     /*#######.
    kuji.js                                         ########",#:
                                                  #########',##".
    by KUBE  : www.kube.io                       ##'##'##".##',##.
    Created  : Jul 23, 2014 6:55PM                ## ## ## # ##",#.
    Modified : Jul 29, 2014 2:16AM                 ## ## ## ## ##'
                                                    ## ## ## :##
                                                     ## ## ##*/

var Task = function (graph, task) {
    var self = this;

    var _dependencies = [],
        _promises = [],
        _started = false;

    this.finished = false;

    this.isReadyToGo = function () {
        for (var i in _dependencies)
            if (!_dependencies[i].finished)
                return false;
        return true;
    }

    this.addDependency = function (dependency) {
        _dependencies.push(dependency);
        dependency.addPromise(this);
    }

    this.addPromise = function (promise) {
        _promises.push(promise);
    }

    // Create Next callback
    var next = function () {
        // Define task as finished
        self.finished = true;
        // Run all its promises, if some
        if (_promises.length > 0)
            for (var i in _promises)
                _promises[i].start();
        // If no promise, maybe graph has finished its tasks
        else
            graph.tryFinish();

    };

    this.start = function () {
        if (!_started && this.isReadyToGo()) {
            _started = true;
            // Run task and pass it the callback
            task(next);
        }
    }

}

var Graph = function (finalCallback) {
    
    var _nodes = [],
        _root = [],
        _finalCallback;

    this.addTask = function (name, task) {
        var node = new Task(this, task);

        // If task has no dependency add it to the graph root
        if (!task.dependencies || task.dependencies.length == 0)
            _root.push(node);
        // Else add each of its dependencies to the node
        else
            for (var i in task.dependencies)
                node.addDependency(_nodes[task.dependencies[i]]);
        _nodes[name] = node;
    }

    this.start = function () {
        // Start all tasks at root
        for (var i in _root)
            _root[i].start();
    }

    this.setFinalCallback = function (finalCallback) {
        _finalCallback = finalCallback;        
    }

    this.tryFinish = function () {
        // Ensure there is a final callback
        if (!_finalCallback)
            return;
        // Check if all nodes have been executed
        for (var i in _nodes)
            if (!_nodes[i].finished)
                return;
            _finalCallback();
    }
}


var kuji = {

    // Helper for adding dependencies to task
    _dependsOn: function (dependencies, task) {
        task.dependencies = [];
        for (var key in dependencies)
            task.dependencies.push(dependencies[key]);
        return task;
    },

    // Creates a graph from tasks array and run it
    graph: function (tasks, finalCallback) {
        var _graph = new Graph();

        // Add all tasks to graph
        for (var i in tasks) 
            _graph.addTask(i, tasks[i]);

        if (finalCallback)
            _graph.setFinalCallback(finalCallback);

        _graph.start();
    },

    parallel: function (tasks, finalCallback) {
        var _graph = new Graph();

        // Add all tasks to graph
        for (var i in tasks) {
            delete tasks[i].dependencies;
            _graph.addTask(i, tasks[i]);
        }

        if (finalCallback)
            _graph.setFinalCallback(finalCallback);

        _graph.start();
    },

    inline: function (tasks) {
        var _graph = new Graph();

        // Add all tasks to graph
        var previous = null;
        for (var i in tasks) {
            // Set task dependency to previous task
            delete tasks[i].dependencies;
            if (previous)
                tasks[i].dependencies = [previous];

            _graph.addTask(i, tasks[i]);
            previous = i;
        }
        _graph.start();
    }
};

module.exports = kuji;
