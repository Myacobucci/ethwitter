const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const ethweetContractFactory = await hre.ethers.getContractFactory('EthwitterPortal');
  const ethweetContract = await ethweetContractFactory.deploy();
  await ethweetContract.deployed();

  console.log('Contract deployed to:', ethweetContract.address);
  console.log('Contract deployed by:', owner.address);

  let ethweetCount;
  ethweetCount = await ethweetContract.getTotalEthweets();

  let ethweetTxn = await ethweetContract.ethweet();
  await ethweetTxn.wait();

  ethweetCount = await ethweetContract.getTotalEthweets();

  ethweetTxn = await ethweetContract.connect(randomPerson).ethweet();
  await ethweetTxn.wait();

  ethweetCount = await ethweetContract.getTotalEthweets();

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
