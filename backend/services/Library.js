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
        for (var _i = 0, filenames_1 = filenames; _i < filenames_1.length; _i++) {
            var fileName = filenames_1[_i];
            var videoEntry = {
                name: fileName,
                resourceLocation: "/" + fileName
            };
            localVideoItem.push(videoEntry);
        }
        return localVideoItem;
    };
    Library.prototype.writeLibrary = function () {
    };
    return Library;
}());
exports.Library = Library;
