//projectController.js
import { Project } from "../models/projectModel";
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/localStorage";
import { updateProjectListUI, createProjectContent, generateProjectDropdown } from "../views/projectView";
import { createTaskList, } from "../views/taskView";
import { addProject, getProjects, setCurrentProject, getCurrentProject, currentProject } from "../models/appState";

// function handleProjectClose() {
//     closeProjectView();
// }

const addNewProject = () => {
    const projectName = prompt('Enter new project name:');
    if (projectName && projectName.trim() !== '') {
        const newProject = { name: projectName.trim(), tasks: [] };
        addProject(newProject);
        setCurrentProject(newProject);
        updateProjectListUI();
        saveToLocalStorage('projects', getProjects());
        // Update the task form dropdown
        const oldDropdown = document.getElementById('projectSelect');
        const newDropdown = generateProjectDropdown();
        if (oldDropdown && oldDropdown.parentNode) {
            oldDropdown.parentNode.replaceChild(newDropdown, oldDropdown);
        }
        // generateProjectDropdown();
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

const updateMainContentForProject = () => {
    const project = getCurrentProject();
    if (!project) {
        console.error("No project provided to updateMainContentForProject");
        return;
    }

    console.log("Attempting to update content for project:", project.name);

    const tasksContainer = document.querySelector('.tasks-container');
    if (!tasksContainer) {
        console.error("Tasks container not found in the DOM");
        return;
    }

    tasksContainer.innerHTML = '';

    const projectContent = createProjectContent(project);
    tasksContainer.appendChild(projectContent);

    const tasksList = createTaskList(project.tasks);
    const tasksPlaceholder = tasksContainer.querySelector('.tasks-placeholder');
    if (tasksPlaceholder) {
        tasksPlaceholder.replaceWith(tasksList); // Replace the placeholder with the actual tasks list
    } else {
        tasksContainer.appendChild(tasksList); // Append tasks list if no placeholder exists
    }

};

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

export { addNewProject, deleteProject, updateMainContentForProject, saveProjectName };