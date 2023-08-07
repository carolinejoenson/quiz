export class Answer {
    constructor(answer, points) {
        this.answer = answer;
        this.points = points;
    }
    outputText() {
        if (this.points === 1 || this.points === -1) {
            return `${this.answer} for ${this.points} point`;
        }
        else {
            return `${this.answer} for ${this.points} points`;
        }
    }
}
