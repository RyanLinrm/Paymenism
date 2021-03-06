const db = require("../database");

//query for reviewing certain off request.
const select = "SELECT * from offrequest WHERE Request_ID = ($1)";
//query for listing all request
const selectAll = "SELECT * from offrequest";

class Request {
  static retrieve(values, callback) {
    db.query(select, [values], (err, res) => {
      if (err.error) return callback(err);
      callback(res);
    });
  }

  static retrieveAll(callback) {
    db.query(selectAll, (err, res) => {
      if (err.error) return callback(err);
      callback(res);
    });
  }

  static insert(Request_ID, Request_DATE, Emp_ID, Reason, callback) {
    db.query(
      "INSERT INTO offrequest (Request_ID, Request_DATE, Emp_ID, Reason) VALUES ($1, $2, $3, $4)",
      [Request_ID, Request_DATE, Emp_ID, Reason],
      (err, res) => {
        if (err.error) return callback(err);
        callback(res);
      }
    );
  }
}

module.exports = Request;
