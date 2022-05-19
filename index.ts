import { cryptoWaitReady } from '@polkadot/util-crypto';

import keyring from '@polkadot/ui-keyring';

import { XCM, JunctionParent, MultiAssetConcreteFungible, JunctionAccountId32, MultiAsset } from './xcm';
import { X1 } from './xcm/multilocation';
import { Parachain, parachains } from './xcm/parachain';
import { Provider } from './provider';
import { RelayChain } from './xcm/relay';

// TODO: use a wallet provider
const ROCOCO_TEST_01_ACCOUNT = "ready source ski bitter tag gap special design dial saddle muscle civil"
const CANVA_TEST_01_ACCOUNT = "praise hundred party visual party hole slight globe between immense zoo any"
const ENCOINTER_TEST_01_ACCOUNT = "plastic scheme there credit duck october job pause act stool disease awesome"

const ROCOCO_RELAY_CHAIN = "wss://rococo-rpc.polkadot.io"
const CANVA_PARACHAIN = "wss://rococo-canvas-rpc.polkadot.io"
const STATEMINT_PARACHAIN = "wss://rococo-statemint-rpc.polkadot.io"
const ENCOINTER_ROCOCO_PARACHAIN = "wss://rococo.api.encointer.org"

async function main() {
    await cryptoWaitReady();
    await keyring.loadAll({ ss58Format: 42, type: 'sr25519' });

    const rococoTest01Acc = keyring.addUri(ROCOCO_TEST_01_ACCOUNT, '123123', { name: 'TEST 01' })
    const canvaTest01Acc = keyring.addUri(CANVA_TEST_01_ACCOUNT, '123123', { name: 'CANVA TEST 01' })

    const provider = await Provider.create(CANVA_PARACHAIN)

    const xcm = new Parachain(new XCM(provider))
    const submitable = await xcm.teleportAssetToParent("5CV8dGgSF1VsVnyNSMHNN35TmpkpjXzLFn7wfZeAnQZULQmC", 10000000000000)

    const hash = await submitable.signAndSend(canvaTest01Acc.pair)
    console.log(hash.toString())

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