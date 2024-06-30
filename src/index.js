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



const loadApplication = () => {
    const root = document.getElementById('root');
    root.classList.add('root');

    const sidebar = createSidebar();
    const mainContent = createMainContent();

    root.appendChild(sidebar);
    root.appendChild(mainContent);

    initializeApp();

    const taskFormContainer = createTaskForm();
    mainContent.appendChild(taskFormContainer);

    createTaskDetailModal();
};
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    loadApplication();
    loadProjects(currentProject);

    renderFilteredTasks('all');
    updateCounters();


    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content area is missing');
        return;
    }
});

