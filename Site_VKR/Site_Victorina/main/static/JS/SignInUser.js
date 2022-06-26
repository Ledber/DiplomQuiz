

function CreateAjaxPost(result,urlSign,urlSuccess,Tokken){
    $.ajax({
      type: "POST",
      url: urlSign,
      data: {
        name: result,
        csrfmiddlewaretoken: Tokken
      },
      success: function () {
        window.location.assign(urlSuccess)
          }
    });
    
}


function CreateAjaxGet(result,urlWork){
  $.ajax({
    type: "GET",
    datatype: 'json',
    url: urlWork,
    data: {
      name: result,},
    success: function () { }
  });
}