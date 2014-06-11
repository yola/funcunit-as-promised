"use strict";

var q = require("q");

var delay = function(ms){
    var deferred = q.defer();
    setTimeout(function(){
        deferred.resolve();
    }, ms);
    return deferred.promise;
};

var waitFor = function(event){
    if (!event.deferred){
        event.deferred = q.defer();
        event.startTime = new Date().getTime();
    }

    var result = event.evaluator.call(this, event.args);

    if (result){
        return event.deferred.resolve(result);
    }

    var elapsedTime = new Date().getTime() - event.startTime;
    var timeout = event.timeout || 15000;
    if (elapsedTime <= timeout){
        delay(100).then(function(){
            return waitFor(event);
        });
        return event.deferred.promise;
    }
    else {
        var error = new Error("Poller timed out: " + event.message);
        error.args = event.args;
        event.deferred.reject(error);
    }

    return event.deferred.promise;
};

var exports = {
    waitFor: waitFor,
    delay: delay
};

module.exports = exports;
