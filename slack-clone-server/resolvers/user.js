import bcrypt from 'bcrypt';
import _ from 'lodash';
const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(x => _.pick(x, ['path', 'message']));
  }
  return [{ path: 'name', message: 'something went wrong' }];
};

export default{
  Query: {
   getUser: (parent, args, {models}) => models.User.findOne({where: {id} })
  },
  Mutation: {
    register: async (parent,{password,...otherArgs},{models}) => {
      try{
        if (password.length < 5 || password.length > 100) {
         return {
           ok: false,
           errors: [
             {
               path: 'password',
               message: 'The password needs to be between 5 and 100 characters long',
             },
           ],
         };
       }
     const hashedPassword = await bcrypt.hash(password, 12);
     const user = await models.User.create({ ...otherArgs, password: hashedPassword });
     return {
       ok: true,
       user,
     };
   } catch (err) {
     return {
       ok: false,
       errors: formatErrors(err, models),
     };
   }
    },
  },
};
