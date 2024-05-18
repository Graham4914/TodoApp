import { loadFromLocalStorage, saveToLocalStorage } from './utils/localStorage';
import { createSidebar } from './views/sidebarView';
import { createMainContent } from './views/mainContentView';
import { initializeApp } from './controllers/appController';
import { getProjects, addProject, setCurrentProject, getAllTasks } from './models/appState';
import { createTaskForm, createTaskDetailModal, renderAllTasksView, showTaskForm } from './views/taskView';
import { loadProjects } from './views/projectView';
import './style.css';

// Initialize and load the application
const loadApplication = () => {
    const root = document.getElementById('root');
    root.classList.add('root');

    const sidebar = createSidebar();
    const mainContent = createMainContent();

    root.appendChild(sidebar);
    root.appendChild(mainContent);

    const projects = getProjects();
    if (projects.length > 0) {
        setCurrentProject(projects[0]);
    } else {
        const defaultProject = { name: "Default", tasks: [] };
        addProject(defaultProject);
        setCurrentProject(defaultProject);
        saveToLocalStorage('projects', getProjects());
    }
    renderAllTasksView(getAllTasks());

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
    loadProjects();

    const addButton = document.getElementById('add-task-button');
    if (addButton) {
        addButton.addEventListener('click', () => {
            showTaskForm();
        });
    } else {
        console.error('Add Task button not found');
    }
});


// import { loadFromLocalStorage, saveToLocalStorage } from './utils/localStorage';
// import { createSidebar, } from './views/sidebarView';
// import { createMainContent } from './views/maincontentView';
// import { initializeApp, } from './controllers/appController';
// import { getProjects, addProject, setCurrentProject, getCurrentProject, getAllTasks } from './models/appState';
// import { createTaskForm, createTaskDetailModal, closeNewTaskModal, renderAllTasksView, showTaskForm } from './views/taskView';
// import { loadProjects, updateProjectListUI } from './views/projectView';
// import './style.css';



// //Initialize and load the application
// const loadApplication = () => {
//     const root = document.getElementById('root');
//     root.classList.add('root');

//     const sidebar = createSidebar();
//     const mainContent = createMainContent();

//     root.appendChild(sidebar);
//     root.appendChild(mainContent);


//     loadFromLocalStorage('projects');

//     const projects = getProjects();
//     if (projects.length > 0) {
//         setCurrentProject(projects[0]);
//     } else {
//         const defaultProject = { name: "Default", tasks: [] };
//         addProject(defaultProject);
//         setCurrentProject(defaultProject);

//         saveToLocalStorage('projects', getProjects());
//     }
//     renderAllTasksView(getAllTasks());
//     // Append the hidden task form to the main content
//     const taskFormContainer = createTaskForm();
//     mainContent.appendChild(taskFormContainer);

//     // Ensure the task detail modal is created and appended to the DOM
//     createTaskDetailModal();

// };


// //Event listener for DOMContentLoaded

// document.addEventListener('DOMContentLoaded', () => {
//     console.log("DOM fully loaded and parsed");

//     initializeApp();

//     loadApplication();
//     loadProjects();

//     const mainContent = document.getElementById('main-content');
//     if (!mainContent) {
//         console.error('Main content area is missing');
//         return;
//     }

//     const taskFormContainer = createTaskForm();
//     mainContent.appendChild(taskFormContainer);

//     // Setup the button to toggle form visibility
//     const addButton = document.getElementById('add-task-button');
//     if (addButton) {
//         addButton.addEventListener('click', () => {
//             showTaskForm();
//             // taskFormContainer.style.display = 'block'; // Show the form when the button is clicked
//         });
//     } else {
//         console.error('Add Task button not found');
//     }
// });


