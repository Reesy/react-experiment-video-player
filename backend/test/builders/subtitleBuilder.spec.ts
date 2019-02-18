import chai = require('chai');
import mocha = require('mocha');
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

            });
        });

        describe("When called with a valid subtitle filename", () =>
        {
            describe("And the filename does not specify a language", () =>
            {
                it("Should default the language to Unknown", () =>
                {

                });
            });

            describe("And the language does not contain a known ISO code", () =>
            {
                it("Should default the language to Unknown", () =>
                {

                });
            });

            describe("And the filename specifies a languague in ISO 639-1", () =>
            {
                describe("And the Language is French", () =>
                {

                });

                describe("And the Language is Welsh", () =>
                {

                });
            });

            describe("And the filename specifies a languague in ISO 639-2/B", () =>
            {
                describe("And the Language is French", () =>
                {

                });

                describe("And the Language is Welsh", () =>
                {

                });
            });

        });
});

