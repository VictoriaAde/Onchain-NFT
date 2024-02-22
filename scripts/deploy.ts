// import { ethers } from "ethers";
import { Log } from "ethers/lib.commonjs/ethers";
import { ethers } from "hardhat";

async function main() {
  // const signers = await ethers.getSigners();
  const [owner, otherAccount] = await ethers.getSigners();

  const onchain = await ethers.deployContract(
    "VictoriaOnChainNFT",
    [owner],
    {}
  );

  await onchain.waitForDeployment();

  console.log(`VictoriaOnChainNFT deployed to ${onchain.target}`);
  //0xecD70e99631214cf503D61668da655A005728Eb8

  const svgImage = `<svg width="110" height="67" viewBox="0 0 110 67" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="12.6575" height="3.2731" transform="matrix(-1 0 0 1 90.9005 9.02258)" fill="#64FFDA"/>
  <rect width="9.16057" height="3.27355" transform="matrix(0 -1 -1 0 90.9005 21.4563)" fill="#64FFDA"/>
  <rect x="19.1896" y="57.0999" width="12.6577" height="3.2736" transform="rotate(-90 19.1896 57.0999)" fill="#64FFDA"/>
  <rect x="31.6252" y="57.0999" width="9.16197" height="3.2736" transform="rotate(180 31.6252 57.0999)" fill="#64FFDA"/>
  <rect x="58.1086" y="19.1614" width="6.0371" height="35.6234" transform="rotate(-24.2475 58.1086 19.1614)" fill="#64FFDA"/>
  <rect x="51.8314" y="32.9719" width="15.9097" height="5.8666" fill="#64FFDA"/>
  <rect x="43.1526" y="46.1509" width="8.84357" height="4.68952" fill="#64FFDA"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M56.587 16.6821L45.5765 48.6187L51.8196 50.7711L63.5721 16.6821H56.587ZM64.8409 13.0019L64.8409 13.0018L64.8409 13.0018V13.0019Z" fill="#64FFDA"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M31.6252 16.6821L43.0177 50.8404L49.2821 48.7511L38.5864 16.6821H31.6252Z" fill="#64FFDA"/>
  </svg>`;

  // Call the mint function from our contract
  const txn = await onchain.mint(svgImage);
  const txnReceipt = await txn.wait();

  // // Get the token id of the minted NFT (using our event)
  // const event = txnReceipt.events?.find(
  //   (event: { event: string }) => event.event === "Minted"
  // );
  // const tokenId = event?.args["tokenId"];

  // Get the logs from the transaction receipt
  const logs = (txnReceipt as any).logs as Log[];

  // Get the token id of the minted NFT (using the event topics)
  const eventTopic = logs[0].topics[1];
  const tokenId = eventTopic ? parseInt(eventTopic.slice(32), 16) : null;

  console.log(
    "🎨 Your minted NFT:",
    `https://testnets.opensea.io/assets/${onchain.target}/${tokenId}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
