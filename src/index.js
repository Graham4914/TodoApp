
import './style.css';

let currentEditingTaskId = null;
//initial state
let allTasksArray = [];
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
const Task = (title, description, dueDate, priority, projectName = null, status = 'incomplete') => {
    return {
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        title,
        description,
        dueDate,
        priority,
        projectName,
        status
    };
}

const Project = (name) => {
    const tasks = [];

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

    allTasksArray = allTasksArray.filter(task => task.id !== taskToDelete.id);
    saveToLocalStorage();
    renderTasks(currentProject.tasks);
    updateMainContentForProject(currentProject);
}


//local storage functions

const saveToLocalStorage = () => {
    console.log('Saving to local storage', projectsArray);
    localStorage.setItem('projects', JSON.stringify(projectsArray));
};
const loadFromLocalStorage = () => {
    const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    console.log('Loaded from Local storage', savedProjects);

    projectsArray = [];
    allTasksArray = [];
    savedProjects.forEach(projData => {
        const proj = Project(projData.name);
        projData.tasks.forEach(task => {
            const loadedTask = Task(task.title, task.description, task.dueDate, task.priority, task.projectName, task.status);
            proj.addTask(loadedTask);
            allTasksArray.push(loadedTask);
        });
        projectsArray.push(proj);
    });

    console.log('Projects and All Tasks loaded:', projectsArray, allTasksArray);
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

    return { container, button };
}

//Create Sidebar DOM
const createSidebar = () => {
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar');

    const taskListTitle = document.createElement('h2')
    taskListTitle.textContent = 'Tasks';
    taskListTitle.classList.add('task-list-title')

    const { container: allTasksContainer, button: allTasksButton } = createButtonWithCounter('All Tasks', calculateTaskCount('all'), 'nav-button', 'all-tasks-button');
    allTasksButton.addEventListener('click', renderAllTasksView);


    const { container: todayTasksContainer } = createButtonWithCounter('Today', calculateTaskCount('today'), 'nav-button', 'today-tasks-button');
    const { container: upcomingTaskContainer } = createButtonWithCounter('Upcoming', calculateTaskCount('upcoming'), 'nav-button', 'upcoming-tasks-button');
    const { container: overdueTasksContainer } = createButtonWithCounter('Overdue', calculateTaskCount('overdue'), 'nav-button', 'overdue-tasks-button');
    const { container: completedTasksContainer } = createButtonWithCounter('Completed', calculateTaskCount('completed'), 'nav-button', 'completed-tasks-button');


    const projectListContainer = createProjectListElement([{ name: 'Home' }, { name: 'Work' }]);

    // const projectListElement = createProjectListElement(projectsArray);

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

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = task.status === 'complete';


    checkbox.addEventListener('change', function (event) {
        event.stopImmediatePropagation();
        task.status = this.checked ? 'complete' : 'incomplete'; // Update the task's completed property
        saveToLocalStorage();
    });

    taskElement.appendChild(checkbox);

    const title = document.createElement('h2');
    title.textContent = task.title;

    const description = document.createElement('p');
    description.textContent = task.description;

    const dueDate = document.createElement('p');
    dueDate.textContent = `Due:${task.dueDate}`;

    const priority = document.createElement('span');
    priority.textContent = `Priority: ${task.priority}`;

    taskElement.addEventListener('click', function (event) {
        if (event.target.type !== 'checkbox') {
            openTaskDetail(task);
        }

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
    const titleInput = document.createElement('input');
    titleInput.type = 'text'
    titleInput.classList.add('modal-title');
    titleInput.id = 'modalTitle';
    // titleInput.placeholder = 'Enter task title';


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

    const projectDropdown = generateProjectDropdown();
    projectDropdown.id = 'modalProjectSelect';
    modalContent.appendChild(projectDropdown);


    modalContent.appendChild(titleInput);
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
    document.getElementById('modalTitle').value = task.title;
    document.getElementById('modalDescription').value = task.description;
    document.getElementById('modalDueDate').value = task.dueDate;
    document.getElementById('modalPriority').value = task.priority.toLowerCase();
    const projectDropdown = document.getElementById('modalProjectSelect');
    projectDropdown.value = task.projectName;

    taskDetailModal.style.display = 'block';
    console.log(`Editing task ID:${currentEditingTaskId}`);
};



function saveCurrentTask() {

    // Check that the current project is defined and has a tasks array
    if (!currentProject || !Array.isArray(currentProject.tasks)) {
        console.error("The current project is not defined or has no tasks property.");
        return;
    }

    const taskIndex = currentProject.tasks.findIndex(t => t.id === currentEditingTaskId);
    console.log("saving task details for ID:", currentEditingTaskId);

    if (taskIndex !== -1) {
        const task = currentProject.tasks[taskIndex];
        console.log("OldTask Data:", JSON.stringify(task));

        //update task details
        task.title = document.getElementById('modalTitle').value;
        task.description = document.getElementById('modalDescription').value;
        task.dueDate = document.getElementById('modalDueDate').value;
        task.priority = document.getElementById('modalPriority').value;

        const newProjectName = document.getElementById('modalProjectSelect').value;

        //check if task has been reassigned to new project
        if (task.projectName !== newProjectName) {
            currentProject.tasks.splice(taskIndex, 1);

            const newProject = projectsArray.find(p => p.name === newProjectName);

            task.projectName = newProjectName;
            newProject.tasks.push(task);
        }

        console.log("Updated Tas Data", JSON.stringify(task));

        renderTasks(currentProject.tasks);
        saveToLocalStorage();
        updateMainContentForProject(currentProject);
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
    updateMainContentForProject(currentProject);
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

    const projectTitleInput = document.createElement('input');
    projectTitleInput.type = 'text';
    projectTitleInput.value = project.name;
    projectTitleInput.classList.add('project-title-input');

    projectTitleInput.addEventListener('blur', () => {
        saveProjectName(project, projectTitleInput.value);
    });

    projectTitleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            projectTitleInput.blur();
        }
    });

    projectContent.appendChild(projectTitleInput);
    // Check if projectTitle is set correctly
    console.log("projectTitle set to:", projectTitleInput);

    const addTaskButton = document.createElement('button');
    addTaskButton.textContent = "Add Task to Project";
    addTaskButton.addEventListener('click', showTaskForm);
    projectContent.appendChild(addTaskButton);

    // add project close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', () => closeProjectView());
    projectContent.appendChild(closeButton);

    //add delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => deleteProject(project));
    projectContent.appendChild(deleteButton)

    return projectContent;
}

