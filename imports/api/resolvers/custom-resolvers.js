/* Custom scalars type resolver
 * Supporting for the GrapQL custom scalar type needs
 */

import { GraphQLScalarType, Kind } from 'graphql'
import isNumeric from 'validator/lib/isNumeric'
import isFloat from 'validator/lib/isFloat'
import { UserInputError } from 'apollo-server-express'

const errMsg = 'Value must be either a String, an Int or a Float!';
export const CustomScalar = {
    
    StringIntFloat: new GraphQLScalarType({
        name: 'StringIntFloat',
        description: "A String or an Int or Float Scalar Type",

        serialize(value) {
            if(typeof value !== 'string') {
                let result = value.toString();
                if(isNumeric(result) || isFloat(result)) {
                    return value;
                }
                throw new UserInputError(errMsg);
            }
            return value;
        },

        parseValue(value) {
            if(typeof value !== 'string') {
                let result = value.toString();
                if(isNumeric(result) || isFloat(result)) {
                    return value;
                }
                throw new UserInputError(errMsg);
            }
            return value;
        },

        parseLiteral(ast) {
    
            // Kinds: http://facebook.github.io/graphql/June2018/#sec-Type-Kinds
            // ast.value is always a string
            switch (ast.kind) {
            case Kind.INT: return parseInt(ast.value, 10);
            case Kind.STRING: return ast.value;
            case Kind.FLOAT: return ast.value;
            default:
                throw new UserInputError(errMsg);
            }
        }
    })
    
  }