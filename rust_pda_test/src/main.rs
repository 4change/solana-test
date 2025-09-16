use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;

///////////////// 使用可选字符串种子派生 PDA
// #[tokio::main]
// async fn main() -> anyhow::Result<()> {
//     let program_address = Pubkey::from_str("11111111111111111111111111111111")?;

//     let seeds: &[&[u8]] = &[b"helloWorld"];
//     let (pda, bump) = Pubkey::find_program_address(seeds, &program_address);

//     println!("PDA----------------------------: {}", pda);
//     println!("Bump---------------------------: {}", bump);
//     Ok(())
// }

////////////////// 使用可选地址种子派生 PDA
// #[tokio::main]
// async fn main() -> anyhow::Result<()> {
//     let program_address = Pubkey::from_str("11111111111111111111111111111111")?;

//     let optional_seed_address = Pubkey::from_str("B9Lf9z5BfNPT4d5KMeaBFx8x1G4CULZYR1jA2kmxRDka")?;
//     let seeds: &[&[u8]] = &[optional_seed_address.as_ref()];
//     let (pda, bump) = Pubkey::find_program_address(seeds, &program_address);

//     println!("PDA: {}", pda);
//     println!("Bump: {}", bump);
//     Ok(())
// }


//////////////////// 使用多个可选种子派生 PDA
// #[tokio::main]
// async fn main() -> anyhow::Result<()> {
//     let program_address = Pubkey::from_str("11111111111111111111111111111111")?;

//     let optional_seed_bytes = b"helloWorld";
//     let optional_seed_address = Pubkey::from_str("B9Lf9z5BfNPT4d5KMeaBFx8x1G4CULZYR1jA2kmxRDka")?;
//     let seeds: &[&[u8]] = &[optional_seed_bytes, optional_seed_address.as_ref()];
//     let (pda, bump) = Pubkey::find_program_address(seeds, &program_address);

//     println!("PDA: {}", pda);
//     println!("Bump: {}", bump);
//     Ok(())
// }


///////////////////// 使用所有可能的 bump seed（从 255 到 0）进行 PDA 派生
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let program_id = Pubkey::from_str("11111111111111111111111111111111")?;
    let optional_seed = b"helloWorld";

    // Loop through all bump seeds (255 down to 0)
    for bump in (0..=255).rev() {
        match Pubkey::create_program_address(&[optional_seed.as_ref(), &[bump]], &program_id) {
            Ok(pda) => println!("bump {}: {}", bump, pda),
            Err(err) => println!("bump {}: {}", bump, err),
        }
    }

    Ok(())
}