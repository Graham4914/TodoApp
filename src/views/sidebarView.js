// sidebarView.js

// import { calculateTaskCount } from "../utils/taskUtils";
// import { getAllTasks } from "../models/appState";
import { createProjectListElement } from "./projectView";
import { showTaskForm, renderAllTasksView } from "./taskView";
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

    // Add functionality to the All Tasks button
    const allTasksButton = document.createElement('button');
    allTasksButton.textContent = 'All Tasks';
    allTasksButton.classList.add('nav-button');
    allTasksButton.addEventListener('click', () => {
        const allTasks = getAllTasks();
        renderAllTasksView(allTasks);
    });

    sidebar.appendChild(allTasksButton);

    // Static button creation for demonstration
    const buttonNames = ['Today', 'Upcoming', 'Overdue', 'Completed'];
    buttonNames.forEach(name => {
        const button = document.createElement('button');
        button.textContent = name;
        button.classList.add('nav-button');
        // Uncomment below line once you are ready to add functionality back
        button.addEventListener('click', () => console.log(name + ' clicked'));
        sidebar.appendChild(button);
    });


    const projectListContainer = createProjectListElement();
    sidebar.appendChild(projectListContainer);

    return sidebar;
};

export { createSidebar };