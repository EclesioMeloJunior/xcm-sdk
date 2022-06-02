import { cryptoWaitReady } from '@polkadot/util-crypto';

import keyring from '@polkadot/ui-keyring';

import { XCM, JunctionParent, MultiAssetConcreteFungible, JunctionAccountId32, MultiAsset } from '../xcm';
import { X1 } from '../xcm/multilocation';
import { Parachain } from '../xcm/parachain';
import { Provider } from '../provider';
import { RelayChain } from '../xcm/relay';

// TODO: use a wallet provider
const ACALA_TEST_01_ACC = "okay common sleep diagram absorb runway shed time rack recipe gown unfair"
const ROCKMINE_TEST_01_ACCOUNT = "steel stage problem reduce depart town renew admit silly wisdom slot upper"
const CANVA_TEST_01_ACCOUNT = "praise hundred party visual party hole slight globe between immense zoo any"

const CANVA_PARACHAIN = "wss://rococo-contracts-rpc.polkadot.io"

async function main() {
    await cryptoWaitReady();
    await keyring.loadAll({ ss58Format: 42, type: 'sr25519' });

    //const rococoTest01Acc = keyring.addUri(ROCKMINE_TEST_01_ACCOUNT, '123123', { name: 'TEST 01' })
    const canvaTest01Acc = keyring.addUri(CANVA_TEST_01_ACCOUNT, '123123', { name: 'CANVA TEST 01' })

    const provider = await Provider.create(CANVA_PARACHAIN)
    const xcm = new Parachain(new XCM(provider))
    const submitable = await xcm.limitedReserveTransferAssets(1000, "5GEDoLmWf1swFpkcMZz35KKfSx5JTDzJ3EFG2LVUgVVp1hvo", 10000000000000)

    const hash = await submitable.signAndSend(canvaTest01Acc.pair)
    console.log(hash.toString())

    // TODO: watch for events and support error handling
    // canvaXCM.watchEvents((event) => {
    //     console.log("Received event")

    //     event.forEach((record) => {
    //         // Extract the phase, event and the event types
    //         const { event, phase } = record;
    //         const types = event.typeDef;

    //         // Show what we are busy with
    //         console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);

    //         // Loop through each of the parameters, displaying the type and data
    //         event.data.forEach((data, index) => {
    //             console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
    //         });
    //     })
    // })
}

main().catch(err => console.log(err));