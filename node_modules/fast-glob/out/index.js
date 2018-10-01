"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var merge2 = require("merge2");
var optionsManager = require("./managers/options");
var taskManager = require("./managers/tasks");
var reader_async_1 = require("./providers/reader-async");
var reader_stream_1 = require("./providers/reader-stream");
var reader_sync_1 = require("./providers/reader-sync");
var arrayUtils = require("./utils/array");
/**
 * Synchronous API.
 */
function sync(source, opts) {
    var works = getWorks(source, reader_sync_1.default, opts);
    return arrayUtils.flatten(works);
}
exports.sync = sync;
/**
 * Asynchronous API.
 */
function async(source, opts) {
    var works = getWorks(source, reader_async_1.default, opts);
    return Promise.all(works).then(arrayUtils.flatten);
}
exports.async = async;
/**
 * Stream API.
 */
function stream(source, opts) {
    var works = getWorks(source, reader_stream_1.default, opts);
    return merge2(works);
}
exports.stream = stream;
/**
 * Return a set of tasks based on provided patterns.
 */
function generateTasks(source, opts) {
    var patterns = [].concat(source);
    var options = optionsManager.prepare(opts);
    return taskManager.generate(patterns, options);
}
exports.generateTasks = generateTasks;
/**
 * Returns a set of works based on provided tasks and class of the reader.
 */
function getWorks(source, _Reader, opts) {
    var patterns = [].concat(source);
    var options = optionsManager.prepare(opts);
    var tasks = taskManager.generate(patterns, options);
    var reader = new _Reader(options);
    return tasks.map(reader.read, reader);
}
