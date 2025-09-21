import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorEventCpiTest } from "../target/types/anchor_event_cpi_test";

describe("event-cpi", () => {
  // 配置客户端使用本地集群。
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.AnchorEventCpiTest as Program<AnchorEventCpiTest>;

  it("发出自定义事件", async () => {
    const message = "Hello, Solana!";
    const transactionSignature = await program.methods.emitEvent(message).rpc();

    // 等待交易确认
    await program.provider.connection.confirmTransaction(
      transactionSignature,
      "confirmed",
    );

    // 获取交易数据

    const transactionData = await program.provider.connection.getTransaction(
      transactionSignature,
      { commitment: "confirmed" },
    );

    // 从 CPI 指令数据中解码事件数据

    const eventIx = transactionData.meta.innerInstructions[0].instructions[0];
    const rawData = anchor.utils.bytes.bs58.decode(eventIx.data);
    const base64Data = anchor.utils.bytes.base64.encode(rawData.subarray(8));
    const event = program.coder.events.decode(base64Data);
    console.log(event);
  });
});