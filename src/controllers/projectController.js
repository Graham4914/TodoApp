import { Project } from "../models/projectModel";
import { saveToLocalStorage } from "../utils/localStorage";
import { getProjectNameFromUser, updateProjectListUI, closeProjectView } from "../views/projectView";

function handleProjectClose() {
    closeProjectView();
}

const addNewProject = () => {
    getProjectNameFromUser((projectName) => {
        if (projectName) {
            const newProject = Project(projectName);
            projectsArray.push(newProject);
            updateProjectListUI();
            saveToLocalStorage();
        }
    });
};

const updateProjectListUI = () => {
    const projectListElement = document.getElementById('project-list');
    projectListElement.innerHTML = '';

    projectsArray.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.textContent = project.name;
        projectElement.classList.add('project');
        projectElement.addEventListener('click', () => {
            currentProject = project;
            updateMainContentForProject(project);

        });
        projectListElement.appendChild(projectElement);
    });
};

function deleteProject(projectToDelete) {
    projectsArray = projectsArray.filter(project => project !== projectToDelete);
    saveToLocalStorage();

    updateProjectListUI();

    if (projectsArray.length > 0) {
        updateMainContentForProject(projectsArray[0]);
    } else {
        console.log('no projects selected')
        // showEmptyStateOrPrompt();
    }
}

function updateMainContentForProject(project) {

    if (!project) {
        console.error("no project provided to updatemaincontentforproject", project.name);
        return;
    }

    if (!project.name) {
        console.error("Project data is invalid", project);
        return;
    }

    console.log("Attempting to update content for project:", project.name);
    const relevantTasks = currentProject.tasks.filter(task => task.projectName === project.name);

    const tasksContainer = document.querySelector('.tasks-container');

    tasksContainer.innerHTML = '';

    tasksContainer.appendChild(createProjectContent(project));
    const tasksList = createTaskList(project.tasks);
    tasksContainer.appendChild(tasksList);
    currentProject = project;
}

function saveProjectName(project, newName) {
    if (!project) {
        console.error("no project available to save name")
        return;
    }

    project.name = newName;
    saveToLocalStorage();
    updateProjectListUI();
    updateMainContentForProject(project);
}

export { addNewProject, updateProjectListUI, deleteProject, updateMainContentForProject, saveProjectName, closeProjectView };