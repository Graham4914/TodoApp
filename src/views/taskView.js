//taskView.js
import { generateProjectDropdown } from "./projectView";
import { handleFormSubmit, deleteTask, closeTaskDetail, openTaskDetail } from "../controllers/taskController";
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/localStorage";
import { isTaskDueToday, isTaskOverdue, isTaskUpcoming, isTaskCompleted, calculateTaskCount, updateCounters, truncateText, appendFilterContainerToTasks, currentFilterType, setCurrentFilterType, getFilteredTasks, toggleSortDueDate, toggleSortPriority, isDueDateAsc, isPriorityAsc } from "../utils/taskUtils";
import { getAllTasks, getTaskById, allTasksArray, setAllTasks, getProjects, setProjects, saveAppState, projectsArray } from "../models/appState";



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
    const dueDateLabel = document.createElement('label');
    dueDateLabel.textContent = 'Due Date';
    form.appendChild(dueDateLabel);
    const dueDateInput = document.createElement('input');
    dueDateInput.type = 'date';
    dueDateInput.name = 'due-date';
    form.appendChild(dueDateInput);

    //input for priority
    const priorityLabel = document.createElement('label');
    priorityLabel.textContent = 'Priority';
    form.appendChild(priorityLabel);
    const prioritySelect = document.createElement('select');
    prioritySelect.name = 'priority';
    ['High', 'Medium', 'Low'].forEach(priority => {
        const option = document.createElement('option');
        option.value = priority.toLowerCase();
        option.textContent = priority;
        prioritySelect.appendChild(option);
    });
    form.appendChild(prioritySelect);

    const projectLabel = document.createElement('label');
    projectLabel.textContent = 'Project';
    form.appendChild(projectLabel);
    const projectDropdown = generateProjectDropdown();
    form.appendChild(projectDropdown);


    // add Task from close button
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.classList.add('close-modal');
    closeButton.id = 'closeButton';
    closeButton.addEventListener('click', () => toggleTaskFormVisibility(false));
    form.appendChild(closeButton);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    //submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Add Task';
    submitButton.classList.add('submit-button');
    buttonContainer.appendChild(submitButton);

    form.appendChild(buttonContainer);

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
    description.textContent = truncateText(task.description, 100);
    description.classList.add('task-description');

    taskDetail.appendChild(title);
    taskDetail.appendChild(description);

    const taskInfoContainer = document.createElement('div');
    taskInfoContainer.classList.add('task-info-container');


    const priority = document.createElement('span');
    priority.classList.add('task-priority', task.priority.toLowerCase());
    priority.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';

    const dueDate = document.createElement('span');
    // dueDate.textContent = `${task.dueDate}`;
    dueDate.textContent = formatDate(task.dueDate);
    dueDate.classList.add('task-due-date');


    taskInfoContainer.appendChild(priority);
    taskInfoContainer.appendChild(dueDate);


    // Container for delete button
    const deleteContainer = document.createElement('div');
    deleteContainer.classList.add('delete-container');

    //Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.classList.add('delete-button');

    deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteTask(task);
        renderAllTasksView(getAllTasks)//check this line

    });

    deleteContainer.appendChild(deleteBtn);

    // Right-aligned container for due date, priority, and delete button
    const taskRightContainer = document.createElement('div');
    taskRightContainer.classList.add('task-right-container');
    taskRightContainer.appendChild(taskInfoContainer);
    taskRightContainer.appendChild(deleteContainer);

    taskElement.appendChild(taskDetail);
    taskElement.appendChild(taskRightContainer);



    taskElement.addEventListener('click', function (event) {
        if (event.target.type !== 'checkbox') {
            openTaskDetail(task.id);
        }
    });

    return taskElement;
};


const formatDate = (dateString) => {
    if (!dateString) return ''; // Return empty string if no date is provided
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of year
    return `${day}/${month}/${year}`;
};

const createLabel = (forId, text) => {
    const label = document.createElement('label');
    label.htmlFor = forId;
    label.textContent = text;
    return label;
};

function createTaskDetailModal() {
    const modal = document.createElement('div');
    modal.id = 'taskDetailModal';
    modal.style.display = 'none';
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content', 'task-detail-modal');

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-modal');
    closeButton.onclick = () => closeTaskDetailModal(false);

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.classList.add('modal-title');
    titleInput.id = 'modalTitle';

    modalHeader.appendChild(titleInput);
    modalHeader.appendChild(closeButton);

    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');

    const titleLabel = createLabel('modalTitle', 'Title');
    const descriptionLabel = createLabel('modalDescription', 'Description');
    const dueDateLabel = createLabel('modalDueDate', 'Due Date');
    const priorityLabel = createLabel('modalPriority', 'Priority');
    const projectLabel = createLabel('modalProjectSelect', 'Project');





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
        option.value = p.toLowerCase();
        option.textContent = p;
        priority.appendChild(option);
    });

    const projectDropdown = generateProjectDropdown();
    projectDropdown.id = 'modalProjectSelect';


    modalBody.appendChild(descriptionLabel);
    modalBody.appendChild(description);
    modalBody.appendChild(dueDateLabel);
    modalBody.appendChild(dueDate);
    modalBody.appendChild(priorityLabel);
    modalBody.appendChild(priority);
    modalBody.appendChild(projectLabel);
    modalBody.appendChild(projectDropdown);

    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');

    const saveButton = document.createElement('button');
    saveButton.classList.add('save-button');
    saveButton.textContent = 'Save';
    saveButton.onclick = () => closeTaskDetailModal(true);

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = () => closeTaskDetailModal(false);

    modalFooter.appendChild(saveButton);
    modalFooter.appendChild(cancelButton);

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    return modal;
}


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
    setCurrentFilterType(filterType); // Set the current filter type
    const tasksContainer = document.querySelector('.tasks-container');
    console.log(`Filter type received: ${filterType}`);  // Debug log to verify filter type received
    const headingText = filterType === 'all' ? 'All Tasks' : filterType.charAt(0).toUpperCase() + filterType.slice(1);
    console.log(`Setting heading to: ${headingText}`);

    const filteredTasks = getFilteredTasks(filterType);

    console.log(`Rendering ${filterType} tasks:`, filteredTasks);

    renderTasks(filteredTasks, headingText);
}
// function renderFilteredTasks(filterType) {
//     setCurrentFilterType(filterType);
//     const tasksContainer = document.querySelector('.tasks-container');
//     console.log(`Filter type received: ${filterType}`);  // Debug log to verify filter type received
//     const headingText = filterType === 'all' ? 'All Tasks' : filterType.charAt(0).toUpperCase() + filterType.slice(1);
//     console.log(`Setting heading to: ${headingText}`);

