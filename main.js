let userAddress;
let referrer;
let web3;
let contract;

const CONTRACT_ADDRESS = "0x9B0Abb27524B2857322C2D3682c5bc819eDB6d73";
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_tokenAddress", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "distributor",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "referrer", "type": "address" }],
    "name": "registerReferrer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "buyer", "type": "address" },
      { "internalType": "uint256", "name": "totalAmount", "type": "uint256" }
    ],
    "name": "recordPurchase",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "referrers",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    userAddress = accounts[0];

    contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    const refUrl = `${window.location.origin}${window.location.pathname}?ref=${userAddress}`;
    document.getElementById("refLink").value = refUrl;
    document.getElementById("refBox").style.display = "block";

    const params = new URLSearchParams(window.location.search);
    referrer = params.get("ref");

    if (referrer && referrer.toLowerCase() !== userAddress.toLowerCase()) {
      const alreadySet = await contract.methods.referrers(userAddress).call();
      if (alreadySet === "0x0000000000000000000000000000000000000000") {
        try {
          await contract.methods.registerReferrer(referrer).send({ from: userAddress });
          alert("✅ ผูก referrer สำเร็จ!");
        } catch (err) {
          console.error("Register referrer failed:", err);
        }
      }
    }
  } else {
    alert("⚠️ กรุณาติดตั้ง MetaMask หรือ Bitget Wallet ก่อนใช้งาน");
  }
}

function copyLink() {
  const refInput = document.getElementById("refLink");
  refInput.select();
  refInput.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(refInput.value);
  alert("✅ คัดลอกลิงก์แล้ว!");
}

document.getElementById("connectBtn").addEventListener("click", connectWallet);