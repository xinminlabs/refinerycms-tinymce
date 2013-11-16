module Refinery
  class TinymceGenerator < Rails::Generators::Base

    source_root File.expand_path('../templates', __FILE__)

    def generate_share_this_initializer
      template 'config/initializers/refinery/tinymce.rb.erb', File.join(destination_root, 'config', 'initializers', 'refinery', 'tinymce.rb')
    end

  end
end
