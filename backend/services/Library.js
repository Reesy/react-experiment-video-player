"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var Library = /** @class */ (function () {
    function Library() {
        this.content = '';
        this.videoItemCache = [];
        this.scanLibrary();
    }
    Library.prototype.getLibrary = function () {
        return this.videoItemCache;
    };
    Library.prototype.scanLibrary = function () {
        var contentDirectory = path.join(__dirname, '..', 'videos');
        var LibraryFolderContent = fs.readdirSync(contentDirectory);
        this.videoItemCache = this.buildLibrary(LibraryFolderContent);
    };
    Library.prototype.buildLibrary = function (filenames) {
        var localVideoItem = [];
        var subtitles = [];
        for (var _i = 0, filenames_1 = filenames; _i < filenames_1.length; _i++) {
            var fileName = filenames_1[_i];
            if (fileName.indexOf('.vtt') !== -1) {
                //Will add a builder later that works off iso and does this logic more cleanly
                var fullFilename = fileName.replace('.vtt', '');
                //create a new entry subtitle entry if one doesn't exist
                if (!subtitles[fullFilename]) {
                    subtitles[fullFilename] = [];
                }
                subtitles[fullFilename].push(fileName);
            }
        }
        for (var _a = 0, filenames_2 = filenames; _a < filenames_2.length; _a++) {
            var fileName = filenames_2[_a];
            if (fileName.indexOf('.vtt') === -1) {
                var videoEntry = {
                    name: fileName,
                    resourceLocation: "/" + fileName
                };
                var fullFilename = fileName.replace('.mp4', '');
                fullFilename = fileName.replace('.m4v', '');
                if (subtitles[fullFilename]) {
                    videoEntry.subtitles = subtitles[fullFilename];
                }
                localVideoItem.push(videoEntry);
            }
        }
        return localVideoItem;
    };
    Library.prototype.writeLibrary = function () {
    };
    return Library;
}());
exports.Library = Library;
