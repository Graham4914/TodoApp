//Create Main Content DOM
export const createMainContent = () => {
    const mainContent = document.createElement('div');
    mainContent.classList.add('main-content');

    const tasksContainer = document.createElement('div');
    tasksContainer.classList.add('tasks-container');


    const tasksListContainer = document.createElement('div');
    tasksListContainer.classList.add('tasks-list-container');

    tasksContainer.appendChild(tasksListContainer);

    mainContent.appendChild(tasksContainer);

    return mainContent;
};
