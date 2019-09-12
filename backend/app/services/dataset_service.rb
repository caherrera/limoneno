require 'services/midas_service'
module DatasetService 
  class Files
    def self.upload_pdf(file)
      stored = false
      if file[:data]
        data = Base64.decode64(file[:data])
        stored = self.save_s3 file
      elsif file[:url]
        data = self.download_file(file[:url])
      end

      # 0: Archivo no cargado, 1: archivo cargado, 2: Archivo en proceso de carga
      dataset_item = {
        dataset_id: file[:dataset_id],
        name: file[:name],
        text: '',
        mime: file[:mime],
        metadata: file[:metadata],
        url: file[:url],
        status: 2, 
        stored: stored
      }

      result = self.save_dataset([dataset_item])
      PdfConvertion.perform_later(data, result[0])
      result
    end

    def self.upload_txt(file)
      stored = false
      if file[:data]
        data = Base64.decode64(file[:data])
        stored = self.save_s3 file
      elsif file[:url]
        data = self.download_file(file[:url])
      end
      
      result = self.save_dataset([{
        dataset_id: file[:dataset_id],
        name: file[:name],
        text: data,
        mime: file[:mime],
        metadata: file[:metadata],
        url: file[:url],
        status: 1,
        stored: stored
      }])

      result
    end

    def self.upload_csv(file)
      puts "csv"
      true
    end

    def self.save_s3(file)
      if ActiveRecord::Type::Boolean.new.cast(ENV['AWS_SAVE'])
        key = "datasets/#{file[:dataset_id]}/items/#{file[:name]}"
        return true if AwsService::S3.upload_file(key, file)
      end
    rescue ex
      puts "Hubo un error mientras se subia el archivo al bucket en S3"
      return false
    end

    def self.save_dataset(file)
      result = []

      file.each do |item|
        ditem = DatasetItem.create({
          dataset_id: item[:dataset_id],
          name: item[:name],
          mime: item[:mime],
          text: item[:text],
          metadata: item[:metadata],
          url: item[:url],
          status: item[:status]
        });

        result.push(ditem) if ditem
      end

      result
    end

    def self.download_file(link)
      open(file[:url])
    end
  end
end