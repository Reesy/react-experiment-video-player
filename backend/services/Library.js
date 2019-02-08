"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Library = /** @class */ (function () {
    function Library() {
        this.content = '';
        this.videoItemCache = [
            {
                name: '',
                resourceLocation: ''
            }
        ];
        this.scanLibrary();
    }
    Library.prototype.getLibrary = function () {
        return this.videoItemCache;
    };
    Library.prototype.scanLibrary = function () {
        console.log(process.cwd());
        var LibraryFolderContent = fs.readdirSync('backend/videos');
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
