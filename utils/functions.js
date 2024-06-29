const parseData = (string) => {
    try {
        return JSON.parse(string);
    } catch (error) {
        return null;
    }
}
const getDateInfo = () => {
    return {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
}
module.exports = { parseData, getDateInfo };