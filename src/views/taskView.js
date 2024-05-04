//Create Task Form DOM

export const createTaskForm = () => {
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
    const modal = document.createElement('div');
    modal.id = 'taskDetailModal';
    modal.style.display = 'none';
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-modal');
    closeButton.id = 'closeButton';
    closeButton.textContent = 'X';
    closeButton.onclick = closeTaskDetail;

    const titleInput = document.createElement('input');
    titleInput.type = 'text'
    titleInput.classList.add('modal-title');
    titleInput.id = 'modalTitle';

    const description = document.createElement('textarea');
    description.classList.add('modal-description');
    description.id = 'modalDescription';
    description.rows = '4';
    description.cols = '50';

    const dueDate = document.createElement('input');
    dueDate.type = 'date';
    dueDate.classList.add('modal-due-date');
    dueDate.id = 'modalDueDate';

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

function createTaskList(tasks) {
    const tasksList = document.createElement('div');
    tasksList.classList.add('tasks-list');

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksList.appendChild(taskElement);
    });

    return tasksList;
};

function closeNewTaskModal() {

    document.getElementById('modalTitle').textContent = '';
    document.getElementById('modalDescription').value = '';
    document.getElementById('modalDueDate').value = '';
    document.getElementById('modalPriority').selectedIndex = 0;
    document.querySelector('.form-container').style.display = 'none';
};

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

const toggleTaskFormVisibility = (show) => {
    const formContainer = document.querySelector('.form-container');
    if (!formContainer) {
        console.error('formconstainer not founf in DOM');
        return;
    }
    formContainer.style.display = show ? 'block' : 'none';
};

function renderFilteredTasks(filterType) {
    const tasksContainer = document.querySelector('.tasks-container');
    tasksContainer.innerHTML = `<h2>${filterType.charAt(0).toUpperCase() + filterType.slice(1)}</h2>`;

    let filteredTasks = [];
    switch (filterType) {
        case 'today':
            filteredTasks = allTasksArray.filter(isTaskDueToday);
            break;
        case 'upcoming':
            filteredTasks = allTasksArray.filter(isTaskUpcoming);
            break;
        case 'overdue':
            filteredTasks = allTasksArray.filter(isTaskOverdue);
            break;
        case 'completed':
            filteredTasks = allTasksArray.filter(task => task.status === 'complete');
            break;
        default:
            filteredTasks = allTasksArray;
            break;
    }
    // cherck position of this code after refactoring
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });
}

const renderTasks = (tasks) => {
    const tasksContainer = document.querySelector('.tasks-container');

    tasksContainer.innerHTML = ''; //clear container

    const tasksList = createTaskList(tasks);
    tasksContainer.appendChild(tasksList);

};

function renderAllTasksView(allTasksArray) {
    const tasksContainer = document.querySelector('.tasks-container');
    console.log('Rendering all tasks:', allTasksArray);  // Debug log
    tasksContainer.innerHTML = '<h2>All Tasks</h2>';
    allTasksArray.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });
}

const showTaskDetailModal = (task) => {
    const taskDetailModal = document.getElementById('taskDetailNodal');
    document, getElementById('modalTitle').value = task.title;
    document.getElementById('modalDescription').value = task.description;
    document.getElementById('modalDueDate').value = task.dueDate;
    document.getElementById('modalPriority').value = task.priority.toLowerCase();
    document.getElementById('modalProjectSelect').value = task.projectName; // assuming this select exists

    taskDetailModal.style.display = 'block';
};

const hideTaskDetailModal = () => {
    const taskDetailModal = document.getElementById('taskDetailModal');
    taskDetailModal.style.display = 'none';
};
export { createTaskForm, createTaskElement, createTaskDetailModal, createTaskList, closeNewTaskModal, showTaskForm, toggleTaskFormVisibility, renderFilteredTasks, renderTasks, renderAllTasksView, showTaskDetailModal, hideTaskDetailModal };