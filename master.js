//Hide the note creation form by default
$('.create_a_note').hide()

$(document).ready(function(){

  api_root = "https://jacques-is-a-deadbeat.herokuapp.com/api/"
  tagged_notes_url = api_root + "notes/tag/"

  function reset_form(form_id){
    $(form_id)[0].reset()
  }

    //Create a post
    $('#note_create').on('submit', function(ev){
      ev.preventDefault()
      $.post(api_root + 'notes', $(this).serialize())
      .done(function(note){
        $('#note_content').prepend(
          note_display(note.note)
        )
        reset_form('#note_create')
      })
    })

    //Hide the note creation form by clicking the 'Meister a Note' Button
    $('#show_note_form_button').on('click', function(){
    $('.create_a_note').slideToggle(400)
    })

    //Click on a Tag and see all notes with that tag
    $(document).on('click', '.tag_link', function(ev){
      ev.preventDefault()
      tag_name = $(ev.target).attr('href')
      $('#notemeister-tag').empty().append(`: ${tag_name}`)
      populate_tagged_notes(tag_name)
  })

  //Replace a non-user's username with anonymous
  function replace_null_username(note){
    if(note.user === null){
      return "Anonymous"
    }else{
      return note.user.username
    }
  }

  function note_display(note){
    return `
      <div class="media" id="${note.id}">
        <div class="media-left media-middle">
          <p class="note-username">${replace_null_username(note)}</p>
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
        //Open a modal window when URL includes #note.id
        if(window.location.hash){
          $('#modal_win .modal-body').html($(location.hash).html())
          $('#modal_win').modal('show')
        }

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
