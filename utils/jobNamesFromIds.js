const buildJobNames = (jobIds, type) => {
    const jobNames = jobIds.map(id => `bull:${type}:${id}`);
    return jobNames;
}

module.exports = buildJobNames;