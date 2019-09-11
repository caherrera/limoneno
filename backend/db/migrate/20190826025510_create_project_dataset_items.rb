class CreateProjectDatasetItems < ActiveRecord::Migration[6.0]
  def change
    create_table :project_dataset_items do |t|
      t.integer :project_id
      t.integer :user_id
      t.integer :dataset_id
      t.integer :dataset_item_id
      t.json :clasification
      t.json :tags
      t.integer :status
      t.boolean :documents

      t.timestamps
    end
  end
end
