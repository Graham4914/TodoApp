
import './style.css';

let currentEditingTaskId = null;
//initial state
let projectsArray = [];
let currentProject;


function closeNewTaskModal() {

    document.getElementById('modalTitle').textContent = '';
    document.getElementById('modalDescription').value = '';
    document.getElementById('modalDueDate').value = '';
    document.getElementById('modalPriority').selectedIndex = 0;
    document.querySelector('.form-container').style.display = 'none';
}
// Models
// const Task = (title, description, dueDate, priority) => ({ title, description, dueDate, priority });
const Task = (title, description, dueDate, priority) => {
    return {
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        title,
        description,
        dueDate,
        priority
    };
};

const Project = (name) => {
    const tasks = [];
    // return { name, tasks, addTask: (task) => tasks.push(task) };
    return {
        name,
        tasks,
        addTask(task) {
            tasks.push(task);
        }
    };
};


//delete tasks function
function deleteTask(taskToDelete) {
    currentProject.tasks = currentProject.tasks.filter(task => task.id !== taskToDelete.id);
    saveToLocalStorage();
    renderTasks(currentProject.tasks);
}


//local storage functions

const saveToLocalStorage = () => {
    console.log('Saving to local storage', projectsArray);
    localStorage.setItem('projects', JSON.stringify(projectsArray));
};
const loadFromLocalStorage = () => {
    const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    console.log('Loaded from Local storage', savedProjects);
    projectsArray = savedProjects.map(projData => {
        const proj = Project(projData.name);
        projData.tasks.forEach(task => proj.addTask(Task(task.title, task.description, task.dueDate, task.priority)));
        return proj;
    });
};

//helper funtion for task btn and filter container element
function createButtonWithCounter(buttonText, count, cssClass, id) {
    const container = document.createElement('div');
    const button = document.createElement('button');
    const counter = document.createElement('span');

    button.textContent = buttonText;
    counter.textContent = count;

    button.classList.add(cssClass);
    button.id = id;

    container.appendChild(button);
    container.appendChild(counter);

    return container;
}

//Create Sidebar DOM
const createSidebar = () => {
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar');

    const taskListTitle = document.createElement('h2')
    taskListTitle.textContent = 'Tasks';
    taskListTitle.classList.add('task-list-title')

    const allTasksContainer = createButtonWithCounter('All Tasks', calculateTaskCount('all'), 'nav-button', 'all-tasks-button');
    const todayTasksContainer = createButtonWithCounter('Today', calculateTaskCount('today'), 'nav-button', 'today-tasks-button');
    const upcomingTaskContainer = createButtonWithCounter('Upcoming', calculateTaskCount('upcoming'), 'nav-button', 'upcoming-tasks-button');
    const overdueTasksContainer = createButtonWithCounter('Overdue', calculateTaskCount('overdue'), 'nav-button', 'overdue-tasks-button');
    const completedTasksContainer = createButtonWithCounter('Completed', calculateTaskCount('completed'), 'nav-button', 'completed-tasks-button');

    const projectListContainer = createProjectListElement([{ name: 'Home' }, { name: 'Work' }]);

    const projectListElement = createProjectListElement(projectsArray);

    const addButton = document.createElement('button');
    addButton.textContent = '+ Add Task';
    addButton.id = 'add-task-button';
    addButton.classList.add('add-task-button');


    sidebar.appendChild(taskListTitle);
    sidebar.appendChild(addButton);
    sidebar.appendChild(allTasksContainer);
    sidebar.appendChild(todayTasksContainer);
    sidebar.appendChild(upcomingTaskContainer);
    sidebar.appendChild(overdueTasksContainer);
    sidebar.appendChild(completedTasksContainer);
    sidebar.appendChild(projectListContainer);

    return sidebar;
};

function calculateTaskCount(filterCriteria) {
    return 42; //example
}

//Create Main Content DOM
const createMainContent = () => {
    const mainContent = document.createElement('div');
    mainContent.classList.add('main-content');

    const tasksContainer = document.createElement('div');
    tasksContainer.classList.add('tasks-container');


    const tasksListContainer = document.createElement('div');
    tasksListContainer.classList.add('tasks-list-container');

    tasksContainer.appendChild(tasksListContainer);

    mainContent.appendChild(tasksContainer);

    return mainContent;
};


