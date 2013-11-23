
(function (window, $) {

// Source: scripts/tinymce.js
(function (refinery) {

    var tinymce_deferred;

    /**
     * @constructor
     * @class refinery.tinymce.Tinymce
     * @expose
     * @extends {refinery.Object}
     */
    refinery.Object.create({

        name: 'Tinymce',

        module: 'tinymce',

        /**
         * Lazy load main tinymce js
         *
         * @param  {string} url
         * @return {Object} jQuery promise
         */
        load_tinymce: function (url) {
            if (typeof tinymce_deferred === 'undefined') {
                tinymce_deferred = $.Deferred();

                $.getScript(url, function () {
                    if (tinymce) {
                        tinymce.baseURL = url.replace(/[^\/]+$/, '');
                        tinymce.dom.Event.domLoaded = true;

                        tinymce.PluginManager.add('refinery_links', function (editor) {
                            editor.addButton('link', {
                                'text': t('refinery.tinymce.link'),
                                'icon': false,
                                'onclick': function () {
                                    editor.refinery_links_dialog.init().open();
                                }
                            });
                        });

                        tinymce.PluginManager.add('refinery_images', function (editor) {
                            editor.addButton('image', {
                                'text': t('refinery.tinymce.image'),
                                'icon': false,
                                'onclick': function () {
                                    editor.refinery_images_dialog.init().open();
                                }
                            });
                        });

                        tinymce_deferred.resolve();
                    }
                });
            }

            return tinymce_deferred.promise();
        },

        /**
         *
         * @param  {tinymce_editor} editor
         * @param  {Object} dialog
         * @return {undefined}
         */
        bind_links_dialog: function (editor, dialog) {
            dialog.on('insert',
                /** @param {links_dialog_object} link */
                function (link) {
                    insert_link(link, editor);
                    dialog.close();
                }
            );

            /**
             * @expose
             */
            editor.refinery_links_dialog = dialog;
        },

        /**
         *
         * @param  {tinymce_editor} editor
         * @param  {Object} dialog
         * @return {undefined}
         */
        bind_images_dialog: function (editor, dialog) {
            var that = this;

            dialog.on('insert',
                /** @param {images_dialog_object} img */
                function (img) {
                    var tpl = '<img src="%url" alt="%alt" />';

                    if (img.url) {
                        tpl = tpl.replace('%alt', refinery.htmlEncode(img.alt));
                        tpl = tpl.replace('%url', /** @type {string} */(img.url));
                        editor.insertContent(tpl);
                    } else {
                        that.open_image_dialog_for(editor, img.id, dialog);
                    }

                    dialog.close();
                }
            );

            /**
             * @expose
             */
            editor.refinery_images_dialog = dialog;
        },

        open_image_dialog_for: function (editor, image_id, images_dialog) {
            var that = this,
                dialog, buttons;

            buttons = [{
                'text': t('refinery.tinymce.insert'),
                'class': 'submit-button',
                'click': function () {
                    dialog.insert( dialog.holder );
                }
            }, {
                'text': t('refinery.tinymce.back_to_library'),
                'click': function () {
                    dialog.destroy();
                    images_dialog.open();
                }
            }];

            dialog = that.image_dialog_factory(image_id, buttons);

            dialog.on('insert',
                /** @param {image_dialog_object} img */
                function (img) {
                    var tpl = '<img src="%url" alt="%alt" />';

                    tpl = tpl.replace('%alt', refinery.htmlEncode(img.alt));
                    tpl = tpl.replace('%url', img.sizes[img.size]);

                    editor.insertContent(tpl);
                    dialog.destroy();
                }
            );

            that.on('destroy', function () { dialog.destroy(); } );

            dialog.init().open();
        },

        /**
         * Insert string to tinymce
         * @param  {string} str
         * @return {undefined}
         */
        insert: function (str) {
            this.editor.insertContent(str);
        },

        unload_editor: function () {
            this.update_textarea();
            this.holder.removeClass('wysiwyg-editor-on');
            this.holder.find('.mce-tinymce').hide();
            this.holder.find('textarea').show();
        },

        update_textarea: function () {
            /*
            NS_ERROR_UNEXPECTED: Unexpected error
            },
             */
            try {
                tinymce.triggerSave();
            } catch (e) {
                refinery.log(e);
            }
        },

        destroy: function () {
            if (this.is('initialised')) {
                this.unload_editor();
                this.toggle_button.remove();
                tinymce.remove();

                this.images_dialog.destroy();
                this.links_dialog.destroy();
                this.holder.closest('form').off('before-submit', this.update_textarea);
            }

            this._destroy();

            return this;
        },

        init_editor: function () {
            var that = this,
                holder = that.holder,
                textarea = holder.find('textarea'),
                /**
                 *
                 * @type {tinymce_config|Object}
                 */
                options = holder.data('editor-options') || {};

            options.convert_urls = false;
            options.selector = options.selector || '#' + textarea.attr('id');

            /**
             * @expose
             * @param  {Object} editor
             * @return {undefined}
             */
            options.setup = function (editor) {
                that.bind_images_dialog(editor, that.images_dialog);
                that.bind_links_dialog(editor, that.links_dialog);

                editor.on('init', function () {
                    holder.addClass('wysiwyg-editor-on');
                    that.editor = editor;
                    that.is({'initialised': true, 'initialising': false});
                    that.trigger('init');
                });
            };

            that.toggle_button = $('<button/>', {
                'class': 'wysiwyg-toggle-button',
                'text': t('refinery.admin.toggle_editor')
            }).appendTo(holder);

            that.toggle_button.on('click', function (e) {
                e.preventDefault();

                if (holder.hasClass('wysiwyg-editor-on')) {
                    that.unload_editor();
                } else {
                    holder.addClass('wysiwyg-editor-on');
                    holder.find('.mce-tinymce').show();
                    holder.find('textarea').hide();
                    $(holder.find('.mce-edit-area iframe')
                        .get(0).contentWindow.document.body
                    ).html(textarea.val());
                }
            });

            holder.closest('form').on('before-submit', that.update_textarea);

            that.load_tinymce(options.tinymce_url).done(function () {
                tinymce.init(options);
            });
        },

        /**
         * Initialisation
         *
         * @param {!jQuery} holder
         * @param {Object} dependencies
         *
         * @return {Object} self
         */
        init: function (holder, dependencies) {
            var that = this;

            if (that.is('initialisable')) {
                that.is('initialising', true);
                that.holder = holder;

                that.images_dialog = dependencies[0];
                that.links_dialog = dependencies[1];
                that.image_dialog_factory = dependencies[2];

                that.init_editor();
            }

            return that;
        }
    });

    /** @param {links_dialog_object} link */
    function insert_link (link, editor) {
        var selection = editor.selection.getContent(),
            a = $('<a/>', {
                'href': link.url
            });

        if (link.blank) {
            a.attr('target', '_blank');
        }

        if (selection === '') {
            a.text(link.title);
        } else {
            a.html(selection);
        }

        editor.selection.setNode(a.get(0));
    }

    /**
     * Editor initialization
     *
     * @expose
     * @param  {jQuery} holder
     * @return {undefined}
     */
    refinery.admin.ui.editorTinymce = function (holder, ui) {
        function image_dialog_factory (image_id, buttons) {
            return refinery('admin.ImageDialog', {
                'image_id': image_id,
                'buttons': buttons
            });
        }

        holder.find('.wysiwyg-editor-wrapper').each(function () {
            ui.addObject(
                refinery('tinymce.Tinymce').init(
                    $(this), [
                    refinery('admin.ImagesDialog'),
                    refinery('admin.LinksDialog'),
                    image_dialog_factory
                ])
            );
        });
    };

}(refinery));
}(window, jQuery));