import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("http://localhost:8899", "confirmed");

const address = new PublicKey("J5Z3LToitDd9UM2RxJ1GVdRwuYWCEVHnWYEx8q5EEGMs");
const accountInfo = await connection.getAccountInfo(address);

console.log(
    JSON.stringify(
        accountInfo,
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