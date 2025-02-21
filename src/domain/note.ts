import { Id } from "../../convex/_generated/dataModel";

export class Note {
    constructor(
        public id: Id<"notes">,
        public title: string,
        public content: string,
        public lastEditTime: number
    ) {}
}