import { loadFromLocalStorage, saveToLocalStorage } from './utils/localStorage';
import { createSidebar, createButtonWithCounter } from './views/sidebarView';
import { createMainContent } from './views/maincontentView';
import { createProjectListElement, createProjectContent, generateProjectDropdown, } from './views/projectView';
import { createTaskForm, createTaskElement, createTaskDetailModal, createTaskList, closeNewTaskModal, showTaskForm, toggleTaskFormVisibility, renderTasks, renderAllTasksView, renderFilteredTasks } from './views/taskView';
import { initializeApp } from './controllers/appController';
import { deleteTask, saveCurrentTask, addTaskToProject, handleFormSubmit, openTaskDetail, closeTaskDetail } from './controllers/taskController';
import { addNewProject, updateProjectListUI, deleteProject, updateMainContentForProject, saveProjectName } from './controllers/projectController';
import { isTaskDueToday, isTaskUpcoming, isTaskOverdue, isTaskCompleted, calculateTaskCount, updateCounters } from './utils/taskUtils';
import './style.css';


//initial state
let allTasksArray = [];
let projectsArray = [];
let currentProject;


//Load the eitire application
const loadApplication = () => {
    const root = document.getElementById('root');
    root.classList.add('root');
    const sidebar = createSidebar();
    const mainContent = createMainContent();
    const formContainer = createTaskForm();
    mainContent.appendChild(formContainer);

    root.appendChild(sidebar);

    root.appendChild(mainContent);

    document.getElementById('add-task-button').addEventListener('click', showTaskForm);

    loadFromLocalStorage();

    if (projectsArray.length > 0) {
        currentProject = projectsArray[0];
    } else {
        currentProject = Project('Default');
        projectsArray.push(currentProject);
        saveToLocalStorage();
    }

    updateProjectListUI();
    renderAllTasksView();
};


//Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    loadApplication();
    createTaskDetailModal();
    updateCounters();
    const { projectsArray, allTasksArray } = initializeApp();
    const addTaskButton = document.getElementById('add-task-button');
    if (addTaskButton) {
        addTaskButton.addEventListener('click', showTaskForm);
    } else {
        console.error('Add Task button not found!');
    }

});