//Create task element DOM

const createTaskElement = (task) => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');

    const title = document.createElement('h2');
    title.textContent = task.title;

    const description = document.createElement('p');
    description.textContent = task.description;

    const dueDate = document.createElement('p');
    dueDate.textContent = `Due:${task.dueDate}`;

    const priority = document.createElement('span');
    priority.textContent = `Priority: ${task.priority}`;

    taskElement.addEventListener('click', () => {
        openTaskDetail(task);
    });

    taskElement.appendChild(title);
    taskElement.appendChild(description);
    taskElement.appendChild(dueDate);
    taskElement.appendChild(priority);

    //color coding
    const priorityColors = { high: 'red', medium: 'yellow', low: 'green' };
    priority.style.backgroundColor = priorityColors[task.priority.toLowerCase()];

    //Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-task-button');

    deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteTask(task);

    });
    taskElement.appendChild(deleteBtn);

    return taskElement;
};


//Create task detail modal
function createTaskDetailModal() {
    //modal container
    const modal = document.createElement('div');
    modal.id = 'taskDetailModal';
    modal.style.display = 'none';
    modal.classList.add('modal');

    //modal content container
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    //close button
    const closeButton = document.createElement('span');
    closeButton.classList.add('close-modal');
    closeButton.id = 'closeButton';
    closeButton.textContent = 'X';
    closeButton.onclick = closeTaskDetail;


    //Title element
    const title = document.createElement('h2');
    title.classList.add('modal-title');
    title.id = 'modalTitle';


    //Description  element
    const description = document.createElement('textarea');
    description.classList.add('modal-description');
    description.id = 'modalDescription';
    description.rows = '4';
    description.cols = '50';

    //Duedate element
    const dueDate = document.createElement('input');
    dueDate.type = 'date';
    dueDate.classList.add('modal-due-date');
    dueDate.id = 'modalDueDate';

    //priority element
    const priority = document.createElement('select');
    priority.classList.add('modal-priority');
    priority.id = 'modalPriority';
    ['High', 'Medium', 'Low'].forEach((p) => {
        const option = document.createElement('option');
        option.value = p.toLocaleLowerCase();
        option.textContent = p;
        priority.appendChild(option);
    });

    modalContent.appendChild(title);
    modalContent.appendChild(closeButton);
    modalContent.appendChild(description);
    modalContent.appendChild(dueDate);
    modalContent.appendChild(priority);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    return modal;
};

function openTaskDetail(task) {
    currentEditingTaskId = task.id;
    console.log(`Editing task ID: ${currentEditingTaskId}`);
    const taskDetailModal = document.getElementById('taskDetailModal');
    document.getElementById('modalTitle').textContent = task.title;
    document.getElementById('modalDescription').value = task.description;
    document.getElementById('modalDueDate').value = task.dueDate;
    document.getElementById('modalPriority').value = task.priority.toLowerCase();
    taskDetailModal.style.display = 'block';
    console.log(`Editing task ID:${currentEditingTaskId}`);
};



function saveCurrentTask() {
    const taskIndex = currentProject.tasks.findIndex(t => t.id === currentEditingTaskId);
    console.log("saving task details for ID:", currentEditingTaskId);

    if (taskIndex !== -1) {
        const task = currentProject.tasks[taskIndex];
        console.log("OldTask Data:", JSON.stringify(task));
        //get datafrom modal fieldsand update the task
        task.title = document.getElementById('modalTitle').textContent;
        task.description = document.getElementById('modalDescription').value;
        task.dueDate = document.getElementById('modalDueDate').value;
        task.priority = document.getElementById('modalPriority').value;

        console.log("Updated Tas Data", JSON.stringify(task));

        renderTasks(currentProject.tasks);
        saveToLocalStorage();
    } else {
        console.log("Task not foiund with ID:", currentEditingTaskId);
    }

}

//funtion to close the task detail modal
function closeTaskDetail() {
    saveCurrentTask();
    const taskDetailModal = document.getElementById('taskDetailModal');
    taskDetailModal.style.display = 'none';
    currentEditingTaskId = null;
    renderTasks(currentProject.tasks);
}



