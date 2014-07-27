kuji
====

###Asynchronous Control Flow library for Node.

Browsers are not supported yet, it will be added later.


##What's inside
`kuji.graph` permits you to easily run __tasks graphs__:

``` javascript
var kuji = require('kuji'),
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

##Coming next
- Error handling through next()
- Passing values through next()
- Final callback
- Benchmark
- Perfomance optimization
- kuji.series and kuji.parallel

##Testing
To run the tests :
```
mocha
```

##License
MIT