// delete project funtion
function deleteProject(projectToDelete) {
    projectsArray = projectsArray.filter(project => project !== projectToDelete);
    saveToLocalStorage();

    updateProjectListUI();

    if (projectsArray.length > 0) {
        updateMainContentForProject(projectsArray[0]);
    } else {
        console.log('no projects selected')
        // showEmptyStateOrPrompt();
    }
}

// close project view
function closeProjectView() {
    const tasksContainer = document.querySelector('.tasks-container');
    if (tasksContainer) {
        tasksContainer.innerHTML = '';
    }
}

//update main content with Project
function updateMainContentForProject(project) {

    if (!project) {
        console.error("no project provided to updatemaincontentforproject", project.name);
        return;
    }

    if (!project.name) {
        console.error("Project data is invalid", project);
        return;
    }

    console.log("Attempting to update content for project:", project.name);
    const relevantTasks = currentProject.tasks.filter(task => task.projectName === project.name);

    const tasksContainer = document.querySelector('.tasks-container');

    tasksContainer.innerHTML = '';

    tasksContainer.appendChild(createProjectContent(project));
    const tasksList = createTaskList(project.tasks);
    tasksContainer.appendChild(tasksList);
    currentProject = project;
}

function saveProjectName(project, newName) {
    if (!project) {
        console.error("no project available to save name")
        return;
    }

    project.name = newName;
    saveToLocalStorage();
    updateProjectListUI();
    updateMainContentForProject(project);
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

function generateProjectDropdown() {
    const select = document.createElement('select');
    select.id = 'projectSelect';
    console.log('Generating dropdown with projects:', projectsArray); // Debugging line
    projectsArray.forEach(project => {
        const option = document.createElement('option');
        option.value = project.name;
        option.textContent = project.name;
        select.appendChild(option);
    });
    return select;
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

    const projectDropdown = generateProjectDropdown();
    form.appendChild(projectDropdown);


    // add Task from close button
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

    if (formContainer) {
        formContainer.style.display = 'block';
        const form = document.getElementById('task-form')
        const existingDropdown = document.getElementById('projectSelect');

        if (existingDropdown) {
            existingDropdown.remove();
        }
        const dropdown = generateProjectDropdown();
        form.insertBefore(dropdown, form.querySelector('button[type="submit"]'));

        if (form) {
            form.reset();
        } else {
            console.error('Task form or project select is missing from DOM');
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
    const projectName = form.elements['projectSelect'].value;

    console.log('Form submitted with:', { title, description, dueDate, priority, projectName });

    addTaskToProject(title, description, dueDate, priority, projectName);

    toggleTaskFormVisibility(false);

    console.log('Current project after adding task:', currentProject);

};

//Add new task to current Project and re-render tasks
const addTaskToProject = (title, description, dueDate, priority, projectName) => {
    const newTask = Task(title, description, dueDate, priority, projectName);
    allTasksArray.push(newTask);

    let assignedProject = projectsArray.find(p => p.name === projectName);

    if (!assignedProject) {
        assignedProject = projectsArray.find(p => p.name === "Default");
        if (!assignedProject) {
            console.error("default project not found");
            return;
        }
    }
    assignedProject.tasks.push(newTask);
    console.log('Added new task to project', newTask, 'Current tasks:', assignedProject.tasks);


    saveToLocalStorage();
    renderAllTasksView();
    updateMainContentForProject(assignedProject);
}


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
    renderAllTasksView();
};

function renderAllTasksView() {
    const tasksContainer = document.querySelector('.tasks-container');
    console.log('Rendering all tasks:', allTasksArray);  // Debug log
    tasksContainer.innerHTML = '<h2>All Tasks</h2>';
    allTasksArray.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });
}

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
