// taskUtils.js
import { getAllTasks, getCurrentProject, getProjects, setProjects, setAllTasks, saveAppState, getLastViewedContext, setLastViewedContext } from "../models/appState";
import { createFilterContainer, renderTasks, renderFilteredTasks } from "../views/taskView";
import { updateMainContentForProject } from "../controllers/projectController";
import { synchronizeProjectTasks } from "../controllers/appController";

export let currentFilterType = 'all';
function setCurrentFilterType(filterType) {
    currentFilterType = filterType;
}


export let isPriorityAsc = true;
export let isDueDateAsc = true;


function toggleSortPriority(tasks) {

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
    return isDue && task.status !== 'complete';
}

function isTaskUpcoming(task) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    return dueDate > today && task.status !== 'complete' && !isTaskDueToday(task);
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
            // console.error(`Button with ID ${buttonId} not found.`);
            return;
        }


        const span = button.querySelector('.task-counter');

        span.textContent = calculateTaskCount(filterCriteria);
    };

    const buttonIds = ['all-button', 'today-button', 'upcoming-button', 'overdue-button', 'completed-button'];
    const filterTypes = ['all', 'today', 'upcoming', 'overdue', 'completed'];

    buttonIds.forEach((buttonId, index) => {

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



const appendFilterContainerToTasks = (tasksContainer) => {
    const filterContainer = createFilterContainer();
    // Insert the filter container after the header element
    const headingElement = tasksContainer.querySelector('h2');
    if (headingElement) {
        headingElement.insertAdjacentElement('afterend', filterContainer);
    } else {
        tasksContainer.insertBefore(filterContainer, tasksContainer.firstChild);
    }

    // Add event listeners for sort buttons
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
};



const appendFilterContainerToProjects = (tasksContainer) => {
    if (!tasksContainer) {
        console.error('Tasks container is undefined');
        return;
    }

    const projectContent = tasksContainer.querySelector('.project-content');
    if (!projectContent) {
        return;
    }

    // Check if the filter container already exists to prevent duplication
    if (!tasksContainer.querySelector('.filter-container')) {
        const filterContainer = createFilterContainer();
        const projectHeaderElement = projectContent.querySelector('.project-header');
        if (projectHeaderElement) {
            projectHeaderElement.insertAdjacentElement('afterend', filterContainer);
        } else {
            tasksContainer.insertBefore(filterContainer, tasksContainer.firstChild);

        }

        // Add event listeners for sort buttons here
        const sortPriorityButton = filterContainer.querySelector('#sort-priority');
        const sortDueDateButton = filterContainer.querySelector('#sort-due-date');

        if (sortPriorityButton && sortDueDateButton) {
            sortPriorityButton.addEventListener('click', () => {
                const currentProject = getCurrentProject();
                const tasks = currentProject ? currentProject.tasks : [];
                const sortedTasks = toggleSortPriority(tasks);
                renderTasks(sortedTasks, currentProject.name);
                updateMainContentForProject(currentProject);
            });

            sortDueDateButton.addEventListener('click', () => {
                const currentProject = getCurrentProject();
                const tasks = currentProject ? currentProject.tasks : [];
                const sortedTasks = toggleSortDueDate(tasks);
                renderTasks(sortedTasks, currentProject.name);
                updateMainContentForProject(currentProject);
            });
        } else {
            console.error('Sort buttons not found in the DOM');
        }
    } else {
        console.log('Filter container already exists');
    }
};


const updateTaskStatus = (taskId, status) => {
    let allTasks = getAllTasks();
    const projects = getProjects();

    const task = allTasks.find(t => t.id === taskId);
    if (!task) {
        console.error('Task not found with ID:', taskId);
        return;
    }

    task.status = status;

    allTasks = allTasks.filter(t => t.id !== taskId);
    allTasks.push(task);
    setAllTasks(allTasks);

    projects.forEach(project => {
        project.tasks = project.tasks.filter(t => t.id !== taskId);
    });

    if (status !== 'complete') {
        const project = projects.find(p => p.name === task.projectName);
        if (project) {
            project.tasks.push(task);
        }
    }

    setProjects(projects);
    saveAppState();
};


const reRenderCurrentView = () => {
    const lastViewedContext = getLastViewedContext();
    if (lastViewedContext.type === 'project') {
        const currentProject = getCurrentProject();
        if (currentProject) {
            updateMainContentForProject(currentProject);
        } else {
            renderFilteredTasks(currentFilterType);
        }
    } else {
        renderFilteredTasks(lastViewedContext.filterType);
    }
};


export {
    isTaskDueToday, isTaskOverdue, isTaskUpcoming, isTaskCompleted,
    toggleSortPriority, toggleSortDueDate,
    calculateTaskCount, updateCounters, truncateText, appendFilterContainerToTasks, appendFilterContainerToProjects,
    getFilteredTasks, setCurrentFilterType, updateTaskStatus, reRenderCurrentView
};