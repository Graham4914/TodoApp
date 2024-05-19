// sidebarView.js

import { createProjectListElement } from "./projectView";
import { showTaskForm, renderAllTasksView, renderFilteredTasks } from "./taskView";
import { getProjects, setProjects, addProject, getAllTasks } from "../models/appState";


const createSidebar = () => {
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar');

    const taskListTitle = document.createElement('h2')
    taskListTitle.textContent = 'Tasks';
    taskListTitle.classList.add('task-list-title');

    const addButton = document.createElement('button');
    addButton.textContent = '+ Add Task';
    addButton.classList.add('add-task-button');
    addButton.id = 'add-task-button';
    addButton.addEventListener('click', showTaskForm);


    sidebar.appendChild(taskListTitle);
    sidebar.appendChild(addButton);

    const buttonNames = [
        { name: 'All Tasks', id: 'all-tasks-button', filter: 'all' },
        { name: 'Today', id: 'today-tasks-button', filter: 'today' },
        { name: 'Upcoming', id: 'upcoming-tasks-button', filter: 'upcoming' },
        { name: 'Overdue', id: 'overdue-tasks-button', filter: 'overdue' },
        { name: 'Completed', id: 'completed-tasks-button', filter: 'completed' }
    ];

    buttonNames.forEach(buttonData => {
        const button = document.createElement('button');
        button.textContent = buttonData.name;
        button.id = buttonData.id;
        button.classList.add('nav-button');
        button.addEventListener('click', () => renderFilteredTasks(buttonData.filter));
        sidebar.appendChild(button);
    });



    const projectListContainer = createProjectListElement();
    sidebar.appendChild(projectListContainer);

    return sidebar;
};

export { createSidebar };