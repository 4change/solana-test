# anchor_cpi_test
## 参考文档
[跨程序调用](https://solana.com/zh/docs/core/cpi#%E8%B7%A8%E7%A8%8B%E5%BA%8F%E8%B0%83%E7%94%A8)

## 运行
```shell
cd anchor_cpi_test

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