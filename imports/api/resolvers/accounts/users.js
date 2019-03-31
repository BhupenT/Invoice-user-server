import {Accounts} from 'meteor/accounts-base'
import { UserInputError } from 'apollo-server-express'
import { Random } from 'meteor/random'
import { Organisations } from '../../../startup/server/collections'
import { UsersData } from '../../../startup/server/collections'
import { Meteor } from 'meteor/meteor'

const Users = Meteor.users;

const UsersAccount = {

    GetUser: function(_id) {
        
        const targetDoc = Users.findOne({_id: _id});

        if(targetDoc === undefined) {
            throw new Meteor.Error(402, 'User Not found');
        }
        return targetDoc;

    },

    RegisterUser: function(email, phone, pass) {
        
        try {
            let userObj = {
                username: email,
                email: email,
                password: pass,
                phone: phone
            };
            if(pass === undefined) {
                delete userObj.password;
            }
 
            const userId = Accounts.createUser(userObj);

            // upsert additional user datas
            const orgId = Organisations.insert({ // Organisation
                owner_id: userId,
                aioms_id: Random.id()
            });

            UsersData.insert(
                { 
                    contacts: {
                        main: {
                            email_address: email
                        }
                    },
                    status: 'inactive'
                }
            ); // Userdatas

            Users.upsert(userId, { // User global
                $set: {
                    status: 'inactive',
                    phone: phone,
                    organisations: [
                        {
                            _id: orgId
                        }
                    ],
                    subscription: null
                }
            });
            
            return UsersAccount.GetUser(userId);
            
        } catch (error) {

            throw new UserInputError(
                error.reason
            );

        }
    },

    UpdateUser: function(_id, datas) {
        const User = UsersAccount.GetUser(_id);

        if(datas.username !== undefined) {
            Accounts.setUsername(User._id, datas.username);
        }

        if(datas.emails !== undefined) {
            const currentEmail = User.emails[0].address;

            if(currentEmail != datas.emails) {
                // Add Email
                Accounts.addEmail(User._id, datas.emails);

                /* We not allowing multiple emails eventho database can handle multiple
                * Remove previous email now
                */
                Accounts.removeEmail(User._id, currentEmail);

                /* update many matched owners datas
                 * and of all the organisationsUserDatas
                 */

                UsersData.update({'contacts.main.email_address': currentEmail}, {
                    $set: {
                        contacts: {
                            main: {
                                email_address: datas.emails
                            }
                        }
                    }
                });

            }
        }

        if(datas.phone !== undefined) {
            Users.upsert(User._id, {
                $set: {
                    phone: datas.phone
                }
            });
        }

        return UsersAccount.GetUser(User._id);
     
    }
}

export default UsersAccount;