import { Meteor } from 'meteor/meteor'
import { ApolloServer } from 'apollo-server-express'
import { WebApp } from 'meteor/webapp'
import bodyParser from 'body-parser'
import { makeExecutableSchema } from 'graphql-tools'
import merge from 'lodash/merge'

import CommonInputSchema from '../../api/schema/common-input-types.graphql'
import CommonTypeSchema from '../../api/schema/common-types.graphql'
import AccountsSchema from '../../api/schema/accounts/account.graphql'
import OrganisationSchema from '../../api/schema/organisations/organisation.graphql'
import ContactsSchema from '../../api/schema/accounts/contact.graphql'

import AccountsResolvers from '../../api/resolvers/account'
import OrganisationResolvers from '../../api/resolvers/organisation'
import ContactsResolvers from '../../api/resolvers/contact'

import {Accounts} from 'meteor/accounts-base'
///

/*let user = Accounts.findUserByEmail('hello@hi.co');
let result = Accounts._checkPassword(user , '1234');
if(result.error) {
    console.log(result.error.reason);
}else{
    console.log(result);
}*/


const typeDefs = [
    CommonTypeSchema,
    AccountsSchema,
    OrganisationSchema,
    CommonInputSchema,
    ContactsSchema

];

const resolvers = merge(AccountsResolvers, OrganisationResolvers, ContactsResolvers);

const schema = makeExecutableSchema( {
    typeDefs,
    resolvers,
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
