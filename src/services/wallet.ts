import Wallet from "../model/wallet.js";

export const activateWalletService = async (walletId: string) => {
    const wallet = await Wallet.findById(walletId);

    if (!wallet) {
        throw new Error("Wallet not found");
    }

    // check if wallet is already active
    if (wallet.status === "active") {
        throw new Error("Wallet is already active");
    }

    // activate wallet
    wallet.status = "active";
    await wallet.save();

    return wallet;
}

const walletService = { activateWalletService };
export default walletService;