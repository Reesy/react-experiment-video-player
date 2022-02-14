import chai = require('chai');
import path = require('path');
import { videoBuilder } from '../../builders/videoBuilder';
import { subtitleBuilder } from '../../builders/subtitleBuilder';
import { Video } from "../../interfaces/Video";

describe("videoBuilder", () =>
{
    describe("When called with an empty fileName", () => 
    {
        let result: any;
        before(() =>
        {
            try
            {
                result = new videoBuilder('', 'videohost')
            }
            catch (__error)
            {
                result = __error;
            }
        });

        it("Should throw an 'Invalid video filename' error ", () => 
        {
            chai.expect(result.message).to.equal("Invalid video filename");
        })
    });

    describe("When called with a null fileName", () =>
    {
        let result: any;
        before(() =>
        {
            try
            {
                result = new videoBuilder(<any>null, 'videohost')
            }
            catch (__error)
            {
                result = __error;
            }
        });

        it("Should throw an 'Invalid video filename' error ", () => 
        {
            chai.expect(result.message).to.equal("Invalid video filename");
        })
    });

    describe("When called with a valid filename ending with .mp4 or .m4v", () =>
    {
        describe("When called without subtitles", () =>
        {
            let result: Video;
            before(() =>
            {
                let VideoBuilder = new videoBuilder('Interstellar.mp4', 'videohost');
                result = VideoBuilder.buildVideo();
            });
            it("Should return a video object with name as filename", () =>
            {
                chai.expect(result.name).to.equal('Interstellar.mp4');
            });

            it("Should return a video object with path as the filepath on the host server", () =>
            {
                chai.expect(result.path).to.equal(path.join('videohost', 'Interstellar.mp4'));
            });

            it("Should return a video object with baseName as the extensionless filename", () =>
            {
                chai.expect(result.baseName).to.equal('Interstellar');
            });

            it("Should not return a subtitles property", () =>
            {
                chai.expect(result.subtitles).to.be.undefined;
            });
        })


        describe("When called with subtitles", () =>
        {
            describe('And there is one subtitle', () =>
            {
                let result: Video;
                before(() =>
                {
                    let SubtitleBuilder = new subtitleBuilder('skyfall.jp.vtt', 'subtitleHost');
                    let subtitle = SubtitleBuilder.buildSubtitle();
                    let VideoBuilder = new videoBuilder('skyfall.mp4', 'videohost');
                    VideoBuilder.buildVideoSubtitles([subtitle]);
                    result = VideoBuilder.buildVideo();
                })
                it("Should return a video object with name as filename", () =>
                {
                    chai.expect(result.name).to.equal('skyfall.mp4');
                });

                it("Should return a video object with path as the filepath on the host server", () =>
                {

                    chai.expect(result.path).to.equal(path.join('videohost', 'skyfall.mp4'));
                });

                it("Should return a video object with baseName as the extensionless filename", () =>
                {
                    chai.expect(result.baseName).to.equal('skyfall');
                });

                it("Should return a subtitles array with one subtitle object", () =>
                {
                    chai.expect(result.subtitles).to.be.lengthOf(1);
                });

            });

            describe('And there is 5 subtitles', () =>
            {
                let result: Video;
                before(() =>
                {
                    let SubtitleBuilder_1 = new subtitleBuilder('Lost in translation.vtt', 'subtitleHost');
                    let SubtitleBuilder_2 = new subtitleBuilder('Lost in translation.jp.vtt', 'subtitleHost');
                    let SubtitleBuilder_3 = new subtitleBuilder('Lost in translation.fr.vtt', 'subtitleHost');
                    let SubtitleBuilder_4 = new subtitleBuilder('Lost in translation.it.vtt', 'subtitleHost');
                    let SubtitleBuilder_5 = new subtitleBuilder('Lost in translation.cy.vtt', 'subtitleHost');
                    let subtitles = [];
                    subtitles.push(SubtitleBuilder_1.buildSubtitle());
                    subtitles.push(SubtitleBuilder_2.buildSubtitle());
                    subtitles.push(SubtitleBuilder_3.buildSubtitle());
                    subtitles.push(SubtitleBuilder_4.buildSubtitle());
                    subtitles.push(SubtitleBuilder_5.buildSubtitle());
                    let VideoBuilder = new videoBuilder('Lost in translation.mp4', 'videohost');
                    VideoBuilder.buildVideoSubtitles(subtitles);
                    result = VideoBuilder.buildVideo();
                })
                it("Should return a video object with name as filename", () =>
                {
                    chai.expect(result.name).to.equal('Lost in translation.mp4');
                });

                it("Should return a video object with path as the filepath on the host server", () =>
                {

                    chai.expect(result.path).to.equal(path.join('videohost', 'Lost in translation.mp4'));
                });

                it("Should return a video object with baseName as the extensionless filename", () =>
                {
                    chai.expect(result.baseName).to.equal('Lost in translation');
                });

                it("Should return a subtitles array with 5 subtitle objects", () =>
                {
                    chai.expect(result.subtitles).to.be.lengthOf(5);
                });

            });
        });

    });


});

