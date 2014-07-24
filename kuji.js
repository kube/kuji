
var kuji = {

    // Helper for adding dependencies to task
    _dependsOn: function (dependencies, task) {
        task.dependencies = [];
        for (var key in dependencies)
            task.dependencies.push(dependencies[key]);
        return task;
    },

    graph: function (tasks) {
        for (var task in tasks)
            tasks[task]();
    }


};

module.exports = kuji;