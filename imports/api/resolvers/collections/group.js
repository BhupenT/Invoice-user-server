import { CustomGroup } from '../../../startup/server/collections'
import { Categories } from '../../../startup/server/collections'
import Organisation from '../organisations/organisation-datas'
import { Meteor } from 'meteor/meteor'
import DotNotation from 'mongo-dot-notation'
import { Match } from 'meteor/check'

const Groups = {

    GetCustomGroup: function(_id) {
        
        const GroupDoc = CustomGroup.findOne({_id: _id});

        if(GroupDoc === undefined) {
            throw new Meteor.Error(402, 'Custom Group Not found');
        }
        return GroupDoc;

    },

    GetCustomGroups: function(org_id) {

        const GroupDocs = CustomGroup.find({org_id: org_id}).fetch();
        
        if(GroupDocs === undefined) {
            return;
        }
        return GroupDocs;

    },

    GetCategory: function(_id) {
        
        const CatDoc = Categories.findOne({_id: _id});

        if(CatDoc === undefined) {
            throw new Meteor.Error(402, 'Category Not found');
        }
        return CatDoc;

    },

    GetCategories: function(org_id) {

        const CatDocs = Categories.find({org_id: org_id}).fetch();
        
        if(CatDocs === undefined) {
            return;
        }
        return CatDocs;

    },

    CreateCustomGroup: function(org_id, datas) {

        Organisation.GetOrganisation(org_id); // Validates Organisation

        let groupTitle = datas['title'].toLowerCase();
        const GroupDoc = CustomGroup.findOne({org_id: org_id, title: groupTitle});

        if(GroupDoc !== undefined) { // Check if title exists already
            throw new Meteor.Error(402, `${datas.title} already exists.`);
        }

        datas.title = groupTitle; // Store as lowercase
        datas.org_id = org_id;

        // Check and match against categories
        if(datas.categories !== undefined) {
            datas.categories = Groups.CheckCategories(datas.categories);
        }

        const GroupId = CustomGroup.insert(datas);

        return Groups.GetCustomGroup(GroupId);
     
    },

    UpdateCustomGroup: function(_id, datas) {

        const GroupDoc = Groups.GetCustomGroup(_id); // Validates CustomGroup also :)

        let groupTitle = datas['title'].toLowerCase();
        datas.title = groupTitle; // Store as lowercase

        // Check and match against categories
        if(datas.categories !== undefined) {
            datas.categories = Groups.CheckCategories(datas.categories);
        }
        
        // Dot Notation flatten datas
        const Datas = DotNotation.flatten(datas);

        CustomGroup.upsert(GroupDoc._id, Datas);

        return Groups.GetCustomGroup(GroupDoc._id);

    },

    AddCategory: function(org_id, datas) {

        Organisation.GetOrganisation(org_id); // Validates Organisation

        let catName = datas['name'].toLowerCase();
        const CatDoc = Categories.findOne({org_id: org_id, name: catName});

        if(CatDoc !== undefined) { // Check if title exists already
            throw new Meteor.Error(402, `${datas.name} already exists.`);
        }
        datas.name = catName; // Store as lowercase
        datas.org_id = org_id;

        const CatId = Categories.insert(datas);

        return Groups.GetCategory(CatId);

    },

    UpdateCategory: function(_id, datas) {

        const CatDoc = Groups.GetCategory(_id); // Validates Categories also :)

        let catName = datas['name'].toLowerCase();
        datas.name = catName; // Store as lowercase

        // Dot Notation flatten datas
        const Datas = DotNotation.flatten(datas);

        Categories.upsert(CatDoc._id, Datas);

        return Groups.GetCategory(CatDoc._id);

    },

    CheckCategories: function(array) {
        let _this = Groups;
        let catArray = [];
        array.forEach(element => {
            
            let _match = Match.test(element, Object);
            
            if(_match === true) {
                
                // Check if elementObj is empty
                if(Object.keys(element).length > 0) {
                    let obj = {};
                    const CatDoc = _this.GetCategory(element._id); 
                    if(CatDoc.name != element['name'].toLowerCase()) {
                        throw new Meteor.Error(402, `Category ${element.name} doesn't match with the _id.`);
                    }
                    obj._id = CatDoc._id;
                    obj.name = CatDoc.name;
                    catArray.push(obj);

                }else{
                    throw new Meteor.Error(402, `object cannot be empty!`);
                }

            }else{ // not object

                _this.GetCategory(element); // validates the id

                catArray.push(element);

            }
        });

        return catArray;

    }
}

export default Groups;