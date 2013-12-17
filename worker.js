var spawn = require('child_process').spawn;

process.on('message', function(opts) {
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

  // assign a new variable
  gap.stdin.write('s:="' + opts.input + '";;\n');

  // evaluate OpenMath string
  var run = "EvalOMString(s); \n";
  gap.stdin.write(run);

  // GAP error output
  gap.stderr.on('data', function (data) {
    var resp = data.toString();
    process.send(resp);
    gap.stdin.write('quit;;\n');
    gap.kill('SIGHUP');
  });

  // GAP evaluation output
  gap.stdout.on('data', function (data) {
    if (data) {
      // trims \r and \n
      var out = data.toString().trim();
      if (out.length > 0) {
        process.send(out);
        gap.kill('SIGHUP');
      }
    }
  });

});
