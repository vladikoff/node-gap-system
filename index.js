var path = require('path');
var computecluster = require('compute-cluster');

module.exports = function (opts) {
  if (!opts) {  opts = {} }
  console.log(__dirname);

  var cc = new computecluster({
    module: __dirname +  '/worker.js'
  });

  return {
    calculate: function (x, cb) {
      opts.input = x;

      cc.enqueue(opts, function (err, result) {
        if (err || result.indexOf('Error') === 0) {
          cb(result, null);
        } else {
          cb(null, result);
        }
      });

      cc.on('error', function(e) {
        cb('Error, ' + e, null);
      });
    }
  };

};
