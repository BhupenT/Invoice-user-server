import merge from 'lodash/merge'

import CollectionsResolvers from './collections/collection'
import AccountsResolvers from './accounts/account'
import OrganisationResolvers from './organisations/organisation'
import ContactsResolvers from './accounts/contact'


export const Resolvers = merge(AccountsResolvers, OrganisationResolvers,
    ContactsResolvers, CollectionsResolvers);