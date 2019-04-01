import CommonInputSchema from './globals/common-input-types.graphql'
import CommonTypeSchema from './globals/common-types.graphql'
import AccountsSchema from './accounts/account.graphql'
import OrganisationSchema from './organisations/organisation.graphql'
import ContactsSchema from './accounts/contact.graphql'
import CollectionsSchema from './collections/customgroup.graphql'


export const Schemas = [
    CommonTypeSchema,
    AccountsSchema,
    OrganisationSchema,
    CommonInputSchema,
    ContactsSchema,
    CollectionsSchema
];
