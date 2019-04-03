import isEmpty from 'validator/lib/isEmpty'
import isEmail from 'validator/lib/isEmail'
import { UserInputError } from 'apollo-server-express'
import { Match } from 'meteor/check'

const options = {
    ignore_whitespace: true
}

const Validator =  {

    Email(email, throwError = true) {

        const result = isEmail(email);

        if(throwError === false) {
            return result;
        }

        if(result === false) {
            throw new UserInputError('Invalid Email');
        }
    },

    Empty(object, throwError = true, endObj = {}) {
        const _this = Validator.Empty;

        for (const key in object) {
            let _match = Match.test(object[key], Object);

            if(_match === true) {

                _this(object[key], throwError, endObj);

            }else{

                let result = isEmpty(object[key].toString(), options);
                    
                if(throwError === false) {
                    endObj[key] = result;
                }else{
                    if(result === true) {
                        throw new UserInputError(`${key} cannot be empty`);
                    }
                }

            }
        }

        if(throwError === false) {
            return endObj;
        }
    },
    
    Organisation(datas) {
        //console.log(datas);

        let _email;
        try {
            _email = datas.contacts.main.email_address;
            
        } catch (error) {
            if(error) {
                _email = undefined;
            }
        }
        
        if(typeof _email !== 'undefined') {

            let check = Validator.Empty({email: _email}, false);
            if(check.email === false) {
                Validator.Email(_email);
            }
        }
    },

    CustomGroup(datas) {
        
        let _datas = {
            title: datas.title,
            module_id: datas.module_id
        }

        if(datas.org_id !== undefined) {
            _datas.org_id = datas.org_id;
        }

        if(datas._id !== undefined) {
            _datas._id = datas._id;
        }

        Validator.Empty(_datas);

        
        if(datas.categories !== undefined) {
            let categories = datas.categories;
            Validator.ArrayEmpty(categories);
        }

        if(datas.datas !== undefined) {
            let customDatas = datas.datas;
            Validator.ArrayEmpty(customDatas);
        }

    },

    ArrayEmpty(Array, throwError = true, endObj = {}) {

        Array.forEach(element => {
            
            let _match = Match.test(element, Object);

            if(_match === true) {

                endObj = Validator.Empty(element, throwError);

            }else{

                let result = isEmpty(element.toString(), options);
                if(result === true && throwError === true) {
                    throw new UserInputError(`${element} cannot be empty!`);
                }
                endObj[element] = result;
            }

        });

        if(throwError === false) {
            return endObj;
        }

    }

}

export default Validator;