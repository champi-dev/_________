
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

function runTasks(tasks, cb) {
  const statuses = {}
  const runningJobs = {}
  const tasksKeys = Object.keys(tasks)
  tasksKeys.map(taskKey => {
    statuses[taskKey] = false
    runningJobs[taskKey] = false
  })

  let allTasksDone = reduceStatuses(statuses)
  const tasksInterval = setInterval(() => {
    if (allTasksDone) {
      clearInterval(tasksInterval)
      cb()
    }

    Object.entries(tasks).map(crrTask => {
      const crrTaskKey = crrTask[0]
      const crrTaskValue = crrTask[1]
      if ((!crrTaskValue.dependencies || !crrTaskValue.dependencies.length) && !statuses[crrTaskKey]) {
        !runningJobs[crrTaskKey] && crrTaskValue.job(() => {
          statuses[crrTaskKey] = true
          allTasksDone = reduceStatuses(statuses)
        })
        runningJobs[crrTaskKey] = true
        return
      }

      const depsDone = !statuses[crrTaskKey] && crrTaskValue.dependencies.map(crrDep => statuses[crrDep]).reduce((crr, acc) => crr && acc)
      if (depsDone) {
        !runningJobs[crrTaskKey] && crrTaskValue.job(() => {
          statuses[crrTaskKey] = true
          allTasksDone = reduceStatuses(statuses)
        })
        runningJobs[crrTaskKey] = true
      }
    })
  }, 200)

  function reduceStatuses(statusesToReduce) {
    return Object.values(statusesToReduce).reduce((crr, acc) => crr && acc)
  }
}

const tasks = {
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
  },
  'd': {
    job: function (finish) {
      setTimeout(function () {
        console.log('d done');
        finish();
      }, 100);
    },
    dependencies: ['a', 'b']
  },
  'e': {
    job: function (finish) {
      setTimeout(function () {
        console.log('e done');
        finish();
      }, 200);
    },
    dependencies: ['c', 'd']
  }
};

runTasks(tasks, () => {
  console.log('all done');
});

