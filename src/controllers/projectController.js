//projectController.js
import { Project } from "../models/projectModel";
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/localStorage";
import { updateProjectListUI, createProjectContent, updateAllProjectDropdowns, generateProjectDropdown } from "../views/projectView";
import { createTaskList, renderAllTasksView } from "../views/taskView";
import { addProject, getProjects, setProjects, setCurrentProject, getCurrentProject, getAllTasks, currentProject } from "../models/appState";


// const addNewProject = () => {
//     const projectName = prompt('Enter new project name:');
//     if (projectName && projectName.trim() !== '') {
//         const newProject = { name: projectName.trim(), tasks: [] };
//         addProject(newProject);
//         setCurrentProject(newProject);
//         updateProjectListUI();
//         saveToLocalStorage('projects', getProjects());
//         updateAllProjectDropdowns();
//     } else {
//         alert("Project name cannot be empty.");
//     }
// };
// const addNewProject = (projectName) => {
//     // Implement the function to add a new project to the list
//     const projectList = document.getElementById('project-list');
//     const projectElement = document.createElement('div');
//     projectElement.classList.add('project');
//     projectElement.textContent = projectName;
//     projectList.appendChild(projectElement);
//     // Add logic to save the new project
// };

const addNewProject = (projectName) => {
    if (projectName && projectName.trim() !== '') {
        const newProject = { name: projectName.trim(), tasks: [] };
        addProject(newProject); // Function to add the new project to your projects array
        setCurrentProject(newProject); // Function to set the new project as the current project
        updateProjectListUI(); // Function to update the project list UI
        saveToLocalStorage('projects', getProjects()); // Save projects to local storage
        updateAllProjectDropdowns(); // Update any dropdowns with the new project

        // Add new project element to the UI
        const projectList = document.getElementById('project-list');
        const projectElement = document.createElement('div');
        projectElement.classList.add('project');
        projectElement.textContent = newProject.name;
        projectList.appendChild(projectElement);
    } else {
        alert("Project name cannot be empty.");
    }
};

const deleteProject = (project) => {
    const projects = getProjects();
    const allTasks = getAllTasks();

    // Reassign tasks from the project to "No Project"
    project.tasks.forEach(task => {
        task.projectName = "";
    });

    const updatedProjects = projects.filter(p => p.name !== project.name);
    setProjects(updatedProjects);
    saveToLocalStorage('projects', updatedProjects);
    saveToLocalStorage('tasks', allTasks);

    updateProjectListUI();
    renderAllTasksView(allTasks);
};

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