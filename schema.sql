create TABLE users (
    user_id serial PRIMARY key,
    first_name text,
    last_name text,
    organization_name text,
    email text,
    phone_number VARCHAR(12),
    user_name text unique not null,
    password text   
);

create TABLE events (
    event_id serial PRIMARY key,
    event_name text,
    event_location text,
    event_date date,
    event_time time,
    event_description text 
);

create TABLE userID_eventID (
    userID_eventID serial PRIMARY key,
    user_id INTEGER REFERENCES users (user_id),
    event_id INTEGER REFERENCES events (event_id)
);

create TABLE tasks (
    task_id serial PRIMARY key,
    event_id INTEGER REFERENCES events(event_id),
    user_id INTEGER REFERENCES users(user_id),
    task text
);

