CREATE TYPE sys AS ENUM ('user', 'sys');

CREATE TABLE users (
	ID serial primary key,
    Displayname varchar(100), 
    Username varchar(100),
    Pwdhash varchar(100),
    Sys sys
);

INSERT INTO users(Displayname,Username,Pwdhash,Sys) VALUES ('Orange','trump','63a9f0ea7bb98050796b649e85481845','sys');

INSERT INTO users(Displayname,Username,Pwdhash,Sys) VALUES ('Come on man','biden','63a9f0ea7bb98050796b649e85481845','sys');

SELECT * FROM users;