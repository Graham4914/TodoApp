//index.js
import { loadFromLocalStorage, saveToLocalStorage } from './utils/localStorage';
import { createSidebar } from './views/sidebarView';
import { createMainContent } from './views/mainContentView';
import { initializeApp } from './controllers/appController';
import { updateMainContentForProject } from './controllers/projectController';
import { getProjects, addProject, setCurrentProject, getAllTasks, loadAppState, saveAppState, getTaskById, currentProject } from './models/appState';
import { createTaskForm, createTaskDetailModal, renderFilteredTasks, renderAllTasksView, showTaskForm } from './views/taskView';
import { loadProjects } from './views/projectView';
import { updateCounters } from './utils/taskUtils';
import './styles/nav.css';
import './styles/modals.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/tasklist.css';
import './styles/project.css';


// Initialize and load the application
const loadApplication = () => {
    const root = document.getElementById('root');
    root.classList.add('root');

    const sidebar = createSidebar();
    const mainContent = createMainContent();

    root.appendChild(sidebar);
    root.appendChild(mainContent);

    loadAppState();

    const projects = getProjects();
    if (projects.length > 0) {
        setCurrentProject(projects[0]);
    } else {
        const defaultProject = { name: "Default", tasks: [] };
        addProject(defaultProject);
        setCurrentProject(defaultProject);

        saveAppState();
    }


    renderFilteredTasks('all');
    updateCounters();

    // Append the hidden task form to the main content
    const taskFormContainer = createTaskForm();
    mainContent.appendChild(taskFormContainer);

    // Ensure the task detail modal is created and appended to the DOM
    createTaskDetailModal();
};

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    initializeApp();
    loadApplication();
    loadProjects(currentProject);


    renderFilteredTasks('all');


    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content area is missing');
        return;
    }
});