//     const filteredTasks = getFilteredTasks(filterType);
//     // tasksContainer.innerHTML = `<h2>${headingText}</h2>`;


//     // let filteredTasks = [];
//     switch (filterType) {
//         case 'today':
//             filteredTasks = allTasksArray.filter(isTaskDueToday);
//             break;
//         case 'upcoming':
//             filteredTasks = allTasksArray.filter(isTaskUpcoming);
//             break;
//         case 'overdue':
//             filteredTasks = allTasksArray.filter(isTaskOverdue);
//             break;
//         case 'completed':
//             filteredTasks = allTasksArray.filter(isTaskCompleted);
//             break;
//         case 'all':
//         default:
//             filteredTasks = allTasksArray.filter(task => task.status !== 'complete');
//             break;
//     }

//     console.log(`Rendering ${filterType} tasks:`, filteredTasks);



//     renderTasks(filteredTasks, headingText);
// };


function createFilterContainer() {
    const filterContainer = document.createElement('div');
    filterContainer.classList.add('filter-container');

    const sortPriorityButton = document.createElement('button');
    sortPriorityButton.id = 'sort-priority';
    sortPriorityButton.classList.add('sort-button');
    sortPriorityButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i>'; // FontAwesome icon for priority

    const sortDueDateButton = document.createElement('button');
    sortDueDateButton.id = 'sort-due-date';
    sortDueDateButton.classList.add('sort-button');
    sortDueDateButton.innerHTML = '<i class="fas fa-calendar-alt"></i>'; // FontAwesome icon for due date

    filterContainer.appendChild(sortPriorityButton);
    filterContainer.appendChild(sortDueDateButton);


    return filterContainer;
};



const renderTasks = (tasks, headingText) => {
    const tasksContainer = document.querySelector('.tasks-container');
    tasksContainer.innerHTML = '';

    const heading = document.createElement('h2');
    heading.textContent = headingText;
    tasksContainer.appendChild(heading);

    appendFilterContainerToTasks(tasksContainer);

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });
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

    appendFilterContainerToTasks(tasksContainer);

    // Filter out completed tasks
    const incompleteTasks = tasks.filter(task => task.status !== 'complete');

    incompleteTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });
}

const showTaskDetailModal = (task) => {
    let taskDetailModal = document.getElementById('taskDetailModal');
    if (!taskDetailModal) {
        taskDetailModal = createTaskDetailModal();
    }

    taskDetailModal.dataset.taskId = task.id; // Store the task ID for later use
    document.getElementById('modalTitle').value = task.title;
    document.getElementById('modalDescription').value = task.description;
    document.getElementById('modalDueDate').value = task.dueDate;
    document.getElementById('modalPriority').value = task.priority.toLowerCase();
    document.getElementById('modalProjectSelect').value = task.projectName;

    // Ensure event listeners are added only once
    const saveButton = document.querySelector('.save-button');
    const cancelButton = document.querySelector('.cancel-button');

    saveButton.onclick = () => closeTaskDetailModal(true);
    cancelButton.onclick = () => closeTaskDetailModal(false);


    taskDetailModal.style.display = 'block';
};



const closeTaskDetailModal = (saveChanges) => {
    const taskDetailModal = document.getElementById('taskDetailModal');
    if (taskDetailModal) {
        if (saveChanges) {
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
                const oldProjectName = task.projectName;
                task.projectName = projectName;

                // If the project has changed, move the task to the new project
                if (oldProjectName !== projectName) {
                    const oldProject = projectsArray.find(p => p.name === oldProjectName);
                    const newProject = projectsArray.find(p => p.name === projectName);
                    if (oldProject) {
                        oldProject.tasks = oldProject.tasks.filter(t => t.id !== task.id);
                    }
                    if (newProject) {
                        newProject.tasks.push(task);
                    }
                }


                saveToLocalStorage('tasks', getAllTasks());
                renderAllTasksView(getAllTasks());
                // updateProjectListUI(); // To reflect changes in the project list if needed
            }
        }
        taskDetailModal.style.display = 'none';
    }
};

const hideTaskDetailModal = () => {
    const taskDetailModal = document.getElementById('taskDetailModal');
    if (taskDetailModal) {
        taskDetailModal.style.display = 'none';
    }
};



export {
    createTaskForm, createTaskElement, createTaskDetailModal, createTaskList, closeNewTaskModal, showTaskForm,
    toggleTaskFormVisibility, renderFilteredTasks, renderTasks, renderAllTasksView, showTaskDetailModal,
    closeTaskDetailModal, hideTaskDetailModal, createFilterContainer
};