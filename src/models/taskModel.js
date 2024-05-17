export const Task = (title, description, dueDate, priority, projectName) => {
    return {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        dueDate,
        priority,
        projectName,
        status: 'incomplete'
    };
};