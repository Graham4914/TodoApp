import './style.css';



const Task = (title, description, dueDate, priority) => {
    return { title, description, dueDate, priority };
};

const Project = (name) => {
    const tasks = [];
    return {
        name,
        tasks,
        addTask(task) { tasks.push(task); },
        removeTask(index) { tasks.splice(index, 1); }
    };
};

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


    //add listeners

    sidebar.appendChild(inboxButton);
    sidebar.appendChild(projectListContainer);
    sidebar.appendChild(addButton);

    return sidebar;

};

const createMainContent = () => {
    const mainContent = document.createElement('div');
    mainContent.classList.add('main-content');

    return mainContent;

};

//Create task function

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

//Project list
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

//CREATE TASK FORM

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

    return form;

};

const showTaskForm = () => {
    const mainContent = document.querySelector('.main-content');
    const form = createTaskForm();

    //clear content
    mainContent.innerHTML = '';
    mainContent.appendChild(form);

};

const initForm = () => {
    const taskForm = document.getElementById('task-form');
    if (taskForm) {
        taskForm.addEventListener('submit', (event) => {
            event.preventDefault();
        });
    }
};




//build application on page
const loadApplication = () => {
    const root = document.getElementById('root');
    root.classList.add('root');

    const sidebar = createSidebar();
    const mainContent = createMainContent();

    root.appendChild(sidebar);
    root.appendChild(mainContent);
    initForm();

    document.getElementById('add-task-button').addEventListener('click', showTaskForm);

    const exapleTask = { title: 'Finish to-do list project' };
    mainContent.appendChild(createTaskElement(exapleTask));

    // const exampleProject = [{ name: 'Home' }, { name: 'Work' }];
    // sidebar.appendChild(createProjectListElement(exampleProject));

};

document.addEventListener('DOMContentLoaded', loadApplication);