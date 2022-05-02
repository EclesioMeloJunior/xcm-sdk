import { ApiPromise, WsProvider } from '@polkadot/api'
import { HexString } from '@polkadot/util/types';

export type ParachainInfo = {
    parachainId: number,
    palletVersion: number
}

export class Provider {
    public api: ApiPromise

    private constructor(api: ApiPromise) {
        this.api = api;
    }

    static async create(ws: string): Promise<Provider> {
        const apiPromise = await ApiPromise.create({
            provider: new WsProvider(ws)
        })


        return Promise.resolve(new Provider(apiPromise))
    }

    public toAccountId32Hex(addr: string): HexString {
        return this.api.createType('AccountId32', addr).toHex();
    }

    public async parachainInfo(): Promise<ParachainInfo> {
        const [
            palletVersion,
            parachainId
        ] = await Promise.all([
            this.api.query.parachainInfo.palletVersion(),
            this.api.query.parachainInfo.parachainId(),
        ])

        return Promise.resolve({ 
            parachainId: Number.parseInt(parachainId.toString()), 
            palletVersion: Number.parseFloat(palletVersion.toString()), 
        } as ParachainInfo)
    } 
}