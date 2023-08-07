export class Question {
    constructor(question, points) {
        this.question = question;
        this.points = points;
    }
    outputText() {
        if (this.points === 1 || this.points === -1) {
            return `${this.question} for ${this.points} point`;
        }
        else {
            return `${this.question} for ${this.points} points`;
        }
    }
}
