"use strict";

var poller = require("./poller");
var q = require("q");
var f = require("funcunit");

var frameNumber = false;

var exports = {};

exports.switchToFrame = function(newFrameNumber){
    return q.fcall(function(){
        frameNumber = newFrameNumber;
        return frameNumber;
    });
};

exports.clearFrame = function(){
    return q.fcall(function(){
        frameNumber = false;
        return false;
    });
};

var isVisible = function(args){
    // We can't use funcunit's .visible() method because it
    // takes a callback and throws on failure. We need
    // something that returns now, without a callback.
    return f(args.selector, frameNumber).is(":visible");
};

var anyVisible = function(args){
    for (var i=0; i < args.selectors.length; i++){
        var selector = args.selectors[i];
        if (isVisible({selector:selector})){
            return true;
        }
    }
    return false;
};

var isTextEqual = function(args){
    var actualText = f(args.selector, frameNumber).text();
    return actualText === args.expectedText;
};

var isSize = function(args){
    var actualSize = f(args.selector, frameNumber).size();
    return actualSize === args.expectedSize;
};

exports.open = function(url){
    var dfd = q.defer();
    f.open(url, function(){
        dfd.resolve();
    });
    return dfd.promise;
};

exports.assertVisible = function(selector){
    return poller.waitFor({
        message: selector + " should be visible",
        evaluator: isVisible,
        args: {
            selector: selector
        }
    });
};

exports.assertAnyVisible = function(selectors){
    return poller.waitFor({
        message: "Any of " + selectors + " should be visible",
        evaluator: anyVisible,
        args: {
            selectors: selectors
        }
    });
};

exports.assertTextEquals = function(selector, expectedText){
    return poller.waitFor({
        message: selector + " should have text: " + expectedText,
        evaluator: isTextEqual,
        args: {
            selector: selector,
            expectedText: expectedText
        }
    });
};

exports.assertSize = function(selector, expectedSize){
    return poller.waitFor({
        message: selector + " should have size of " + expectedSize,
        evaluator: isSize,
        args: {
            selector: selector,
            expectedSize: expectedSize
        }
    });
};

exports.getText = function(selector){
    return q.fcall(function(){
        return f(selector, frameNumber).text();
    });
};

exports.getSize = function(selector){
    return q.fcall(function(){
        return f(selector, frameNumber).size();
    });
};

exports.type = function(selector, keys){
    return q.fcall(function(){
        f(selector).type(keys);
    });
};

exports.click = function(selector){
    return q.fcall(function(){
        f(selector).click();
    });
};

module.exports = exports;
