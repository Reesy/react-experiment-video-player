import chai = require('chai');
import { videoBuilder } from '../../builders/videoBuilder';

describe("videoBuilder", () =>
{
        describe("When called with an empty fileName", () => 
        {
            let result: any;
            before(() =>
            {
            });

            it("Should throw an 'invalid fileName' error ", () => 
            {
                chai.expect(result).to.equal("An error was thrown");
            })
        });

        describe("When called with a null fileName", () =>
        {
            let result;
            before(() =>
            {
            });

            it("Should throw an 'invalid fileName' error", () => 
            {
                chai.assert.fail();
            });
        });

        describe("When called with a filename of an invalid extension", () =>
        {

            before(() =>
            {
            });

            it("Should throw an 'invalid fileName' error ", () => 
            {
                chai.assert.fail();
            });

        })

        describe("When called with a valid filename ending with .mp4 or .m4v", () =>
        {
            describe("When called without subtitles", () =>
            {

                it("Should return a video object with name as filename", () =>
                {
                    chai.assert.fail();
                });

                it("Should return a video object with path as the filepath on the host server", () =>
                {
                    chai.assert.fail();
                });

                it("Should return a video object with baseName as the extensionless filename", () =>
                {
                    chai.assert.fail();
                });


            })


            describe("When called with subtitles", () =>
            {
                it("Should return a video object with name as filename", () =>
                {
                    chai.assert.fail();
                });

                it("Should return a video object with path as the filepath on the host server", () =>
                {
                    chai.assert.fail();
                });

                it("Should return a video object with baseName as the extensionless filename", () =>
                {
                    chai.assert.fail();
                });

                describe('And there is one subtitle', () =>
                {
                    it("Should return a subtitles array with one subtitle object", () =>
                    {
                        chai.assert.fail();
                    });
                });

                describe('And there is 5 subtitles', () =>
                {
                    it("Should return a subtitles array with 5 subtitle objects", () =>
                    {
                        chai.assert.fail();
                    });

                })


            })



        })
});

