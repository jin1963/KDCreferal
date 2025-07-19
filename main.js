let web3;
let contract;
let userAddress;

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // 🔁 สลับไปยัง BNB Chain
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x38" }],
            });

            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            userAddress = accounts[0];
            document.getElementById("connectButton").innerText =
              "✅ Wallet เชื่อมแล้ว: " +
              userAddress.slice(0, 6) +
              "..." +
              userAddress.slice(-4);

            contract = new web3.eth.Contract(abi, contractAddress);
            checkReferrer();
        } catch (error) {
            alert("❌ การเชื่อมต่อ Wallet ล้มเหลว:\n" + error.message);
        }
    } else {
        alert("⚠️ ไม่พบ Wallet ที่รองรับ เช่น Bitget หรือ MetaMask");
    }
}

function checkReferrer() {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref");
    if (ref) {
        document.getElementById("referrerDisplay").innerText = "📫 Referrer: " + ref;
    } else {
        document.getElementById("referrerDisplay").innerText = "📫 Referrer: ไม่มี";
    }
}

function copyReferralLink() {
    if (!userAddress) return alert("⛔ กรุณาเชื่อมต่อ Wallet ก่อน");
    const referralURL = `${window.location.origin + window.location.pathname}?ref=${userAddress}`;
    navigator.clipboard.writeText(referralURL);
    alert("✅ คัดลอกลิงก์แล้ว:\n" + referralURL);
}

async function registerReferrer() {
    if (!userAddress || !contract) return alert("⛔ กรุณาเชื่อมต่อ Wallet ก่อน");

    const ref = new URLSearchParams(window.location.search).get("ref") || "0x0000000000000000000000000000000000000000";

    try {
        await contract.methods.registerReferrer(ref).send({ from: userAddress });
        alert("✅ ลงทะเบียนเรียบร้อยแล้ว!");
    } catch (err) {
        alert("❌ ล้มเหลว: " + err.message);
    }
}

async function recordPurchase() {
    if (!userAddress || !contract) return alert("⛔ กรุณาเชื่อมต่อ Wallet ก่อน");

    try {
        await contract.methods.recordPurchase(userAddress, web3.utils.toWei("10", "ether")).send({ from: userAddress });
        alert("✅ บันทึกการซื้อเรียบร้อยแล้ว!");
    } catch (err) {
        alert("❌ ล้มเหลว: " + err.message);
    }
}
