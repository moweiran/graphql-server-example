const { ApolloServer, gql } = require('apollo-server');
const MyDatabase = require('./MyDatabase')

const knexConfig = {
    client: "pg",
    connection: {
        host: "localhost",
        port: 55000,
        user: 'postgres',
        password: 'postgres',
        database: 'study',
    },
    searchPath: ['study', 'public'],
    debug: true,
}

// you can also pass a knex instance instead of a configuration object
const db = new MyDatabase(knexConfig);

const typeDefs = gql`
    type Book {
        title: String
        author: Author
    }

    type Author {
        name: String
        age: Int
    }

    type Student {
        id: Int
        name: String
        roll: String
    }

    type Query {
        books: [Book]
        students(id:Int): [Student]
    }
    
    type Mutation {
        addBook(title: String, author: String): Book
        addStudent(name: String, roll: String): Int
        updateStudent(id:Int, name:String): Int
    }
`;

const books = [
    {
        title: 'The Awakening',
        author: {
            name: 'Tom',
            age: 1,
        },
    },
    {
        title: 'City of Glass',
        author: {
            name: 'Paul Auster',
            age: 1,
        },
    },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        books: () => books,
        students: async (_, { id }) => {
            const datas = await db.getStudents(id);
            return datas;
        }
    },
    Mutation: {
        addStudent: async (_, { name, roll }) => {
            const { id } = await db.addStudents(name, roll);
            return id;
        },
        updateStudent: async (_, { id, name }) => {
            await db.updateStudent(id, name);
            return id;
        }
    }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    dataSources: () => ({ db })
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});