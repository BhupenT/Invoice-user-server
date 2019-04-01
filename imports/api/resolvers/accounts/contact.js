import Validator from '../../../startup/server/validation';
import ContactsData from './contacts-data'

const ContactsResolvers = {
    
    Mutation: {
        createContact(parent, {org_id, datas}, context, {fieldName}) {

            /* Validate datas
             * Prepare object
             */
            let _object = {
                'org_id': org_id,
                first_name: datas.contact_details.first_name,
                last_name: datas.contact_details.last_name,
                email_address: datas.contacts.main.email_address
            }

            /* Validate Empty rules
             * Check email validation
             */
            Validator.Empty(_object);
            Validator.Email(_object.email_address);

            return ContactsData.CreateContact(org_id, datas);

        },

        updateContact(parent, {contact_id, datas}, context, {fieldName}) {
        
            let _object = {'contact_id': contact_id};
            try {
                _object.email_address = datas.contacts.main.email_address;
            } catch (error) {
                _object.email_address = undefined;
            }

            /* Validate Empty rules
             * Check email validation
             */
            Validator.Empty(_object);
            if(_object.email_address !== 'undefined') {
                Validator.Email(_object.email_address);
            }

            return ContactsData.UpdateContact(contact_id, datas);

        }
    },

    Query: {
        getContact(parent, {contact_id, datas}, context, {fieldName}) {

            Validator.Empty({'contact_id': contact_id});
            return ContactsData.GetContact(contact_id);

        },

        getContacts(parent, {org_id, datas}, context, {fieldName}) {
            Validator.Empty({'org_id': org_id});
            return ContactsData.GetContacts(org_id);
        }
    }
};

export default ContactsResolvers;