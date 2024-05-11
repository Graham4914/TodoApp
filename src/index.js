import { loadFromLocalStorage, saveToLocalStorage } from './utils/localStorage';
import { createSidebar, } from './views/sidebarView';
import { createMainContent } from './views/maincontentView';
import { initializeApp, } from './controllers/appController';
import { getProjects, addProject, setCurrentProject, getCurrentProject } from './models/appState';
import { createTaskForm } from './views/taskView';
import { loadProjects } from './views/projectView';
import './style.css';



//Initialize and load the application
const loadApplication = () => {
    const root = document.getElementById('root');
    root.classList.add('root');

    const sidebar = createSidebar();
    const mainContent = createMainContent();

    root.appendChild(sidebar);
    root.appendChild(mainContent);


    loadFromLocalStorage();

    const projects = getProjects();
    if (projects.length > 0) {
        setCurrentProject(projects[0]);
    } else {
        const defaultProject = { name: "Default", tasks: [] };
        addProject(defaultProject);
        setCurrentProject(defaultProject);

        saveToLocalStorage();
    }

};


//Event listener for DOMContentLoaded

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    // Initialize your app's state or load from storage
    initializeApp();

    // Load the main application structure only once
    loadApplication();
    loadProjects();


    // Since loadApplication already appends sidebar and main content,
    // we only need to append the task form to the already created main content
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content area is missing');
        return;
    }

    const taskFormContainer = createTaskForm();
    mainContent.appendChild(taskFormContainer); // Append the hidden task form to the main content

    // Setup the button to toggle form visibility
    const addButton = document.getElementById('add-task-button');
    if (addButton) {
        addButton.addEventListener('click', () => {
            taskFormContainer.style.display = 'block'; // Show the form when the button is clicked
        });
    } else {
        console.error('Add Task button not found');
    }
});


