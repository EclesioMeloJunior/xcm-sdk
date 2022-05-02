import { Provider } from '../provider';
import { JunctionParachain, MultiLocationV0Parachain } from '.';

export async function resolveParachainJunction(parachainProvider: Provider): Promise<MultiLocationV0Parachain> {
    const parachainId = await parachainProvider.api.query.parachainInfo.parachainId();
    return {
        X1: {
            ParaChain: Number.parseInt(parachainId.toString(), 10),
        }
    };
}