let web3;
let userAccount;
let contract;

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    userAccount = accounts[0];
    contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    document.getElementById("walletAddress").textContent = `✅ Connected: ${shorten(userAccount)}`;

    await showMyReferrer();
  } else {
    alert("Please install MetaMask or Bitget Wallet.");
  }
});

document.getElementById("connectBtn").onclick = async () => {
  if (!window.ethereum) return alert("Wallet not found.");
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  userAccount = accounts[0];
  contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  document.getElementById("walletAddress").textContent = `✅ Connected: ${shorten(userAccount)}`;
  await showMyReferrer();
};

document.getElementById("registerBtn").onclick = async () => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");

  if (!ref || !web3.utils.isAddress(ref)) {
    alert("❌ Invalid referral address");
    return;
  }

  try {
    await contract.methods.registerReferrer(ref).send({ from: userAccount });
    alert("✅ Registered successfully");
    await showMyReferrer();
  } catch (err) {
    alert("⚠️ Register failed or already registered.");
    console.error(err);
  }
};

document.getElementById("copyBtn").onclick = () => {
  const referralUrl = `${BASE_URL}?ref=${userAccount}`;
  navigator.clipboard.writeText(referralUrl).then(() => {
    alert("✅ Copied: " + referralUrl);
  });
};

async function showMyReferrer() {
  const ref = await contract.methods.referrers(userAccount).call();
  document.getElementById("myReferrer").textContent = ref !== "0x0000000000000000000000000000000000000000"
    ? ref
    : "❌ No referrer registered";
}

function shorten(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}
