import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLEnumType,
    GraphQLList,
    GraphQLSchema,
} from 'graphql';
import db from './db';
import util from 'util';

const POSType = new GraphQLEnumType({
    name: 'POS',
    values: {
        NOUN: { value: 'n', description: "noun" },
        VERB: { value: 'v', description: "verb" },
        ADJECTIVE: { value: 'a', description: "adjective" },
        ADVERB: { value: 'r', description: "adverb" }
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
            }
            // lexdomainid:
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
                    if('id' in args){
                        args.synsetid = args.id;
                        delete args.id;
                    }
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
                    if('id' in args){
                        args.wordid = args.id;
                        delete args.id;
                    }
                    return db.sequelize.models.words.findAll({where: args});
                }
            }
        }
    }
});

const Schema = new GraphQLSchema({
    query: Query
});

export default Schema;
