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

CREATE TABLE Category(
    id INT NOT NULL AUTO_INCREMENT,
    name varchar(225) NOT NULL,
    primary key(id)
);

CREATE TABLE Product(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(225) NOT NULL,
    categoryId INT NOT NULL,
    description VARCHAR(255),
    price INT,
    status VARCHAR(20),
    PRIMARY KEY(id)
);

CREATE TABLE Bill(
    billNo INT NOT NULL AUTO_INCREMENT,
    uuid VARCHAR(200) NOT NULL,
    name VARCHAR(225) NOT NULL,
    email VARCHAR(225) NOT NULL,
    contactNumber VARCHAR(20) NOT NULL,
    paymentMethod VARCHAR(50) NOT NULL,
    total INT NOT NULL,
    productDetials JSON DEFAULT NULl,
    createdBy VARCHAR(255) NOT NULL,
    PRIMARY KEY(billNo)
);
ALTER TABLE Bill RENAME COLUMN productDetials TO productDetails;

/* product details for billing report comming from UI.
the following one is temperary check Api
productDetails: "[{\"id\":1, \"name\":\"Product Deatils\", \"price\":99, \"total:99\", \"category\":\"Coffee\", \"quantity\":\"1\"}]" 

productDetails: "[{\"id\":5, \"name\":\"Deatils\", \"price\":199, \"total\":199, \"category\":\"bun\", \"quantity\":\"1\"},
{\"id\":6, \"name\":\"MudCake\", \"price\":249, \"total\":498, \"category\":\"cake\", \"quantity\":\"2\"}]" 


*/