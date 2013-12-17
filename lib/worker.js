var spawn = require('child_process').spawn;

module.exports = function(opts, cb) {
  // path to GAP executable
  var GAP_PATH = opts.path;
  // path to a generate workspace
  var WORKSPACE_PATH = opts.workspace;
  // executable args
  // -q silent mode
  // -L workspace path flag
  var args = ['-q', '-L', WORKSPACE_PATH];
  // spawn a new GAP process.
  var gap = spawn(GAP_PATH, args);
  // TODO: find a better solution
  var called = false;
  var errored = false;

  // assign a new variable
  gap.stdin.write('s:="' + opts.input + '";;\n');

  // evaluate OpenMath string
  var run = "EvalOMString(s); \n";
  gap.stdin.write(run);

  // GAP error output
  gap.stderr.on('data', function (data) {
    if (!errored) {
      errored = true;
      var err = data.toString();
      cb(err, null);
      gap.stdin.write('quit;;\n');
      gap.kill('SIGHUP');
    }
  });

  // GAP evaluation output
  gap.stdout.on('data', function (data) {
    if (data && !called && !errored) {
      // trims \r and \n
      var out = data.toString().trim();
      if (out.length > 0) {
        called = true;
        cb(null, out);
        gap.kill('SIGHUP');
      }
    }
  });
};
