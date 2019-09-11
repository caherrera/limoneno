export class Subclasification {
    public name: string;
    public tag: string;
    public description: string;
    
    constructor(subclasification: any = null) {
        this.name = subclasification.name;
        this.tag = subclasification.tag;
        this.description = subclasification.description;
    }
}