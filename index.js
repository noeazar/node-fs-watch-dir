const fs = require('fs');
const events = require('events');
const util = require('util');
const watchDir = './watch';
const processedDir = './processed';

function Watcher(watchDir, processedDir) {
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}

util.inherits(Watcher, events.EventEmitter);

Watcher.prototype.watch = function() {
    const watcher = this;
    fs.readdir(this.watchDir, function(err, files) {
        if (err) throw err;
        for (let index in files) {
            watcher.emit('process', files[index]);
        }
    });
}

Watcher.prototype.start = function() {
    const watcher = this;
    fs.watchFile(watchDir, function() {
        watcher.watch();
    });
}

let watcher = new Watcher(watchDir, processedDir);

watcher.on('process', function(file) {
    let watchFile = this.watchDir + '/' + file;
    let processedFile = this.processedDir + '/' + file.toLowerCase();
    fs.rename(watchFile, processedFile, function(err){
        if (err) throw err;
    });
});

watcher.start();