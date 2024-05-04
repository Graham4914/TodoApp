export const Project = (name) => {
    const tasks = [];

    return {
        name,
        tasks,
        addTask(task) {
            tasks.push(task);
        }
    };
};