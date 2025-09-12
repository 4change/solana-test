import { Connection, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction, Keypair } from '@solana/web3.js';

// **************************** 配置信息 ****************************
// 连接到本地Solana节点（确保本地验证器正在运行，例如 solana-test-validator）
const connection = new Connection('http://localhost:8899', 'confirmed');

// 支付交易费用和签名的钱包（payer）
// !!! 注意：在实际应用中，务必安全地处理私钥，不要硬编码在代码中 !!!
// 这里假设payer的私钥字节数组来自环境变量或安全配置文件
const payerSecretKey = Uint8Array.from([196, 216, 27, 162, 97, 242, 230, 64, 137, 100, 78, 8, 194, 158, 93, 237, 248, 146, 119, 32, 80, 104, 13, 204, 148, 202, 185, 76, 85, 22, 91, 212, 139, 194, 196, 238, 85, 115, 52, 125, 131, 176, 60, 25, 123, 139, 34, 193, 45, 214, 80, 209, 50, 224, 192, 152, 58, 6, 38, 68, 117, 196, 158, 124]);
const payer = Keypair.fromSecretKey(payerSecretKey);

// 替换为你的智能合约（程序）的实际 Program ID
const PROGRAM_ID = new PublicKey('J5Z3LToitDd9UM2RxJ1GVdRwuYWCEVHnWYEx8q5EEGMs'); // 替换为你的合约Program ID

// **************************** 调用合约的某个方法（例如 flip） ****************************
async function callContractFlip() {
    try {
        console.log(`调用合约的 flip 方法...`);

        // Generate sender and recipient keypairs
        const sender = Keypair.generate();
        const recipient = new Keypair();

        // 1. 构建指令 (Instruction)
        // 这是与智能合约交互的核心，需要根据合约的具体要求来构建
        const instruction = new TransactionInstruction({
            keys: [ // 该指令所需的所有账户列表及其权限
                // 根据你的合约方法要求，这里需要列出所有操作涉及到的账户
                // 例如：{ pubkey: someAccountPubkey, isSigner: boolean, isWritable: boolean },
                // 如果你的 flip 方法需要操作或传入特定账户，请在此添加。
                // 如果不需要（例如只是简单的状态翻转且状态存储在程序本身），可能为空或只需部分账户。
                // 请务必参考你合约程序的实际接口。
                // 假设我们的 flip 操作需要一个可写的账户来存储状态，且该账户由程序派生（PDA），并且不需要签名。
                // 注意：这只是一个示例，你的实际账户结构可能完全不同！
                // {
                //   pubkey: derivedStatePubkey,
                //   isSigner: false,
                //   isWritable: true // 因为需要翻转状态，所以可写
                // }
                
                {
                    pubkey: sender.publicKey,
                    isSigner: true,
                    isWritable: true // because sender will pay for the transaction
                }
                ,
                {
                    pubkey: recipient.publicKey,
                    isSigner: true,
                    isWritable: true // because sender will pay for the transaction
                }
            
            ],
            programId: PROGRAM_ID, // 程序地址
            data: Buffer.alloc(0), // 指令数据（传递给合约方法的参数需要序列化后放在这里）
            // 如果你的 flip 方法需要接收参数（例如一个标识符），需要在此 Buffer 中按合约要求的格式进行序列化。
            // 例如：Buffer.from([0x01]) 可能代表调用 flip 操作。
        });

        // 2. 创建交易并添加指令
        const transaction = new Transaction().add(instruction);

        // 3. 发送并确认交易
        // 这将使用支付者（payer）的密钥对进行签名并支付费用
        console.log('发送交易...');
        const transactionSignature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [payer] // Signers（签名者列表，这里payer是签名者和费用支付者）
        );

        console.log('交易成功！');
        console.log('交易签名（Signature）:', transactionSignature);
        // 你可以在 Solana Explorer 上查看此交易（使用本地集群URL）
        console.log(`交易详情: https://explorer.solana.com/tx/${transactionSignature}?cluster=custom&customUrl=http://localhost:8899`);

    } catch (error) {
        console.error('调用合约失败:', error);
    }
}

// **************************** 调用一个只读方法（例如 get） ****************************
// 注意：只读方法通常不消耗Gas，也不上链，所以通常通过模拟交易或直接查询账户状态来实现，而不是发送正式交易。
// 这里假设 `get` 方法返回的状态存储在一个特定的账户中，我们通过查询该账户的数据来获取值。
async function callContractGet() {
    try {
        console.log(`查询合约的 get 方法...`);


        const programId = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

        // const account = await connection.getAccountInfo(programId);
        // console.log(
        //     JSON.stringify(
        //         account,
        //         (key, value) => {
        //             if (key === "data" && value && value.length > 1) {
        //                 return [
        //                     value[0],
        //                     "...truncated, total bytes: " + value.length + "...",
        //                     value[value.length - 1]
        //                 ];
        //             }
        //             return value;
        //         },
        //         2
        //     )
        // );

        // 假设存储状态的账户地址是由程序派生（PDA）或其他方式已知的
        // 你需要替换为实际存储状态的账户地址
        const sender = Keypair.generate();
        const stateAccountPubkey = programId; // 替换为存储状态的账户公钥

        // 获取账户信息
        const accountInfo = await connection.getAccountInfo(stateAccountPubkey);

        if (accountInfo === null) {
            throw new Error('未找到指定的状态账户');
        }

        console.log("0-----------------------------------" +
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

        // 解析账户数据 (data)
        // 账户数据是一个Uint8Array，你需要根据合约中数据存储的布局来解析
        // 例如，假设你的合约中 `value` 是 bool，在 Rust 中可能只占 1 字节
        const storedValue = accountInfo.data[0] !== 0; // 假设非0即为true
        console.log(`当前存储的 value 值为---------------------: ${storedValue}`);

    } catch (error) {
        console.error('查询合约状态失败:', error);
    }
}

// 执行函数
(async () => {
      await callContractFlip(); // 调用 flip 方法（修改状态）
      await callContractGet();  // 调用 get 方法（查询状态）
})();