var path = require('path');
var worker = require('./lib/worker');

module.exports = function (opts) {
  if (!opts) { opts = {} }
  if (!opts.hasOwnProperty('path')) {
    opts.path = process.env.GAP_PATH || 'gap';
  }

  return {
    calculate: function (x, cb) {
      opts.input = x;

      worker(opts, function (err, result) {
        if (err) {
          cb(err, null);
        } else {
          cb(null, result);
        }
      });
    }
  };

};
