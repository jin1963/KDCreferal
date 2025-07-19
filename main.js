let web3;
let contract;
let userAddress;

// Contract info
const contractAddress = "0x9B0Abb27524B2857322C2D3682c5bc819eDB6d73";

window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await ethereum.request({ method: "eth_requestAccounts" });
            const accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];

            document.getElementById("walletStatus").innerHTML =
                `✅ Wallet เชื่อมแล้ว: <br>${shortenAddress(userAddress)}`;

            contract = new web3.eth.Contract(abi, contractAddress);
            loadReferrer();

        } catch (err) {
            console.error("🛑 Wallet connect error:", err);
            alert("❌ การเชื่อมต่อ Wallet ล้มเหลว");
        }
    } else {
        alert("⚠️ ไม่พบ Wallet โปรดติดตั้ง MetaMask หรือ Bitget Wallet");
    }
});

function shortenAddress(address) {
    return address.slice(0, 6) + "..." + address.slice(-4);
}

async function loadReferrer() {
    if (!contract || !userAddress) return;

    try {
        const ref = await contract.methods.referrers(userAddress).call();
        if (ref === "0x0000000000000000000000000000000000000000") {
            document.getElementById("referrerStatus").innerText = "📮 Referrer: ไม่มี";
        } else {
            document.getElementById("referrerStatus").innerText = `📮 Referrer: ${shortenAddress(ref)}`;
        }
    } catch (err) {
        console.error("❌ Load referrer error:", err);
    }
}

document.getElementById("connectWallet").addEventListener("click", async () => {
    if (window.ethereum) {
        try {
            await ethereum.request({ method: "eth_requestAccounts" });
            const accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];
            document.getElementById("walletStatus").innerHTML =
                `✅ Wallet เชื่อมแล้ว: <br>${shortenAddress(userAddress)}`;
            contract = new web3.eth.Contract(abi, contractAddress);
            loadReferrer();
        } catch (err) {
            alert("❌ เชื่อม Wallet ไม่สำเร็จ");
        }
    } else {
        alert("⚠️ ไม่พบ Wallet");
    }
});

document.getElementById("registerReferrer").addEventListener("click", async () => {
    if (!userAddress || !contract) {
        alert("🚫 กรุณาเชื่อมต่อ Wallet ก่อน");
        return;
    }

    const referrer = prompt("📮 กรอกที่อยู่กระเป๋าของผู้แนะนำ (Referrer):");
    if (!referrer || !web3.utils.isAddress(referrer)) {
        alert("❌ ที่อยู่ Referrer ไม่ถูกต้อง");
        return;
    }

    try {
        await contract.methods.registerReferrer(referrer).send({ from: userAddress });
        alert("✅ ลงทะเบียน Referrer สำเร็จ!");
        loadReferrer();
    } catch (error) {
        console.error("❌ ลงทะเบียนล้มเหลว:", error);
        alert("❌ ลงทะเบียนล้มเหลว: " + (error.message || ""));
    }
});

document.getElementById("recordPurchase").addEventListener("click", async () => {
    if (!userAddress || !contract) {
        alert("🚫 กรุณาเชื่อมต่อ Wallet ก่อน");
        return;
    }

    const amount = prompt("💰 กรอกจำนวนที่ซื้อ (USDT):");
    const totalAmount = parseFloat(amount);

    if (isNaN(totalAmount) || totalAmount <= 0) {
        alert("❌ จำนวนไม่ถูกต้อง");
        return;
    }

    try {
        await contract.methods.recordPurchase(userAddress, web3.utils.toWei(totalAmount.toString(), 'ether'))
            .send({ from: userAddress });

        alert("✅ บันทึกการซื้อสำเร็จ!");
    } catch (err) {
        console.error("❌ บันทึกล้มเหลว:", err);
        alert("❌ บันทึกการซื้อไม่สำเร็จ: " + (err.message || ""));
    }
});
