/*jshint unused: false*/

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#login').click(login);
    $('#seed').click(seed);
    $('#getforest').click(getForest);
    $('#forest').on('click', '.tree.alive', grow);
    $('#forest').on('click', '.tree.alive.adult #chop', chop);
    $('#sell').click(sell);
  }

  function sell(event){
    event.preventDefault();
    var data = $(this).closest('form').serialize();
    var userId = $('#username').data('id');
    $.ajax({
      url: '/sell/'+userId,
      type: 'PUT',
      data: data,
      success: response=>{
        $.ajax({
          url: '/user/'+userId+'/stats',
          type: 'GET',
          dataType: 'html',
          success: response=>{
            $('#stats').empty().append(response);
        }
      });
      }
    });
  }

  function chop(event){
    var tree = $(this).parent();
    var treeId = $(tree).data('id');
    var userId = $('#username').data('id');

    $.ajax({
      url: '/tree/'+treeId+'/chop',
      type: 'PUT',
      dataType: 'html',
      success: response=>{
        tree.replaceWith(response);

        $.ajax({
          url: '/user/'+userId+'/stats',
          type: 'GET',
          dataType: 'html',
          success: response=>{
            $('#stats').empty().append(response);
        }
      });
    }
  });
    event.stopPropagation();
  }

  function grow(){
    var tree = $(this);
    var treeId = $(this).data('id');

    $.ajax({
      url: '/tree/'+treeId+'/grow',
      type: 'PUT',
      dataType: 'html',
      success: response=>{
        tree.replaceWith(response);
      }
    });
  }

  function getForest(){
    var userId = $('#username').attr('data-id');

    $.ajax({
      url: '/forest/' + userId,
      type: 'GET',
      dataType: 'html',
      success: response=>{
        $('#forest').empty().append(response);
      }
    });
  }

  function seed(){
    var userId = $('#username').data('id');

    $.ajax({
      url: '/seed',
      type: 'POST',
      data: {userId:userId},
      success: response=>{
        $('#forest').append(response);
      }
    });
  }

  function login(event){
    var data = $(this).closest('form').serialize();

    $.ajax({
      url: '/login',
      type: 'POST',
      data: data,
      success: response => {
        $('#login').prev().val('');
        $('#username').attr('data-id', response._id);
        $('#username').text(response.username);
      }
    });

    event.preventDefault();
  }


})();
