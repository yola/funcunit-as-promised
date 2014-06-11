# funcunit-as-promised

Promise-ified [Funcunit](http://funcunit.com/).

## Use it

FuncUnit is a jquery-based testing library that allows functional application tests to run right in the browser. It allows us to open our application in a popup window, and drive the application from JS code. Unfortunately, the default FuncUnit API makes a lot of assumptions about how it will be used, and is not easily paired with modern test harnesses or other asynchronous code like yotest.js. This can lead to frustration when writing and debugging tests.

Funcunit-as-promised is yotest's _very_ thin wrapper around FuncUnit which exposes a promise-based interface. This in turn improves error-handling, asserts, and debug messages in our tests. The promise-based interface also makes it much easier to combine FuncUnit with the promise-based yotest.js API.


### 'Assert function' Example

If we want to assert that an element is visible, we do this:

```javascript
var fp = require("funcunit-as-promised");

var promise = fp.assertVisible(".no-sites");

promise.then(function(){
    console.log("SUCCESS");
}, function(){
    console.log("FAILURE");
});
```

assertVisible works like this:
1. Immediately return a promise that the item will become visible
2. Wait for the item to become visible within the default timeout period of 15 seconds
3. If the element becomes visible, _resolve_ the promise
4. If the element never appears _reject_ the promise

The other funcunit-as-promised assert functions also use a polling mechanism like this.

### 'Get function' Example

If we want to simply get the text of an element, we do this:

```javascript
var fp = require("funcunit-as-promised");

fp.getText(".siteName");
.then(function(siteName){
    console.log("The site name is " + siteName);
});
```

Get functions return a promise, but that promise is resolved immediately, as there is no condition for funcunit-as-promised to poll for.

## Build it

```
$ npm install
$ bower install
$ npm run builddist
```
