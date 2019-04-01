import { ApolloServer } from 'apollo-server-express'
import { WebApp } from 'meteor/webapp'
import bodyParser from 'body-parser'
import { makeExecutableSchema } from 'graphql-tools'

import { Resolvers } from '../../api/resolvers/resolvers'
import { Schemas } from '../../api/schemas/schemas'

import {Accounts} from 'meteor/accounts-base'

/*let user = Accounts.findUserByEmail('hello@hi.co');
let result = Accounts._checkPassword(user , '1234');
if(result.error) {
    console.log(result.error.reason);
}else{
    console.log(result);
}*/

const schema = makeExecutableSchema( {
    typeDefs : Schemas,
    resolvers: Resolvers,
    resolverValidationOptions: {
		requireResolversForResolveType: false,
	},
});

const server = new ApolloServer({ 
    schema: schema,
    introspection: true,
    playground: true,
    context: ({req}) => {
        const headers = req.headers;
        return {headers};
    }
 });

server.applyMiddleware({
  app: WebApp.connectHandlers,
  path: '/graphql'
});

/*WebApp.connectHandlers.use(bodyParser.urlencoded({ extended: true }))
WebApp.connectHandlers.use('/api/v3', (req, res, next) => {
    
        if (req.method === 'GET') {
            res.end()
        }
});*/

// TESTING AREA
