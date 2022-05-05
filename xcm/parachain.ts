import { Provider } from '../provider';
import { JunctionParachain, MultiAssetConcreteFungible, MultiLocationX1, XCM } from '.';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { X1 } from './multilocation';

export const parachains = {
    Canva: {
        id: 1002
    }
}

export async function resolveParachainJunction(parachainProvider: Provider): Promise<MultiLocationX1<JunctionParachain>> {
    const parachainId = await parachainProvider.api.query.parachainInfo.parachainId();
    return {
        X1: {
            ParaChain: Number.parseInt(parachainId.toString(), 10)
        }
    }
}

export class Parachain {
    private xcmProvider: XCM;

    constructor(provider: XCM) {
        this.xcmProvider = provider;
    }

    public async teleportAssetToParent(acc: string, amount: number):
        Promise<SubmittableExtrinsic<"promise", ISubmittableResult>
            | SubmittableExtrinsic<"rxjs", ISubmittableResult>> {
        const accountHex = this.xcmProvider.provider.api
            .createType("AccountId32", acc).toHex()

        const beneficiary = X1.accountId32(accountHex, "Any")
        const recipient = X1.parent();
        const asset: MultiAssetConcreteFungible = {
            ConcreteFungible: {
                id: X1.parent(),
                amount: amount,
            }
        }

        const submitable = await this.xcmProvider.polkadotXcmLimitedTeleportAssets(
            recipient, beneficiary, [asset], 0, "Unlimited");

        return submitable;
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