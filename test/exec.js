var test = require('tape');
var GAP_PATH = process.env.GAP_PATH || '../gap/gap';
var gap = require('../')({
  path: GAP_PATH,
  workspace: '/Users/vfilippov/Desktop/node-gap-system/savefile'
});

test('basic calculation', function (t) {
  var openmath = "<OMOBJ xmlns='http://www.openmath.org/OpenMath' version='2.0' cdbase='http://\www.openmath.org/cd'> <OMA> <OMS cd='arith1' name='plus'/> <OMI>3</OMI> <OMI>4</OMI> </OMA> </OMOBJ>";
  t.plan(2);

  gap.calculate(openmath, function(err, resp) {
    t.equal(err, null);
    t.equal(resp, '7');
  });
});


test('unsupported CDs', function (t) {
  // "arith1" changed to unknown - "arith221"
  var openmath = "<OMOBJ xmlns='http://www.openmath.org/OpenMath' version='2.0' cdbase='http://\www.openmath.org/cd'> <OMA> <OMS cd='arith221' name='plus'/> <OMI>3</OMI> <OMI>4</OMI> </OMA> </OMOBJ>";
  t.plan(2);

  gap.calculate(openmath, function(err, resp) {
    t.equal(err, 'Error, OpenMathError: unsupported_CD cd=arith221 name=plus called from\n');
    t.equal(resp, null);
  });
});
