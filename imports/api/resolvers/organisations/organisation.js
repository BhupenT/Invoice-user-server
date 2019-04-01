import Organisation from './organisation-datas'
import Validator from '../../../startup/server/validation';

export default {

    Mutation: {

        addOrganisation(parent, {user_id, datas}, context, {fieldName}) {
            
            // Validate datas
            Validator.Empty({"user_id": user_id});
            Validator.Organisation(datas);

            return Organisation.AddOrganisation(user_id, datas);

        },

        updateOrganisation(parent, {org_id, datas}, context, {fieldName}) {

            // Validate datas
            Validator.Empty({"org_id": org_id});
            Validator.Organisation(datas);

            return Organisation.UpdateOrganisation(org_id, datas);

        }
        
    },

    Query: {

        getOrganisation(parent, {_id}, context, {fieldName}) {

            // Validate datas
            Validator.Empty({'_id': _id});
            
            return Organisation.GetOrganisation(_id);

        }
    }
    
};