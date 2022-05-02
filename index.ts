import { cryptoWaitReady } from '@polkadot/util-crypto';

import keyring from '@polkadot/ui-keyring';
import * as BN from "bn.js";

import { XCM, MultiLocationV0AccountId32, MultiLocationV0Parent, MultiAssetConcreteFungible } from './xcm';
import { resolveParachainJunction } from './xcm/parachain';
import { Provider } from './provider';

const ROCOCO_TEST_01_ACCOUNT = "ready source ski bitter tag gap special design dial saddle muscle civil"
const CANVA_TEST_01_ACCOUNT = "praise hundred party visual party hole slight globe between immense zoo any";

const ROCOCO_RELAY_CHAIN = "wss://rococo-rpc.polkadot.io"
const CANVA_PARACHAIN = "wss://rococo-canvas-rpc.polkadot.io"
const STATEMINT_PARACHAIN = "wss://rococo-statemint-rpc.polkadot.io"

async function main() {
    await cryptoWaitReady();
    await keyring.loadAll({ ss58Format: 42, type: 'sr25519' });
    const rococTest01Acc = keyring.addUri(ROCOCO_TEST_01_ACCOUNT, '123123', { name: 'TEST 01' })
    const canvaTest01Acc = keyring.addUri(CANVA_TEST_01_ACCOUNT, '123123', { name: 'CANVA TEST 01' })

    const [rococoProvider, canvaParachainProvider] = await Promise.all([
        Provider.create(ROCOCO_RELAY_CHAIN),
        Provider.create(CANVA_PARACHAIN),
    ])

    const rococoXCM = new XCM(rococoProvider);
    const canvaXCM = new XCM(canvaParachainProvider);

    let recipient: MultiLocationV0Parent = {
        X1: "Parent"
    };
    //const recipient = await resolveParachainJunction(canvaParachainProvider);
    const beneficiary: MultiLocationV0AccountId32 = {
        X1: {
            AccountId32: {
                Id: rococoProvider.api.createType(
                    "AccountId32", "5CV8dGgSF1VsVnyNSMHNN35TmpkpjXzLFn7wfZeAnQZULQmC").toHex(),
                Network: "Any"
            }
        }
    }
    const asset: MultiAssetConcreteFungible = {
        ConcreteFungible: {
            id: {
                X1: "Parent",
            },
            amount: 1000000000000,
        }
    }
    
    const submitable = await canvaXCM.polkadotXcmLimitedTeleportAssets(recipient, beneficiary, [asset], 0, "Unlimited");
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