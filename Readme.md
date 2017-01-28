#GraphQL WordNet

This is an experimental project to help me learn about GraphQL by implementing WordNet querying.

I'm following the tutorial located [here](https://www.youtube.com/watch?v=DNPVqK_woRQ).

##Building

First download the WN sqlite db from [here](https://downloads.sourceforge.net/project/wnsql/wnsql3/mysql/3.1/mysql-3.0.0-31-wn-31.zip?r=https%3A%2F%2Fsourceforge.net%2Fprojects%2Fwnsql%2Ffiles%2Fwnsql3%2Fsqlite%2F3.1%2F&ts=1485637843&use_mirror=freefr) and place under `db/`. Then run the following:

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

