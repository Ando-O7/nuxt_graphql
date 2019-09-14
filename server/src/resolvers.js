import { users } from './db';

const resolvers = {
  Query: {
    // one search
    user: (parent, { id }, context, info) => users.find(user => user.id == id),
    // multiple search
    users: (parent, args, context, info) => users
  },
};
