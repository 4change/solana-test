import {
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
    Keypair,
    Connection
} from "@solana/web3.js";

// Create a connection to cluster
const connection = new Connection("http://localhost:8899", "confirmed");

// Generate sender and recipient keypairs
const sender = Keypair.generate();
const recipient = new Keypair();

// Fund sender with airdrop
const airdropSignature = await connection.requestAirdrop(
    sender.publicKey,
    LAMPORTS_PER_SOL
);
await connection.confirmTransaction(airdropSignature, "confirmed");

// Check balance before transfer
const preBalance1 = await connection.getBalance(sender.publicKey);
const preBalance2 = await connection.getBalance(recipient.publicKey);

// Define the amount to transfer
const transferAmount = 0.01; // 0.01 SOL

// Create a transfer instruction for transferring SOL from sender to recipient
const transferInstruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: recipient.publicKey,
    lamports: transferAmount * LAMPORTS_PER_SOL // Convert transferAmount to lamports
});

// Add the transfer instruction to a new transaction
const transaction = new Transaction().add(transferInstruction);

// Send the transaction to the network
const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [sender] // signer
);

// Check balance after transfer
const postBalance1 = await connection.getBalance(sender.publicKey);
const postBalance2 = await connection.getBalance(recipient.publicKey);

console.log("Sender prebalance:", preBalance1 / LAMPORTS_PER_SOL);
console.log("Recipient prebalance:", preBalance2 / LAMPORTS_PER_SOL);
console.log("Sender postbalance:", postBalance1 / LAMPORTS_PER_SOL);
console.log("Recipient postbalance:", postBalance2 / LAMPORTS_PER_SOL);
console.log("Transaction Signature:", transactionSignature);