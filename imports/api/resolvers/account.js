import UsersAccount from './accounts/users'
import Validator from '../../startup/server/validation';

const AccountsResolvers = {
    
    Mutation: {
        registerUser(parent, {email, pass, phone}, context, {fieldName}) {
            
            let datas = {Email: email,Password: pass};

            Validator.Empty(datas);
            Validator.Email(email);

            return UsersAccount.RegisterUser(email, phone, pass);

        },

        updateUser(parent, {_id, datas}, context, {fieldName}) {
            
            let _datas = {};
            
            for (const key in datas) {
                if(key !== undefined) {
                    _datas[key] = datas[key];
                }
            }

            Validator.Empty(_datas);
            if(_datas.emails !== undefined) {
                Validator.Email(_datas.emails);
            }

            return UsersAccount.UpdateUser(_id, _datas);

        }
        
    },

    Query: {
        getUser(parent, {_id}, context, {fieldName}) {

            let _object = {"_id": _id}
            Validator.Empty(_object);

            return UsersAccount.GetUser(_id);

        }
    }
};

export default AccountsResolvers;