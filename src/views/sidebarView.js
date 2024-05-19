// sidebarView.js

import { createProjectListElement } from "./projectView";
import { showTaskForm, renderAllTasksView, renderFilteredTasks } from "./taskView";
import { getProjects, setProjects, addProject, getAllTasks } from "../models/appState";
import { updateCounters } from "../utils/taskUtils";


const createSidebar = () => {
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar');

    const taskListTitle = document.createElement('h2')
    taskListTitle.textContent = 'Tasks';
    taskListTitle.classList.add('task-list-title');

    const addButton = document.createElement('button');
    addButton.textContent = '+ ';
    addButton.classList.add('add-task-button');
    addButton.id = 'add-task-button';
    addButton.addEventListener('click', showTaskForm);

    sidebar.appendChild(addButton);
    sidebar.appendChild(taskListTitle);

    const buttonNames = ['All', 'Today', 'Upcoming', 'Overdue', 'Completed'];
    buttonNames.forEach(name => {
        const button = document.createElement('button');
        button.textContent = `${name} `;
        button.classList.add('nav-button');
        button.id = `${name.toLowerCase().replace(' ', '-')}-button`;

        console.log(`Created button with ID: ${button.id}`); // Debugging line

        const counter = document.createElement('span');
        counter.classList.add('task-counter');
        button.appendChild(counter);

        button.addEventListener('click', () => {
            const filterType = name.toLowerCase().replace(' ', '');
            console.log(`Button clicked: ${filterType}`);
            renderFilteredTasks(filterType);
            updateCounters();
        });

        sidebar.appendChild(button);
    });




    const projectListContainer = createProjectListElement();
    sidebar.appendChild(projectListContainer);

    return sidebar;
};

export { createSidebar };