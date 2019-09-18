import { users, generateId } from './db';

const resolvers = {
  Query: {
    // one search
    user: (parent, { id }, context, info) => users.find(user => user.id == id),
    // multiple search
    users: (parent, args, context, info) => users
  },
  Mutation: {
    createUser: (parent, { name, email, age }, context, info) => {
      const newUser = { id: generateId(), name, email, age};
      users.push(newUser);
      return newUser;
    },
    updateUser: (parent, { id, name, email, age }, context, info) => {
      const updatedUser = users.find(user => user.id == id);
      updatedUser.name = name;
      updatedUser.email = email;
      updatedUser.age = age;

      pubsub.publish(EVEN.USER_UPDATED, {[EVENT.USER_UPDATED]: updatedUser});
      return updatedUser;
    },
    deleteUser: (parent, {id}, context, info) => {
      const userIndex = users.findIndex(user => user.id == id);
      if (userIndex === -1) throw new Error('User not found');
      const [deletedUser] = users.splice(userIndex, 1);
      return deletedUser;
    }
  },
};

export default resolvers;
