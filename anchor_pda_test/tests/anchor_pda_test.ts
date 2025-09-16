import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PdaAccount } from "../target/types/pda_account";
import { PublicKey } from "@solana/web3.js";

describe("pda-account", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.PdaAccount as Program<PdaAccount>;
  const user = provider.wallet as anchor.Wallet;

  // Derive the PDA address using the seeds specified on the program
  const [PDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("data"), user.publicKey.toBuffer()],
    program.programId
  );

  // 请注意，在此示例中，如果您多次调用 initialize 指令，并使用相同的 user 地址作为种子，则交易会失败。
  // 这是因为在推导出的地址上已经存在一个账户。
  it("Is initialized!", async () => {
    const transactionSignature = await program.methods
      .initialize()
      .accounts({
        user: user.publicKey
      })
      .rpc();

    console.log("Transaction Signature:", transactionSignature);
  });

  it("Fetch Account", async () => {
    const pdaAccount = await program.account.dataAccount.fetch(PDA);
    console.log(JSON.stringify(pdaAccount, null, 2));
  });
});