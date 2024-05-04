//Create Sidebar DOM
const createSidebar = () => {
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar');

    const taskListTitle = document.createElement('h2')
    taskListTitle.textContent = 'Tasks';
    taskListTitle.classList.add('task-list-title')

    const { container: allTasksContainer, button: allTasksButton } = createButtonWithCounter('All Tasks', calculateTaskCount('all'), 'nav-button', 'all-tasks-button');
    // allTasksButton.addEventListener('click', renderAllTasksView);


    const { container: todayTasksContainer, button: todayTasksButton } = createButtonWithCounter('Today', calculateTaskCount('today'), 'nav-button', 'today-tasks-button');
    // todayTasksButton.addEventListener('click', () => renderFilteredTasks('Today'));

    const { container: upcomingTaskContainer, button: upcomingTasksButton } = createButtonWithCounter('Upcoming', calculateTaskCount('upcoming'), 'nav-button', 'upcoming-tasks-button');
    // upcomingTasksButton.addEventListener('click', () => renderFilteredTasks('Upcoming'));

    const { container: overdueTasksContainer, button: overdueTasksButton } = createButtonWithCounter('Overdue', calculateTaskCount('overdue'), 'nav-button', 'overdue-tasks-button');
    // overdueTasksButton.addEventListener('click', () => renderFilteredTasks('Overdue'));

    const { container: completedTasksContainer, button: completedTasksButton } = createButtonWithCounter('Completed', calculateTaskCount('completed'), 'nav-button', 'completed-tasks-button');
    // completedTasksButton.addEventListener('click', () => renderFilteredTasks('Completed'));


    const projectListContainer = createProjectListElement([{ name: 'Home' }, { name: 'Work' }]);

    // const projectListElement = createProjectListElement(projectsArray);

    const addButton = document.createElement('button');
    addButton.textContent = '+ Add Task';
    addButton.id = 'add-task-button';
    addButton.classList.add('add-task-button');


    sidebar.appendChild(taskListTitle);
    sidebar.appendChild(addButton);
    sidebar.appendChild(allTasksContainer);
    sidebar.appendChild(todayTasksContainer);
    sidebar.appendChild(upcomingTaskContainer);
    sidebar.appendChild(overdueTasksContainer);
    sidebar.appendChild(completedTasksContainer);
    sidebar.appendChild(projectListContainer);

    sidebar.addEventListener('click', (event) => {
        const { target } = event;
        if (target.classList.contains('nav-button')) {
            const filterType = target.id.replace('-tasks-button', '');
            renderFilteredTasks(filterType);
            updateCounters();
        }
    });

    return sidebar;
};

function createButtonWithCounter(buttonText, count, cssClass, id) {
    const container = document.createElement('div');
    container.classList.add('button-container');
    const button = document.createElement('button');
    button.textContent = buttonText;
    button.classList.add(cssClass);
    button.id = id;


    const counter = document.createElement('span');
    counter.textContent = count;
    counter.classList.add('task-counter');



    container.appendChild(button);
    container.appendChild(counter)

    // container.appendChild(counter);
    console.log(`Created button: ${button.outerHTML}`); // Log the button HTML

    return { container, button };
}

export { createSidebar, createButtonWithCounter };