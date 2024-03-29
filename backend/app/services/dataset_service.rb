module DatasetService 
  class Files
    def self.upload_pdf(file)
      AwsService::S3.list_files
      [{
        name: 'file',
        text: 'perrito lorem ipsum',
        metadata: '',
        url: 'ashjbasdjabdjas',
        status: 1,
        stored: false
      }]
    end

    def self.upload_txt(file)
      stored = false
      if file[:data]
        data = Base64.decode64(file[:data])
        stored = self.save_s3 file
      elsif file[:url]
        data = self.download_file(file[:url])
      end
      
      [{
        name: file[:name],
        text: data,
        metadata: nil,
        url: nil,
        status: 1,
        stored: stored
      }]
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

    def self.download_file(link)
      open(file[:url])
    end
  end
end