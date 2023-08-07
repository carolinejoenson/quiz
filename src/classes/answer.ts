import { OutputFormat } from "../interfaces/outputFormat.js";

export class Answer implements OutputFormat {
    answer: string;
    points: number;

    constructor(answer: string, points: number){
        this.answer = answer;
        this.points = points;
    }

    outputText(){
        if (this.points === 1 || this.points === -1){
            return `${this.answer} for ${this.points} point`
        }
        else{
            return `${this.answer} for ${this.points} points`
        }
    }
}