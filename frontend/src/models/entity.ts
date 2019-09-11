export class Entity {
    public name: string;
    public tag: string;
    public description: string;

    constructor(entity: any = null) {
        this.name = entity.name;
        this.tag = entity.tag;
        this.description = entity.description;
    }
}