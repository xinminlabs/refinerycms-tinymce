(function() {
  var clickBtn, image_dialog_provider;

  refinery.admin.ImagesDialog.prototype.options.url_path = '/../components/refinerycms-clientside/test/fixtures/images_dialog.json';

  refinery.admin.ResourcesDialog.prototype.options.url_path = '/../components/refinerycms-clientside/test/fixtures/resources_dialog.json';

  refinery.admin.LinksDialog.prototype.options.url_path = '/../components/refinerycms-clientside/test/fixtures/links_dialog.json';

  clickBtn = function(name) {
    var btn;
    btn = $('button').filter(function() {
      return $(this).text() === name;
    });
    return btn.click();
  };

  image_dialog_provider = function(image_id, images_dialog) {
    var buttons, dialog;
    buttons = [
      {
        'text': 'Insert',
        'class': 'submit-button',
        'click': function() {
          return dialog.insert(dialog.holder);
        }
      }, {
        'text': 'Back to the library',
        'click': function() {
          dialog.destroy();
          return images_dialog.open();
        }
      }
    ];
    dialog = refinery('admin.ImageDialog', {
      'image_id': image_id,
      'buttons': buttons
    });
    return dialog;
  };

  describe('Refinery Tinymce', function() {
    before(function(done) {
      var container;
      this.container = container = $('#container');
      return $.get('/test/fixtures/editor_textarea.html', function(response) {
        container.html(response);
        return done();
      });
    });
    after(function() {
      return this.container.empty();
    });
    describe('Instance', function() {
      before(function() {
        return this.editor = refinery('tinymce.Tinymce');
      });
      after(function() {
        return this.editor.destroy();
      });
      return it('is instance of refinery.Object', function() {
        return expect(this.editor).to.be.an["instanceof"](refinery.Object);
      });
    });
    describe('Initialization', function() {
      before(function(done) {
        var images_dialog, links_dialog;
        this.images_dialog = images_dialog = refinery('admin.ImagesDialog');
        this.links_dialog = links_dialog = refinery('admin.LinksDialog');
        this.editor = refinery('tinymce.Tinymce');
        this.editor.on('init', function() {
          return done();
        });
        return this.editor.init($('.wysiwyg-editor-wrapper'), [images_dialog, links_dialog, image_dialog_provider]);
      });
      after(function() {
        return this.editor.destroy();
      });
      return context('#container', function() {
        it('contains .mce-tinymce', function() {
          return expect($('.mce-tinymce').length).to.eq(1);
        });
        return it('textarea is not visible', function() {
          return expect($('.wysiwyg-editor-wrapper').hasClass('wysiwyg-editor-on')).to.be["true"];
        });
      });
    });
    describe('Dialogs', function() {
      before(function(done) {
        var images_dialog, links_dialog, that;
        that = this;
        this.images_dialog = images_dialog = refinery('admin.ImagesDialog');
        this.links_dialog = links_dialog = refinery('admin.LinksDialog');
        this.editor = refinery('tinymce.Tinymce');
        this.editor.on('init', function() {
          that.container = $('.mce-container-body.mce-stack-layout');
          return done();
        });
        return this.editor.init($('.wysiwyg-editor-wrapper'), [images_dialog, links_dialog, image_dialog_provider]);
      });
      after(function() {
        return this.editor.destroy();
      });
      it('has Images dialog', function() {
        return expect(this.container.text()).to.have.string('Image');
      });
      return it('has Pages (links) dialog', function() {
        return expect(this.container.text()).to.have.string('Link');
      });
    });
    describe('Insert image', function() {
      context('via Library', function() {
        before(function(done) {
          var editor, images_dialog, links_dialog, that;
          that = this;
          this.expectation = '<p><img src="/test/fixtures/500x350.jpg" alt="Image alt" data-mce-src="/test/fixtures/500x350.jpg"></p>';
          this.editor = editor = refinery('tinymce.Tinymce');
          this.images_dialog = images_dialog = refinery('admin.ImagesDialog');
          this.links_dialog = links_dialog = refinery('admin.LinksDialog');
          this.editor.on('init', function() {
            that.container = $('.mce-container-body.mce-stack-layout');
            that.editable_area = $($('#page_parts_attributes_1_body_ifr').get(0).contentWindow.document.body);
            images_dialog.on('load', function() {
              $('.ui-dialog:visible').find('.ui-tabs').tabs({
                active: 0
              });
              return $.getJSON('/components/refinerycms-clientside/test/fixtures/image_dialog.json', function(response) {
                var ajaxStub;
                ajaxStub = sinon.stub($, 'ajax');
                ajaxStub.returns(okResponse(response));
                uiSelect('#image-1');
                $('.ui-dialog:visible form').submit();
                return done();
              });
            });
            return clickBtn('Image');
          });
          return this.editor.init($('.wysiwyg-editor-wrapper'), [images_dialog, links_dialog, image_dialog_provider]);
        });
        after(function() {
          $.ajax.restore();
          return this.editor.destroy();
        });
        return it('include image tag to editable area', function() {
          return expect(this.editable_area.html()).to.have.string(this.expectation);
        });
      });
      return context('via Url', function() {
        before(function(done) {
          var editor, images_dialog, links_dialog, that, url;
          that = this;
          url = 'http://localhost:9000/refinerycms-tinymce/components/refinerycms-clientside/test/fixtures/sample.gif';
          this.expectation = '<img src="' + url + '"';
          this.editor = editor = new refinery.tinymce.Tinymce();
          this.images_dialog = images_dialog = refinery('admin.ImagesDialog');
          this.links_dialog = links_dialog = refinery('admin.LinksDialog');
          images_dialog.on('load', function() {
            var tab;
            $('.ui-dialog:visible').find('.ui-tabs').tabs({
              active: 1
            });
            tab = images_dialog.holder.find('div[aria-expanded="true"]');
            tab.find('input[type="url"]').val(url);
            tab.find('input[type="submit"]:visible').click();
            return done();
          });
          editor.on('init', function() {
            that.container = $('.mce-container-body.mce-stack-layout');
            that.editable_area = $($('#page_parts_attributes_1_body_ifr').get(0).contentWindow.document.body);
            return clickBtn('Image');
          });
          return editor.init($('.wysiwyg-editor-wrapper'), [images_dialog, links_dialog, image_dialog_provider]);
        });
        after(function() {
          this.editable_area.empty();
          return this.editor.destroy();
        });
        return it('include image tag to editable area', function() {
          return expect(this.editable_area.html()).to.have.string(this.expectation);
        });
      });
    });
    describe('Insert link', function() {
      context('via Library', function() {
        before(function(done) {
          var editor, images_dialog, links_dialog, that;
          that = this;
          this.editor = editor = refinery('tinymce.Tinymce');
          this.images_dialog = images_dialog = refinery('admin.ImagesDialog');
          this.links_dialog = links_dialog = refinery('admin.LinksDialog');
          links_dialog.on('load', function() {
            $('.ui-dialog:visible').find('.ui-tabs').tabs({
              active: 0
            });
            return uiSelect($('.records li').first());
          });
          links_dialog.on('insert', function() {
            return done();
          });
          editor.on('init', function() {
            that.container = $('.mce-container-body.mce-stack-layout');
            that.editable_area = $($('#page_parts_attributes_1_body_ifr').get(0).contentWindow.document.body);
            return clickBtn('Link');
          });
          return editor.init($('.wysiwyg-editor-wrapper'), [images_dialog, links_dialog, image_dialog_provider]);
        });
        after(function() {
          this.editable_area.empty();
          return this.editor.destroy();
        });
        return it('include link tag to editable area', function() {
          return expect(this.editable_area.html()).to.have.string('<a href="/">Home</a>');
        });
      });
      context('via Url', function() {
        before(function(done) {
          var editor, images_dialog, links_dialog, that, url;
          that = this;
          this.editor = editor = refinery('tinymce.Tinymce');
          this.images_dialog = images_dialog = refinery('admin.ImagesDialog');
          this.links_dialog = links_dialog = refinery('admin.LinksDialog');
          this.url = url = 'http://localhost:9000/refinery-tinymce/';
          links_dialog.on('load', function() {
            var tab;
            $('.ui-dialog:visible').find('.ui-tabs').tabs({
              active: 1
            });
            tab = links_dialog.holder.find('div[aria-expanded="true"]');
            tab.find('input[type="url"]').val(url);
            return tab.find('input[type="submit"]').click();
          });
          links_dialog.on('insert', function() {
            return done();
          });
          editor.on('init', function() {
            that.container = $('.mce-container-body.mce-stack-layout');
            that.editable_area = $($('#page_parts_attributes_1_body_ifr').get(0).contentWindow.document.body);
            return clickBtn('Link');
          });
          return editor.init($('.wysiwyg-editor-wrapper'), [images_dialog, links_dialog, image_dialog_provider]);
        });
        after(function() {
          this.editable_area.empty();
          return this.editor.destroy();
        });
        return it('include link tag to editable area', function() {
          return expect(this.editable_area.html()).to.have.string('<a href="' + this.url + '">localhost:9000/refinery-tinymce/</a>');
        });
      });
      return context('as Email link', function() {
        before(function(done) {
          var body, editor, email, images_dialog, links_dialog, subject, that;
          that = this;
          this.editor = editor = refinery('tinymce.Tinymce');
          this.images_dialog = images_dialog = refinery('admin.ImagesDialog');
          this.links_dialog = links_dialog = refinery('admin.LinksDialog');
          email = 'lorem@ipsum.sk';
          subject = 'Hello Philip';
          body = 'some body';
          links_dialog.on('load', function() {
            var tab;
            $('.ui-dialog:visible').find('.ui-tabs').tabs({
              active: 2
            });
            tab = links_dialog.holder.find('div[aria-expanded="true"]');
            tab.find('#email_address_text').val(email);
            tab.find('#email_default_subject_text').val(subject);
            tab.find('#email_default_body_text').val(body);
            return tab.find('input[type="submit"]').click();
          });
          links_dialog.on('insert', function() {
            return done();
          });
          editor.on('init', function() {
            that.container = $('.mce-container-body.mce-stack-layout');
            that.editable_area = $($('#page_parts_attributes_1_body_ifr').get(0).contentWindow.document.body);
            return clickBtn('Link');
          });
          return editor.init($('.wysiwyg-editor-wrapper'), [images_dialog, links_dialog, image_dialog_provider]);
        });
        after(function() {
          this.editable_area.empty();
          return this.editor.destroy();
        });
        return it('include link tag to editable area', function() {
          return expect(this.editable_area.html()).to.have.string('<a href="mailto:lorem%40ipsum.sk?subject=Hello%20Philip&amp;body=some%20body">lorem@ipsum.sk</a>');
        });
      });
    });
    return describe('Toggle button', function() {
      before(function(done) {
        var editor, expectation, images_dialog, links_dialog, that;
        that = this;
        this.expectation = expectation = 'lorem ipsum';
        this.editor = editor = refinery('tinymce.Tinymce');
        this.images_dialog = images_dialog = refinery('admin.ImagesDialog');
        this.links_dialog = links_dialog = refinery('admin.LinksDialog');
        editor.on('init', function() {
          that.container = $('.mce-container-body.mce-stack-layout');
          that.editable_area = $($('#page_parts_attributes_1_body_ifr').get(0).contentWindow.document.body);
          that.editable_area.html(expectation);
          $('.wysiwyg-toggle-button').click();
          return done();
        });
        return editor.init($('.wysiwyg-editor-wrapper'), [images_dialog, links_dialog, image_dialog_provider]);
      });
      after(function() {
        this.editable_area.empty();
        return this.editor.destroy();
      });
      context('first click', function() {
        it('shows textarea instead of editor', function() {
          return expect($('.wysiwyg-editor-wrapper').hasClass('wysiwyg-editor-on')).to.be["false"];
        });
        return it('save content of editable_area to textarea', function() {
          return expect($('#container textarea').val()).to.have.string(this.expectation);
        });
      });
      return context('second click', function() {
        before(function() {
          this.container.find('textarea').val('this some text from textarea');
          return $('.wysiwyg-toggle-button').click();
        });
        return it('shows again editor', function() {
          return expect($('.wysiwyg-editor-wrapper').hasClass('wysiwyg-editor-on')).to.be["true"];
        });
      });
    });
  });

}).call(this);
