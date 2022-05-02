import { HexString } from '@polkadot/util/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { AnyU8a, ISubmittableResult } from '@polkadot/types/types';
import { Provider } from '../provider';

export type JunctionParent = "Parent"
export type JunctionParachain = { ParaChain: number }
export type JunctionAccountId32 = { AccountId32: { Network: string, Id: HexString } }

export type MultiLocation<T> = {
    X1: {
        [Proprety in keyof T]: T[Proprety]
    }
}

export type MultiLocationV0Parent = MultiLocation<JunctionParent>;
export type MultiLocationV0Parachain = MultiLocation<JunctionParachain>
export type MultiLocationV0AccountId32 = MultiLocation<JunctionAccountId32>

type MultiLocationV0 = MultiLocation<"Parent" | JunctionParachain | JunctionAccountId32>;

export type MultiAssetAll = "All";
export type MultiAssetAllFungible = "AllFungible";
export type MultiAssetAllNonFungible = "AllNonFungible";
export type MultiAssetAllAbstractFungible = { id: AnyU8a };
export type MultiAssetAllAbstractNonFungible = { class: AnyU8a };
export type MultiAssetAllConcreteFungible = { id: MultiLocationV0 };
export type MultiAssetAllConcreteNonFungible = { class: MultiLocationV0 };

export type MultiAssetAbstractFungible = { id: AnyU8a, amount: number };
export type MultiAssetConcreteFungible = { ConcreteFungible: { id?: MultiLocationV0, amount: number } };

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
        dst: MultiLocationV0, beneficiary: MultiLocationV0, 
        ass:MultiAsset[], feeAssetItem: number = 0, weightLimit: WeightLimit): 
        Promise<SubmittableExtrinsic<'promise', ISubmittableResult> | SubmittableExtrinsic<'rxjs', ISubmittableResult>> {        

        const xcmCall = this.provider.api.tx.xcmPallet.limitedTeleportAssets
        const callParams = [{ V0: dst }, { V0: beneficiary }, { V0: ass }, feeAssetItem, weightLimit];

        return xcmCall(...callParams)
    }

    public async polkadotXcmLimitedTeleportAssets(
        dst: MultiLocationV0, beneficiary: MultiLocationV0, 
        ass:MultiAsset[], feeAssetItem: number = 0, weightLimit: WeightLimit): 
        Promise<SubmittableExtrinsic<'promise', ISubmittableResult> | SubmittableExtrinsic<'rxjs', ISubmittableResult>> {        

        const xcmCall = this.provider.api.tx.polkadotXcm.limitedTeleportAssets
        const callParams = [{ V0: dst }, { V0: beneficiary }, { V0: ass }, feeAssetItem, weightLimit];

        return xcmCall(...callParams)
    }
}