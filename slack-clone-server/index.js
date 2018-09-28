import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import models from './models';
import cors from 'cors';

const express = require('express');
const { ApolloServer, gql} = require('apollo-server-express');
const app = express();

const PORT = 8080;
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));
const server = new ApolloServer({ typeDefs, resolvers,playground: {
  settings: {
    'editor.theme': 'light',
  },
  tabs: [
    {
      endpoint: "/graphql",
    },
  ],
},
context: {
  models,
  user: {
    id: 1,
  },
}
});
server.applyMiddleware({ app});
app.use(cors('*'))
models.sequelize.sync({force: true}).then(() => {
  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`)
  )
});
