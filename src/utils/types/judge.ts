export function getTypeMaker(type) {
    return (obj) => {
        return Object.prototype.toString.call(obj) === type
    }
}

export const isErrorTask = getTypeMaker('ErrorTask')
