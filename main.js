let userAddress;

async function connectWallet() {
  if (window.ethereum) {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = accounts[0];

    const refUrl = `${window.location.origin}${window.location.pathname}?ref=${userAddress}`;
    document.getElementById("refLink").value = refUrl;
    document.getElementById("refBox").style.display = "block";
  } else {
    alert("⚠️ กรุณาติดตั้ง MetaMask หรือ Bitget Wallet เพื่อใช้งาน");
  }
}

document.getElementById("connectBtn").addEventListener("click", connectWallet);

function copyLink() {
  const refInput = document.getElementById("refLink");
  refInput.select();
  refInput.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(refInput.value);
  alert("✅ คัดลอกลิงก์แนะนำแล้ว!");
}
