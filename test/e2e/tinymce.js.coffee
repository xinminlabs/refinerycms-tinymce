refinery.admin.ImagesDialog.prototype.options.url_path = '/../components/refinerycms-clientside/test/fixtures/images_dialog.json'
refinery.admin.ResourcesDialog.prototype.options.url_path = '/../components/refinerycms-clientside/test/fixtures/resources_dialog.json'
refinery.admin.LinksDialog.prototype.options.url_path = '/../components/refinerycms-clientside/test/fixtures/links_dialog.json'

clickBtn = (name) ->
  btn = $('button').filter ->
    $(this).text() == name

  btn.click()


image_dialog_provider = (image_id, images_dialog) ->
  buttons = [{
      'text': 'Insert',
      'class': 'submit-button',
      'click': ->
        dialog.insert( dialog.holder );
  }, {
      'text': 'Back to the library',
      'click': ->
        dialog.destroy();
        images_dialog.open();
  }]

  dialog = refinery('admin.ImageDialog', {
    'image_id': image_id,
    'buttons': buttons
  })

  return dialog

describe 'Refinery Tinymce', ->

  before (done) ->
    @container = container = $('#container')
    $.get '/test/fixtures/editor_textarea.html', (response) ->
      container.html(response)
      done()

  after ->
    @container.empty()


  describe 'Instance', ->
    before ->
      @editor = refinery('tinymce.Tinymce')

    after ->
      @editor.destroy()

    it 'is instance of refinery.Object', ->
      expect( @editor ).to.be.an.instanceof refinery.Object


  describe 'Initialization', ->
    before (done) ->
      @images_dialog = images_dialog = refinery('admin.ImagesDialog')
      @links_dialog = links_dialog = refinery('admin.LinksDialog')

      @editor = refinery('tinymce.Tinymce')
      @editor.on 'init', ->
        done()
      @editor.init( $('.wysiwyg-editor-wrapper'), [images_dialog, links_dialog, image_dialog_provider])

    after ->
      @editor.destroy()

    context '#container', ->
      it 'contains .mce-tinymce', ->
        expect( $('.mce-tinymce').length ).to.eq(1)

      it 'textarea is not visible', ->
        expect( $('.wysiwyg-editor-wrapper').hasClass('wysiwyg-editor-on') ).to.be.true


  describe 'Dialogs', ->
    before (done) ->
      that = @
      @images_dialog = images_dialog = refinery('admin.ImagesDialog')
      @links_dialog = links_dialog = refinery('admin.LinksDialog')
      @editor = refinery('tinymce.Tinymce')
      @editor.on 'init', ->
        that.container = $('.mce-container-body.mce-stack-layout')
        done()

      @editor.init( $('.wysiwyg-editor-wrapper'), [images_dialog, links_dialog, image_dialog_provider])

    after ->
      @editor.destroy()

    # todo
    # it 'has Resources (files) dialog', ->

    it 'has Images dialog', ->
      expect( @container.text() ).to.have.string('Image')

    it 'has Pages (links) dialog', ->
      expect( @container.text() ).to.have.string('Link')


  describe 'Insert image', ->
    context 'via Library', ->
      before (done) ->
        that = @
        @expectation = '<p><img src="/test/fixtures/500x350.jpg" alt="Image alt" data-mce-src="/test/fixtures/500x350.jpg"></p>'
        @editor = editor = refinery('tinymce.Tinymce')
        @images_dialog = images_dialog = refinery('admin.ImagesDialog')
        @links_dialog = links_dialog = refinery('admin.LinksDialog')

        @editor.on 'init', ->
          that.container = $('.mce-container-body.mce-stack-layout')
          that.editable_area = $( $('#page_parts_attributes_1_body_ifr').get(0).contentWindow.document.body )
          images_dialog.on 'load', ->
            $('.ui-dialog:visible').find('.ui-tabs').tabs({ active: 0 })
            $.getJSON '/components/refinerycms-clientside/test/fixtures/image_dialog.json', (response) ->
              ajaxStub = sinon.stub($, 'ajax')
              ajaxStub.returns(okResponse(response))
              uiSelect('#image-1')
              $('.ui-dialog:visible form').submit()
              done()

          clickBtn('Image')

        @editor.init( $('.wysiwyg-editor-wrapper'), [images_dialog, links_dialog, image_dialog_provider])

      after ->
        $.ajax.restore()
        @editor.destroy()

      it 'include image tag to editable area', ->
        expect( @editable_area.html() ).to.have.string(@expectation)

    context 'via Url', ->
      before (done) ->
        that = @
        url = 'http://localhost:9000/refinerycms-tinymce/components/refinerycms-clientside/test/fixtures/sample.gif'
        @expectation = '<img src="' + url + '"'
        @editor = editor = new refinery.tinymce.Tinymce()
        @images_dialog = images_dialog = refinery('admin.ImagesDialog')
        @links_dialog = links_dialog = refinery('admin.LinksDialog')

        images_dialog.on 'load', ->
          $('.ui-dialog:visible').find('.ui-tabs').tabs({ active: 1 })
          tab = images_dialog.holder.find('div[aria-expanded="true"]')
          tab.find('input[type="url"]').val(url)
          tab.find('input[type="submit"]:visible').click()
          done()

        editor.on 'init', ->
          that.container = $('.mce-container-body.mce-stack-layout')
          that.editable_area = $($('#page_parts_attributes_1_body_ifr').get(0).contentWindow.document.body)
          clickBtn('Image')

        editor.init( $('.wysiwyg-editor-wrapper'), [images_dialog, links_dialog, image_dialog_provider])



      after ->
        @editable_area.empty()
        @editor.destroy()

      it 'include image tag to editable area', ->
        expect( @editable_area.html() ).to.have.string( @expectation )


  describe 'Insert link', ->
    context 'via Library', ->
      before (done) ->
        that = @
        @editor = editor = refinery('tinymce.Tinymce')
        @images_dialog = images_dialog = refinery('admin.ImagesDialog')
        @links_dialog = links_dialog = refinery('admin.LinksDialog')

        links_dialog.on 'load', ->
          $('.ui-dialog:visible').find('.ui-tabs').tabs({ active: 0 })
          uiSelect($('.records li').first())

        links_dialog.on 'insert', ->
          done()

        editor.on 'init', ->
          that.container = $('.mce-container-body.mce-stack-layout')
          that.editable_area = $($('#page_parts_attributes_1_body_ifr').get(0).contentWindow.document.body)
          clickBtn('Link')

        editor.init( $('.wysiwyg-editor-wrapper'), [images_dialog, links_dialog, image_dialog_provider])

      after ->
        @editable_area.empty()
        @editor.destroy()

      it 'include link tag to editable area', ->
        expect( @editable_area.html() ).to.have.string('<a href="/">Home</a>')


    context 'via Url', ->
      before (done) ->
        that = @
        @editor = editor = refinery('tinymce.Tinymce')
        @images_dialog = images_dialog = refinery('admin.ImagesDialog')
        @links_dialog = links_dialog = refinery('admin.LinksDialog')
        @url = url = 'http://localhost:9000/refinery-tinymce/'

        links_dialog.on 'load', ->
          $('.ui-dialog:visible').find('.ui-tabs').tabs({ active: 1 })
          tab = links_dialog.holder.find('div[aria-expanded="true"]')
          tab.find('input[type="url"]').val(url)
          tab.find('input[type="submit"]').click()

        links_dialog.on 'insert', ->
          done()

        editor.on 'init', ->
          that.container = $('.mce-container-body.mce-stack-layout')
          that.editable_area = $($('#page_parts_attributes_1_body_ifr').get(0).contentWindow.document.body)
          clickBtn('Link')

        editor.init( $('.wysiwyg-editor-wrapper'), [images_dialog, links_dialog, image_dialog_provider])

      after ->
        @editable_area.empty()
        @editor.destroy()

      it 'include link tag to editable area', ->
        expect( @editable_area.html() ).to.have.string('<a href="' + @url + '">localhost:9000/refinery-tinymce/</a>')

    context 'as Email link', ->
      before (done) ->
        that = @
        @editor = editor = refinery('tinymce.Tinymce')
        @images_dialog = images_dialog = refinery('admin.ImagesDialog')
        @links_dialog = links_dialog = refinery('admin.LinksDialog')

        email = 'lorem@ipsum.sk'
        subject = 'Hello Philip'
        body = 'some body'

        links_dialog.on 'load', ->
          $('.ui-dialog:visible').find('.ui-tabs').tabs({ active: 2 })
          tab = links_dialog.holder.find('div[aria-expanded="true"]')
          tab.find('#email_address_text').val(email)
          tab.find('#email_default_subject_text').val(subject)
          tab.find('#email_default_body_text').val(body)
          tab.find('input[type="submit"]').click()

        links_dialog.on 'insert', ->
          done()

        editor.on 'init', ->
          that.container = $('.mce-container-body.mce-stack-layout')
          that.editable_area = $($('#page_parts_attributes_1_body_ifr').get(0).contentWindow.document.body)
          clickBtn('Link')

        editor.init( $('.wysiwyg-editor-wrapper'), [images_dialog, links_dialog, image_dialog_provider])

      after ->
        @editable_area.empty()
        @editor.destroy()

      it 'include link tag to editable area', ->
        expect( @editable_area.html() ).to.have.string(
          '<a href="mailto:lorem%40ipsum.sk?subject=Hello%20Philip&amp;body=some%20body">lorem@ipsum.sk</a>'
        )


  describe 'Toggle button', ->
    before (done) ->
      that = @
      @expectation = expectation = 'lorem ipsum'
      @editor = editor = refinery('tinymce.Tinymce')
      @images_dialog = images_dialog = refinery('admin.ImagesDialog')
      @links_dialog = links_dialog = refinery('admin.LinksDialog')

      editor.on 'init', ->
        that.container = $('.mce-container-body.mce-stack-layout')
        that.editable_area = $($('#page_parts_attributes_1_body_ifr').get(0).contentWindow.document.body)
        that.editable_area.html(expectation)
        $('.wysiwyg-toggle-button').click()
        done()

      editor.init( $('.wysiwyg-editor-wrapper'), [images_dialog, links_dialog, image_dialog_provider])

    after ->
      @editable_area.empty()
      @editor.destroy()

    context 'first click', ->
      it 'shows textarea instead of editor', ->
        expect( $('.wysiwyg-editor-wrapper').hasClass('wysiwyg-editor-on') ).to.be.false

      it 'save content of editable_area to textarea', ->
        expect( $('#container textarea').val() ).to.have.string(@expectation)

    context 'second click', ->
      before ->
        @container.find('textarea').val('this some text from textarea')
        $('.wysiwyg-toggle-button').click()

      it 'shows again editor', ->
        expect( $('.wysiwyg-editor-wrapper').hasClass('wysiwyg-editor-on') ).to.be.true
