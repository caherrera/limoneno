require 'json_web_token'
module Versions
  class V1::DatasetItems < Grape::API
    version 'v1', using: :path
    format :json

    include Grape::Jwt::Authentication
    auth :jwt

    route_param :dataset_id do
      namespace :items do
        # CREATE DATASET ITEM METHOD
        params do
          requires :name, :mime
        end
        post do
          name = params[:name]
          mime = params[:mime]
          dataset_id = params[:dataset_id]

          return status 400 unless params[:data] || params[:url]
          
          case mime
          when "application/pdf"
            file = DatasetService::Files.upload_pdf params
          when "text/plain"
            file = DatasetService::Files.upload_txt params
          when "text/csv"
            # file = DatasetService::Files.upload_csv params
            return status 415 unless file
          else
            return status 415 unless file
          end

          status 201

          file
        end

        # UPDATE DATASET METHOD
        params do
          requires :id
        end
        patch ':id' do
          id = params[:id]
          dataset_id = params[:dataset]

          DatasetItem.update(id, {
              dataset_id: dataset_id,
              name: params[:name],
              mime: params[:mime],
              text: params[:text],
              metadata: params[:metadata],
              url: params[:url]
          });
  
          status 204
        end
        
        # DELETE DATASET METHOD
        delete ':id' do
          id = params[:id]
          dataset_id = params[:dataset_id]
          
          item = DatasetItem.where(id).first

          if item.stored
            key = "datasets/#{dataset_id}/items/#{id}"
            AwsService::S3.delete_file()
          end

          DatasetItem.destroy(id);

          status 204
        end

        # GET DATASETS ITEM OF DATASET
        get ':id' do
          id = params[:id]
          
          datasets = DatasetItem.where({
            id: id
          }).first;

          datasets
        end
      end
    end
  end
end