import chai = require('chai');
import { subtitleBuilder } from '../../builders/subtitleBuilder';

describe("subtitleBuilder", () =>
{
        describe("When called with an empty fileName", () => 
        {
            let result: any;
            before(() =>
            {
                let SubtitleBuilder = new subtitleBuilder('');
                result = SubtitleBuilder.buildSubtitle();
            });

            it("Should throw an 'invalid fileName' error ", () => 
            {
                chai.expect(result).to.equal("An error was thrown")
            })
        });

        describe("When called with a null fileName", () =>
        {
            let result;
            before(() =>
            {
                let SubtitleBuilder = new subtitleBuilder(<any>null);
                result = SubtitleBuilder.buildSubtitle();
            });

            it("Should throw an 'invalid fileName' error ", () => 
            {
                chai.assert.fail()
            });
        });

        describe("When called with a valid subtitle filename", () =>
        {
            describe("And the filename does not specify a language", () =>
            {
                it("Should default the language to Unknown", () =>
                {
                    chai.assert.fail()
                });
            });

            describe("And the language does not contain a known ISO code", () =>
            {
                it("Should default the language to Unknown", () =>
                {
                    chai.assert.fail()
                });
            });

            describe("And the filename specifies a languague in ISO 639-1", () =>
            {
                describe("And the Language is French", () =>
                {
                    it("Should return a subtitle object with name set to the filename", () =>
                    {
                        chai.assert.fail();
                    });

                    it("Should return a subtitle object with language 'French'", () =>
                    {
                        chai.assert.fail();
                    });

                    it("Should return a subtitle object with path referencing the french file", () =>
                    {
                        chai.assert.fail();
                    });

                    it("Should return a subtitle object with target which should be filename excluding extention", () =>
                    {
                        chai.assert.fail();
                    });
                });

                describe("And the Language is Welsh", () =>
                {
                    it("Should return a subtitle object with name set to the filename", () =>
                    {
                        chai.assert.fail();
                    });

                    it("Should return a subtitle object with language 'Welsh'", () =>
                    {
                        chai.assert.fail();
                    });

                    it("Should return a subtitle object with path referencing the Welsh file", () =>
                    {
                        chai.assert.fail();
                    });

                    it("Should return a subtitle object with target which should be filename excluding extention", () =>
                    {
                        chai.assert.fail();
                    });
                });
            });

            describe("And the filename specifies a languague in ISO 639-2/B", () =>
            {
                describe("And the Language is French", () =>
                {
                    it("Should return a subtitle object with name set to the filename", () =>
                    {
                        chai.assert.fail();
                    });

                    it("Should return a subtitle object with language 'French'", () =>
                    {
                        chai.assert.fail();
                    });

                    it("Should return a subtitle object with path referencing the french file", () =>
                    {
                        chai.assert.fail();
                    });

                    it("Should return a subtitle object with target which should be filename excluding extention", () =>
                    {
                        chai.assert.fail();
                    });
                });

                describe("And the Language is Welsh", () =>
                {
                    it("Should return a subtitle object with name set to the filename", () =>
                    {
                        chai.assert.fail();
                    });

                    it("Should return a subtitle object with language 'Welsh'", () =>
                    {
                        chai.assert.fail();
                    });

                    it("Should return a subtitle object with path referencing the Welsh file", () =>
                    {
                        chai.assert.fail();
                    });

                    it("Should return a subtitle object with target which should be filename excluding extention", () =>
                    {
                        chai.assert.fail();
                    });
                });
            });

        });
});

