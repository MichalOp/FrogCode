CREATE TABLE users (
	ID serial primary key,
    Displayname varchar(100), 
    Username varchar(100),
    Pwdhash varchar(100)
);

INSERT INTO users(Displayname,Username,Pwdhash) VALUES ('Orange','trump','63a9f0ea7bb98050796b649e85481845');

INSERT INTO users(Displayname,Username,Pwdhash) VALUES ('Come on man','biden','63a9f0ea7bb98050796b649e85481845');

SELECT * FROM users;