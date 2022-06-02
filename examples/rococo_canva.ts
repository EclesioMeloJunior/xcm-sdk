import { cryptoWaitReady } from '@polkadot/util-crypto';

import keyring from '@polkadot/ui-keyring';

import { XCM, JunctionParent, MultiAssetConcreteFungible, JunctionAccountId32, MultiAsset } from '../xcm';
import { X1 } from '../xcm/multilocation';
import { Parachain } from '../xcm/parachain';
import { Provider } from '../provider';
import { RelayChain } from '../xcm/relay';

// TODO: use a wallet provider

async function transfer_from_canva_to_rococo() {
    await cryptoWaitReady();
    await keyring.loadAll({ ss58Format: 42, type: 'sr25519' });

    const CANVA_TEST_01_ACCOUNT = "praise hundred party visual party hole slight globe between immense zoo any"
    const canvaTest01Acc = keyring.addUri(CANVA_TEST_01_ACCOUNT, '123123', { name: 'CANVA TEST 01' })

    const CANVA_PARACHAIN = "wss://rococo-canvas-rpc.polkadot.io"
    const provider = await Provider.create(CANVA_PARACHAIN)

    const xcm = new Parachain(new XCM(provider))
    const submitable = await xcm.teleportAssetToParent("5CV8dGgSF1VsVnyNSMHNN35TmpkpjXzLFn7wfZeAnQZULQmC", 10000000000000)

    const hash = await submitable.signAndSend(canvaTest01Acc.pair)
    console.log(hash.toString())

}

async function transfer_from_rococo_to_canva() {
    await cryptoWaitReady();
    await keyring.loadAll({ ss58Format: 42, type: 'sr25519' });

    const ROCOCO_TEST_01_ACCOUNT = "ready source ski bitter tag gap special design dial saddle muscle civil"
    const rococoTest01Acc = keyring.addUri(ROCOCO_TEST_01_ACCOUNT, '123123', { name: 'TEST 01' })

    const ROCOCO_RELAY_CHAIN = "wss://rococo-rpc.polkadot.io"
    const provider = await Provider.create(ROCOCO_RELAY_CHAIN)

    const xcm = new RelayChain(new XCM(provider))
    const submitable = await xcm.teleportAssetToParachain(1002, "5CXTjb39NCW1s32UBMmACTejMRgniRLzy9vNky1igeZzKkJx", 10000000000000)

    const hash = await submitable.signAndSend(rococoTest01Acc.pair)
    console.log(hash.toString())

}

transfer_from_canva_to_rococo().catch(err => console.log(err));