import { Dataset } from "./dataset";
import { User } from "./user";
import { ProjectDatasetItem } from "./project-dataset-item";
import { Entity } from "./entity";
import { Clasification } from "./clasification";

export class Project {
    public id: number;
    public name: string;
    public description: string;
    public clasification_type: number;
    public entities: Entity[] = [];
    public clasifications: Clasification[] = [];
    public datasets: Dataset[] = [];
    public users: User[] = [];
    public datasetItems: ProjectDatasetItem[] = [];
    public assignated: number = 0;
    public assignated_done: number = 0;
    public free_pool: number = 0;
    public free_pool_done: number = 0;

    constructor(project: any = null) {
        this.id = project ? project.id : null;
        this.name = project ? project.name : null;
        this.description = project ? project.description : null;
        this.clasification_type = project ? project.clasification_type : null;
        this.assignated = project ? project.assignated : 0;
        this.assignated_done = project ? project.assignated_done : 0;
        this.free_pool = project ? project.free_pool : 0;
        this.free_pool_done = project ? project.free_pool_done : 0;
       
        if (project && project.entities) {
            if (typeof project.entities === 'string') {
                project.entities = JSON.parse(project.entities);
            }
           
            this.entities = project.entities.map((entity: any) => {
                return new Entity(entity);
            });
        }

        if (project && project.clasifications) {
            if (typeof project.clasifications  === 'string') {
                project.clasifications = JSON.parse(project.clasifications);
            }
            
            this.clasifications = project.clasifications
            .map((clasification: any) => {
                return new Clasification(clasification);
            });
        }

        if (project && project.datasets) {
            this.datasets = project.datasets.map((dataset: any) => {
                return new Dataset(dataset);
            });
        }

        if (project && project.users) {
            this.users = project.users.map((user: any) => {
                return new User(user);
            });
        }

        if (project && project.datasetItemss) {
            this.datasetItems = project.datasetItemss
            .map((datasetItems: any) => {
                return new User(datasetItems);
            });
        }
        
    }

    public getDatasetsIds(): number[] | null  {
        if (this.datasets) {
            return this.datasets.map(dataset => {
                return dataset.id;
            });
        }
        return null;
    }

    public getUsersIds(): number[] | null  {
        if (this.users) {
            return this.users.map(user => {
                return user.id;
            });
        }
        return null;
    }

    public toJSON(): any {
        return {
            id: this.id || undefined,
            name: this.name,
            description: this.description || undefined,
            clasification_type: this.clasification_type || undefined,
            entities: this.entities || undefined,
            clasifications: this.clasifications || undefined,
            datasets: this.getDatasetsIds() || undefined,
            users: this.getUsersIds() || undefined
        };
    }
}