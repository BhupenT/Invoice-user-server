import { UsersData } from '../../../startup/server/collections'
import { Meteor } from 'meteor/meteor'
import DotNotation from 'mongo-dot-notation'

const Users = Meteor.users;

const UserData = {

    GetUserData: function(user_id) {
        
        const DataDoc = Users.findOne({_id: user_id});

        if(DataDoc === undefined) {
            throw new Meteor.Error(402, 'User Not found');
        }

        return UsersData.findOne({user_id: DataDoc._id});

    },

    UpdateUserData: function(user_id, datas) {

        const DataDoc = UserData.GetUserData(user_id); // Does validation too :)


        if(Object.keys(datas).length === 0) {
            //datas is Empty nothing to update
            return DataDoc;
        }

        // Dot Notation flatten datas
        const Datas = DotNotation.flatten(datas);

        UsersData.upsert({user_id: DataDoc.user_id}, Datas);

        return UserData.GetUserData(DataDoc.user_id);
     
    }
}

export default UserData;