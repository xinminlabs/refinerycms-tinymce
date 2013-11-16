 var tinymce = {
    dom: {
        Event: {
            domLoaded: false
        }
    },
    baseURL: '',
    init: function () {},
    PluginManager: {},
    EditorManager: {},
    triggerSave: function () {}
};

/**
 * @constructor
 */
tinymce.Editor = function () { };
tinymce.Editor.prototype = {
    on: function () { },
    init: function () { },

    dom: {
        add: function () { }
    },

    selection: {
        collapse: function () { },
        destroy: function () { },
        getBookmark: function () { },
        getContent: function () { },
        getEnd: function () { },
        getNode: function () { },
        getRng: function () { },
        getScrollContainer: function () { },
        getSel: function () { },
        getSelectedBlocks: function () { },
        getStart: function () { },
        isCollapsed: function () { },
        isForward: function () { },
        moveToBookmark: function () { },
        normalize: function () { },
        scrollIntoView: function () { },
        select: function () { },
        selectorChanged: function () { },
        setContent: function () { },
        setCursorLocation: function () { },
        setNode: function () { },
        setRng: function () { }
    }
};



/**
 *
 * @typedef {tinymce_config}
 */
var tinymce_config = {
    // general
    auto_focus: '',
    directionality: '',
    browser_spellcheck: '',
    language: '',
    language_url: '',
    nowrap: '',
    object_resizing: '',
    plugins: [],
    external_plugins: [],
    selector: '',
    skin: '',
    skin_url: '',
    theme: '',
    theme_url: '',
    inline: false,
    hidden_input: '',

    mode: '',

    // Content style
    body_id: '',
    body_class: '',
    content_css: '',

    //Visual aids
    visual: false,

    // Undo/Redo
    custom_undo_redo_levels: 1,

    // User interface
    toolbar: '',
    menubar: '',
    menu: {},
    statusbar: false,
    resize: true,
    width: 600,
    height: 400,
    preview_styles: '',
    fixed_toolbar_container: '',

    // URL
    convert_urls: false,
    relative_urls: false,
    remove_script_host: false,
    document_base_url: '',

    file_browser_callback: function(field_name, url, type, win) {},

    tinymce_url: ''
};

/**
 *
 * @typedef {tinymce_editor}
 */
var tinymce_editor = {
    addButton: function () {},
    insertContent: function () {},

    refinery_images_dialog: {},
    refinery_image_dialog: {},
    refinery_links_dialog: {}
};
