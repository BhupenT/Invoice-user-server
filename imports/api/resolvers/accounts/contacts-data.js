import { Contacts } from '../../../startup/server/collections'
import { Meteor } from 'meteor/meteor'
import UsersAccount from './users'
import Organisation from '../organisations/organisation-datas'
import { UsersData } from '../../../startup/server/collections'
import { OptionsData } from '../../../startup/server/collections'
import DotNotation from 'mongo-dot-notation'

import '../../../startup/both/helper'


const Users = Meteor.users;
const ContactsData = {
    
    GetContact: function(_id) {

        const ContactDoc = Contacts.findOne({_id: _id});

        if(ContactDoc === undefined) {
            throw new Meteor.Error(402, 'Contact Not found');
        }
        return ContactDoc;

    },

    GetContacts: function(org_id) {

        const ContactDocs = Contacts.find({org_id: org_id}).fetch();
        
        if(ContactDocs === undefined) {
            return;
        }
        return ContactDocs;

    },

    CreateContact: function(org_id, datas, insertDatas = true) {

        Organisation.GetOrganisation(org_id); // Validates Organisation

        const email = datas.contacts.main.email_address;
        //Check for duplicates
        let ContactData = Contacts.findOne({org_id: org_id, 'contacts.main.email_address': email});
        
        if(ContactData !== undefined) {
            throw new Meteor.Error(402, `${email } already exists.`);
        }

        let User = Users.findOne({'emails.address': email});

        if(User === undefined) { // Usr doest exits register new
            
            let phone = null;

            try {

                phone = datas.contacts.main.phone;

            } catch (error) {
                
            }
            
            User = UsersAccount.RegisterUser(email, phone);
            // Send Email to activate the account

            UsersData.upsert({'contacts.main.email_address': email}, {$set: datas}); // Registered users own userdata collection

            return ContactsData.insertContactData(org_id, User._id, datas, insertDatas);

        }

        return ContactsDatas.insertUserData(org_id, User._id, datas);

    },

    insertContactData: function(orgId, UserId, datas, insertDatas = true) {

        const UserDoc = UsersAccount.GetUser(UserId);
        let vendors;

        try {
            vendors = UserDoc.vendors;
        } catch (error) {
            
        }

        let result = {'numberAffected': 0};

        if(typeof vendors !== 'undefined' && checkValue(vendors, orgId) === false) {
            result = Users.upsert(UserId, {
                $push: {
                    vendors: { _id: orgId, status: 'pending' }
                }
            });
        }

        if(result.hasOwnProperty('numberAffected')) {
            if(result.numberAffected == 1) {

                if(insertDatas === false) { // ? insert new datas
                    return true;
                }

                // email the user to activate for recieving invoice/pay

                // Finally create user
                datas.org_id = orgId;

                const option = OptionsData.findOne({group: 'account_status', value: 'pending'});
                datas.status = {_id: option._id, status: option.value};

                let contactId = Contacts.insert(datas);
                
                return ContactsData.GetContact(contactId);
            }

            throw new Meteor.Error(500, 'Couldn\'t process at this time' );

        }else{

            throw new Meteor.Error(500, 'Couldn\'t process at this time' );
        }
    },

    UpdateContact: function(contact_id, datas) {
        const contactData = ContactsData.GetContact(contact_id);
        let email = null;
        try {
            email = datas.contacts.main.email_address;
        } catch (error) {
            
        }

        let intention = datas.register;
        delete datas.register; // removing unecessary Datas

        if(email !== null) {
            let org_id = contactData.org_id;
            // Compare with previous email
            if(email != contactData.contacts.main.email_address) {
                
                // email change - register ? yes or no
                if(intention === true) { // yes

                    ContactsData.CreateContact(org_id, datas, false);

                } else { // no
                    //Check for duplicates
                    let Contact = Contacts.findOne({org_id: org_id, 'contacts.main.email_address': email});
                    
                    if(Contact !== undefined) {
                        throw new Meteor.Error(402, `${email} already exists.`);
                    }
                }
            }
        }

        const Datas = DotNotation.flatten(datas);
        Contacts.upsert(contactData._id, Datas);

        return ContactsData.GetContact(contactData._id);

    }
}

export default ContactsData;