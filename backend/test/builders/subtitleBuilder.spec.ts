import chai = require('chai');
import { subtitleBuilder } from '../../builders/subtitleBuilder';
import { Subtitle } from '../../../sharedInterfaces/Subtitle';

describe("subtitleBuilder", () =>
{
        describe("When called with an empty fileName", () => 
        {
            let result: Subtitle;
            before(() =>
            {
                let SubtitleBuilder = new subtitleBuilder('');
                result = SubtitleBuilder.buildSubtitle();
            });

            it("Should throw an 'invalid fileName' error ", () => 
            {
                chai.expect(result).to.equal("Invalid filename");
            })
        });

        describe("When called with a null fileName", () =>
        {
            let result: Subtitle;
            before(() =>
            {
                let SubtitleBuilder = new subtitleBuilder(<any>null);
                result = SubtitleBuilder.buildSubtitle();
            });

            it("Should throw an 'invalid fileName' error ", () => 
            {
                chai.expect(result).to.equal("Invalid filename");
            });
        });

        describe("When called with a valid subtitle filename", () =>
        {
            describe("And the filename does not specify a language", () =>
            {
                let result: Subtitle;
                before(() =>
                {
                    let SubtitleBuilder = new subtitleBuilder('TheMatrix2.jjip.m4v');
                    result = SubtitleBuilder.buildSubtitle();
                });
                it("Should default the language to Unknown", () =>
                {
                    chai.expect(result.language).to.equal('Unknwon');
                });

                it("Should return a target that it is the filename without any extensions", () =>
                {
                    chai.expect(result.target).to.equal('TheMatrix2');
                });

                it("Should return the filename", () =>
                {
                    chai.expect(result.name).to.equal('TheMatrix2.jjip.m4v');
                });

                describe("And the file exists under hosted/videos", () =>
                {
                    it("Should return a path of the directory plus filename", () =>
                    {
                        chai.expect(result.path).to.equal('hosted/videos/TheMatrix2.jjip.m4v');
                    })
                })
            });

            describe("And the language does not contain a known ISO code", () =>
            {
                let result: Subtitle;
                before(() =>
                {
                    let SubtitleBuilder = new subtitleBuilder('TheMatrix2.jjip.m4v');
                    result = SubtitleBuilder.buildSubtitle();
                });
                it("Should default the language to Unknown", () =>
                {
                    chai.expect(result.language).to.equal('Unknwon');
                });

            });

            describe("And the filename specifies a languague in ISO 639-1", () =>
            {
                describe("And the Language is French", () =>
                {
                    let result: Subtitle;
                    before(() =>
                    {
                        let SubtitleBuilder = new subtitleBuilder('TheEnglishMovieThatIsntInEnglish.fr.m4v');
                        result = SubtitleBuilder.buildSubtitle();
                    });

                    it("Should return a subtitle object with name set to the filename", () =>
                    {
                        chai.expect(result.name).to.equal("TheEnglishMovieThatIsntInEnglish.fr.m4v");
                    });

                    it("Should return a subtitle object with language 'French'", () =>
                    {
                        chai.expect(result.language).to.equal("French");
                    });
                    describe("And the folder path is /my/movies", () => 
                    {
                        it("Should return a subtitle object with path referencing the french file", () =>
                        {
                            chai.expect(result.path).to.equal('/my/movies/TheEnglishMovieThatIsntInEnglish.fr.m4v');
                        });
    
                    })

                    it("Should return a subtitle object with target which should be filename excluding extention", () =>
                    {
                        chai.expect(result.target).to.equal('TheEnglishMovieThatIsntInEnglish');
                    });
                });

                describe("And the Language is Welsh", () =>
                {
                    let result: Subtitle;
                    before(() =>
                    {
                        let SubtitleBuilder = new subtitleBuilder('rareMovieFromS4c.cy.m4v');
                        result = SubtitleBuilder.buildSubtitle();
                    });

                    it("Should return a subtitle object with name set to the filename", () =>
                    {
                        chai.expect(result.name).to.equal("rareMovieFromS4c.cy.m4v");
                    });

                    it("Should return a subtitle object with language 'Welsh'", () =>
                    {
                        chai.expect(result.language).to.equal("Welsh");
                    });
                    describe("And the folder path is /my/movies", () => 
                    {
                        it("Should return a subtitle object with path referencing the french file", () =>
                        {
                            chai.expect(result.path).to.equal('/my/movies/rareMovieFromS4c.cy.m4v');
                        });
    
                    })

                    it("Should return a subtitle object with target which should be filename excluding extention", () =>
                    {
                        chai.expect(result.target).to.equal('rareMovieFromS4c');
                    });
                });  
            });

            describe("And the filename specifies a languague in ISO 639-2", () =>
            {
                describe("And the Language is French", () =>
                {
                    let result: Subtitle;
                    before(() =>
                    {
                        let SubtitleBuilder = new subtitleBuilder('TheEnglishMovieThatIsntInEnglish.fre.m4v');
                        result = SubtitleBuilder.buildSubtitle();
                    });

                    it("Should return a subtitle object with name set to the filename", () =>
                    {
                        chai.expect(result.name).to.equal("TheEnglishMovieThatIsntInEnglish.fre.m4v");
                    });

                    it("Should return a subtitle object with language 'French'", () =>
                    {
                        chai.expect(result.language).to.equal("French");
                    });
                    describe("And the folder path is /my/movies", () => 
                    {
                        it("Should return a subtitle object with path referencing the french file", () =>
                        {
                            chai.expect(result.path).to.equal('/my/movies/TheEnglishMovieThatIsntInEnglish.fre.m4v');
                        });
    
                    })

                    it("Should return a subtitle object with target which should be filename excluding extention", () =>
                    {
                        chai.expect(result.target).to.equal('TheEnglishMovieThatIsntInEnglish');
                    });
                });

                describe("And the Language is Welsh", () =>
                {
                    let result: Subtitle;
                    before(() =>
                    {
                        let SubtitleBuilder = new subtitleBuilder('rareMovieFromS4c.cym.m4v');
                        result = SubtitleBuilder.buildSubtitle();
                    });

                    it("Should return a subtitle object with name set to the filename", () =>
                    {
                        chai.expect(result.name).to.equal("rareMovieFromS4c.cym.m4v");
                    });

                    it("Should return a subtitle object with language 'Welsh'", () =>
                    {
                        chai.expect(result.language).to.equal("Welsh");
                    });
                    describe("And the folder path is /my/movies", () => 
                    {
                        it("Should return a subtitle object with path referencing the french file", () =>
                        {
                            chai.expect(result.path).to.equal('/my/movies/rareMovieFromS4c.cym.m4v');
                        });
    
                    })

                    it("Should return a subtitle object with target which should be filename excluding extention", () =>
                    {
                        chai.expect(result.target).to.equal('rareMovieFromS4c');
                    });
                });  
            });

        });
});