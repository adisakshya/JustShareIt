-- CREATE DB
CREATE DATABASE JustShareIt;
use JustShareIt;

-- CREATE ADMIN TABLE
CREATE TABLE admin (
  name VARCHAR(30),
  email VARCHAR(30),
  password VARCHAR(255)
);

-- INSERT DEFAULT ADMIN
INSERT INTO admin (name, email, password) VALUES ("JustShareItAdmin", NULL, "15493336")