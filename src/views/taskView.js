//taskView.js
import { generateProjectDropdown } from "./projectView";
import { handleFormSubmit, deleteTask, closeTaskDetail, openTaskDetail } from "../controllers/taskController";
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/localStorage";
import { isTaskDueToday, isTaskOverdue, isTaskUpcoming, isTaskCompleted, calculateTaskCount, updateCounters } from "../utils/taskUtils";
import { getAllTasks, getTaskById, allTasksArray, setAllTasks, getProjects, setProjects, saveAppState } from "../models/appState";

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
    closeButton.textContent = 'X';
    closeButton.classList.add('close-modal');
    closeButton.id = 'closeButton';
    closeButton.addEventListener('click', () => toggleTaskFormVisibility(false));
    form.appendChild(closeButton);

    //submit button

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Add Task';
    form.appendChild(submitButton);

    form.addEventListener('submit', handleFormSubmit);

    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');
    formContainer.style.display = 'none';
    formContainer.appendChild(form);

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

        // Debugging statement
        console.log(`Task "${task.title}" status changed to: ${task.status}`);

        // Update tasks arrays and save to local storage
        let allTasks = getAllTasks();
        const projects = getProjects();

        console.log("Initial allTasks:", allTasks);
        console.log("Initial projects:", projects);

        // Remove task from allTasks array to avoid duplication
        allTasks = allTasks.filter(t => t.id !== task.id);

        if (this.checked) {
            // Remove task from project tasks if marked complete
            const project = projects.find(p => p.name === task.projectName);
            if (project) {
                project.tasks = project.tasks.filter(t => t.id !== task.id);
            }
            console.log(`Task "${task.title}" marked as complete and removed from its project tasks:`, project);
        } else {
            allTasks.push(task);
            // Add task back to project tasks if marked incomplete
            const project = projects.find(p => p.name === task.projectName);
            if (project) {
                project.tasks.push(task);
            }
            console.log(`Task "${task.title}" marked as incomplete and added back to project tasks:`, project)
        }

        if (!allTasks.some(t => t.id === task.id)) {
            allTasks.push(task);
        }
        console.log("Updated allTasks before setting:", allTasks);

        setAllTasks(allTasks);
        setProjects(projects);
        saveAppState();

        console.log("Updated allTasks after setting:", getAllTasks());
        console.log("Updated projects after setting:", getProjects());

        renderFilteredTasks('all');
        renderFilteredTasks('completed');
        updateCounters();

        console.log('Filtered Tasks after status change:', getAllTasks().filter(t => t.status === 'complete'));

    });

    taskElement.appendChild(checkbox);

    const taskDetail = document.createElement('div');
    taskDetail.classList.add('task-detail');

    const title = document.createElement('span');
    title.textContent = task.title;
    title.classList.add('task-title');

    const description = document.createElement('span');
    description.textContent = task.description;
    description.classList.add('task-description');

    taskDetail.appendChild(title);
    taskDetail.appendChild(description);

    // Right-aligned container for due date, priority, and delete button
    const taskRightContainer = document.createElement('div');
    taskRightContainer.classList.add('task-right-container');

    const dueDate = document.createElement('span');
    dueDate.textContent = `Due:${task.dueDate}`;
    dueDate.classList.add('task-due-date');

    const priority = document.createElement('span');
    priority.textContent = `Priority: ${task.priority}`;
    priority.classList.add('task-priority', task.priority.toLowerCase());

    // //color coding
    // const priorityColors = { high: 'red', medium: 'yellow', low: 'green' };
    // priority.style.backgroundColor = priorityColors[task.priority.toLowerCase()];

    //Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-task-button');

    deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteTask(task);
        renderAllTasksView(getAllTasks)//check this line

    });

    taskRightContainer.appendChild(dueDate);
    taskRightContainer.appendChild(priority);
    taskRightContainer.appendChild(deleteBtn);

    taskElement.appendChild(taskDetail);
    taskElement.appendChild(taskRightContainer);

    taskElement.addEventListener('click', function (event) {
        if (event.target.type !== 'checkbox') {
            openTaskDetail(task.id);
        }
    });




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

