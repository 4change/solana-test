import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorPdaCrud } from "../target/types/anchor_pda_crud";
import { PublicKey } from "@solana/web3.js";

describe("PDA CRUD Test", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorPdaCrud as Program<AnchorPdaCrud>;     // 获取程序
  const wallet = provider.wallet as anchor.Wallet;                              // 获取钱包

  const [messagePda, messageBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("message"), wallet.publicKey.toBuffer()],
    program.programId
  );

  const [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), wallet.publicKey.toBuffer()],    // vault 为派生 PDA 的种子
    program.programId
  );

  it("Create Message Account", async () => {
    const message = "Hello, World!";
    const transactionSignature = await program.methods
      .create(message)
      .accounts({                   // 为啥这里账户的数据可以不完整？
        messageAccount: messagePda,         // 忽略此处的编译器警告
      })
      .rpc({ commitment: "confirmed" });

    const messageAccount = await program.account.messageAccount.fetch(
      messagePda,
      "confirmed"
    );

    console.log("sign wallet publicKey------------------------------------------" + wallet.publicKey.toBase58());
    console.log("message account------------------------------------" + JSON.stringify(messageAccount, null, 2));
    console.log(
      "Transaction Signature:",
      `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
    );
  });

  it("Update Message Account", async () => {
    const message = "Hello, Solana!";
    const transactionSignature = await program.methods
      .update(message)
      .accounts({         // TODO 为什么这里的账户不完整？
        messageAccount: messagePda,
        vaultAccount: vaultPda,
      })
      .rpc({ commitment: "confirmed" });

    const messageAccount = await program.account.messageAccount.fetch(
      messagePda,
      "confirmed"
    );

    console.log("messageAccount--------------------------------------" + JSON.stringify(messageAccount, null, 2));
    console.log(
      "Transaction Signature:",
      `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
    );
  });

  it("Delete Message Account", async () => {
    const transactionSignature = await program.methods
      .delete()
      .accounts({
        messageAccount: messagePda,
        vaultAccount: vaultPda,
      })
      .rpc({ commitment: "confirmed" });

    const messageAccount = await program.account.messageAccount.fetchNullable(
      messagePda,
      "confirmed"
    );

    console.log("Expect Null-----------------------:", JSON.stringify(messageAccount, null, 2));
    console.log(
      "Transaction Signature:",
      `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
    );
  });
});
