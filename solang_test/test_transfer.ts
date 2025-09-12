import {
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
    Keypair,
    Connection,
    PublicKey
} from "@solana/web3.js";

const connection = new Connection("http://localhost:8899", "confirmed");

const sender = new Keypair();
const receiver = new Keypair();

const signature = await connection.requestAirdrop(
    sender.publicKey,
    LAMPORTS_PER_SOL
);
await connection.confirmTransaction(signature, "confirmed");

const PROGRAM_ID = new PublicKey('J5Z3LToitDd9UM2RxJ1GVdRwuYWCEVHnWYEx8q5EEGMs');

const transferInstruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: receiver.publicKey,
    lamports: 0.01 * LAMPORTS_PER_SOL,
    programId: PROGRAM_ID
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