import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MultiAssetConcreteFungible, MultiLocation, XCM } from ".";
import { Provider } from "../provider";
import { X1 } from './multilocation';

export class RelayChain {
    private xcmProvider: XCM;

    constructor(provider: XCM) {
        this.xcmProvider = provider;
    }

    public async teleportAssetToParachain(parachainId: number, acc: string, amount: number): 
        Promise<SubmittableExtrinsic<"promise", ISubmittableResult> 
                | SubmittableExtrinsic<"rxjs", ISubmittableResult>> {
        const accountHex = this.xcmProvider.provider.api
            .createType("AccountId32", acc).toHex()

        const beneficiary = X1.accountId32(accountHex, "Any")
        const recipient = X1.parachain(parachainId);
        const asset: MultiAssetConcreteFungible = {
            ConcreteFungible: {
                amount: amount,
            }
        }

        const submitable = await this.xcmProvider.limitedTeleportAssets(
            recipient, beneficiary, [asset], 0, "Unlimited");

        return submitable;
    }
}