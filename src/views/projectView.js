//projectView.js
import { Project } from "../models/projectModel";
import { loadFromLocalStorage } from "../utils/localStorage";
import { getProjects, addProject, setProjects, setCurrentProject } from "../models/appState";
import { updateMainContentForProject, addNewProject } from "../controllers/projectController";


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
    const storedProjects = loadFromLocalStorage() || [];
    if (storedProjects.length === 0) {
        addProject({ name: "Default", tasks: [] });
    } else {
        setProjects(storedProjects);
    }
    updateProjectListUI();
};


const updateProjectListUI = () => {
    const projects = getProjects();
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

    projectContent.appendChild(projectTitleInput);
    // Check if projectTitle is set correctly
    console.log("projectTitle set to:", projectTitleInput);

    const addTaskButton = document.createElement('button');
    addTaskButton.textContent = "Add Task to Project";
    addTaskButton.addEventListener('click', showTaskForm);
    projectContent.appendChild(addTaskButton);

    // add project close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', () => closeProjectView());
    projectContent.appendChild(closeButton);

    //add delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => deleteProject(project));
    projectContent.appendChild(deleteButton)

    return projectContent;
}

function generateProjectDropdown() {
    const select = document.createElement('select');
    select.id = 'projectSelect';


    const noProjectOption = document.createElement('option');
    noProjectOption.textContent = "No Project";
    noProjectOption.value = "";
    select.appendChild(noProjectOption);

    projectsArray.forEach(project => {
        const option = document.createElement('option');
        option.value = project.name;
        option.textContent = project.name;
        select.appendChild(option);
    });
    return select;
}

function closeProjectView() {
    const tasksContainer = document.querySelector('.tasks-container');
    if (tasksContainer) {
        tasksContainer.innerHTML = '';
    }
}







export { createProjectListElement, createProjectContent, generateProjectDropdown, closeProjectView, updateProjectListUI, getProjectNameFromUser, loadProjects };