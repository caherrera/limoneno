require 'json_web_token'
module Versions
  class V1::Projects < Grape::API
    version 'v1', using: :path
    format :json

    include Grape::Jwt::Authentication
    auth :jwt

    namespace :projects do
      # CREATE DATASET METHOD
      params do
        requires :name
      end
      post do
        datasets = Dataset.find(params[:datasets])
        users = User.find(params[:users])

        project = Project.create({
          name: params[:name],
          description: params[:description],
          clasification_type: params[:clasification_type],
          entities: params[:entities].to_json,
          clasifications: params[:clasifications].to_json,
          datasets: datasets,
          users: users,
          status: 1
        })

        project = params[:datasets]
        users = params[:users]

        status 201
        project
      rescue StandardError => e
        puts e
        status 500
      end

      # UPDATE DATASET METHOD
      params do
        requires :id, :name
      end
      patch do
        id = params[:id]
        name = params[:name]
        datasets = Dataset.find(params[:datasets])
        users = User.find(params[:users])

        Project.update(id, {
          name: params[:name],
          description: params[:description],
          clasification_type: params[:clasification_type],
          entities: params[:entities].to_json,
          clasifications: params[:clasifications].to_json,
          datasets: datasets,
          users: users,
          status: 1
        })

        status 204
      end
      
      # DELETE DATASET METHOD
      delete ':id' do
        id = params[:id]
        
        ProjectUser.where({
          project_id: id
        }).delete_all

        ProjectDataset.where({
          project_id: id
        }).delete_all

        Project.delete(id);

        status 204
      end


      get do
        projects = Project.all
        .includes(:users, :datasets)

        projects = projects.map do |project|
          tmp = project.attributes
          tmp[:datasets] = project.datasets
          tmp[:users] = project.users

          tmp[:assignated] = ProjectDatasetItem.where({
            project_id: project.id,
            status: [0, -1]
          }).count(:id)

          tmp[:assignated_done] = ProjectDatasetItem.where({
            project_id: project.id,
            status: 1
          }).count(:id)

          tmp[:free_pool_done] = ProjectDatasetItem.where({
            project_id: project.id,
            status: 2
          }).count(:id)

          tmp[:free_pool] = Project.where({
            id: project.id
          }).joins(:datasets)
          .joins("INNER JOIN dataset_items ON datasets.id = dataset_items.dataset_id")
          .joins("LEFT OUTER JOIN project_dataset_items ON project_dataset_items.project_id = projects.id AND dataset_items.id = project_dataset_items.dataset_item_id")
          .where("project_dataset_items.id IS NULL").count("datasets.id")

          tmp
        end

        projects
      end

      # GET UNIQUE DATASET
      get ':id' do
        id = params[:id]
        
        project = Project.where({
          id: id
        }).includes(:users)
        .includes(:datasets).first
        
        tmp = project.attributes
        tmp[:datasets] = project.datasets
        tmp[:users] = project.users

        tmp[:assignated] = ProjectDatasetItem.where({
          project_id: project.id,
          status: [0, -1]
        }).count(:id)

        tmp[:assignated_done] = ProjectDatasetItem.where({
          project_id: project.id,
          status: 1
        }).count(:id)

        tmp[:free_pool_done] = ProjectDatasetItem.where({
          project_id: project.id,
          status: 2
        }).count(:id)

        tmp[:free_pool] = Project.where({
          id: project.id
        }).joins(:datasets)
        .joins("INNER JOIN dataset_items ON datasets.id = dataset_items.dataset_id")
        .joins("LEFT OUTER JOIN project_dataset_items ON project_dataset_items.project_id = projects.id AND dataset_items.id = project_dataset_items.dataset_item_id")
        .where("project_dataset_items.id IS NULL").count("*")


        tmp
      end

      mount V1::ProjectItems
    end



    namespace :users do
      route_param :user_id do
        namespace :projects do 
          get do

            user = params[:user_id]

            projects = ProjectUser.where({
              user_id: user
            }).includes(:project)

            projects_stats = projects.map do |project|

              tmp = Project.where({
                id: project.id
              }).includes(:users).first.attributes

              tmp[:assignated] = ProjectDatasetItem.where({
                project_id: project.id,
                user_id: user,
                status: [0, -1]
              }).count(:id)

              tmp[:assignated_done] = ProjectDatasetItem.where({
                project_id: project.id,
                user_id: user,
                status: 1
              }).count(:id)

              tmp[:free_pool_done] = ProjectDatasetItem.where({
                project_id: project.id,
                user_id: user,
                status: 2
              }).count(:id)

              tmp[:free_pool] = Project.where({
                id: project.id
              }).joins(:datasets)
              .joins("INNER JOIN dataset_items ON datasets.id = dataset_items.dataset_id")
              .joins(:users)
              .joins("LEFT OUTER JOIN project_dataset_items ON project_dataset_items.project_id = projects.id AND dataset_items.id = project_dataset_items.dataset_item_id")
              .where("project_dataset_items.id IS NULL")
              .where("users.id = #{user}")
              .count("datasets.id")

              tmp
            end

            status 200
            projects_stats
          end

          route_param :project_id do
            namespace :workout do
              get do
                assignated = ProjectDatasetItem.where({
                  user_id: params[:user_id],
                  project_id: params[:project_id],
                  status: [0, -1]
                }).includes(:dataset, :dataset_item).first
                # Get From free pool if 
                if (assignated) 
                  status 200;
                  return assignated.as_json(include: [:dataset, :dataset_item])
                else
                  free_pool = Project.where({
                    id: params[:project_id]
                  }).joins(:datasets)
                  .joins("INNER JOIN dataset_items ON datasets.id = dataset_items.dataset_id")
                  .joins(:users)
                  .joins("LEFT OUTER JOIN project_dataset_items ON project_dataset_items.project_id = projects.id AND dataset_items.id = project_dataset_items.dataset_item_id")
                  .where("project_dataset_items.id IS NULL")
                  .where("users.id = #{params[:user_id]}")
                  .select("dataset_items.id, datasets.id AS dataset")
                  .first

                  if free_pool
                    created = ProjectDatasetItem.create({
                      user_id: params[:user_id],
                      project_id: params[:project_id],
                      status: -1,
                      dataset_id: free_pool.dataset,
                      dataset_item_id: free_pool.id
                    })
                    
                    assignated = ProjectDatasetItem.where(
                      id: created.id
                    ).includes(:dataset, :dataset_item).first

                    status 200
                    assignated.as_json(include: [:dataset, :dataset_item])
                  else
                    status 404
                  end
                end
              end

              patch ':id' do
                id = params[:id]
                tags = params[:tags]

                clasification = ProjectDatasetItem.update(id, {
                  clasification: params[:clasification],
                  tags: params[:tags].to_json,
                  status: (params[:status] == -1) ? 2 : 1,
                  documents: params[:documents]
                })

                if params[:documents]
                  dataset = DatasetItem.where({
                    id: params[:datasetItem][:id]
                  }).first
                  tags.each do |document|
                    document = dataset[:text][document[:start], document[:end]]
                    # Creamos el dataset
                    item = DatasetItem.create({
                      text: document,
                      dataset_id: dataset[:dataset_id],
                      name: dataset[:name],
                      mime: dataset[:mime],
                      metadata: dataset[:metadata],
                      url: dataset[:url],
                      status: dataset[:status]
                    })
                    # Asignamos el nuevo documento al usuario
                    ProjectDatasetItem.create({
                      user_id: params[:user_id],
                      project_id: params[:project_id],
                      clasification: params[:clasification],
                      status: -1,
                      dataset_id: dataset[:dataset_id],
                      dataset_item_id: item.id
                    })
                  end
                end
                
                clasification.status = 2;

                status 200
                clasification
              end
            end
          end
        end
      end
    end
  end
end