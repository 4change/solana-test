# anchor_pda_crud
## 参考文档
[创建确定性账户](https://solana.com/zh/docs/intro/quick-start/program-derived-address)

## 运行
```shell
cd anchor_pda_test

nvm use v22.19.0

# 安装依赖
yarn

# 编译
anchor build

# 部署
anchor deploy

# 测试
# 建议使用 anchor test 命令进行测试，如果使用 anchor test --skip-local-validator 命令可能会因为已存在派生地址而报错
anchor test                             # 启动 Anchor 自带的 Solana 网络验证器，并运行测试
anchor test --skip-local-validator      # 不启动 Anchor 自带的 Solana 网络验证器，直接运行测试      
```