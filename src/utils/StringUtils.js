export default {
    idToTitle: string => {
        const newStr = `${string[0].toUpperCase()}${string.slice(1)}`
        return newStr.replace(/_/g, " ");
    }
}