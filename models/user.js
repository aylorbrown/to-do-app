//Create User:
const db = require('./connection');


async function createUser(firstName, lastName, organization, email, phoneNumber, password) {
    const result = await db.one(`
insert into users
    (first_name, last_name, organization_name, email, phone_number, password)
values
    ($1, $2, $3, $4, $5, $6)    
returning user_id
     `, [firstName, lastName, organization, email, phoneNumber, password]);

     return result.user_id;
}


module.exports = {
    createUser,
}
