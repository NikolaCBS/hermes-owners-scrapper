import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { hexToBigInt } from "@polkadot/util";

import {
    HERMES_ASSET_ID,
    SORA_NETWORK,
    STAKE_ADDRESS,
    STORAGE_KEY,
} from "../util/consts";
import { hermesHolder, stakingInfo } from "../util/dto";
import {
    calculateTotalHermesAmount,
    getStakedAmount,
    saveToCSVFile,
} from "../util/util";

const keyring = new Keyring();

const PALLETE_NAME = "demeterFarmingPlatform";
const METHOD_KEY = "userInfos";

const findHermesHolders = async () => {
    const provider = new WsProvider(SORA_NETWORK);
    const soraAPI = await ApiPromise.create({ provider });

    const keys: string[] = (await soraAPI.rpc.state.getKeys(STORAGE_KEY))
        .toString()
        .split(", ")
        .filter((key) =>
            key.includes(HERMES_ASSET_ID.slice(2, HERMES_ASSET_ID.length))
        );

    const result: hermesHolder[] = [];

    await Promise.all(
        keys.map(async (key) => {
            const balanceData: any = await soraAPI.rpc.state.getStorage(key);

            const balanceBN: bigint = hexToBigInt(
                balanceData.toString().replace(/0+$/, ""),
                { isLe: true }
            );

            let balanceAmount: string = balanceBN.toString();

            const address = keyring.encodeAddress(
                `0x${key.substring(98, 162)}`,
                69
            );

            const stakingData = (
                await soraAPI.query[PALLETE_NAME][METHOD_KEY](address)
            ).toJSON();

            const stakingInfo: stakingInfo = getStakedAmount(stakingData);

            if (address !== STAKE_ADDRESS) {
                result.push({
                    user_address: address,
                    balance_amount: balanceAmount,
                    staking_amount: stakingInfo.stacking,
                    rewards_amount: stakingInfo.rewards,
                    hermes_total: calculateTotalHermesAmount(
                        balanceAmount,
                        stakingInfo.stacking,
                        stakingInfo.rewards
                    ),
                });
            }
        })
    );

    result.sort((a, b) =>
        BigInt(a.hermes_total) > BigInt(b.hermes_total)
            ? -1
            : BigInt(a.hermes_total) < BigInt(b.hermes_total)
            ? 1
            : 0
    );

    saveToCSVFile(result, "hermes_owners.csv");
};

findHermesHolders()
    .then(() => {
        return process.exit(0);
    })
    .catch((e) => {
        console.error(e);

        return process.exit(1);
    });
