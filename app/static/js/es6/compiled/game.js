(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    $('#login').click(login);
    $('#seed').click(seed);
    $('#getforest').click(getForest);
    $('#forest').on('click', '.tree', grow);
  }
  function grow() {
    var treeId = $(this).data('id');
    $.ajax({
      url: '/tree/' + treeId + '/grow',
      type: 'PUT',
      dataType: 'html',
      success: (function(response) {
        console.log(response);
      })
    });
  }
  function getForest() {
    var userId = $('#username').data('id');
    $.ajax({
      url: '/forest/' + userId,
      type: 'GET',
      dataType: 'html',
      success: (function(response) {
        $('#forest').empty().append(response);
      })
    });
  }
  function seed() {
    var userId = $('#username').data('id');
    $.ajax({
      url: '/seed',
      type: 'POST',
      data: {userId: userId},
      success: (function(response) {
        $('#forest').append(response);
      })
    });
  }
  function login(event) {
    var data = $(this).closest('form').serialize();
    $.ajax({
      url: '/login',
      type: 'POST',
      data: data,
      success: (function(response) {
        $('#login').prev().val('');
        $('#username').attr('data-id', response._id);
        $('#username').text(response.username);
      })
    });
    event.preventDefault();
  }
})();

//# sourceMappingURL=game.map
