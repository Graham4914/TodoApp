


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
    switch (filterCriteria) {
        case 'all':
            return allTasksArray.length;
        case 'today':
            return allTasksArray.filter(isTaskDueToday).length;
        case 'upcoming':
            return allTasksArray.filter(isTaskUpcoming).length;
        case 'overdue':
            return allTasksArray.filter(isTaskOverdue).length;
        case 'completed':
            return allTasksArray.filter(isTaskCompleted).length;
        default:
            return 0; //example
    }
}

function updateCounters() {
    const updateCounter = (buttonId) => {
        const buttonContainer = document.querySelector(`#${buttonId}`).parentNode;
        if (buttonContainer) {
            const span = buttonContainer.querySelector('.task-counter');
            if (span) {
                span.textContent = calculateTaskCount(buttonId.replace('-button', ''));
            } else {
                console.error(`Counter span not found in container for button with ID ${buttonId}.`);
            }
        } else {
            console.error(`Container for button with ID ${buttonId} is not found.`);
        }
    };

    updateCounter('all-tasks-button');
    updateCounter('today-tasks-button');
    updateCounter('upcoming-tasks-button');
    updateCounter('overdue-tasks-button');
    updateCounter('completed-tasks-button');
}

export { isTaskDueToday, isTaskOverdue, isTaskUpcoming, isTaskCompleted, calculateTaskCount, updateCounters };