const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const ethweetContractFactory = await hre.ethers.getContractFactory('EthwitterPortal');
  const ethweetContract = await ethweetContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await ethweetContract.deployed();

  console.log('Contract deployed to:', ethweetContract.address);
  console.log('Contract deployed by:', owner.address);

  let contractBalance = await hre.ethers.provider.getBalance(ethweetContract.address);
  console.log('Contract balance:', hre.ethers.utils.formatEther(contractBalance));

  let ethweetCount;
  ethweetCount = await ethweetContract.getTotalEthweets();

  let ethweetTxn = await ethweetContract.ethweet('A ethweet!');
  await ethweetTxn.wait();

  ethweetCount = await ethweetContract.getTotalEthweets();

  ethweetTxn = await ethweetContract.connect(randomPerson).ethweet('Another ethweet!');
  await ethweetTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(ethweetContract.address);
  console.log('Contract balance:', hre.ethers.utils.formatEther(contractBalance));

  ethweetCount = await ethweetContract.getTotalEthweets();

  let allEthweets = await ethweetContract.getAllEthweets();
  console.log(allEthweets);

  ethweetAddresses = await ethweetContract.getEthweetAddresses();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
