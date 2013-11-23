refinery.admin.ImagesDialog.prototype.options.url = '/components/refinerycms-clientside/test/fixtures/images_dialog.json'
refinery.admin.ResourcesDialog.prototype.options.url = '/components/refinerycms-clientside/test/fixtures/resources_dialog.json'
refinery.admin.LinksDialog.prototype.options.url = '/components/refinerycms-clientside/test/fixtures/links_dialog.json'

describe 'Refinery Tinymce on Tabs', ->

  before (done) ->
    @container = container = $('#container')
    @ui = ui = refinery('admin.UserInterface')
    @body_text = body_text = 'This is body text'
    @side_body_text = side_body_text = 'Some other text in Side body part'
    $.get('/components/refinerycms-clientside/test/fixtures/page_new_parts_default.html', (response) ->
      container.html(response)
      $('#page_parts_attributes_2_body').val(body_text)
      $('#page_parts_attributes_3_body').val(side_body_text)
      ui.on 'init', ->
        setTimeout( ->
          done()
        , 1000)

      ui.init(container)
    )

  after ->
    @ui.destroy()
    @container.empty()

  it 'has 3 tinymce editors', ->
    expect( $('.mce-tinymce.mce-container.mce-panel').length ).to.equal( 3 )

  it 'have content of textarea', ->
    expect( $($('#page_parts_attributes_2_body_ifr').get(0).contentWindow.document.body).html() ).to.have.string( @body_text )

#  todo some test for garbage collection
#  describe 'ui destroy and reinitialize', ->
#    before ->
#      @text_before = $('#page_parts_attributes_1_body').val()
#      @keys_before = Object.keys(refinery.Object.instances.all())
#      @ui.destroy()
#      @ui = ui = new refinery.admin.UserInterface().init(@container)
#      @keys_after = Object.keys(refinery.Object.instances.all())
#      @text_after = $('#page_parts_attributes_1_body').val()
#
#
#    it 'not change number of objects', ->
#      expect( @keys_after.length ).to.be.equal(@keys_before.length)
#
#    it 'not change content of textareas', ->
#      expect( @text_before ).to.be.equal(@text_after)
#
#
