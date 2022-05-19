import { HexString } from '@polkadot/util/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { AnyU8a, ISubmittableResult } from '@polkadot/types/types';
import { Provider } from '../provider';

export type JunctionParent = "Parent"
export type JunctionParachain = { ParaChain: number }
export type JunctionAccountId32 = { AccountId32: { Network: string, Id: HexString } }
export type Junction = unknown | JunctionParent | JunctionParachain | JunctionAccountId32

export type MultiLocationX1<J extends Junction> = {
    X1: {
        [JProp in keyof J]: J[JProp]
    }
}

export type MultiLocationX2<J extends Junction, Y extends Junction> = {
    X2: [
        { [JProp in keyof J]: J[JProp] },
        { [YProp in keyof Y]: Y[YProp] }
    ]
}

export type MultiLocation = 
    | MultiLocationX1<Junction> | MultiLocationX2<Junction, Junction>

export type MultiAssetAll = "All";
export type MultiAssetAllFungible = "AllFungible";
export type MultiAssetAllNonFungible = "AllNonFungible";
export type MultiAssetAllAbstractFungible = { id: AnyU8a };
export type MultiAssetAllAbstractNonFungible = { class: AnyU8a };
export type MultiAssetAllConcreteFungible = { id: MultiLocation };
export type MultiAssetAllConcreteNonFungible = { class: MultiLocation };

export type MultiAssetAbstractFungible = { id: AnyU8a, amount: number };
export type MultiAssetConcreteFungible = { ConcreteFungible: { id?: MultiLocation, amount: number } };

export type MultiAsset = MultiAssetAll | MultiAssetAllFungible | MultiAssetAllNonFungible
    | MultiAssetAllAbstractFungible | MultiAssetAllAbstractNonFungible | MultiAssetAllConcreteFungible
    | MultiAssetAllConcreteNonFungible | MultiAssetAbstractFungible | MultiAssetConcreteFungible

export type Unlimited = "Unlimited";
export type Limited = { Limited: number };
export type WeightLimit = Unlimited | Limited;

export class XCM {
    public provider: Provider;

    constructor(provider: Provider) {
        this.provider = provider;
    }

    public async watchEvents(callback) {
        this.provider.api.query.system.events(callback)
    }

    public async limitedTeleportAssets(
        dst: MultiLocation, beneficiary: MultiLocation, 
        ass:MultiAsset[], feeAssetItem: number = 0, weightLimit: WeightLimit): 
        Promise<SubmittableExtrinsic<'promise', ISubmittableResult> | SubmittableExtrinsic<'rxjs', ISubmittableResult>> {        

        const xcmCall = this.provider.api.tx.xcmPallet.limitedTeleportAssets
        const callParams = [{ V0: dst }, { V0: beneficiary }, { V0: ass }, feeAssetItem, weightLimit];

        return xcmCall(...callParams)
    }

    public async polkadotXcmLimitedTeleportAssets(
        dst: MultiLocation, beneficiary: MultiLocation, 
        ass:MultiAsset[], feeAssetItem: number = 0, weightLimit: WeightLimit): 
        Promise<SubmittableExtrinsic<'promise', ISubmittableResult> | SubmittableExtrinsic<'rxjs', ISubmittableResult>> {        

        const xcmCall = this.provider.api.tx.polkadotXcm.limitedTeleportAssets
        const callParams = [{ V0: dst }, { V0: beneficiary }, { V0: ass }, feeAssetItem, weightLimit];

        return xcmCall(...callParams)
    }

    public async polkadotXcmLimitedReserveTransferAssets(
        dst: MultiLocation, beneficiary: MultiLocation, 
        ass:MultiAsset[], feeAssetItem: number = 0, weightLimit: WeightLimit): 
        Promise<SubmittableExtrinsic<'promise', ISubmittableResult> | SubmittableExtrinsic<'rxjs', ISubmittableResult>> {        

        const xcmCall = this.provider.api.tx.polkadotXcm.limitedReserveTransferAssets
        const callParams = [{ V0: dst }, { V0: beneficiary }, { V0: ass }, feeAssetItem, weightLimit];

        return xcmCall(...callParams)
    }
}