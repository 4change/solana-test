import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { AnchorTypescriptCounter } from "../target/types/anchor_typescript_counter";

describe("PDA CRUD Test", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorTypescriptCounter as Program<AnchorTypescriptCounter>;     // 获取程序

  it("Create Message Account", async () => {
    const connection = provider.connection;
    // 为支付者和计数器账户生成新的 Keypair
    const payer = Keypair.generate();
    const counter = Keypair.generate();

    // 向支付者的账户空投 SOL，以支付交易费用
    const airdropTransactionSignature = await connection.requestAirdrop(
      payer.publicKey,
      LAMPORTS_PER_SOL,
    );
    await connection.confirmTransaction(airdropTransactionSignature);

    // 构建初始化指令
    const initializeInstruction = await program.methods
      .initialize()
      .accounts({
        payer: payer.publicKey,
        counter: counter.publicKey,
      })
      .instruction();

    // 构建增加计数指令
    const incrementInstruction = await program.methods
      .increment()
      .accounts({
        counter: counter.publicKey,
      })
      .instruction();

    // 将两个指令添加到一个交易中
    const transaction = new Transaction().add(
      initializeInstruction,
      incrementInstruction,
    );

    // 发送交易
    const transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payer, counter],
    );
    console.log("交易签名", transactionSignature);

    // 获取计数器账户
    const counterAccount = await program.account.counter.fetch(counter.publicKey);
    console.log("计数：", counterAccount.count);
  });
});