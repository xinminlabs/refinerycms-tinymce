(function() {
  refinery.admin.ImagesDialog.prototype.options.url = '/components/refinerycms-clientside/test/fixtures/images_dialog.json';

  refinery.admin.ResourcesDialog.prototype.options.url = '/components/refinerycms-clientside/test/fixtures/resources_dialog.json';

  refinery.admin.LinksDialog.prototype.options.url = '/components/refinerycms-clientside/test/fixtures/links_dialog.json';

  describe('Refinery Tinymce on Tabs', function() {
    before(function(done) {
      var body_text, container, side_body_text, ui;
      this.container = container = $('#container');
      this.ui = ui = refinery('admin.UserInterface');
      this.body_text = body_text = 'This is body text';
      this.side_body_text = side_body_text = 'Some other text in Side body part';
      return $.get('/components/refinerycms-clientside/test/fixtures/page_new_parts_default.html', function(response) {
        container.html(response);
        $('#page_parts_attributes_2_body').val(body_text);
        $('#page_parts_attributes_3_body').val(side_body_text);
        ui.on('init', function() {
          return setTimeout(function() {
            return done();
          }, 1000);
        });
        return ui.init(container);
      });
    });
    after(function() {
      this.ui.destroy();
      return this.container.empty();
    });
    it('has 3 tinymce editors', function() {
      return expect($('.mce-tinymce.mce-container.mce-panel').length).to.equal(3);
    });
    return it('have content of textarea', function() {
      return expect($($('#page_parts_attributes_2_body_ifr').get(0).contentWindow.document.body).html()).to.have.string(this.body_text);
    });
  });

}).call(this);
