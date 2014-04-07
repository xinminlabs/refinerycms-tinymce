//= require refinery/i18n
//= require tinymce
//= require_tree ./responsivefilemanager

$(function() {

    var backend_path =  function () {
        var paths = document.location.pathname.split('/').filter(function (e) {
            return e !== '';
        });

        if (/^[a-z]{2}(-[a-zA-Z]{2,3})?$/.test(paths[0])) {
            return '/' + paths[0] + '/' + paths[1] + "/";
        } else {
            return '/' + paths[0] + "/";
        }
    }

    var that = this,
        holder = $(".wysiwyg-editor-wrapper"),
        textarea = holder.find('textarea'),
        options = holder.data('editor-options') || {};

    options.convert_urls = false;
    options.selector = ".wysiwyg-editor";
    options.plugins = "advlist code textcolor refineryfilemanager"
    options.toolbar1 = "undo redo |  bullist numlist outdent indent | image media | refineryfilemanager";
    options.toolbar2 = "styleselect | bold italic underline | fontselect forecolor backcolor";
    options.image_advtab = true;
    options.external_filemanager_path  = backend_path();


    holder.closest('form').on('submit', function() {
        tinymce.triggerSave();
    });

    tinymce.init(options);
})