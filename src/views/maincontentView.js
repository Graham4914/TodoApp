//Create Main Content DOM
export const createMainContent = () => {
    console.log('Creating main content...');
    const mainContent = document.createElement('div');
    mainContent.classList.add('main-content');
    mainContent.id = 'main-content';

    const tasksContainer = document.createElement('div');
    tasksContainer.classList.add('tasks-container');
    tasksContainer.id = 'tasks-container';


    const tasksListContainer = document.createElement('div');
    tasksListContainer.classList.add('tasks-list-container');

    tasksContainer.appendChild(tasksListContainer);

    mainContent.appendChild(tasksContainer);
    console.log('Main content about to return:', mainContent);
    return mainContent;
};
