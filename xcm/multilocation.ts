import { HexString } from '@polkadot/util/types';
import { JunctionParachain, JunctionParent, JunctionAccountId32, MultiLocationX1, MultiLocationX2 } from ".";

export module X1 {
    export function parent(): MultiLocationX1<JunctionParent> {
        return {
            X1: "Parent"
        }
    }

    export function parachain(parachainId: number): MultiLocationX1<JunctionParachain> {
        return {
            X1: {
                ParaChain: parachainId,
            }
        };
    }

    export function accountId32(acc: HexString, net: string): MultiLocationX1<JunctionAccountId32> {
        return {
            X1: {
                AccountId32: {
                    Id: acc,
                    Network: net,
                },
            }
        };
    }
}

export module X2 {
    export function parachain(parachainId: number): MultiLocationX2<JunctionParent, JunctionParachain> {
        return {
            X2: [
                "Parent",
                {
                    ParaChain: parachainId
                },
            ]
        };
    }

    export function accountId32(acc: HexString, net: string): MultiLocationX1<JunctionAccountId32> {
        return {
            X1: {
                AccountId32: {
                    Id: acc,
                    Network: net,
                },
            }
        };
    }
}
