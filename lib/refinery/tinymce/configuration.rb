module Refinery
  module Tinymce
    include ActiveSupport::Configurable

    config_accessor :directionality,
                    :browser_spellcheck,
                    :language,
                    :language_url,
                    :nowrap,
                    :object_resizing,
                    :plugins,
                    :skin,
                    :skin_url,
                    :theme,
                    :theme_url,
                    :content_css,
                    :visual,
                    :custom_undo_redo_levels,
                    :toolbar,
                    :menubar,
                    :menu,
                    :statusbar,
                    :resize,
                    :preview_styles,
                    :convert_urls,
                    :relative_urls,
                    :remove_script_host,
                    :document_base_url,
                    :tinymce_url

    self.directionality = 'ltr'
    self.browser_spellcheck = true
    self.language = :en
    self.nowrap = false
    self.object_resizing = true
    self.plugins = %w(refinery_images code table lists charmap autolink hr anchor pagebreak fullscreen)
    self.skin = 'lightgray'
    self.theme = 'modern'

     # Content style
    self.content_css = 'refinery/theme.css'

    # Visual aids
    self.visual = true

    # Undo/Redo
    self.custom_undo_redo_levels = 10

    # User interface
    # self.toolbar = ''
    # self.menubar = false
    # self.statusbar = true
    self.resize = 'both'

    # URL
    self.convert_urls = false
    self.relative_urls = false
    self.remove_script_host = false
    self.document_base_url = ''

    self.tinymce_url = '/components/tinymce/js/tinymce/tinymce.min.js'
  end
end
