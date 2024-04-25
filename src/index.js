
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
    return { name, tasks, addTask: (task) => tasks.push(task) };
};


//delete tasks function
function deleteTask(taskToDelete) {
    currentProject.tasks = currentProject.tasks.filter(task => task !== taskToDelete);
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



//Create Sidebar DOM
const createSidebar = () => {
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar');

    const inboxButton = document.createElement('button');
    inboxButton.textContent = 'Inbox';
    inboxButton.classList.add('nav-button');
    inboxButton.id = 'inbox';

    const projectListContainer = createProjectListElement([{ name: 'Home' }, { name: 'Work' }]);
    const addProjectBtn = document.createElement('button');
    addProjectBtn.textContent = 'Add Project';
    addProjectBtn.onclick = () => showAddProjectForm();

    const projectListElement = createProjectListElement(projectsArray);



    const addButton = document.createElement('button');
    addButton.textContent = '+ Add Task';
    addButton.id = 'add-task-button';
    addButton.classList.add('add-task-button');

    sidebar.appendChild(inboxButton);
    sidebar.appendChild(projectListContainer);
    sidebar.appendChild(addButton);
    sidebar.appendChild(addProjectBtn);


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
    deleteBtn.onclick = (event) => {
        event.stopPropagation();
        deleteTask(task);
    };
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

    //c

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
}




//Render tasks into the tasks container
const renderTasks = (tasks) => {
    const tasksContainer = document.querySelector('.tasks-container');
    if (!tasksContainer) {
        console.error('Tasks container not found in the DOM')
        return;
    }
    tasksContainer.innerHTML = ''; //clear container
    tasks.forEach(task => {
        console.log('rendering task:', task);
        tasksContainer.appendChild(createTaskElement(task));
    }); //populate tasks   
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
    formContainer.style.display = show ? 'block' : 'none';
};

//Show the task form
const showTaskForm = () => {
    const form = document.getElementById('task-form');
    form.reset();
    toggleTaskFormVisibility(true);
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

    const tasksContainer = mainContent.querySelector('.tasks-container');
    tasksContainer.style.display = '';

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
    createTaskDetailModal();
    const addTaskButton = document.getElementById('add-task-button');
    if (addTaskButton) {
        addTaskButton.addEventListener('click', showTaskForm);
    } else {
        console.error('Add Task button not found!');
    }

});
