import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLEnumType,
    GraphQLList,
    GraphQLSchema,
} from 'graphql';
import db from './db';

var POSType = new GraphQLEnumType({
    name: 'POS',
    values: {
        NOUN: { value: 0 },
        VERB: { value: 1 },
        ADJECTIVE: { value: 2 },
        ADVERB: { value: 3 }
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
            // pos: {
            //     type: POSType,
            //     resolve(synset) {
            //         return synset.pos;
            //     }
            // },
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
                    }
                },
                resolve(root, args) {
                    return db.sequelize.models.synsets.findAll({where: args});
                }
            }
        }
    }
});

const Schema = new GraphQLSchema({
    query: Query
});

export default Schema;
