let web3;
let contract;
let userAccount;

window.addEventListener("load", async () => {
  if (window.bitkeep && window.bitkeep.ethereum) {
    window.ethereum = window.bitkeep.ethereum;
  }

  if (typeof window.ethereum === "undefined") {
    alert("⚠️ กรุณาติดตั้ง MetaMask หรือ Bitget Wallet");
    return;
  }

  web3 = new Web3(window.ethereum);

  // ตรวจสอบ chain
  const chainId = await ethereum.request({ method: 'eth_chainId' });
  if (chainId !== '0x38') {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }],
      });
    } catch (err) {
      alert("❌ กรุณาเชื่อมต่อ BNB Smart Chain (ChainID: 56)");
      return;
    }
  }
});

async function connectWallet() {
  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    userAccount = accounts[0];

    contract = new web3.eth.Contract(contractABI, contractAddress);

    document.getElementById("connectButton").innerText = "🟢 Connected: " + userAccount.slice(0, 6) + "..." + userAccount.slice(-4);

    // ตรวจสอบ Referrer
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref");
    if (ref) {
      document.getElementById("referrerDisplay").innerText = `📫 Referrer: ${ref}`;
    } else {
      document.getElementById("referrerDisplay").innerText = "📫 Referrer: ไม่มี";
    }
  } catch (err) {
    console.error(err);
    alert("❌ ไม่สามารถเชื่อมต่อ Wallet ได้");
  }
}

function copyReferralLink() {
  if (!userAccount) {
    alert("⚠️ กรุณาเชื่อมต่อ Wallet ก่อน");
    return;
  }

  const link = `${window.location.origin}${window.location.pathname}?ref=${userAccount}`;
  navigator.clipboard.writeText(link)
    .then(() => alert("📋 คัดลอกลิงก์แนะนำแล้ว"))
    .catch(() => alert("❌ ไม่สามารถคัดลอกลิงก์ได้"));
}

async function registerReferrer() {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");

  if (!ref || ref.toLowerCase() === userAccount.toLowerCase()) {
    alert("❌ ไม่สามารถลงทะเบียน Referrer นี้ได้");
    return;
  }

  try {
    await contract.methods.registerReferrer(ref).send({ from: userAccount });
    alert("✅ ลงทะเบียน Referrer สำเร็จแล้ว");
  } catch (err) {
    console.error(err);
    alert("❌ ลงทะเบียนไม่สำเร็จ");
  }
}

async function recordPurchase() {
  const amount = prompt("💰 ใส่จำนวนที่ซื้อ (เช่น 10 = 10 USDT)");

  if (!amount || isNaN(amount)) {
    alert("❌ จำนวนไม่ถูกต้อง");
    return;
  }

  try {
    const amountWei = web3.utils.toWei(amount, 'ether');
    await contract.methods.recordPurchase(userAccount, amountWei).send({ from: userAccount });
    alert("✅ บันทึกการซื้อเรียบร้อยแล้ว");
  } catch (err) {
    console.error(err);
    alert("❌ บันทึกไม่สำเร็จ");
  }
}
