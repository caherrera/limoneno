import { Subclasification } from "./subclasification";

export class Clasification {
    public name: string;
    public tag: string;
    public description: string;
    public subclasifications: Subclasification[];
    public subclasification: Subclasification | null = null;
    
    constructor(clasification: any = null) {
        this.name = clasification ? clasification.name : '';
        this.tag = clasification ? clasification.tag : '';
        this.description = clasification ? clasification.description : '';
        this.subclasifications = (clasification && clasification.subclasifications) ? clasification.subclasifications : [];
    }
}