const closeNewTaskModal = () => {
    const form = document.getElementById('task-form');
    if (!form) {
        console.error('Task form not found in the DOM');
        return;
    }

    form.reset(); // This will reset all form inputs to their default values

    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.style.display = 'none';
    } else {
        console.error('Form container not found in the DOM');
    }
};

const showTaskForm = () => {
    const formContainer = document.querySelector('.form-container');
    console.log("Attempting to show form, found container:", formContainer);

    if (formContainer) {
        formContainer.style.display = 'block';
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
    console.log(`Filter type received: ${filterType}`);  // Debug log to verify filter type received
    const headingText = filterType === 'all' ? 'All Tasks' : filterType.charAt(0).toUpperCase() + filterType.slice(1);
    console.log(`Setting heading to: ${headingText}`);
    tasksContainer.innerHTML = `<h2>${headingText}</h2>`;


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
            filteredTasks = allTasksArray.filter(isTaskCompleted);
            break;
        case 'all':
        default:
            filteredTasks = allTasksArray.filter(task => task.status !== 'complete');
            break;
    }

    console.log(`Rendering ${filterType} tasks:`, filteredTasks);

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

function renderAllTasksView(tasks) {
    const tasksContainer = document.querySelector('.tasks-container');
    if (!tasksContainer) {
        console.error("Tasks container not found in the DOM");
        return;
    }

    console.log('Rendering all tasks:', tasks);  // Debug log

    if (!Array.isArray(tasks)) {
        console.error("Expected an array of tasks, but received:", tasks);
        return;
    }

    tasksContainer.innerHTML = '<h2>All Tasks</h2>';
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });
}


const showTaskDetailModal = (task) => {
    const taskDetailModal = document.getElementById('taskDetailModal');
    if (!taskDetailModal) {
        console.error('Task detail modal not found in dom');
        return;
    }
    document.getElementById('modalTitle').value = task.title;
    document.getElementById('modalDescription').value = task.description;
    document.getElementById('modalDueDate').value = task.dueDate;
    document.getElementById('modalPriority').value = task.priority.toLowerCase();
    document.getElementById('modalProjectSelect').value = task.projectName; // assuming this select exists

    taskDetailModal.style.display = 'block';
};

const closeTaskDetailModal = () => {
    const taskDetailModal = document.getElementById('taskDetailModal');
    if (taskDetailModal) {
        taskDetailModal.style.display = 'none';
    }

    // Save the changes to the task
    const title = document.getElementById('modalTitle').value;
    const description = document.getElementById('modalDescription').value;
    const dueDate = document.getElementById('modalDueDate').value;
    const priority = document.getElementById('modalPriority').value;
    const projectName = document.getElementById('modalProjectSelect').value;

    // Find the task to update it
    const taskId = taskDetailModal.dataset.taskId;
    const task = getTaskById(taskId); // Implement getTaskById to find a task by its ID
    if (task) {
        task.title = title;
        task.description = description;
        task.dueDate = dueDate;
        task.priority = priority;
        task.projectName = projectName;

        saveToLocalStorage('tasks', getAllTasks());
        renderAllTasksView(getAllTasks());
        updateProjectListUI(); // To reflect changes in the project list if needed
    }

    taskDetailModal.style.display = 'none';
};

const hideTaskDetailModal = () => {
    const taskDetailModal = document.getElementById('taskDetailModal');
    if (taskDetailModal) {
        taskDetailModal.style.display = 'none';
    }

};

export {
    createTaskForm, createTaskElement, createTaskDetailModal, createTaskList, closeNewTaskModal, showTaskForm,
    toggleTaskFormVisibility, renderFilteredTasks, renderTasks, renderAllTasksView, showTaskDetailModal, closeTaskDetailModal, hideTaskDetailModal
};