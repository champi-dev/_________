
// A --|
//     |-- D --|
// B --|       |-- E
//     |       |
// C --|-------|

// Each node is a async job, illustrated by setTimeout.
// A, B, and C can run at the same time.
// D, needs to wait for A and B to be done.
// E needs to wait for C and D to be done.
// Implement an interface, let's call it runTasks to take care of this for us.


// FAILING

var tasks = {
    'a': {
      job: function (finish) {
        setTimeout(function () {
          console.log('a done');
          finish();
        }, 500);
      }
    },
    'b': {
      job: function (finish) {
        setTimeout(function () {
          console.log('b done');
          finish();
        }, 200);
      }
    },
    'c': {
      job: function (finish) {
        setTimeout(function () {
          console.log('c done');
          finish();
        }, 200);
      },
      dependencies: ['a', 'b']
    },
    'd': {
      job: function (finish) {
        setTimeout(function () {
          console.log('d done');
          finish();
        }, 100);
      },
      dependencies: []
    },
    'e': {
      job: function (finish) {
        setTimeout(function () {
          console.log('e done');
          finish();
        }, 200);
      },
      dependencies: ['c', 'b']
    }
};

function runTasks(tasks, cb) {
    const tasksArr = Object.entries(tasks);
    const taskStatus = {}
    tasksArr.forEach((task) => {
        taskStatus[task[0]] = false
    })
    
    tasksArr.forEach((task) => {
        if(!task[1].dependencies || !task[1].dependencies.length) {
            task[1].job(() => {
                taskStatus[task[0]] = true
                
                tasksArr.forEach((task) => {
                    if (task[1].dependencies && task[1].dependencies.length) {
                        let passed = true
                        task[1].dependencies.forEach(dep => {
                          passed = passed && taskStatus[dep]
                        })
                        
                        passed && task[1].job(() => {
                            taskStatus[task[0]] = true
                        });
                    }
                })
            })   
        } 
    })
    
    cb();
}
 
runTasks(tasks, function () {
console.log('all done');
});
 
