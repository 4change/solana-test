import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(
    // "https://api.mainnet-beta.solana.com",'\
    "http://localhost:8899",
    "confirmed"
);

// 注意：这里的 programId J5Z3LToitDd9UM2RxJ1GVdRwuYWCEVHnWYEx8q5EEGMs 一定要是一个已经部署在链上的程序的 programId
const programId = new PublicKey("J5Z3LToitDd9UM2RxJ1GVdRwuYWCEVHnWYEx8q5EEGMs");

const accountInfo = await connection.getAccountInfo(programId);
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