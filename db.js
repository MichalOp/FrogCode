var pg = require("pg");

async function selectUser(username, verbose = false) {
  var pool = new pg.Pool({
    host: "localhost",
    database: "postgres",
    user: "postgres",
    password: "1234",
  });
  try {
    const queryOpts = {
      text: "select * from users where username = $1 limit 1;",
      values: [username],
    };
    var result = await pool.query(queryOpts);
    var found = false;
    var user;
    result.rows.forEach((r) => {
      found = true;
      user = r;
      console.log(`${JSON.stringify(r, null, 4)}`);
    });
  } catch (err) {
    if (verbose) console.log(err);
  }
  if (found) return user;
  else return false;
}

async function authenticateUser(username, pwdhash, verbose = false) {
  var user = await selectUser(username, verbose);
  if (user && user.pwdhash == pwdhash) {
    console.log(`${username} pwd correct`);
    return true;
  }
  console.log(`${username} pwd incorrect`);
  return false;
}

async function writeUser(displayname, username, pwdhash, verbose = false) {
  var pool = new pg.Pool({
    host: "localhost",
    database: "postgres",
    user: "postgres",
    password: "1234",
  });
  try {
    const queryOpts = {
      text:
        "INSERT INTO users (displayname,username,pwdhash) values ($1,$2,$3) RETURNING id;",
      values: [displayname, username, pwdhash],
    };
    var result = await pool.query(queryOpts);
    result.rows.forEach((r) => {
      console.log(`New user ${r.username} of id: ${r.id}`);
    });
  } catch (err) {
    if (verbose) console.log(err);
  }
}

async function createUser(displayname, username, pwdhash, verbose = false) {
  var does_exist = await selectUser(username, verbose);
  if (!does_exist) {
    await writeUser(displayname, username, pwdhash, (verbose = true));
    return true;
  }
  return false;
}

async function changePwd(username, pwdhash) {
  var pool = new pg.Pool({
    host: "localhost",
    database: "postgres",
    user: "postgres",
    password: "1234",
  });
  try {
    const queryOpts = {
      text: "UPDATE users SET pwdhash = $1 WHERE users.username = $2;",
      values: [pwdhash, username],
    };
    await pool.query(queryOpts);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  selectUser,
  authenticateUser,
  writeUser,
  createUser,
  changePwd,
};

//authenticateUser("trump", "63a9f0ea7bb98050796b649e85481845", (verbose = true));
//selectUser("halo", (verbose = true));
