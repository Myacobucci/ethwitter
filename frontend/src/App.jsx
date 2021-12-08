import React, { useEffect, useState } from "react";
import './App.css';
import { ethers } from "ethers";
import abi from "./utils/EthwitterPortal.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [ethweetCount, setEthweetCount] = useState(0);
  const [allEthweets, setAllEthweets] = useState([]);
  const [ethweetText, setEthweetText] = useState("");

  const contractAddress = "0x1c859c9e6Da7daf3FF1d7B7d55cAe881f305c4eB";
  const contractABI = abi.abi;

  const getAllEthweets = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const ethweetPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const ethweets = await ethweetPortalContract.getAllEthweets();

        const ethweetsCleaned = ethweets.map(ethweet => {
          return {
            address: ethweets.sender,
            timestamp: new Date(ethweets.timestamp * 1000),
            message: ethweets.message,
          };
        });

        setAllEthweets(ethweetsCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkEthweetCount = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const ethweetPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await ethweetPortalContract.getTotalEthweets();
        console.log("Retrieved total ethweet count...", count.toNumber());
        if (count !== ethweetCount) {
          setEthweetCount(count);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const ethweet = async (ethweetText) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const ethweetPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await ethweetPortalContract.getTotalEthweets();
        console.log("Retrieved total ethweet count...", count.toNumber());

        const ethweetTxn = await ethweetPortalContract.ethweet(ethweetText, { gasLimit: 300000 });
        console.log("Mining...", ethweetTxn.hash);

        await ethweetTxn.wait();
        console.log("Mined -- ", ethweetTxn.hash);
        setEthweetText("");

        count = await ethweetPortalContract.getTotalEthweets();
        console.log("Retrieved total ethweet count...", count.toNumber());

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}

  const handleTextChange = (event) => {
    setEthweetText(event.target.value);
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  useEffect(() => {
    checkEthweetCount();
  }, []);
  useEffect(() => {
    getAllEthweets();
  }, []);
  useEffect(() => {
    let ethweetPortalContract;

    const onNewEthweet = (from, timestamp, message) => {
      console.log('NewEthweet', from, timestamp, message);
      setAllEthweets(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      ethweetPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      ethweetPortalContract.on('NewEthweet', onNewEthweet);
    }

    return () => {
      if (ethweetPortalContract) {
        ethweetPortalContract.off('NewEthweet', onNewEthweet);
      }
    };
  }, []);

  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 ETHwitter!
        </div>

        <div className="bio">
          Hey there. Welcome to ETHwitter. Please, connect your Ethereum wallet and send a tweet!
        </div>
        <div className="bio">
          Total number of ETHweets: {parseInt(ethweetCount)}
        </div>

         <textarea className="textArea" value={ethweetText} onChange={handleTextChange} />

        <button className="tweetButton" onClick={() => ethweet(ethweetText)}>
          ETHweet
        </button>
        
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="tweetButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allEthweets.map((ethweet, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {ethweet.address}</div>
              <div>Time: {ethweet.timestamp.toString()}</div>
              <div>Message: {ethweet.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App