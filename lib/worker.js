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
  var openMath = opts.input.om;
  // useful digits after . in the result, GAP does simple rounding
  var digits = 3;

  if (typeof opts.input.digits === "number") {
    digits = opts.input.digits + 1;
  }

  // assign a new variable
  gap.stdin.write('FLOAT.VIEW_DIG:=' + digits + ';; s:="' + openMath + '";;\n');

  // evaluate OpenMath string
  var run = 'r:=EvalOMString(s);;\n Float(r); \n';
  gap.stdin.write(run);

  // GAP error output
  gap.stderr.on('data', function (data) {
    if (!errored) {
      errored = true;
      var err = data.toString().replace(/(\r\n|\n|\r)/gm,'');
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