//Render tasks into the tasks container
const renderTasks = (tasks) => {
    const tasksContainer = document.querySelector('.tasks-container');

    tasksContainer.innerHTML = ''; //clear container

    const tasksList = createTaskList(tasks);
    tasksContainer.appendChild(tasksList);

};

function addNewProject() {
    const projectName = prompt('Enter new project name:');
    if (projectName) {
        const newProject = Project(projectName);
        projectsArray.push(newProject);
        updateProjectListUI();
        saveToLocalStorage();
    }
}


// Create Project list element DOM
const createProjectListElement = () => {
    const projectListContainer = document.createElement('div');
    projectListContainer.classList.add('project-list-container');

    const headerContainer = document.createElement('div');
    headerContainer.classList.add('project-header-container');


    const projectListTitle = document.createElement('h2');
    projectListTitle.textContent = 'Projects';
    projectListTitle.classList.add('projects-heading');

    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('project-controls');

    const addProjectButton = document.createElement('button');
    addProjectButton.textContent = '+';
    addProjectButton.classList.add('add-project-button');
    addProjectButton.addEventListener('click', addNewProject);

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Hide';
    toggleButton.classList.add('toggle-projects-button');
    toggleButton.addEventListener('click', function () {
        const projectList = document.getElementById('project-list');
        if (projectList.style.display === 'none' || projectList.style.display === '') {
            projectList.style.display = 'block';
            toggleButton.textContent = 'hide'
        } else {
            projectList.style.display = 'none';
            toggleButton.textContent = 'show';
        }

    });

    controlsContainer.appendChild(addProjectButton);
    controlsContainer.appendChild(toggleButton);

    headerContainer.appendChild(projectListTitle);
    headerContainer.appendChild(controlsContainer);
    projectListContainer.appendChild(headerContainer);

    const projectListElement = document.createElement('div');
    projectListElement.classList.add('project-list');
    projectListElement.id = 'project-list';
    projectListElement.style.display = 'flex';
    projectListContainer.appendChild(projectListElement);

    return projectListContainer;
};

const updateProjectListUI = () => {
    const projectListElement = document.getElementById('project-list');
    projectListElement.innerHTML = '';

    projectsArray.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.textContent = project.name;
        projectElement.classList.add('project');
        projectElement.addEventListener('click', () => {
            currentProject = project;
            updateMainContentForProject(project);

        });
        projectListElement.appendChild(projectElement);
    });
};

function createProjectContent(project) {
    const projectContent = document.createElement('div');
    projectContent.classList.add('project-content');

    const projectTitle = document.createElement('h2');
    projectTitle.textContent = project.name;
    projectContent.appendChild(projectTitle);
    // Check if projectTitle is set correctly
    console.log("projectTitle set to:", projectTitle.textContent);

    const addTaskButton = document.createElement('button');
    addTaskButton.textContent = "Add Task to Project";
    addTaskButton.addEventListener('click', showTaskForm);
    projectContent.appendChild(addTaskButton);

    return projectContent;
}
//update main content with Project
function updateMainContentForProject(project) {
    console.log("Attempting to update content for project:", project.name);

    const tasksContainer = document.querySelector('.tasks-container');
    console.log('Tasks Container found:', tasksContainer);  // Check if the tasksContainer itself is found

    let tasksListContainer = document.querySelector('.tasks-list-container');
    console.log('Initial check - Tasks List Container found:', tasksListContainer); // Initial check for the container

    if (!tasksListContainer) {
        console.error('Tasks list container not found in DOM, creating a new one');
        tasksListContainer = document.createElement('div');
        tasksListContainer.classList.add('tasks-list-container');
        if (tasksContainer) {
            tasksContainer.appendChild(tasksListContainer);
        } else {
            console.error('Tasks container not available to append tasks list container');
            return;
        }
    }

    tasksListContainer.innerHTML = '';
    console.log('Cleared tasksListContainer');

    const projectContent = createProjectContent(project);
    tasksListContainer.appendChild(projectContent);
    console.log('Added project content');

    const tasksList = createTaskList(project.tasks);
    tasksListContainer.appendChild(tasksList);
    console.log('Added tasks list');

    currentProject = project;
}

