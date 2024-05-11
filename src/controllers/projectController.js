//projectController.js
import { Project } from "../models/projectModel";
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/localStorage";
import { updateProjectListUI } from "../views/projectView";
import { addProject, setCurrentProject } from "../models/appState";

function handleProjectClose() {
    closeProjectView();
}

const addNewProject = () => {
    const projectName = prompt('Enter new project name:');
    if (projectName && projectName.trim() !== '') {
        const newProject = { name: projectName.trim(), tasks: [] };
        addProject(newProject);
        setCurrentProject(newProject);
        updateProjectListUI();
    } else {
        alert("Project name cannot be empty.");
    }
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

export { addNewProject, deleteProject, updateMainContentForProject, saveProjectName, };