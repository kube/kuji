kuji
====

Asynchronous library for Node

`kuji.graph` permits you to easily run __tasks graphs__:

``` javascript
var kuji = require('./kuji.js'),
    dependsOn = kuji._dependsOn;

kuji.graph({
  a: function (next) {
    next()
  },
  b: function (next) {
    next();
  },
  c: function (next) {  
    next();
  },
  d: dependsOn('a', function (next) {
    next();
  }),
  e: dependsOn(['d', 'c'], function () {

  })
});

```


To run the tests :
```
mocha
```
