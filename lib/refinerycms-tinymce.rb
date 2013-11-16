module Refinery
  autoload :TinymceGenerator, 'generators/refinery/tinymce_generator'

  module Tinymce
    require 'refinery/tinymce/engine'
    require 'refinery/tinymce/configuration'

    autoload :Version, 'refinery/tinymce/version'

    class << self
      attr_writer :root

      def root
        @root ||= Pathname.new(File.expand_path('../../../', __FILE__))
      end
    end
  end
end
