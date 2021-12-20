export function parseErrors(errors) {
    let parsedErrors = [];
    for (let i in errors) {
        for (let j in errors[i]) {
            parsedErrors.push(errors[i][j]);
        }
    }
    return parsedErrors;
}
