let web3;
let contract;
let userAddress;

const abi = [ // ย่อบางส่วนเพื่อความสั้น
  {
    "inputs": [{"internalType": "address","name": "referrer","type": "address"}],
    "name": "registerReferrer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "recordPurchase",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardToken",
    "outputs": [{"internalType": "address","name": "","type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
];

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      userAddress = accounts[0];
      await switchToBSC();

      contract = new web3.eth.Contract(abi, contractAddress);
      document.getElementById("walletInfo").style.display = "block";

      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref');
      document.getElementById("referrerAddress").innerText = ref || "ไม่มี";

    } catch (err) {
      alert("❌ ไม่สามารถเชื่อมต่อ Wallet ได้");
    }
  } else {
    alert("❌ ไม่พบ MetaMask หรือ Bitget Wallet");
  }
}

async function switchToBSC() {
  const chainId = '0x38'; // BSC Mainnet
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }]
    });
  } catch (switchError) {
    alert("⚠️ กรุณาเปลี่ยนเป็น BNB Smart Chain (Mainnet)");
  }
}

function copyRef() {
  const url = `${window.location.origin}${window.location.pathname}?ref=${userAddress}`;
  navigator.clipboard.writeText(url);
  alert("📋 คัดลอกลิงก์เรียบร้อย");
}

async function registerReferrer() {
  const ref = new URLSearchParams(window.location.search).get('ref');
  if (!ref || ref.toLowerCase() === userAddress.toLowerCase()) {
    alert("❌ Referrer ไม่ถูกต้องหรือเป็น address ตัวเอง");
    return;
  }
  try {
    await contract.methods.registerReferrer(ref).send({ from: userAddress });
    alert("✅ ลงทะเบียน Referrer เรียบร้อย");
  } catch (err) {
    alert("❌ ไม่สามารถลงทะเบียน Referrer ได้");
  }
}

async function recordPurchase() {
  try {
    await contract.methods.recordPurchase().send({ from: userAddress });
    alert("✅ บันทึกการซื้อสำเร็จ (ทดสอบ)");
  } catch (err) {
    alert("❌ ไม่สามารถบันทึกการซื้อได้");
  }
}

document.getElementById("connectButton").addEventListener("click", connectWallet);
