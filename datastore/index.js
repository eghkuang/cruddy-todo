const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // console.log('in index.js create, id = ' + id);

  // counter.getNextUniqueId(function(error, counterString) {
  //   var fileDir = counterString + '.txt';
  //   fs.writeFile(path.join(__dirname, '../test/testData', fileDir), text, function(error) {
  //     if (error) {
  //       // throw error;
  //       console.log('error');
  //     } else {
  //       callback(null, { 'id': counterString, 'text': text });
  //       // or ES6 version: callback(null, {id, text});
  //     }
  //   });
  // });

  // path.join(__dirname, '../test/testData', filedir)
  // var filedir = id + '.txt';
  var promise = new Promise((resolve, reject) => {
    counter.getNextUniqueId(function(error, counterString) {
      var fileDir = counterString + '.txt';
      fs.writeFile(path.join(__dirname, '../test/testData', fileDir), text, function(error) {
      // var filepath = path.join(exports.dataDir, `${id}.txt`)
      // fs.writeFile(path.join(filepath, text, function(error) {

        if (error) {
          // throw error;
          // console.log('error');
          // callback(error);
          reject(error);
        } else {
          // callback(null, { 'id': counterString, 'text': text });
          resolve({ 'id': counterString, 'text': text });
        }
      });
    });
  });
  promise
    .then(result => callback(null, result))
    .catch((error) => callback(error));
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
        var promise = new Promise((resolve, reject) => {
          fs.readFile(path.join(__dirname, '../test/testData', file), (err, data) => {
            if (err) {
              // callback(null, []);
              reject(err);
            } else {
              var newData = '';
              newData += data;
              // todoList.push({'id': id, 'text': newData});
              resolve({'id': id, 'text': newData});
            }
          });
        });
        todoList.push(promise);
        // callback(null, todoList);
      });
      Promise.all(todoList).then((data) => callback(null, data));
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
  // fs.readFile(path.join(__dirname, '../test/testData', filedir), (err, text) => {
  //   if (err) {
  //     console.log(`No item with id: ${id}`);
  //     callback(err);
  //   } else {
  //     var textc = '';
  //     textc += text;
  //     callback(null, {'id': id, 'text': textc});
  //   }
  // });

  var promise = new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '../test/testData', filedir), (err, text) => {
      if (err) {
        // console.log(`No item with id: ${id}`);
        reject(err);
        // callback(err);
      } else {
        var textc = '';
        textc += text;
        // callback(null, {'id': id, 'text': textc});
        resolve({'id': id, 'text': textc});
      }
    });
  });

  promise
    .then(results => callback(null, results))
    .catch((err) => callback(err));

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
  // fs.access(path.join(__dirname, '../test/testData', filedir), fs.constants.R_OK, (err) => {
  //   if (err) {
  //     console.log(`No item with id: ${id}`);
  //     callback(err);
  //   } else {
  //     fs.writeFile(path.join(__dirname, '../test/testData', filedir), text, (err) => {
  //       if (err) {
  //         console.log(`No item with id: ${id}`);
  //       } else {
  //         callback(null, {id, text});
  //       }
  //     });
  //   }
  // });

  var promise = new Promise((resolve, reject) => {
    fs.access(path.join(__dirname, '../test/testData', filedir), fs.constants.R_OK, (err) => {
      if (err) {
        // console.log(`No item with id: ${id}`);
        // callback(err);
        reject(err);
      } else {
        fs.writeFile(path.join(__dirname, '../test/testData', filedir), text, (err) => {
          if (err) {
            // console.log(`No item with id: ${id}`);
            reject(err);
          } else {
            // callback(null, {id, text});
            resolve({id, text});
          }
        });
      }
    });
  });

  promise.then(result => callback(null, result)).catch((err) => callback(err));
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
  // fs.unlink(path.join(__dirname, '../test/testData', filedir), (err) => {
  //   if (err) {
  //     console.log(`No item with id: ${id}`);
  //     callback(err);
  //   } else {
  //     callback(`Successfully deleted ${id}`);
  //   }
  // });

  var promise = new Promise((resolve, reject) => {
    fs.unlink(path.join(__dirname, '../test/testData', filedir), (err) => {
      if (err) {
        // console.log(`No item with id: ${id}`);
        // callback(err);
        reject(err);
      } else {
        // callback(`Successfully deleted ${id}`);
        resolve(`Successfully deleted ${id}`);
      }
    });
  });
  promise.then(result => callback(result)).catch((err) => callback(err));
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
