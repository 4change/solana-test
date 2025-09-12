import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("http://localhost:8899", "confirmed");

const address = new PublicKey("5neqCeezGCsnmEwN2FBMRD3BdvYg2N8MzJqhm8xEgBat");
const accountInfo = await connection.getAccountInfo(address);

console.log(
    JSON.stringify(
        accountInfo
        ,
        (key, value) => {
            if (key === "data" && value && value.length > 1) {
                return [
                    value[0],
                    "...truncated, total bytes: " + value.length + "...",
                    value[value.length - 1]
                ];
            }
            return value;
        },
        2
    )
);