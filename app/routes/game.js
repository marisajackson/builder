'use strict';

var users = global.nss.db.collection('users');
var trees = global.nss.db.collection('trees');
var Mongo = require('mongodb');
var treeHelper = require('../lib/tree-helper');
var _ = require('lodash');

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
  tree.isChopped = false;

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
  var treeId = Mongo.ObjectID(req.params.treeId);

  trees.findOne({_id:treeId}, (err, tree)=>{
    tree.height += _.random(0, 2);
    tree.isHealthy = _.random(0,100) !==70;
    trees.save(tree, (err, count)=>{
      res.render('game/tree', {tree: tree, treeHelper:treeHelper}, (err, html)=>{
        res.send(html);
      });
    });
  });
};

exports.chop = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.treeId);

  trees.findOne({_id:treeId}, (err, tree)=>{
    users.findOne({_id:tree.userId}, (err, user)=>{
      user.wood += tree.height/2;
      users.save(user, (err, usercount)=>{
        tree.isChopped = true;
        tree.isAlive = false;
        tree.height = 0;
        console.log(user);
        trees.save(tree, (err, count)=>{
          res.render('game/tree', {tree: tree, treeHelper:treeHelper}, (err, html)=>{
            res.send(html);
          });
        });
      });
    });
  });
};

exports.sell = (req, res)=>{
  var userId = Mongo.ObjectID(req.params.userId);
  users.findOne({_id:userId}, (err, user)=>{
    user.wood -= req.body.amount;
    user.cash = req.body.amount / 5;
    users.save(user, (err, user)=>{
      res.render('game/stats', {user: user}, (e, html)=>{
        res.send(html);
    });
  });
  });
};

exports.stats = (req, res)=>{
  var userId = Mongo.ObjectID(req.params.userId);
  users.findOne({_id:userId}, (err, user)=>{
    res.render('game/stats', {user: user}, (e, html)=>{
      res.send(html);
    });
  });
};
