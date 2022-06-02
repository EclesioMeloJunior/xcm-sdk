## XCM

Currenlty is possible to use this SDK to transfer tokens from a relay chain to a parachain

````
const provider = await Provider.create(ws_provider)

const xcm = new Parachain(new XCM(provider))
// use the RelayChain constructor if your provider is a relay chain
const xcm = new RelayChain(new XCM(provider))
````