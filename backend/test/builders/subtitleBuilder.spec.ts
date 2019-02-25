import chai = require('chai');
import { subtitleBuilder } from '../../builders/subtitleBuilder';
import { Subtitle } from '../../../sharedInterfaces/Subtitle';

describe.only("subtitleBuilder", () =>
{
        describe("When called with an empty fileName", () => 
        {
            let result: any;
            before(() =>
            {
                try
                {
                    result = new subtitleBuilder('', 'subtitlehost')
                }
                catch(__error)
                {
                    result = __error;
                }
            });

            it("Should throw an 'Invalid filename' error ", () => 
            {
                chai.expect(result.message).to.eql('Invalid filename');
            })
        });

        describe("When called with a null fileName", () =>
        {
            let result: any;
            before(() =>
            {
                try
                {
                    result = new subtitleBuilder('', 'subtitlehost')
                }
                catch(__error)
                {
                    result = __error;
                }
            });

            it("Should throw an 'Invalid filename' error ", () => 
            {
                chai.expect(result.message).to.eql('Invalid filename');
            });
        });

        describe("When called with a valid subtitle filename", () =>
        {
            describe("And the filename does not specify a language", () =>
            {
                let result: Subtitle;
                before(() =>
                {
                    let SubtitleBuilder = new subtitleBuilder('TheMatrix2.jjip.vtt', 'hosted/videos');
                    result = SubtitleBuilder.buildSubtitle();
                });
                it("Should default the language to Unknown", () =>
                {
                    chai.expect(result.language).to.equal('Unknown');
                });

                it("Should return a target that it is the filename without any extensions", () =>
                {
                    chai.expect(result.target).to.equal('TheMatrix2');
                });

                it("Should return the filename", () =>
                {
                    chai.expect(result.name).to.equal('TheMatrix2.jjip.vtt');
                });

                describe("And the file exists under hosted/videos", () =>
                {
                    it("Should return a path of the directory plus filename", () =>
                    {
                        chai.expect(result.path).to.equal('hosted/videos/TheMatrix2.jjip.vtt');
                    })
                })
            });

            describe("And the language does not contain a known ISO code", () =>
            {
                let result: Subtitle;
                before(() =>
                {
                    let SubtitleBuilder = new subtitleBuilder('TheMatrix2.jjip.vtt', 'subtitlehost');
                    result = SubtitleBuilder.buildSubtitle();
                });
                it("Should default the language to Unknown", () =>
                {
                    chai.expect(result.language).to.equal('Unknown');
                });

            });

            describe("And the filename specifies a languague in ISO 639-1", () =>
            {
                describe("And the Language is French", () =>
                {
                    let result: Subtitle;
                    before(() =>
                    {
                        let SubtitleBuilder = new subtitleBuilder('TheEnglishMovieThatIsntInEnglish.fr.vtt', '/my/movies');
                        result = SubtitleBuilder.buildSubtitle();
                    });

                    it("Should return a subtitle object with name set to the filename", () =>
                    {
                        chai.expect(result.name).to.equal("TheEnglishMovieThatIsntInEnglish.fr.vtt");
                    });

                    it("Should return a subtitle object with language 'French'", () =>
                    {
                        chai.expect(result.language).to.equal("French");
                    });
                    describe("And the folder path is /my/movies", () => 
                    {
                        it("Should return a subtitle object with path referencing the french file", () =>
                        {
                            chai.expect(result.path).to.equal('/my/movies/TheEnglishMovieThatIsntInEnglish.fr.vtt');
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
                        let SubtitleBuilder = new subtitleBuilder('rareMovieFromS4c.cy.vtt', '/my/movies');
                        result = SubtitleBuilder.buildSubtitle();
                    });

                    it("Should return a subtitle object with name set to the filename", () =>
                    {
                        chai.expect(result.name).to.equal("rareMovieFromS4c.cy.vtt");
                    });

                    it("Should return a subtitle object with language 'Welsh'", () =>
                    {
                        chai.expect(result.language).to.equal("Welsh");
                    });
                    describe("And the folder path is /my/movies", () => 
                    {
                        it("Should return a subtitle object with path referencing the french file", () =>
                        {
                            chai.expect(result.path).to.equal('/my/movies/rareMovieFromS4c.cy.vtt');
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
                        let SubtitleBuilder = new subtitleBuilder('TheEnglishMovieThatIsntInEnglish.fre.vtt', '/my/movies');
                        result = SubtitleBuilder.buildSubtitle();
                    });

                    it("Should return a subtitle object with name set to the filename", () =>
                    {
                        chai.expect(result.name).to.equal("TheEnglishMovieThatIsntInEnglish.fre.vtt");
                    });

                    it("Should return a subtitle object with language 'French'", () =>
                    {
                        chai.expect(result.language).to.equal("French");
                    });
                    describe("And the folder path is /my/movies", () => 
                    {
                        it("Should return a subtitle object with path referencing the french file", () =>
                        {
                            chai.expect(result.path).to.equal('/my/movies/TheEnglishMovieThatIsntInEnglish.fre.vtt');
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
                        let SubtitleBuilder = new subtitleBuilder('rareMovieFromS4c.cym.vtt', 'subtitlehost');
                        result = SubtitleBuilder.buildSubtitle();
                    });

                    it("Should return a subtitle object with name set to the filename", () =>
                    {
                        chai.expect(result.name).to.equal("rareMovieFromS4c.cym.vtt");
                    });

                    it("Should return a subtitle object with language 'Welsh'", () =>
                    {
                        chai.expect(result.language).to.equal("Welsh");
                    });
                    describe("And the folder path is /my/movies", () => 
                    {
                        it("Should return a subtitle object with path referencing the french file", () =>
                        {
                            chai.expect(result.path).to.equal('subtitlehost/rareMovieFromS4c.cym.vtt');
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