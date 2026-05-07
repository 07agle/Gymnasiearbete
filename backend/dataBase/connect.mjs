import * as mariadb from "mariadb";


// Skapar en connection pool till MariaDB
export const pool = mariadb.createPool({
    host: "mariadb",
    user: "root",
    password: "12345",
    connectionLimit: 5,
    database: "gymnasiearbete",
  });
  
