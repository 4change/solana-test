import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PdaAccount } from "../target/types/pda_account";
import { PublicKey } from "@solana/web3.js";

describe("pda-account", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.PdaAccount as Program<PdaAccount>;       // 获取程序
  const user = provider.wallet as anchor.Wallet;                            // 获取钱包

  // 根据种子和程序 ID 派生 PDA 地址
  const [PDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("data"), user.publicKey.toBuffer()],
    program.programId
  );

  // 请注意，在此示例中，如果您多次调用 initialize 指令，并使用相同的 user 地址作为种子，则交易会失败。
  // 这是因为在推导出的地址上已经存在一个账户。
  it("Is initialized!", async () => {
    const transactionSignature = await program.methods
      .initialize()             // 调用 initialize 指令
      .accounts({
        user: user.publicKey      // 签名账户
      })
      .rpc();

    console.log("派生 PDA 地址的账户的 PublicKey------------------------------------------", user.publicKey);
    console.log("Transaction Signature:", transactionSignature);
  });

  it("Fetch Account", async () => {
    const pdaAccount = await program.account.dataAccount.fetch(PDA);
    console.log("根据 PDA 地址反查出来的账户的账户信息---------------------" + JSON.stringify(pdaAccount, null, 2));
  });
});