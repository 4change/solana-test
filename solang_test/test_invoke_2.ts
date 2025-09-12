import {
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
    Keypair,
    Connection
} from "@solana/web3.js";

const connection = new Connection("http://localhost:8899", "confirmed");

const sender = new Keypair();
const receiver = new Keypair();

const signature = await connection.requestAirdrop(
    sender.publicKey,
    LAMPORTS_PER_SOL
);
await connection.confirmTransaction(signature, "confirmed");

const transferInstruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: receiver.publicKey,
    lamports: 0.01 * LAMPORTS_PER_SOL
});

const transaction = new Transaction().add(transferInstruction);

const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [sender]
);

console.log("Transaction Signature:", `${transactionSignature}`);

const senderBalance = await connection.getBalance(sender.publicKey);
const receiverBalance = await connection.getBalance(receiver.publicKey);

console.log("Sender Balance:", `${senderBalance}`);
console.log("Receiver Balance:", `${receiverBalance}`);