function createTaskList(tasks) {
    const tasksList = document.createElement('div');
    tasksList.classList.add('tasks-list');

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksList.appendChild(taskElement);
    });

    return tasksList;
}


//Create Task Form DOM

const createTaskForm = () => {
    const form = document.createElement('form');
    form.id = 'task-form';
    form.classList.add('task-form');

    //inputs for title
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.name = 'title';
    titleInput.placeholder = 'Task Title';
    form.appendChild(titleInput);

    //input for description
    const descriptionInput = document.createElement('textarea');
    descriptionInput.name = 'description';
    descriptionInput.placeholder = 'Task Description'
    form.appendChild(descriptionInput);

    //input due date
    const dueDateInput = document.createElement('input');
    dueDateInput.type = 'date';
    dueDateInput.name = 'due-date';
    form.appendChild(dueDateInput);

    //input for priority
    const prioritySelect = document.createElement('select');
    prioritySelect.name = 'priority';
    ['High', 'Medium', 'Low'].forEach(priority => {
        const option = document.createElement('option');
        option.value = priority.toLowerCase();
        option.textContent = priority;
        prioritySelect.appendChild(option);
    });
    form.appendChild(prioritySelect);


    //close button
    const closeButton = document.createElement('span');
    closeButton.classList.add('close-modal');
    closeButton.id = 'closeButton';
    closeButton.textContent = 'X';
    form.appendChild(closeButton);
    closeButton.addEventListener('click', closeNewTaskModal);

    //submit button

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Add Task';
    form.appendChild(submitButton);


    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');
    formContainer.style.display = 'none';
    formContainer.appendChild(form);
    form.addEventListener('submit', handleFormSubmit);
    return formContainer;
};

//Toggle the task form visibility
const toggleTaskFormVisibility = (show) => {
    const formContainer = document.querySelector('.form-container');
    if (!formContainer) {
        console.error('formconstainer not founf in DOM');
        return;
    }
    formContainer.style.display = show ? 'block' : 'none';
};

//Show the task form
const showTaskForm = () => {
    const formContainer = document.querySelector('.form-container');

    // toggleTaskFormVisibility(true);

    if (formContainer) {
        formContainer.style.display = 'block';
        const form = document.getElementById('task-form')
        if (form) {
            form.reset();
        } else {
            console.error('Task from is missing from DOM');
        }

    } else {
        console.error('Form container is missing from DOM');
    }

};


//handle form submission

const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const title = form.elements['title'].value;
    const description = form.elements['description'].value;
    const dueDate = form.elements['due-date'].value;
    const priority = form.elements['priority'].value;

    console.log('Form submitted with:', { title, description, dueDate, priority });

    addTaskToProject(title, description, dueDate, priority);
    toggleTaskFormVisibility(false);

    console.log('Current project after adding task:', currentProject);
    renderTasks(currentProject.tasks);
};

//Add new task to current Project and re-render tasks
const addTaskToProject = (title, description, dueDate, priority) => {
    const newTask = Task(title, description, dueDate, priority);
    currentProject.tasks.push(newTask);
    console.log('added New task to project', newTask, 'Current tasks:', currentProject.tasks);
    // renderTasks(currentProject.tasks);
    saveToLocalStorage();
};



//Load the eitire application
const loadApplication = () => {
    const root = document.getElementById('root');
    root.classList.add('root');

    const sidebar = createSidebar();
    const mainContent = createMainContent();
    const formContainer = createTaskForm();
    mainContent.appendChild(formContainer);

    root.appendChild(sidebar);
    root.appendChild(mainContent);

    document.getElementById('add-task-button').addEventListener('click', showTaskForm);

    loadFromLocalStorage();

    if (projectsArray.length > 0) {
        currentProject = projectsArray[0];
    } else {
        currentProject = Project('Default');
        projectsArray.push(currentProject);
        saveToLocalStorage();
    }

    updateProjectListUI();
    renderTasks(currentProject.tasks);
};

//Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    loadApplication();
    createTaskDetailModal();
    const addTaskButton = document.getElementById('add-task-button');
    if (addTaskButton) {
        addTaskButton.addEventListener('click', showTaskForm);
    } else {
        console.error('Add Task button not found!');
    }

});
