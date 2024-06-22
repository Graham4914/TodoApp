// taskUtils.js
import { getAllTasks } from "../models/appState";
import { createFilterContainer, renderTasks } from "../views/taskView";

export let currentFilterType = 'all';
function setCurrentFilterType(filterType) {
    currentFilterType = filterType;
}


export let isPriorityAsc = true;
export let isDueDateAsc = true;

function toggleSortPriority(tasks) {
    console.log('Tasks before sorting (Priority):', tasks);
    if (!Array.isArray(tasks)) {
        console.error('Expected tasks to be an array, but got:', tasks);
        return [];
    }

    tasks.sort((a, b) => {
        if (isPriorityAsc) {
            return a.priority.localeCompare(b.priority);
        } else {
            return b.priority.localeCompare(a.priority);
        }
    });

    isPriorityAsc = !isPriorityAsc;
    return tasks;
}

function toggleSortDueDate(tasks) {
    console.log('Tasks before sorting (Due Date):', tasks);
    if (!Array.isArray(tasks)) {
        console.error('Expected tasks to be an array, but got:', tasks);
        return [];
    }

    tasks.sort((a, b) => {
        if (isDueDateAsc) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else {
            return new Date(b.dueDate) - new Date(a.dueDate);
        }
    });

    isDueDateAsc = !isDueDateAsc;
    return tasks;
}


function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}
function isTaskDueToday(task) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    const isDue = dueDate.toDateString() === today.toDateString();
    console.log(`Task due today check: ${task.title}, Due: ${dueDate}, Today: ${today}, IsDue: ${isDue}`);
    return isDue;
}

function isTaskUpcoming(task) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    return dueDate > today && task.status !== 'complete';
}

function isTaskOverdue(task) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== 'complete';
}

function isTaskCompleted(task) {
    return task.status === 'complete'
}


function calculateTaskCount(filterCriteria) {
    const allTasks = getAllTasks();

    console.log(`Calculating count for filter: ${filterCriteria}`);
    console.log('All tasks:', allTasks);

    switch (filterCriteria) {
        case 'all':
            return allTasks.filter(task => task.status !== 'complete').length;
        case 'today':
            return allTasks.filter(isTaskDueToday).length;
        case 'upcoming':
            return allTasks.filter(isTaskUpcoming).length;
        case 'overdue':
            return allTasks.filter(isTaskOverdue).length;
        case 'completed':
            return allTasks.filter(isTaskCompleted).length;
        default:
            return 0; //example
    }
}

function updateCounters() {
    const updateCounter = (filterCriteria, buttonId) => {
        const button = document.querySelector(`#${buttonId}`);
        if (!button) {
            console.error(`Button with ID ${buttonId} not found.`);
            return;
        }

        console.log(`Updating counter for button with ID: ${buttonId}`); // Debugging line

        const span = button.querySelector('.task-counter');
        if (!span) {
            console.error(`Counter span not found in button with ID ${buttonId}.`);
            return;
        }

        span.textContent = calculateTaskCount(filterCriteria);
    };

    const buttonIds = ['all-button', 'today-button', 'upcoming-button', 'overdue-button', 'completed-button'];
    const filterTypes = ['all', 'today', 'upcoming', 'overdue', 'completed'];

    buttonIds.forEach((buttonId, index) => {
        console.log(`Attempting to update counter for button with ID: ${buttonId}`); // Debugging line
        updateCounter(filterTypes[index], buttonId);
    });
}

const getFilteredTasks = (filterType) => {
    let filteredTasks = getAllTasks();

    switch (filterType) {
        case 'today':
            filteredTasks = filteredTasks.filter(isTaskDueToday);
            break;
        case 'upcoming':
            filteredTasks = filteredTasks.filter(isTaskUpcoming);
            break;
        case 'overdue':
            filteredTasks = filteredTasks.filter(isTaskOverdue);
            break;
        case 'completed':
            filteredTasks = filteredTasks.filter(isTaskCompleted);
            break;
        case 'all':
        default:
            filteredTasks = filteredTasks.filter(task => task.status !== 'complete');
            break;
    }

    return filteredTasks;
};


// const appendFilterContainer = (tasksContainer) => {
//     const filterContainer = createFilterContainer();
//     tasksContainer.appendChild(filterContainer);
// };
// const appendFilterContainerToTasks = (tasksContainer) => {
//     const filterContainer = createFilterContainer();
//     tasksContainer.insertBefore(filterContainer, tasksContainer.firstChild);
// };

// const appendFilterContainerToTasks = (tasksContainer) => {
//     const filterContainer = createFilterContainer();
//     // Insert the filter container after the header element
//     const headingElement = tasksContainer.querySelector('h2');
//     if (headingElement) {
//         headingElement.insertAdjacentElement('afterend', filterContainer);
//     } else {
//         tasksContainer.insertBefore(filterContainer, tasksContainer.firstChild);
//     }
// };

const appendFilterContainerToTasks = (tasksContainer) => {
    const filterContainer = createFilterContainer();
    tasksContainer.insertBefore(filterContainer, tasksContainer.firstChild);

    // Add event listeners for sort buttons here
    document.getElementById('sort-priority').addEventListener('click', () => {
        const tasks = getFilteredTasks(currentFilterType);
        const sortedTasks = toggleSortPriority(tasks);
        renderTasks(sortedTasks, currentFilterType.charAt(0).toUpperCase() + currentFilterType.slice(1));
    });

    document.getElementById('sort-due-date').addEventListener('click', () => {
        const tasks = getFilteredTasks(currentFilterType);
        const sortedTasks = toggleSortDueDate(tasks);
        renderTasks(sortedTasks, currentFilterType.charAt(0).toUpperCase() + currentFilterType.slice(1));
    });

    // // Add event listeners for sort buttons here
    // document.getElementById('sort-priority').addEventListener('click', () => {
    //     const tasks = getAllTasks().filter(task => task.status !== 'complete');
    //     const sortedTasks = toggleSortPriority(tasks);
    //     renderTasks(sortedTasks, 'All Tasks');
    // });

    // document.getElementById('sort-due-date').addEventListener('click', () => {
    //     const tasks = getAllTasks().filter(task => task.status !== 'complete');
    //     const sortedTasks = toggleSortDueDate(tasks);
    //     renderTasks(sortedTasks, 'All Tasks');
    // });
};
const appendFilterContainerToProjects = (projectContent) => {
    const filterContainer = createFilterContainer();
    projectContent.insertBefore(filterContainer, projectContent.querySelector('.tasks-container'));
};


export {
    isTaskDueToday, isTaskOverdue, isTaskUpcoming, isTaskCompleted,
    toggleSortPriority, toggleSortDueDate,
    calculateTaskCount, updateCounters, truncateText, appendFilterContainerToTasks, appendFilterContainerToProjects,
    getFilteredTasks, setCurrentFilterType
};