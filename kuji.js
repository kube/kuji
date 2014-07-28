
                                                     /*#######.
    kuji.js                                         ########",#:
                                                  #########',##".
    by KUBE  : www.kube.io                       ##'##'##".##',##.
    Created  : Jul 23, 2014 6:55PM                ## ## ## # ##",#.
    Modified : Jul 26, 2014 8:01PM                 ## ## ## ## ##'
                                                    ## ## ## :##
                                                     ## ## ##*/

var Task = function (task) {
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
        // Run all its promises
        for (var i in _promises)
            _promises[i].start();
    };

    this.start = function () {
        if (!_started && this.isReadyToGo()) {
            _started = true;
            // Run task and pass it the callback
            task(next);
        }
    }

}

var Graph = function () {
    
    var _nodes = [],
        _root = [];

    this.addTask = function (name, task) {
        var node = new Task(task);

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
    graph: function (tasks) {
        var _graph = new Graph();

        // Add all tasks to graph
        for (var i in tasks) 
            _graph.addTask(i, tasks[i]);

        _graph.start();
    }
};

module.exports = kuji;
