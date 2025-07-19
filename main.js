const contractAddress = "0x9B0Abb27524B2857322C2D3682c5bc819eDB6d73";
const abi = [  // ย่อไว้บางส่วนเพื่อความกระชับ
  {
    "inputs":[{"internalType":"address","name":"referrer","type":"address"}],
    "name":"registerReferrer","outputs":[],"stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[{"internalType":"address","name":"buyer","type":"address"},{"internalType":"uint256","name":"totalAmount","type":"uint256"}],
    "name":"recordPurchase","outputs":[],"stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[],"name":"distributor","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"
  }
];

let web3;
let userAccount;
let contract;

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      userAccount = accounts[0];
      document.getElementById("userAddress").innerText = userAccount;
      contract = new web3.eth.Contract(abi, contractAddress);
      document.getElementById("app").style.display = "block";
      generateReferralLink();
    } catch (e) {
      alert("การเชื่อมต่อ Wallet ล้มเหลว");
    }
  } else {
    alert("กรุณาติดตั้ง MetaMask หรือ Bitget Wallet");
  }
}

function generateReferralLink() {
  const base = window.location.origin + window.location.pathname;
  const link = `${base}?ref=${userAccount}`;
  document.getElementById("referralLink").innerText = link;
  document.getElementById("copyLink").onclick = () => {
    navigator.clipboard.writeText(link);
    alert("คัดลอกลิงก์แนะนำแล้ว!");
  };
}

async function registerReferrer() {
  const urlParams = new URLSearchParams(window.location.search);
  const referrer = urlParams.get('ref');
  if (!referrer || referrer.toLowerCase() === userAccount.toLowerCase()) {
    alert("Referrer ไม่ถูกต้องหรือเป็น address ตัวเอง");
    return;
  }
  try {
    await contract.methods.registerReferrer(referrer).send({ from: userAccount });
    alert("ลงทะเบียน Referrer สำเร็จ");
  } catch (e) {
    alert("ไม่สามารถลงทะเบียน Referrer ได้");
  }
}

async function recordPurchase() {
  try {
    await contract.methods.recordPurchase(userAccount, 100 * 10 ** 18).send({ from: userAccount });
    alert("บันทึกการซื้อสำเร็จ");
  } catch (e) {
    alert("ไม่สามารถบันทึกการซื้อได้");
  }
}

document.getElementById("connectWallet").onclick = connectWallet;
document.getElementById("registerReferrer").onclick = registerReferrer;
document.getElementById("recordPurchase").onclick = recordPurchase;
