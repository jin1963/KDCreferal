let web3;
let contract;
let userAccount;

async function initApp() {
  if (window.bitkeep && window.bitkeep.ethereum) {
    window.ethereum = window.bitkeep.ethereum;
  }

  if (typeof window.ethereum !== "undefined") {
    web3 = new Web3(window.ethereum);
    const chainId = await ethereum.request({ method: 'eth_chainId' });

    if (chainId !== '0x38') {
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }],
        });
      } catch (err) {
        alert("⚠️ กรุณาเชื่อมต่อ BNB Smart Chain");
        return;
      }
    }
  } else {
    alert("⚠️ กรุณาติดตั้ง MetaMask หรือ Bitget Wallet");
  }
}

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      userAccount = accounts[0];
      web3 = new Web3(window.ethereum);
      contract = new web3.eth.Contract(contractABI, contractAddress);

      document.getElementById("connectButton").innerText = `🟢 Connected: ${shortAddress(userAccount)}`;

      // แสดง referrer ถ้ามีใน URL
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get("ref");
      if (ref) {
        document.getElementById("referrerDisplay").innerText = `📫 Referrer: ${ref}`;
      }
    } catch (error) {
      console.error("Connection failed", error);
    }
  }
}

function shortAddress(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function copyReferralLink() {
  const link = `${window.location.origin}${window.location.pathname}?ref=${userAccount}`;
  navigator.clipboard.writeText(link).then(() => {
    alert("📋 คัดลอกลิงก์แนะนำเรียบร้อยแล้ว!");
  });
}

async function registerReferrer() {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");

  if (!ref || ref.toLowerCase() === userAccount.toLowerCase()) {
    alert("❌ ลิงก์แนะนำไม่ถูกต้อง หรือคุณไม่สามารถแนะนำตัวเองได้");
    return;
  }

  try {
    await contract.methods.registerReferrer(ref).send({ from: userAccount });
    alert("✅ ลงทะเบียน Referrer เรียบร้อยแล้ว");
  } catch (err) {
    console.error(err);
    alert("❌ ลงทะเบียน Referrer ไม่สำเร็จ");
  }
}

async function recordPurchase() {
  const amount = prompt("กรุณาใส่จำนวนเงินที่ซื้อ (USDT)");

  if (!amount || isNaN(amount)) {
    alert("❌ จำนวนไม่ถูกต้อง");
    return;
  }

  try {
    await contract.methods.recordPurchase(userAccount, web3.utils.toWei(amount, 'ether')).send({ from: userAccount });
    alert("✅ บันทึกการซื้อสำเร็จ");
  } catch (err) {
    console.error(err);
    alert("❌ บันทึกไม่สำเร็จ");
  }
}
