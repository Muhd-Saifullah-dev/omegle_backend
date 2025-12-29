import dotenv from "dotenv"
import path = require("node:path")

dotenv.config({path:path.resolve(__dirname,"../../.env")})


const PORT=Number(process.env.PORT) || 9001

export{
    PORT
}