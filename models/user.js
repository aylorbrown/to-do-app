//Create User:
const db = require('./connection');
const bcrypt = require('bcryptjs')

function createHash(password) {
    console.log('about to create salt')
    const salt =bcrypt.genSaltSync(10);
    console.log('created salt')
    return bcrypt.hashSync(password, salt);
}


async function createUser(firstName, lastName, organization, email, phoneNumber, userName, password) {
    console.log('about to create hash');
    const hash =createHash(password);
    console.log(hash);
    const result = await db.one(`
        insert into users
            (first_name, last_name, organization_name, email, phone_number, user_name, password)
        values
            ($1, $2, $3, $4, $5, $6, $7)    
        returning user_id
     `, [firstName, lastName, organization, email, phoneNumber, userName, hash]);

     return result.user_id;
}


// Retrieve
// async function userLogin(userName, password) {
//     try {
//         const theUser = await db.one(`select * from users where user_name=$1`, [userName]);
//         return bcrypt.compareSync(password, theUser.hash);

//     } catch (err) {
//         return null;
//     }
// }

async function userLogin(username, password) {
    console.log('getting user by id');
    const theUser = await getByUsername(username);
    console.log(theUser);
    return bcrypt.compareSync(password, theUser.password)
    
}

async function getByUsername(username) {
    const theUser = await db.one(`
        select * from users where user_name=$1
    `, [username]);

    return theUser;
}



module.exports = {
    createUser,
    getByUsername,
    userLogin
}
