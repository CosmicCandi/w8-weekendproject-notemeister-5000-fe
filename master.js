$('.create_a_note').hide()

$(document).ready(function(){

  api_root = "https://jacques-is-a-deadbeat.herokuapp.com/api/"
  tagged_notes_url = api_root + "notes/tag/"

    //Hide the note creation form by clicking the 'Meister a Note' Button
    $('#show_note_form_button').on('click', function(){
    $('.create_a_note').slideToggle(400)
    })

    //Click on a Tag and see all notes with that tag
    $(document).on('click', '.tag_link', function(ev){
      ev.preventDefault()
      tag_name = $(ev.target).attr('href')
      console.log($(tag_name).html())
      $('#notemeister-tag').empty().append(`: ${tag_name}`)
      populate_tagged_notes(tag_name)
  })

  function note_display(note){
    return `
      <div class="media" id="note-${note.id}">
        <div class="media-left media-middle">
          <p class="note-username">${note.user.username}</p>
        </div>
        <div class="media-body">
        <h4 class="media-heading text-center">${note.title}</h4>
          <blockquote>
            <p>${note.body}</p>
            <cite>
            <p><small>Created: ${moment(note.created_at).format("ddd, MMMM Do YYYY, HH:mm")}</small></p>
            </cite>
            </blockquote>
              <p class="text-center">${note.tags.map(function(tag){
                return `<a href=${tag.name} class='btn btn-primary tag_link'>${tag.name}</a>`
                }).join(', ')
                }
              </p>
        </div>
      </div>
    `
  }

  function populate_notes(){
    $('#note_content').empty()
    $.getJSON(api_root + 'notes')
      .done(function(response){
        response.notes.forEach(function(note){
          $('#note_content').append(
            note_display(note)
          )
        })
      })
  }

  function populate_tagged_notes(tag_name){
    $('#note_content').empty()
    $.getJSON(tagged_notes_url + tag_name)
    .done(function(response){
      response.tag.notes.forEach(function(note){
        $('#note_content').append(
          note_display(note)
        )
      })
    })
  }

  populate_notes()

//End of Document Ready
})
