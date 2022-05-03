const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // console.log('in index.js create, id = ' + id);
  counter.getNextUniqueId(function(error, counterString) {
    var fileDir = counterString + '.txt';
    fs.writeFile(path.join(__dirname, '../test/testData', fileDir), text, function(error) {
      if (error) {
        // throw error;
        console.log('error');
      } else {
        callback(null, { 'id': counterString, 'text': text });
      }
    });

  });


  // path.join(__dirname, '../test/testData', filedir)
  // var filedir = id + '.txt';

};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);

  let todoList = [];
  fs.readdir(path.join(__dirname, '../test/testData'), (err, files) => {
    if (err) {
      callback(null, []);
    } else {
      files.forEach(function(file) {
        let id = file.split('.')[0];
        todoList.push({'id': id, 'text': id});
      });
      callback(null, todoList);
    }
  });
};



exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  let filedir = id + '.txt';
  fs.readFile(path.join(__dirname, '../test/testData', filedir), (err, text) => {
    if (err) {
      console.log(`No item with id: ${id}`);
      callback(err);
    } else {
      var textc = '';
      textc += text;
      callback(null, {'id': id, 'text': textc});
    }
  });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
  let filedir = id + '.txt';
  fs.access(path.join(__dirname, '../test/testData', filedir), fs.constants.R_OK, (err) => {
    if (err) {
      console.log(`No item with id: ${id}`);
      callback(err);
    } else {
      fs.writeFile(path.join(__dirname, '../test/testData', filedir), text, (err) => {
        if (err) {
          console.log(`No item with id: ${id}`);
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  let filedir = id + '.txt';
  fs.unlink(path.join(__dirname, '../test/testData', filedir), (err) => {
    if (err) {
      console.log(`No item with id: ${id}`);
      callback(err);
    } else {
      callback(`Successfully deleted ${id}`);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
