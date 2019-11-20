const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean
} = graphql;

//mongoose schema
const Movies = require("../models/movie");
const Directors = require("../models/director");

// const movies = [
//   { id: "1", name: "Pulp Fiction", genre: "Crime", directorId: "1" },
//   { id: "2", name: "1984", genre: "Sci-Fi", directorId: "2" },
//   { id: 3, name: "V for vendetta", genre: "Sci-Fi-Triller", directorId: "3" },
//   { id: 4, name: "Snatch", genre: "Crime-comedy", directorId: "4" },
//   { id: "5", name: "Reservoir Dogs", genre: "Crime", directorId: "1" },
//   { id: "6", name: "The Hateful Eight", genre: "Crime", directorId: "1" },
//   { id: "7", name: "Inglorious Basterds", genre: "Crime", directorId: "1" }
// ];

//const moviesJson = [
//   { "name": "Pulp Fiction", "genre": "Crime", "directorId": "5d2f46161c9d440000dc59b7" }
//   { "name: "1984", "genre": "Sci-Fi", "directorId": "5d2f49e31c9d440000dc59b9" }
//   { "name": "V for vendetta", "genre": "Sci-Fi-Triller", "directorId": "5d2f4a931c9d440000dc59ba" }
//   { "name": "Snatch", genre: "Crime-comedy", directorId: "5d2f4b9d1c9d440000dc59c3" }
//]

// const directorsJson = [
//{ "name" : "Quentin Tarantino", "age":55} , 5d2f46161c9d440000dc59b7
//{ "name": "Michael Radford", "age": 72 } , 5d2f49e31c9d440000dc59b9
// {"name": "James McTeigue", "age": 51 } , 5d2f4a931c9d440000dc59ba
// { "name": "Guy Ritchie", "age": 50} , 5d2f4b9d1c9d440000dc59c3
//];

// const directors = [
//   { id: "1", name: "Quentin Tarantino", age: 55 },
//   { id: "2", name: "Michael Radford", age: 72 },
//   { id: "3", name: "James McTeigue", age: 51 },
//   { id: "4", name: "Guy Ritchie", age: 50 }
// ];

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: new GraphQLNonNull(GraphQLString) },
    watched: { type: new GraphQLNonNull(GraphQLBoolean) },
    rate: { type: GraphQLInt },
    director: {
      type: DirectorType,
      resolve({directorId}, args) {
        //without models
        //return directors.find(director => director.id === parent.id);

        return Directors.findById(directorId);
      }
    }
  })
});


const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt)},
    movies: {
      type: new GraphQLList(MovieType),
      resolve({id}, args) {
        //without model
        //return movies.filter(movie => movie.directorId === parent.id);
        return Movies.find({directorId: id});
      }
    }
  })
});


//mutation for adding Director in database
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addDirector:{
      type: DirectorType,
      args:{
        name : { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },

      },
      resolve(parent, {name,age}){
          const director = new Directors({
            name,
            age,
          });
         return director.save();
      },
    },
    addMovie:{
      type: MovieType,
      args:{
        name : { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        rate: { type: GraphQLInt },
        directorId: { type: GraphQLID  }
      },
      resolve(parent, {name,genre,watched,rate,directorId}){
          const movie = new Movies({
            name,
            genre,
            watched,
            rate,
            directorId,
          });
         return movie.save();
      },
    },
    deleteDirector: {
      type: DirectorType,
      args: { id :{ type: GraphQLID}},
      resolve(parent,{id}){
        return Directors.findByIdAndRemove(id);
      }
    },
    deleteMovie: {
      type: MovieType,
      args: { id :{ type: GraphQLID}},
      resolve(parent,{id}){
        return Movies.findByIdAndRemove(id);
      }
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id : { type: GraphQLID },
        name: { type:new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        },
        resolve(parent,{id,name,age}){
          return Directors.findByIdAndUpdate(
            id,
            { $set: { name, age }},
            { new  : true },
          );
        },
    },
    updateMovie: {
      type: MovieType,
      args: {
        id : { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        rate: { type: GraphQLInt },
        directorId: { type:  GraphQLID }
        },
        resolve(parent,{id,name,genre,watched,rate,directorId}){
          return Movies.findByIdAndUpdate(
            id,
            { $set: { name, genre, watched, rate, directorId }}, 
            { new  : true },
          );
        },
    },
    



  }
});



const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, {id}) {
        //without model
        //return movies.find(movie => movie.id === args.id);
        return Movies.findById(id);
      }
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, {id}) {
        //return directors.find(director => director.id === args.id);
        return Directors.findById(id);
      }
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve() {
        //return movies;
        return Movies.find({});
      }
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve() {
       // return directors;
       return Directors.find({});
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
