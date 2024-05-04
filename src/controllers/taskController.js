import { Task } from '../models/taskModel';
import { createTaskElement, updateTaskElement } from '../views/taskView';
import { saveToLocalStorage } from '../utils/localStorage';
import { showTaskDetailModal, hideTaskdetailModal } from ' ./Views/taskView';
import { updateMainContentForProject } from './projectController';


let currentEditingTaskId = null;

const openTaskDetail = (task) => {
    currentEditingTaskId = task.id;
    taskView.showTaskDetailModal(task);
};

const closeTaskDetail = () => {
    taskView.hideTaskdetailModal();
    currentEditingTaskId = null;
    saveCurrentTask();
    updateMainContentForProject(currentProject);
};

function deleteTask(taskToDelete) {
    currentProject.tasks = currentProject.tasks.filter(task => task.id !== taskToDelete.id);

    allTasksArray = allTasksArray.filter(task => task.id !== taskToDelete.id);
    saveToLocalStorage();
    renderTasks(currentProject.tasks);
    updateMainContentForProject(currentProject);
}

function saveCurrentTask() {

    // Check that the current project is defined and has a tasks array
    if (!currentProject || !Array.isArray(currentProject.tasks)) {
        console.error("The current project is not defined or has no tasks property.");
        return;
    }

    const taskIndex = currentProject.tasks.findIndex(t => t.id === currentEditingTaskId);
    console.log("saving task details for ID:", currentEditingTaskId);

    if (taskIndex !== -1) {
        const task = currentProject.tasks[taskIndex];
        console.log("OldTask Data:", JSON.stringify(task));

        //update task details
        task.title = document.getElementById('modalTitle').value;
        task.description = document.getElementById('modalDescription').value;
        task.dueDate = document.getElementById('modalDueDate').value;
        task.priority = document.getElementById('modalPriority').value;

        const newProjectName = document.getElementById('modalProjectSelect').value;

        //check if task has been reassigned to new project
        if (task.projectName !== newProjectName) {
            currentProject.tasks.splice(taskIndex, 1);

            const newProject = projectsArray.find(p => p.name === newProjectName);

            task.projectName = newProjectName;
            newProject.tasks.push(task);
        }

        console.log("Updated Tas Data", JSON.stringify(task));

        renderTasks(currentProject.tasks);
        saveToLocalStorage();
        updateMainContentForProject(currentProject);
    } else {
        console.log("Task not foiund with ID:", currentEditingTaskId);
    }

}

//Add new task to current Project and re-render tasks
const addTaskToProject = (title, description, dueDate, priority, projectName) => {
    const newTask = Task(title, description, dueDate, priority, projectName);
    allTasksArray.push(newTask);

    if (projectName) {
        const project = projectsArray.find(p => p.name === projectName);
        if (project) {
            project.tasks.push(newTask);
        }
    }


    saveToLocalStorage();
    renderAllTasksView();
    console.log('Tasks rendered, updating counters.');
    updateCounters();
    // updateMainContentForProject(assignedProject);
}

const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    const title = form.elements['title'].value;
    const description = form.elements['description'].value;
    const dueDate = form.elements['due-date'].value;
    const priority = form.elements['priority'].value;
    const projectName = form.elements['projectSelect'].value;

    console.log('Form submitted with:', { title, description, dueDate, priority, projectName });

    addTaskToProject(title, description, dueDate, priority, projectName);

    toggleTaskFormVisibility(false);

    console.log('Current project after adding task:', currentProject);

};

export { deleteTask, saveCurrentTask, addTaskToProject, handleFormSubmit, openTaskDetail, closeTaskDetail };