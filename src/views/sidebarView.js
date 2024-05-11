// sidebarView.js

// import { calculateTaskCount } from "../utils/taskUtils";
// import { getAllTasks } from "../models/appState";
import { createProjectListElement } from "./projectView";
import { showTaskForm } from "./taskView";
import { getProjects, setProjects, addProject } from "../models/appState";


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
    // Static button creation for demonstration
    const buttonNames = ['All Tasks', 'Today', 'Upcoming', 'Overdue', 'Completed'];
    buttonNames.forEach(name => {
        const button = document.createElement('button');
        button.textContent = name;
        button.classList.add('nav-button');
        // Uncomment below line once you are ready to add functionality back
        // button.addEventListener('click', () => console.log(name + ' clicked'));
        sidebar.appendChild(button);
    });


    const projectListContainer = createProjectListElement([{ name: 'Home' }, { name: 'Work' }]);
    sidebar.appendChild(projectListContainer);

    return sidebar;
};

export { createSidebar };