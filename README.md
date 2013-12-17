# gap-system

Perform computations using the [GAP](http://www.gap-system.org/) computer algebra system from node.js.

## Setup

* Currently only supports calculating expressions created in [OpenMath](http://www.openmath.org/) XML format.
* Requires [OpenMath](http://www.gap-system.org/Packages/openmath.html) in your GAP installation.
* Create a workspace in GAP using:


```
gap> LoadPackage("openmath");
gap> SaveWorkspace("workspace");
true
gap>
```

## Usage


Initialize:

```
var gap = require('gap-system')({
  path: GAP_PATH,
  workspace: 'workspace'
});
```

Calculate:

```
var xml = "<OMOBJ xmlns='http://www.openmath.org/OpenMath' version='2.0' cdbase='http://\www.openmath.org/cd'> <OMA> <OMS cd='arith1' name='plus'/> <OMI>3</OMI> <OMI>4</OMI> </OMA> </OMOBJ>";

gap.calculate(xml, function(err, resp) {
  var result = resp;
});
```


### Options

#### path
Type: `String` - [Optional]
Default: 'gap'

Path to your GAP installation.
You can also use `GAP_PATH`.


#### workspace
Type: `String` - [Required]

Path to your GAP workspace.

## Development

Running tests:

```
npm test
```

or custom path:

```
GAP_PATH=[path]/gap/gap npm test
```




