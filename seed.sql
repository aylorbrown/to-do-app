insert into users
    (first_name, last_name, organization_name, email, phone_number)
VALUES 
    ('Travis', 'Franklin', 'DigitalCrafts', 'travis@gmail.com', '229-237-0490'),
    ('Aylor', 'Brown', 'GirlsWhoCode', 'naylor@gmail.com', '123-456-7890');

insert into events
    (event_name, event_location, event_date, event_time)
VALUES
    ('thanksgiving', 'my house', '2020-01-17', '05:00 PM');

insert into userID_eventID 
    (user_id, event_id)
VALUES
    (37, 43);

insert into tasks 
    (event_id, user_id)
Values (43, 37);

