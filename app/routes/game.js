'use strict';

var users = global.nss.db.collection('users');
var trees = global.nss.db.collection('trees');
var Mongo = require('mongodb');
var treeHelper = require('../lib/tree-helper');

exports.index = (req, res)=>{
  res.render('game/index', {title: 'Game: Home'});
};

exports.login = (req, res)=>{
  var user = {};
  user.username = req.body.username;
  user.wood = 0;
  user.cash = 0;

  users.findOne({username: user.username}, (err, record)=>{
    if(record === null){
      users.save(user, (error, object)=>res.send(object));
    } else {
      res.send(record);
    }
  });
};

exports.seed = (req, res)=>{
  var tree = {};
  tree.height = 0;
  tree.userId = Mongo.ObjectID(req.body.userId);
  tree.isHealthy = true;
  tree.isChopped = true;

  trees.save(tree, (error, obj)=>{
    res.render('game/tree', {tree: obj, treeHelper:treeHelper}, (err, html)=>{
      res.send(html);
    });
  });
};

exports.forest = (req, res)=>{
  var userId = Mongo.ObjectID(req.params.userId);

  trees.find({userId:userId}).toArray((error, objs)=>{
    res.render('game/forest', {trees: objs, treeHelper:treeHelper}, (err, html)=>{
      res.send(html);
    });
  });
};

exports.grow = (req, res)=>{

};
