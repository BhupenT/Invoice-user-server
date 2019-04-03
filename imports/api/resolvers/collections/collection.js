import Validator from '../../../startup/server/validation';
import Groups from './group';


const CollectionResolvers = {

    Mutation: {

        createCustomGroup(parent, {org_id, datas}, context, {fieldName}) {

            /* Validate Empty rules
             */
            let _datas = datas;
            _datas['org_id'] = org_id;

            Validator.CustomGroup(_datas);

            return Groups.CreateCustomGroup(org_id, datas);

        },

        updateCustomGroup(parent, {_id, datas}, context, {fieldName}) {

            /* Validate Empty rules
             */
            let _datas = datas;
            _datas['_id'] = _id;
            Validator.CustomGroup(_datas);

            return Groups.UpdateCustomGroup(_id, datas);
        },

        addCategory(parent, {org_id, datas}, context, {fieldName}) {

            /* Validate Empty rules
             */
            let _datas = {org_id: org_id, category_name: datas.name, module_id: datas.module_id};
            Validator.Empty(_datas);

            return Groups.AddCategory(org_id, datas);
            
        },

        updateCategory(parent, {_id, datas}, context, {fieldName}) {

            /* Validate Empty rules
             */
            let _datas = {_id: _id, category_name: datas.name, module_id: datas.module_id};
            Validator.Empty(_datas);

            return Groups.UpdateCategory(_id, datas);
        }

    },

    Query: {
        
        getCustomGroup(parent, {_id}, context, {fieldName}) {

            Validator.Empty({_id: _id});

            return Groups.GetCustomGroup(_id);


        },

        getCustomGroups(parent, {org_id}, context, {fieldName}) {

            Validator.Empty({org_id: org_id});

            return Groups.GetCustomGroups(org_id);

        },

        getCategory(parent, {_id}, context, {fieldName}) {

            Validator.Empty({_id: _id});

            return Groups.GetCategory(_id);

        },

        getCustomGroups(parent, {org_id}, context, {fieldName}) {

            Validator.Empty({org_id: org_id});

            return Groups.GetCategories(org_id);
        }
    }

};

export default CollectionResolvers;