import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLEnumType,
    GraphQLList,
    GraphQLSchema,
} from 'graphql';
import db from './db';

const renameId = (tableName) => {
    return (args) => {
        if('id' in args){
            args[tableName+'id'] = args.id;
            delete args.id;
        }
    }
}

const getOneToMany = (cell, idType, otherTable) => {
    var otherId = otherTable + 'id';
    var thisId = idType + 'id';
    return db.sequelize.models[otherTable].findAll({where: {[thisId]: cell[thisId]}});
}

const getOneToOne = (cell, idType, otherTable) => {
    var otherId = otherTable + 'id';
    var thisId = idType + 'id';
    return db.sequelize.models[otherTable].findOne({where: {[thisId]: cell[thisId]}});
}

const POSType = new GraphQLEnumType({
    name: 'POS',
    values: {
        NOUN: { value: 'n', description: "noun" },
        VERB: { value: 'v', description: "verb" },
        ADJECTIVE: { value: 'a', description: "adjective" },
        ADVERB: { value: 'r', description: "adverb" }
    }
});

const LexDomain = new GraphQLObjectType({
    name: 'LexDomain',
    description: 'Subject/domain that a lexeme may belong to',
    fields: () => {
        return {
            id: {
                type: GraphQLInt,
                resolve(lexDomain) {
                    return lexDomain.lexdomainid;
                }
            },
            name: {
                type: GraphQLString,
                resolve(lexDomain) {
                    return lexDomain.lexdomainname;
                }
            },
            lexdomain: {
                type: GraphQLString,
                resolve(lexDomain) {
                    return lexDomain.lexdomain;
                }
            },
            pos: {
                type: POSType,
                resolve(lexDomain) {
                    return lexDomain.pos;
                }
            }
        }
    }
});

const SynSet = new GraphQLObjectType({
    name: 'SynSet',
    description: 'A set of cognitive synonyms expressing a distinct concept',
    fields: () => {
        return {
            id: {
                type: GraphQLInt,
                resolve(synset) {
                    return synset.synsetid;
                }
            },
            pos: {
                type: POSType,
                resolve(synset) {
                    return synset.pos;
                }
            },
            definition: {
                type: GraphQLString,
                resolve(synset) {
                    return synset.definition;
                }
            },
            senses: {
                type: new GraphQLList(Sense),
                resolve(synset) {
                    return getOneToMany(synset, 'synset', 'senses');
                }
            },
            lexdomain: {
                type: LexDomain,
                resolve(synset) {
                    return getOneToOne(synset, 'lexdomain', 'lexdomains');
                }
            }
        }
    }
});

const Word = new GraphQLObjectType({
    name: 'Word',
    description: 'An orthographical representation',
    fields: () => {
        return {
            id: {
                type: GraphQLInt,
                resolve(word) {
                    return word.wordid;
                }
            },
            lemma: {
                type: GraphQLString,
                resolve(word) {
                    return word.lemma;
                }
            },
            senses: {
                type: new GraphQLList(Sense),
                resolve(word) {
                    return getOneToMany(word, 'word', 'senses');
                }
            }
        }
    }
});

const Sense = new GraphQLObjectType({
    name: 'Sense',
    description: 'A unique meaning shared between synonyms',
    fields: () => {
        return {
            id: {
                type: GraphQLInt,
                resolve(sense) {
                    return sense.senseid;
                }
            },
            word: {
                type: Word,
                resolve(sense) {
                    return getOneToOne(sense, 'word', 'words');
                }
            },
            // casedword: {
            //     type: CasedWord,
            //     resolve(sense) {
            //         return db.sequelize.models.casedwords.findOne({where: {casedwordid: sense.casedwordid}});
            //     }
            // },
            synset: {
                type: SynSet,
                resolve(sense) {
                    return getOneToOne(sense, 'synset', 'synsets');
                }
            },
            sensenum: {
                type: GraphQLInt,
                resolve(sense) {
                    return sense.sensenum;
                }
            },
            // lexid: ...
            tagcount: {
                type: GraphQLInt,
                resolve(sense) {
                    return sense.tagcount;
                }
            },
            sensekey: {
                type: GraphQLString,
                resolve(sense) {
                    return sense.sensekey;
                }
            }
        }
    }
});

const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'The root query',
    fields: () => {
        return {
            synsets: {
                type: new GraphQLList(SynSet),
                args: {
                    id: {
                        type: GraphQLInt
                    },
                    pos: {
                        type: POSType
                    }
                },
                resolve(root, args) {
                    renameId('synset')(args);
                    return db.sequelize.models.synsets.findAll({where: args});
                }
            },
            words: {
                type: new GraphQLList(Word),
                args: {
                    id: {
                        type: GraphQLInt
                    },
                    lemma: {
                        type: GraphQLString
                    }
                },
                resolve(root, args) {
                    renameId('word')(args);
                    return db.sequelize.models.words.findAll({where: args});
                }
            },
            senses: {
                type: new GraphQLList(Sense),
                args: {
                    id: {
                        type: GraphQLInt
                    }
                },
                resolve(root, args) {
                    renameId('sense')(args);
                    return db.sequelize.models.senses.findAll({where: args});
                }
            }
        }
    }
});

const Schema = new GraphQLSchema({
    query: Query
});

export default Schema;
