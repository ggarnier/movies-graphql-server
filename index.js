var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    moviesByTitle(title: String): [Movie!]!
    moviesByYear(year: Int): [Movie!]!
  }
  type Movie {
    title: String!
    year: Int!
  }
`);

var db = {
  movies: [
    { title: 'Once Upon a Time in Hollywood', year: 2019 },
    { title: 'Rocky', year: 1976 },
  ],
};

var root = {
  moviesByTitle: (args) => (
    db.movies.filter(m => m.title.includes(args.title))
  ),
  moviesByYear: (args) => (
    db.movies.filter(m => m.year === args.year)
  ),
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
