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

Refinery::Core.module_eval do
  config_accessor :wysiwyg_editor, :javascripts, :I18n_javascripts, :stylesheets,
                  :admin_javascripts, :admin_I18n_javascripts, :admin_stylesheets,
                  :extern_javascripts, :admin_extern_javascripts

  self.javascripts = []
  self.I18n_javascripts = {}
  self.extern_javascripts = []
  self.stylesheets = []
  self.admin_javascripts = []
  self.admin_I18n_javascripts = {}
  self.admin_extern_javascripts = []
  self.admin_stylesheets = []

  def config.register_javascript(name)
    self.javascripts |= Array(name)
  end

  def config.register_I18n_javascript(locale, name)
    self.I18n_javascripts[locale] ||= []
    self.I18n_javascripts[locale] |= Array(name)
  end

  def config.register_extern_javascript(options)
    self.extern_javascripts << options
  end

  def config.register_stylesheet(*args)
    self.stylesheets |= Array(Stylesheet.new(*args))
  end

  def config.register_admin_javascript(name)
    self.admin_javascripts |= Array(name)
  end

  def config.register_admin_I18n_javascript(locale, name)
    self.admin_I18n_javascripts[locale] ||= []
    self.admin_I18n_javascripts[locale] |= Array(name)
  end

  def config.register_admin_extern_javascript(options)
    self.admin_extern_javascripts << options
  end

  def config.register_admin_stylesheet(*args)
    self.admin_stylesheets |= Array(Stylesheet.new(*args))
  end

  # wrapper for stylesheet registration
  class Stylesheet
    attr_reader :options, :path
    def initialize(*args)
      @options = args.extract_options!
      @path = args.first if args.first
    end
  end
end

Refinery::Images.module_eval do
  config_accessor :per_dialog_page
  self.per_dialog_page = 12
end
