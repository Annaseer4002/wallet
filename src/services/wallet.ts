import Wallet from "../model/wallet.js";

export const activateWalletService = async (walletId: string) => {
    const wallet = await Wallet.findById(walletId);

    if (!wallet) {
        throw new Error("Wallet not found");
    }

    wallet.status = "active";
    await wallet.save();

    return wallet;
}