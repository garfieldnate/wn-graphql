#GraphQL WordNet

This is an experimental project to help me learn GraphQL but implementing WordNet querying.

##Building

    npm i
    npm run sql-gen

##Running

    node-babel server.js

Then navigate to `localhost:3000/graphql`. This will open a GraphiQL viewer. The following query will show synonyms of "carry" for each of its senses:

    {
      words(lemma:"carry") {
        id,
        senses {
          id,
          synset {
            id,
            definition
            senses {
              id,
              word {
                lemma
              }
            }
          }
        }
      }
    }

