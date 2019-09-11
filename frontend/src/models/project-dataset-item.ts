import { DatasetItemTag } from "./dataset-item-tag";
import { User } from "./user";
import { DatasetItem } from "./dataset-item";
import { Dataset } from "./dataset";
import { Clasification } from "./clasification";

export class ProjectDatasetItem {
    public id: number;
    public project: number;
    public dataset: Dataset | null;
    public datasetItem: DatasetItem | null;
    public clasification: Clasification | null;
    public tags: DatasetItemTag[] = [];
    public status: number;
    public user: User | null;
    public documents: boolean;

    constructor(pDatasetItem: any = null) {
        this.id = pDatasetItem ? pDatasetItem.id : null;
        this.project = pDatasetItem ? pDatasetItem.project : null;
        this.dataset = pDatasetItem ? new Dataset(pDatasetItem.dataset) : null;
        this.datasetItem = pDatasetItem ? new DatasetItem(pDatasetItem.dataset_item) : null;
        this.clasification = pDatasetItem && pDatasetItem.clasification ? new Clasification(pDatasetItem.clasification) : null;
        this.tags = pDatasetItem ? pDatasetItem.tags || [] : [];
        this.status = pDatasetItem ? pDatasetItem.status : null;
        this.user = pDatasetItem ? new User(pDatasetItem.user) : null;
        this.documents = pDatasetItem ? pDatasetItem.documents : false;
    }
}