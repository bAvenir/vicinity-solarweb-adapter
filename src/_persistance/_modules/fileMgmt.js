var fs = require('fs');

exports.findFiles = function(path) {
  return new Promise(function(resolve, reject){
    fs.readdir(path, function(err, response){
      if(err) reject('Problem fetching files: ' + err);
      resolve(response);
    });
  });
};

/**
* Read a file
* @param {String} file Path to the file
*/
exports.read = function(file){
  return new Promise(function(resolve, reject){
    fs.readFile(file, 'utf8', function(err, response){
      if (err) reject('Problem writing file: ' + err);
        resolve(response);
    });
  });
};

/**
* Write string to a file (Replaces old one)
* @param {String} file Path to the file
* @param {String} string String to append to the file
*/
exports.write = function(file, string){
  return new Promise(function(resolve, reject){
    fs.writeFile(file, string, 'utf8', function(err){
      if (err) reject('Problem writing file: ' + err);
        resolve('The file has been saved!');
    });
  });
};
