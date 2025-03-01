const path = require("path");
require("dotenv").config({path : path.join(__dirname, '../../.env')});

class Config {
    PORT: string | number;
    DB_URI: string;
    SECRET: string;
    SECRET_ADMIN: string;
    NODE_ENV: string;
    ISSUER: string;
    AUDIENCE: string;
    constructor(){
        this.PORT = process.env.PORT || 3000;
        this.DB_URI = String(process.env.DB_URI);
        this.SECRET = String(process.env.SECRET);
        this.SECRET_ADMIN = String(process.env.SECRET_ADMIN);
        this.NODE_ENV = String(process.env.NODE_ENV);
        this.ISSUER = String(process.env.ISSUER);
        this.AUDIENCE = String(process.env.AUDIENCE);
    }
}

export default new Config();