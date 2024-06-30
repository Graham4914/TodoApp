//projectView.js
import { Project } from "../models/projectModel";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";
import { getProjects, addProject, setProjects, setCurrentProject, currentProject } from "../models/appState";
import { showTaskForm, createTaskList, createTaskElement, renderTasks, renderAllTasksView, renderFilteredTasks } from "./taskView";
import { saveProjectName, deleteProject, addNewProject, updateMainContentForProject } from "../controllers/projectController";
import { appendFilterContainerToProjects } from "../utils/taskUtils";


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
    addProjectButton.classList.add('uniform-plus-button', 'add-project-button')
    addProjectButton.innerHTML = '<i class="fas fa-plus"></i>';

    addProjectButton.addEventListener('click', () => {
        const addProjectForm = document.querySelector('.add-project-form');
        addProjectForm.style.display = addProjectForm.style.display === 'none' ? 'flex' : 'none';
    });

    const toggleButton = document.createElement('button');
    toggleButton.classList.add('toggle-button');
    toggleButton.innerHTML = '<i class="fas fa-angle-up"></i>';
    toggleButton.addEventListener('click', () => {
        const projectList = document.getElementById('project-list');
        const isHidden = projectList.style.display === 'none';
        projectList.style.display = isHidden ? 'block' : 'none';
        toggleButton.innerHTML = isHidden ? '<i class="fas fa-angle-up"></i>' : '<i class="fas fa-angle-down"></i>';
    });

    controlsContainer.appendChild(toggleButton);
    controlsContainer.appendChild(addProjectButton);


    headerContainer.appendChild(projectListTitle);
    headerContainer.appendChild(controlsContainer);

    projectListContainer.appendChild(headerContainer);

    // Add Project Form
    const addProjectForm = document.createElement('form');
    addProjectForm.classList.add('add-project-form');
    addProjectForm.style.display = 'none';

    const projectNameInput = document.createElement('input');
    projectNameInput.type = 'text';
    projectNameInput.id = 'newProjectName';
    projectNameInput.placeholder = 'Enter project name';

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.classList.add('submit-project-button')
    submitButton.textContent = 'Add';

    addProjectForm.appendChild(projectNameInput);
    addProjectForm.appendChild(submitButton);

    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const projectName = projectNameInput.value.trim();
        if (projectName) {
            addNewProject(projectName);
            addProjectForm.style.display = 'none';
            projectNameInput.value = '';
        }
    });

    projectListContainer.appendChild(addProjectForm);


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
            updateMainContentForProject(currentProject);
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
    closeButton.addEventListener('click', () => renderFilteredTasks('all'));
    projectHeader.appendChild(closeButton);


    projectContent.appendChild(projectHeader);

    const tasksContainer = document.createElement('div');
    tasksContainer.classList.add('tasks-container');

    appendFilterContainerToProjects(projectContent);


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