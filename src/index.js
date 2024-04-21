import './style.css';

//initial state
let projectsArray = [];
let currentProject;

// Models
const Task = (title, description, dueDate, priority) => ({ title, description, dueDate, priority });

const Project = (name) => {
    const tasks = [];
    return { name, tasks, addTask: (task) => tasks.push(task) };
};



//local storage functions

const saveToLocalStorage = () => localStorage.setItem('projects', JSON.stringify(projectsArray));
const loadFromLocalStorage = () => {
    const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    projectsArray = savedProjects.map(projData => {
        const proj = Project(projData.name);
        projData.tasks.forEach(task => proj.addTask(Task(task.title, task.description, task.dueDate, task.priority)));
        return proj;
    });
};



//Create Sidebar DOM
const createSidebar = () => {
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar');

    const inboxButton = document.createElement('button');
    inboxButton.textContent = 'Inbox';
    inboxButton.classList.add('nav-button');
    inboxButton.id = 'inbox';

    const projectListContainer = createProjectListElement([{ name: 'Home' }, { name: 'Work' }]);

    const addButton = document.createElement('button');
    addButton.textContent = '+ Add Task';
    addButton.id = 'add-task-button';
    addButton.classList.add('add-task-button');

    sidebar.appendChild(inboxButton);
    sidebar.appendChild(projectListContainer);
    sidebar.appendChild(addButton);

    return sidebar;
};

//Create Main Content DOM
const createMainContent = () => {
    const mainContent = document.createElement('div');
    mainContent.classList.add('main-content');

    const tasksContainer = document.createElement('div');
    tasksContainer.classList.add('tasks-container');
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


    taskElement.appendChild(title);
    taskElement.appendChild(description);
    taskElement.appendChild(dueDate);
    taskElement.appendChild(priority);


    return taskElement;
};

//Render tasks intio the tasks container
const renderTasks = (tasks) => {
    const tasksContainer = document.querySelector('.tasks-container');
    if (!tasksContainer) {
        console.error('Tasks container not found in the DOM')
        return;
    }
    tasksContainer.innerHTML = ''; //clear container
    tasks.forEach(task => tasksContainer.appendChild(createTaskElement(task))); //populate tasks   
};


// Create Project list element DOM
const createProjectListElement = (projectList) => {
    const projectListContainer = document.createElement('div');
    projectListContainer.classList.add('project-list-container');
    const projectListTitle = document.createElement('h2');
    projectListTitle.textContent = 'Projects';
    projectListContainer.appendChild(projectListTitle);

    const projectListElement = document.createElement('div');
    projectListElement.classList.add('project-list');

    projectList.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.textContent = project.name;
        projectElement.classList.add('project');
        //event listnesrs for project elements
        projectListElement.appendChild(projectElement);

    });
    projectListContainer.appendChild(projectListElement);
    return projectListContainer;

};

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

    //submit button

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Add Task';
    form.appendChild(submitButton);

    const formContainer = document.createElement('div');
    formContainer.appendChild(form);

    return form;

};

//Show the task form
const showTaskForm = () => {

    const mainContent = document.querySelector('.main-content');
    const form = createTaskForm();

    mainContent.innerHTML = '';
    mainContent.appendChild(form);

    form.addEventListener('submit', handleFormSubmit);
};

//handle form submission

const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const title = form.elements['title'].value;
    const description = form.elements['description'].value;
    const dueDate = form.elements['due-date'].value;
    const priority = form.elements['priority'].value;

    addTaskToProject(title, description, dueDate, priority);

    form.remove();//remove from from DOM after submission

    //show the tasks container again
    const tasksContainer = document.querySelector('.tasks-container');
    if (tasksContainer) {
        tasksContainer.style.display = '';
    }
};

//Add new task to current Project and re-render tasks
const addTaskToProject = (title, description, dueDate, priority) => {
    const newTask = Task(title, description, dueDate, priority);
    currentProject.tasks.push(newTask);
    renderTasks(currentProject.tasks);
    saveToLocalStorage();
};



//Load the eitire application
const loadApplication = () => {
    const root = document.getElementById('root');
    root.classList.add('root');

    const sidebar = createSidebar();
    const mainContent = createMainContent();

    root.appendChild(sidebar);
    root.appendChild(mainContent);

    document.getElementById('add-task-button').addEventListener('click', showTaskForm);

    loadFromLocalStorage();
    if (projectsArray.length > 0) {
        currentProject = projectsArray[0];
        renderTasks(currentProject.tasks);
    } else {
        currentProject = Project('Default');
        projectsArray.push(currentProject);
        saveToLocalStorage();
    };

};

//Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    loadApplication();
    const addTaskButton = document.getElementById('add-task-button');
    if (addTaskButton) {
        addTaskButton.addEventListener('click', showTaskForm);
    } else {
        console.error('Add Task button not found!');
    }

});
