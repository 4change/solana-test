import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorEventTest } from "../target/types/anchor_event_test";

describe("anchor_event_test", () => {
  // 配置客户端使用本地集群。
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AnchorEventTest as Program<AnchorEventTest>;

  it("发出自定义事件", async () => {
    // 在发送交易之前设置监听器


    const listenerId = program.addEventListener("customEvent", event => {
      // 使用事件数据执行某些操作
      console.log("事件数据:", event);
    });

    // 事件中发出的消息
    const message = "Hello, Solana!";
    // 发送交易
    await program.methods.emitEvent(message).rpc();

    // 移除监听器
    await program.removeEventListener(listenerId);
  });
});