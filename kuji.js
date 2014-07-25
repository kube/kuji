
var kuji = {

    // Helper for adding dependencies to task
    _dependsOn: function (dependencies, task) {
        task.dependencies = [];
        for (var key in dependencies)
            task.dependencies.push(dependencies[key]);
        return task;
    },


    graph: function (tasks) {
        // Create graph of tasks
        var root = [];
        for (var i in tasks) {

            var task = tasks[i];
            task.promises = [];

            if (!task.dependencies)
                root.push(task);
            else
                for (var j in task.dependencies)
                    tasks[task.dependencies[j]].promises.push(task);

            // Create Next for each task
            task.next = (function (task) {
                return function () {
                    for (var p in task.promises) {
                        var promise = task.promises[p];
                        if (!promise.started) {
                            promise.started = true;
                            promise(promise.next);
                        }
                    }
                }
            })(task);
        }

        // Run graph from root
        for (var i in root) {
            var task = root[i];
            task(task.next);
        }
    }

};

module.exports = kuji;
