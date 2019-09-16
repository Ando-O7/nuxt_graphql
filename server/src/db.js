export let users = [
    {
        id: 1,
        name: 'gatsby taro',
        email: 'gatsby.taro@example.com',
        age: 32
    },
    {
        id: 2,
        name: 'gridsome taro',
        email: 'gridsom.taro@example.com',
        age: 55
    },
];

// Numbering ID(numbering from 3)
let idSequence = 2;
// Numbering process
export const generateId = () => ++idSequence;
