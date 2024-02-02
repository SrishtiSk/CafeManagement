use CafeMangement;

create table user(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(250),
    status varchar(20),
    rule varchar(20),
    UNIQUE(email)
);

ALTER TABLE user RENAME COLUMN rule TO role;

insert into user(name, contactNumber, email, password, status, role)
values('Admin', '9876543210', 'admin@mail.com', 'password', 'true', 'admin');

{
    "name":"",
    "contactNumber":"",
    "email":"",
    "password":"",
    "status":"",
    "role":""
}