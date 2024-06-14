//projectView.js
import { Project } from "../models/projectModel";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";
import { getProjects, addProject, setProjects, setCurrentProject } from "../models/appState";
import { showTaskForm, createTaskList, createTaskElement } from "./taskView";
import { saveProjectName, deleteProject, addNewProject, updateMainContentForProject } from "../controllers/projectController";


// Create Project list element DOM
const createProjectListElement = () => {
    const projectListContainer = document.createElement('div');
    projectListContainer.classList.add('project-list-container');

    const headerContainer = document.createElement('div');
    headerContainer.classList.add('project-header-container');

    const projectListTitle = document.createElement('h2');
    projectListTitle.textContent = 'Projects';
    projectListTitle.classList.add('projects-heading');

    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('project-controls');

    const addProjectButton = document.createElement('button');
    addProjectButton.textContent = '+';
    addProjectButton.classList.add('add-project-button');
    addProjectButton.addEventListener('click', addNewProject);

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Hide';
    toggleButton.classList.add('toggle-projects-button');
    toggleButton.addEventListener('click', () => {
        const projectList = document.getElementById('project-list');
        projectList.style.display = (projectList.style.display === 'none' || projectList.style.display === '') ? 'block' : 'none';
        toggleButton.textContent = projectList.style.display === 'block' ? 'Hide' : 'Show'
    });

    controlsContainer.appendChild(addProjectButton);
    controlsContainer.appendChild(toggleButton);

    headerContainer.appendChild(projectListTitle);
    headerContainer.appendChild(controlsContainer);

    projectListContainer.appendChild(headerContainer);

    const projectListElement = document.createElement('div');
    projectListElement.classList.add('project-list');
    projectListElement.id = 'project-list';
    projectListContainer.appendChild(projectListElement);

    return projectListContainer;
};

const getProjectNameFromUser = (onSubmit) => {
    const projectNameInput = prompt('Enter new project name:');
    if (projectNameInput && projectNameInput.trim() !== '') {
        onSubmit(projectNameInput.trim());
    } else {
        alert("Project name cannot be empty.");
    }
};

const loadProjects = () => {
    const storedProjects = loadFromLocalStorage('projects') || [];
    if (storedProjects.length === 0) {
        const defaultProject = Project("Default");
        addProject(defaultProject);
        saveToLocalStorage('projects', [defaultProject]);
    } else {
        setProjects(storedProjects);
    }
    updateProjectListUI();
};

const updateProjectListUI = () => {
    const projects = getProjects();
    if (!Array.isArray(projects)) {
        console.error('Projects data is not an array', projects);
        return;
    }
    const projectListElement = document.getElementById('project-list');
    projectListElement.innerHTML = '';
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.textContent = project.name;
        projectElement.classList.add('project');
        projectElement.addEventListener('click', () => {
            setCurrentProject(project);
            updateMainContentForProject(project);
        });
        projectListElement.appendChild(projectElement);
    });
};


function createProjectContent(project) {
    const projectContent = document.createElement('div');
    projectContent.classList.add('project-content');

    const projectHeader = document.createElement('div');
    projectHeader.classList.add('project-header');

    const projectTitleWrapper = document.createElement('div');
    projectTitleWrapper.classList.add('project-title-wrapper');

    const projectTitleInput = document.createElement('input');
    projectTitleInput.type = 'text';
    projectTitleInput.value = project.name;
    projectTitleInput.classList.add('project-title-input');

    projectTitleInput.addEventListener('blur', () => {
        saveProjectName(project, projectTitleInput.value);
    });

    projectTitleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            projectTitleInput.blur();
        }
    });

    projectTitleWrapper.appendChild(projectTitleInput);
    projectHeader.appendChild(projectTitleWrapper);

    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('button-wrapper');

    const addTaskButton = document.createElement('button');
    addTaskButton.innerHTML = '<i class="fas fa-plus"></i>';
    addTaskButton.classList.add('add-task-button');
    addTaskButton.addEventListener('click', showTaskForm);
    buttonWrapper.appendChild(addTaskButton);

    //add delete button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => deleteProject(project));
    buttonWrapper.appendChild(deleteButton);

    projectHeader.appendChild(buttonWrapper);

    // add project close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', () => closeProjectView());
    projectHeader.appendChild(closeButton);


    projectContent.appendChild(projectHeader);


    // Check if projectTitle is set correctly
    console.log("projectTitle set to:", projectTitleInput);

    return projectContent;
}

function generateProjectDropdown(id) {
    const select = document.createElement('select');
    select.id = id || 'projectSelect';

    const noProjectOption = document.createElement('option');
    noProjectOption.textContent = "No Project";
    noProjectOption.value = "";
    select.appendChild(noProjectOption);

    const projects = getProjects();

    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.name;
        option.textContent = project.name;
        select.appendChild(option);
    });
    return select;
}

const updateAllProjectDropdowns = () => {
    const dropdownSelectors = ['projectSelect', 'modalProjectSelect'];

    dropdownSelectors.forEach(selector => {
        const oldDropdown = document.getElementById(selector);
        const newDropdown = generateProjectDropdown();
        newDropdown.id = selector;
        if (oldDropdown && oldDropdown.parentNode) {
            oldDropdown.parentNode.replaceChild(newDropdown, oldDropdown);
        }
    });
};

function closeProjectView() {
    const tasksContainer = document.querySelector('.tasks-container');
    if (tasksContainer) {
        tasksContainer.innerHTML = '';
    }
}


export { createProjectListElement, createProjectContent, generateProjectDropdown, closeProjectView, updateProjectListUI, getProjectNameFromUser, loadProjects, updateAllProjectDropdowns };