const CollectionResolvers = {
    CustomData: {
        __resolveType(obj, context, info){
            console.log(obj);

            if(obj.field) {
                return 'CustomString'
            }

            if(obj.value){
                return 'CustomNumber';
            }

            return null;
        }
            
    },

    Query: {
        
        getCustomGroup(parent, {_id, org_id}, context, {fieldName}) {

            console.log(_id, org_id);
            const Group = {
                _id: 'ladjfljl',
                title: 'My Title',
                datas: [
                    {
                        name: 'Address',
                        field: '1-3 Mary Street'
                    },
                    {
                        name: 'State',
                        field: 'NSW'

                    },
                    {
                        name: 'Zip Code',
                        value: 2141
                    }
                ]
            }

            return Group;

        }
    }

};

export default CollectionResolvers;