import { getAllTasks } from "../models/appState";


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






export { isTaskDueToday, isTaskOverdue, isTaskUpcoming, isTaskCompleted, calculateTaskCount, updateCounters };