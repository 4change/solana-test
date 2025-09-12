const { Connection, PublicKey, Keypair, Transaction, TransactionInstruction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { keccak256 } = require('js-sha3');
const fs = require('fs');

(async () => {
    // 配置 —— 请替换下面这些路径/地址
    const RPC = 'http://localhost:8899'; // or your cluster RPC
    const PAYER_KEYPAIR_PATH = '/home/fly/.config/solana/id.json'; // 替成你的 payer 私钥 json 路径
    const PROGRAM_ID = new PublicKey('J5Z3LToitDd9UM2RxJ1GVdRwuYWCEVHnWYEx8q5EEGMs'); // 来自 flipper.sol 的 @program_id
    const recipient = new Keypair();

    const CONTRACT_ACCOUNT = new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111'); // 合约存储账号（部署时创建的账号）

    // 载入 payer
    const payerSecret = JSON.parse(fs.readFileSync(PAYER_KEYPAIR_PATH, 'utf8'));
    const payer = Keypair.fromSecretKey(Uint8Array.from(payerSecret));

    const conn = new Connection(RPC, 'confirmed');

    // --- 1) 发送 flip() 调用 ---
    // Solang / Solidity ABI: 使用 keccak256("flip()") 的前 4 字节作为函数 selector（若你的编译器 ABI 不同请按实际 ABI 编码）
    const selectorHex = keccak256('flip()').slice(0, 8); // 前 4 字节（8 hex chars）
    const selectorBuf = Buffer.from(selectorHex, 'hex');

    // 根据合约是否需要其他账户，调整 keys 列表（这里假设需要写入合约 state account 并由 payer 签名）
    const keys = [
        { pubkey: CONTRACT_ACCOUNT, isSigner: false, isWritable: true },
        { pubkey: payer.publicKey, isSigner: true, isWritable: false },
    ];

    const ix = new TransactionInstruction({
        keys,
        programId: PROGRAM_ID,
        data: selectorBuf, // flip() 没有参数，仅用 selector
    });

    const tx = new Transaction().add(ix);

    console.log('----------------------------------Sending flip() transaction...');
    const sig = await sendAndConfirmTransaction(conn, tx, [payer], { commitment: 'confirmed' });
    console.log('Transaction confirmed:', sig);

    // --- 2) 读取合约的存储（示例，假设 bool 存在 account.data[0]） ---
    const accountInfo = await conn.getAccountInfo(CONTRACT_ACCOUNT, 'confirmed');
    if (!accountInfo) {
        console.error('Contract storage account not found.');
        return;
    }

    const data = accountInfo.data;
    // 如果合约把 bool 存为第一个字节（0x00 或 0x01），则：
    const currentBool = data.length > 0 && data[0] !== 0 ? true : false;
    console.log('Contract stored bool (decoded from account.data[0]):', currentBool);
})();