var express = require('express');
var graphqlHTTP = require('express-graphql');
var graphql = require('graphql');

var db = {
  movies: [
    { title: 'Once Upon a Time in Hollywood', year: 2019 },
    { title: 'Rocky', year: 1976 },
  ],
};

var movieType = new graphql.GraphQLObjectType({
  name: 'Movie',
  fields: {
    title: { type: graphql.GraphQLString },
    year: { type: graphql.GraphQLInt },
  }
});

var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    moviesByTitle: {
      type: new graphql.GraphQLList(movieType),
      args: {
        title: { type: graphql.GraphQLString }
      },
      resolve: (_, { title }) => (
        db.movies.filter(m => m.title.includes(title))
      ),
    },
    moviesByYear: {
      type: new graphql.GraphQLList(movieType),
      args: {
        year: { type: graphql.GraphQLInt }
      },
      resolve: (_, { year }) => (
        db.movies.filter(m => m.year === year)
      ),
    },
  },
});

var schema = new graphql.GraphQLSchema({query: queryType});

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
