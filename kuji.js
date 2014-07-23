
var kuji = {

    graph: function (tasks) {
        for (var task in tasks)
            tasks[task]();
    }

};

module.exports = kuji;