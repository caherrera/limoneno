# frozen_string_literal: true

require 'services/midas_service'
require 'open-uri'

class MidasServiceTest < Minitest::Test
  # Tests for get_file_text method
  class GetFileTextTests < Minitest::Test
    def test_url_required_is_nil
      file = nil

      exception = assert_raises Exception do
        ::MidasService::MidasClient.get_file_text(file)
      end
      assert_equal('File not provided.', exception.message)
    end
  end

  # Tests for get_remote_file_text method
  class GetRemoteFileTextTests < Minitest::Test
    def test_url_required_is_empty
      url = ''

      exception = assert_raises Exception do
        ::MidasService::MidasClient.get_remote_file_text(url)
      end
      assert_equal('URL not provided.', exception.message)
    end

    def test_url_required_is_nil
      url = nil

      exception = assert_raises Exception do
        ::MidasService::MidasClient.get_remote_file_text(url)
      end
      assert_equal('URL not provided.', exception.message)
    end
  end

  # Tests for prepare_request method
  class PrepareRequestTests < Minitest::Test
    def test_no_pages_provided
      mock_file_path = "#{Rails.root}/test/fixtures/files/sample_file.pdf"
      mock_file = File.read(mock_file_path, encoding: ::MidasService::MidasClient::FILE_ENCODING)
      midas_file_type = Midas::InputFormat::INPUT_FORMAT_AUTO

      result = ::MidasService::MidasClient.send(:prepare_request, mock_file, midas_file_type)
      assert_equal(Midas::GetTextRequest, result.class)
    end
  end

  # Tests for parse_response method
  class ParseResponseTests < Minitest::Test
    Page = Struct.new(:text)

    def test_no_pages_provided
      mock_response = []

      result = ::MidasService::MidasClient.send(:parse_response, mock_response)
      assert_equal('', result)
    end

    def test_only_one_page
      mock_response = [
        Page.new('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
      ]

      result = ::MidasService::MidasClient.send(:parse_response, mock_response)
      expected_result = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n "
      assert_equal(expected_result, result)
    end

    def test_merge_pages
      mock_response = [
        Page.new('Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
        Page.new('Praesent posuere, leo eu rutrum cursus, enim felis interdum...')
      ]

      result = ::MidasService::MidasClient.send(:parse_response, mock_response)
      expected_result = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n ",
        "Praesent posuere, leo eu rutrum cursus, enim felis interdum...\n "
      ].join
      assert_equal(expected_result, result)
    end
  end

  # Tests for change_default_buffer method
  class ChangeDefaultBufferTests < Minitest::Test
    def test_buffer_default_value_different_than_zero
      refute_equal(0, OpenURI::Buffer::StringMax)
    end

    def test_buffer_inside_block_is_zero
      ::MidasService::MidasClient.send(:change_default_buffer) do
        assert_equal(0, OpenURI::Buffer::StringMax)
      end
      refute_equal(0, OpenURI::Buffer::StringMax)
    end
  end
end
