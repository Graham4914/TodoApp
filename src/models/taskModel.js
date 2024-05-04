export const Task = (title, description, dueDate, priority, projectName = null, status = 'incomplete') => {
    return {
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        title,
        description,
        dueDate,
        priority,
        projectName,
        status
    };
};