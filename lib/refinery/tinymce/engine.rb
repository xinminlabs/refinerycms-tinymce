module Refinery
  module Tinymce
    class Engine < ::Rails::Engine
      # include ::ActionView::Helpers::AssetTagHelper

      engine_name :refinery_tinymce

      initializer 'register refinery_tinymce to refinery_core' do
        Refinery::Core.wysiwyg_editor = self
      end

      initializer 'register tinymce javascripts' do
        ::Refinery::I18n.locales.each do |locale|
          file_path = "#{config.root}/vendor/assets/javascripts/refinery/i18n/tinymce/tinymce-#{locale[0]}.js"
          if File.exists?(file_path)
            Refinery::Core.config.register_admin_I18n_javascript locale[0], "refinery/i18n/tinymce/tinymce-#{locale[0]}.js"
          end
        end

        Refinery::Core.config.register_admin_javascript(%w(
          refinery/tinymce/tinymce.all.js
        ))
      end

      initializer 'register refinery_tinymce stylesheets' do
        Refinery::Core.config.register_admin_stylesheet 'refinery/tinymce'
      end

      def options context
        options = Refinery::Tinymce.config
        options[:content_css] = context.asset_url(options[:content_css]) unless options[:content_css].nil?

        options
      end

    end
  end
end
