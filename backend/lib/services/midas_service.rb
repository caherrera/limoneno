# frozen_string_literal: true

require 'grpc'
require 'proto/midas/midas_services_pb'
require 'open-uri'

module MidasService
  # Utils class to consume Midas OCR service
  class MidasClient
    MIDAS_HOST = ENV['MIDAS_HOST'] || 'midas.caseflow.lemontech.com:80'
    FILE_ENCODING = 'ASCII-8BIT'

    # For PDF files use 'file_type = Midas::InputFormat::PDF'
    def self.get_file_text(file, file_type = Midas::InputFormat::INPUT_FORMAT_AUTO)
      raise(Exception, 'File not provided.') unless file.present?

      request = prepare_request(file, file_type)
      response_object = call_get_text(request)
      parse_response(response_object)
    end

    # For PDF files use 'file_type = Midas::InputFormat::PDF'
    def self.get_remote_file_text(url, file_type = Midas::InputFormat::INPUT_FORMAT_AUTO)
      raise(Exception, 'URL not provided.') unless url.present?

      request = prepare_remote_request(url, file_type)
      response_object = call_get_text(request)
      parse_response(response_object)
    end

    private_class_method def self.parse_response(midas_reponse)
      document_text = +''
      midas_reponse.each do |page|
        page_text = page.try(:text)
        next unless page_text.present?

        document_text << "#{page_text}\n "
      end

      document_text
    end

    private_class_method def self.call_get_text(request)
      stub = Midas::MidasService::Stub.new(MIDAS_HOST, :this_channel_is_insecure)
      stub.get_text(request)
    end

    private_class_method def self.prepare_remote_request(url, file_type)
      change_default_buffer do
        downloaded_document = URI.open(url)
        file = File.read(downloaded_document, encoding: FILE_ENCODING)

        return prepare_request(file, file_type)
      end
    end

    private_class_method def self.prepare_request(file, input_format)
      Midas::GetTextRequest.new(
        file: file,
        input_format: input_format,
        output_format: Midas::OutputFormat::PLAIN_TEXT_WITH_SIGNATURES
      )
    end

    # Sets default read buffer to 0 to force OpenURI to store it inside a TempFile.
    # If a file is small enough OpenURI returns StringIO instead of TempFile.
    # Resets defaults after use
    private_class_method def self.change_default_buffer
      default_buffer = remove_buffer_const
      OpenURI::Buffer.const_set('StringMax', 0)

      yield

      remove_buffer_const
      OpenURI::Buffer.const_set('StringMax', default_buffer) if default_buffer.present?
    end

    private_class_method def self.remove_buffer_const
      default_buffer = nil
      if OpenURI::Buffer.const_defined?('StringMax')
        default_buffer = OpenURI::Buffer::StringMax
        OpenURI::Buffer.send(:remove_const, 'StringMax')
      end
      default_buffer
    end
  end
end
