# anchor_event_cpi_test
## 参考文档
[发出事件：emit_cpi](https://learnblockchain.cn/docs/anchor/features/events#emit_cpi)

## 运行
```shell
cd anchor_event_cpi_test

nvm use v22.19.0

# 安装依赖
yarn

# 编译
anchor build

# 获取编译后的程序ID，并将 lib.rs 文件中的程序 ID 替换为该 ID
solana program show ./target/deploy/anchor_event_cpi_test-keypair.json

# 部署
anchor deploy

# 测试
# 建议使用 anchor test 命令进行测试，如果使用 anchor test --skip-local-validator 命令可能会因为已存在派生地址而报错
anchor test                             # 启动 Anchor 自带的 Solana 网络验证器，并运行测试
anchor test --skip-local-validator      # 不启动 Anchor 自带的 Solana 网络验证器，直接运行测试      
```