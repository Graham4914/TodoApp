//projectController.js
import { Project } from "../models/projectModel";
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/localStorage";
import { updateProjectListUI, createProjectContent, updateAllProjectDropdowns, generateProjectDropdown } from "../views/projectView";
import { createTaskList, renderAllTasksView } from "../views/taskView";
import { addProject, getProjects, setProjects, setCurrentProject, getCurrentProject, getAllTasks, currentProject, } from "../models/appState";



const addNewProject = (projectName) => {
    if (projectName && projectName.trim() !== '') {
        const newProject = { name: projectName.trim(), tasks: [] };
        addProject(newProject);
        setCurrentProject(newProject);
        saveToLocalStorage('projects', getProjects());
        updateProjectListUI();
        updateAllProjectDropdowns();
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
    tasksContainer.appendChild(tasksList);
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