//taskController.js
import { Task } from '../models/taskModel';
import { renderAllTasksView, renderTasks, hideTaskDetailModal, toggleTaskFormVisibility, closeNewTaskModal } from '../views/taskView';
import { saveToLocalStorage } from '../utils/localStorage';
import { updateMainContentForProject } from './projectController';
import { allTasksArray, projectsArray, getCurrentProject, getProjects, getAllTasks, setAllTasks, setProjects } from '../models/appState';

let currentEditingTaskId = null;

const openTaskDetail = (task) => {
    currentEditingTaskId = task.id;
    taskView.showTaskDetailModal(task);
};

const closeTaskDetail = () => {
    hideTaskDetailModal();
    currentEditingTaskId = null;
    saveToLocalStorage('projects', getAllTasks());
    saveToLocalStorage('tasks', getAllTasks());


};


function deleteTask(taskToDelete) {

    const projects = getProjects();
    const allTasks = getAllTasks();
    // Remove task from its project
    const project = projects.find(p => p.name === taskToDelete.projectName);
    if (project) {
        project.tasks = project.tasks.filter(task => task.id !== taskToDelete.id);
    }

    // Remove task from allTasksArray
    const updatedAllTasks = allTasks.filter(task => task.id !== taskToDelete.id);

    setProjects(projects);
    setAllTasks(updatedAllTasks);
    saveToLocalStorage('projects', projects);
    saveToLocalStorage('tasks', updatedAllTasks);

    renderAllTasksView(updatedAllTasks);

    // const currentProject = getCurrentProject(); // Use getter to access current project
    // if (currentProject) {
    //     currentProject.tasks = currentProject.tasks.filter(task => task.id !== taskToDelete.id);
    //     allTasksArray = allTasksArray.filter(task => task.id !== taskToDelete.id);
    //     saveToLocalStorage();
    //     renderTasks(currentProject.tasks);
    //     updateMainContentForProject(currentProject);
    // } else {
    //     console.error("No current project set.");
    // }
}

function saveCurrentTask(currentEditingTaskId) {
    const currentProject = getCurrentProject(); // Use getter to access current project
    if (currentProject && Array.isArray(currentProject.tasks)) {
        const taskIndex = currentProject.tasks.findIndex(t => t.id === currentEditingTaskId);
        console.log("Saving task details for ID:", currentEditingTaskId);

        if (taskIndex !== -1) {
            const task = currentProject.tasks[taskIndex];
            console.log("Old Task Data:", JSON.stringify(task));

            // Update task details
            task.title = document.getElementById('modalTitle').value;
            task.description = document.getElementById('modalDescription').value;
            task.dueDate = document.getElementById('modalDueDate').value;
            task.priority = document.getElementById('modalPriority').value;

            const newProjectName = document.getElementById('modalProjectSelect').value;

            // Check if task has been reassigned to a new project
            if (task.projectName !== newProjectName) {
                currentProject.tasks.splice(taskIndex, 1);

                const newProject = projectsArray.find(p => p.name === newProjectName);
                if (newProject) {
                    task.projectName = newProjectName;
                    newProject.tasks.push(task);
                } else {
                    console.error("New project not found:", newProjectName);
                }
            }

            console.log("Updated Task Data", JSON.stringify(task));
            renderTasks(currentProject.tasks);
            saveToLocalStorage();
            updateMainContentForProject(currentProject);
        } else {
            console.log("Task not found with ID:", currentEditingTaskId);
        }
    } else {
        console.error("The current project is not defined or has no tasks property.");
    }
}

const addTaskToProject = (title, description, dueDate, priority, projectName) => {
    console.log('Adding task with:', { title, description, dueDate, priority, projectName });
    const projects = getProjects();
    const allTasks = getAllTasks();

    console.log('Current state before adding:', { allTasks, projects });

    try {
        const newTask = Task(title, description, dueDate, priority, projectName);
        allTasks.push(newTask);

        if (projectName) {
            const project = projects.find(p => p.name === projectName);
            console.log('Found project:', project);
            if (project) {
                project.tasks.push(newTask);
            } else {
                console.log('No project found with name:', projectName);
            }
        }
        saveToLocalStorage('projects', projects);
        saveToLocalStorage('tasks', allTasks);

        setAllTasks(allTasks);
        setProjects(projects);

        renderAllTasksView(allTasks);
        console.log('Task added, updated tasks list:', allTasks);
    } catch (error) {
        console.error('Failed to add task in addTaskToProject:', error);
        throw error; // Rethrow or handle the error appropriately
    }
};

const handleFormSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    const title = form.elements['title']?.value.trim();
    const description = form.elements['description']?.value.trim();
    const dueDate = form.elements['due-date']?.value;
    const priority = form.elements['priority']?.value;
    const projectName = form.elements['projectSelect']?.value;

    if (!title) {
        alert("Please enter a title for the task.");
        return;
    }

    try {
        addTaskToProject(title, description, dueDate, priority, projectName);
        toggleTaskFormVisibility(false);
        console.log('Task added successfully:', { title, description, dueDate, priority, projectName });
        alert("Task added successfully.");
        closeNewTaskModal()
    } catch (error) {
        console.error('Error adding task:', error);
        alert("Failed to add task.");
    }
};


export { deleteTask, saveCurrentTask, addTaskToProject, handleFormSubmit, openTaskDetail, closeTaskDetail };