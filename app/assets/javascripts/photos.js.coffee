# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/
# jQuery ->
  # $('#new_photo').fileupload
  #   dataType: "script"
  #   add: (e, data) ->
  #     types = /(\.|\/)(gif|jpe?g|png)$/i
  #     file = data.files[0]
  #     if types.test(file.type) || types.test(file.name)
  #       data.context = $(tmpl("template-upload", file))
  #       $('#new_photo').append(data.context)
  #       data.submit()
  #     else
  #       alert("#{file.name} is not a gif, jpeg, or png image file")
  #   progress: (e, data) ->
  #     if data.context
  #       progress = parseInt(data.loaded / data.total * 100, 10)
  #       data.context.find('.bar').css('width', progress + '%')

$ ->
  $(".photo_loading").each (index, pending_photo) ->
    console.log(pending_photo)
    photoId = $(".photo_loading").attr("data-photoid")
    interval = setInterval(->
      $.get("/photos/" + photoId + ".json").done (data) ->
        console.log data.thumbnail_url
        debugger
        if data.thumbnail_url
          $('.photo_loading').replaceWith("<img alt='' src='#{data.thumbnail_url}'>")
          clearInterval interval
          # console.log("data is not null")
        else
          console.log "the interval id is ", interval

    , 1000)


# # in javascript:

# $(function() {
#     photoId = $(".photo_loading").attr("data-photoId");
#     interval = setInterval(function(){$.get("/photos/" + photoId + ".json").done(function(data){
#       if(data.responseJSON.remote_image_url != false){
#         clearInterval(interval);
#         console.log(data.responseJSON.remote_image_url);
#         console.log("the interval id is ", interval)
#       } else {
#         console.log(data);
#         console.log("the interval id is ", interval);
#       }
#     })}, 1000);
#   })


#     $('.photo_loading').each(function(pending_photo){
#         photoId = $(".photo_loading").attr("data-photoId")
#     interval = setInterval(function(){$.get("/photos/" + photoId + ".json").done(function(data){
#       if(data.remote_image_url != false){
#         clearInterval(interval);
#         console.log(data.remote_image_url);
#         console.log("the interval id is ", interval)
#       } else {
#         console.log(data);
#         console.log("the interval id is ", interval);
#       }
#     })}, 1000);
#       })


