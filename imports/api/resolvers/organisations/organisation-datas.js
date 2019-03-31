import { Organisations } from '../../../startup/server/collections'
import { Random } from 'meteor/random'
import { Meteor } from 'meteor/meteor'
import DotNotation from 'mongo-dot-notation'

const Users = Meteor.users;

const Organisation = {

    GetOrganisation(_id) {

        const targetDoc = Organisations.findOne({_id: _id});
        
        if(targetDoc === undefined) {
            throw new Meteor.Error(402, 'Organisation Not found');
        }
        return targetDoc;

    },

    AddOrganisation(user_id, datas) {

        const targetDoc = Users.find({_id: user_id}).fetch([0]);
        
        if(targetDoc.length === 0) {
            throw new Meteor.Error(402, 'Userid Not found');
        }
        
        if(datas.generate_aioms_id === true) {
            datas.aioms_id = Random.id();
        }

        // Delete unecessary Datas
        delete datas.generate_aioms_id;

        // Add userId in Organisation Doc
        datas.owner_id = user_id;

        const orgId = Organisations.insert(datas);

        Users.update(targetDoc[0]._id, {
            $push: {
                organisations: {_id: orgId}
            }
        });
        return Organisation.GetOrganisation(orgId);

    },

    UpdateOrganisation(org_id, datas) {

        const Doc = Organisation.GetOrganisation(org_id);

        if(datas.generate_aioms_id === true) {
            datas.aioms_id = Random.id();
        }
        
        // Delete unecessary Datas
        delete datas.generate_aioms_id;

        if(Object.keys(datas).length === 0) {
            //datas is Empty nothing to update
            return Doc;
        }

        // Dot Notation flatten datas
        const Datas = DotNotation.flatten(datas);

        Organisations.upsert(Doc._id, Datas);

        return Organisation.GetOrganisation(Doc._id);

    }
};

export default Organisation;