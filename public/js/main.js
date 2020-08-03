// Delete Functionality 
$(document).ready(function(){
  $('.delete-post').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/posts/'+id,
      success: function(response){
        alert('Are you sure you want to delete');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
