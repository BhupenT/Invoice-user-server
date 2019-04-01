import { Mongo } from 'meteor/mongo'

export const Organisations = new Mongo.Collection('organisations');
export const Contacts = new Mongo.Collection('contacts');
export const UsersData = new Mongo.Collection('usersdata');
export const OptionsData = new Mongo.Collection('optionsdata');
export const CustomGroup = new Mongo.Collection('customgroup');

/*const options = {
    group: 'account_status',
    value: 'pending'
}
OptionsData.insert(options);*/