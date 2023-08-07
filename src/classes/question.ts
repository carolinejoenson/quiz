import { OutputFormat } from "../interfaces/outputFormat.js";

export class Question implements OutputFormat {
    question: string;
    points: number;

    constructor(question: string, points: number){
        this.question = question;
        this.points = points;
    }

    outputText(){
        if (this.points === 1 || this.points === -1){
            return `${this.question} for ${this.points} point`
        }
        else{
            return `${this.question} for ${this.points} points`
        }
    }
}