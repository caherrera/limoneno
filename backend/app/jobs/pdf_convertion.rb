require 'services/midas_service'
class PdfConvertion < ActiveJob::Base
    queue_as :default
    
    def perform(file, dataset)
      # do da ting
      text = MidasService::MidasClient.get_file_text(file)
      DatasetItem.update(dataset[:id], {
        text: text,
        status: 1
      });
    rescue
      DatasetItem.update(dataset[:id], {
        status: 3
      });
    end
end