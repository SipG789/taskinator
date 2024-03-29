
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

// Arrays for local storage 
var tasks = [];


// function that is collecting data and sending it elsewhere 
var taskFormHandler = function(event) {
        event.preventDefault();
        var taskNameInput = document.querySelector("input[name='task-name']").value;
        var taskTypeInput = document.querySelector("select[name='task-type']").value;
      
        // check if input values are empty strings
        if (!taskNameInput || !taskTypeInput) {
            alert("You need to fill out the task form!");
            return false;
        }
        // reset form fields for next task to be entered
        document.querySelector("input[name='task-name']").value = "";
        document.querySelector("select[name='task-type']").selectedIndex = 0;

        // editing task 
        var isEdit = formEl.hasAttribute("data-task-id");
        
        // has data attribute, so get task id and call function to complete edit process
        if (isEdit) {
          var taskId = formEl.getAttribute("data-task-id");
          completeEditTask(taskNameInput, taskNameInput, taskId);
        }
        // no data attribute, so create object as normal and pass to creatTaskEl function 
        else {
          var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
          };

        // send it as an argument to createTaskEl
        createTaskEl(taskDataObj);
        }
      
  };

// complete edit task function 
var completeEditTask = function(taskName, taskType, taskId) {
  // find the matching task list item 
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // set new values 
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent= taskType;

  // loop through tasks array and task object with new content 
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  };

  alert("Task Updated!");

  // reset form 
  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";

  // local storage
  saveTasks();
};

//new function create task will hold the code that creates new task HTML element 
var createTaskEl = function(taskDataObj) {

    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
  
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);
    
    //task actions 
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    
    tasksToDoEl.appendChild(listItemEl);

    switch (taskDataObj.status) {
      case "to do":
        taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
        tasksToDoEl.append(listItemEl);
        break;
      case "in progress":
        taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
        tasksInProgressEl.append(listItemEl);
        break;
      case "completed":
        taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
        tasksCompletedEl.append(listItemEl);
        break;
      default:
        console.log("Something went wrong!");
    }
    // add value as a property 
    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    // local storage function 
    saveTasks();
  
    // increase task counter for next unique id
    taskIdCounter++;
  };

// new function for buttons 
  var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);

    // select element 
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(statusSelectEl);

    // for loop logic
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
      }


    return actionContainerEl;

};

var taskButtonHandler = function(event) {
  // get target element from event 
  var targetEl = event.target;
  
  // edit button was clicked 
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }
  // delete button was clicked
  else if (targetEl.matches(".delete-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

// add a delete task function 
var deleteTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();

  // create new array to hold updated list of tasks
  var updatedTaskArr = [];

  // loop through current tasks 
  for (var i= 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it intp the new array 
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  // reassign tasks array to be the same as updatedTaskArr
  tasks = updatedTaskArr;

  
  // local storage function 
 saveTasks();
};



// add a edit task function 
var editTask = function(taskId) {
  // get task list item element
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // get content from task name and type 
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  console.log(taskName);

  var taskType = taskSelected.querySelector("span.task-type").textContent;

  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

    // id tag
    formEl.setAttribute("data-task-id", taskId);
  // save edits 
  formEl.querySelector("#save-task").textContent = "Save Task";
}; 

// function for status change 
var taskStatusChangeHandler = function(event) {
  // get the task item's id 
  var taskId = event.target.getAttribute("data-task-id");

  // get the currently selected option's value and convert to lowercase 
  var statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id 
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  }
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  }
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  // update task's in tasks array 
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }

  
  // local storage function 
  saveTasks();
};

// local storage function 
var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};


// create loadTasks function 
var loadTasks = function() {
 var savedTasks = localStorage.getItem("tasks");

 if (!savedTasks) {
   return false;
 }

 savedTasks = JSON.parse(savedTasks);

 // loop through savedTasks array 
 for (var i = 0; i < savedTasks.length; i++) {
   // pass each task object into the createTaskEl() function 
   createTaskEl(savedTasks[i]);
 }
};

// event listener method 
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();
