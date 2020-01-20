const db = require('./connection');


async function createEvent(eventName, eventLocation, eventDate, eventTime, eventDescription){
    const result = await db.result(`
    insert into events
        (event_name, event_location, event_date, event_time, event_description)
    values ($1, $2, $3, $4, $5)
    `, [eventName, eventLocation, eventDate, eventTime, eventDescription]);
}

async function listEvents(){
    const result = await db.any(`
    select * from events`);
    console.log(result);
    return 
    
    result;
}



async function saveEvent(userID, eventID){
    const result = await db.result(`
    insert into userID_eventID
        (userID, event_id)
    values ($1, $2)
    `, [userID, eventID);
}


module.exports= {
    listEvents,
    createEvent,
    saveEvent
}