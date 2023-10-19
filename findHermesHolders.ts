import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { hexToBigInt } from "@polkadot/util";
import { writeFileSync } from "fs";

const SORA_NETWORK = "wss://mof3.sora.org";
const STORAGE_KEY =
    "0x99971b5749ac43e0235e41b0d37869188ee7418a6531173d60d1f6a82d8f4d51";
const HERMES_ASSET_ID =
    "0x002d4e9e03f192cc33b128319a049f353db98fbf4d98f717fd0b7f66a0462142";

const keyring = new Keyring();

const findHermesHolders = async () => {
    const provider = new WsProvider(SORA_NETWORK);
    const soraAPI = await ApiPromise.create({ provider });

    const keys: string[] = (await soraAPI.rpc.state.getKeys(STORAGE_KEY))
        .toString()
        .split(", ")
        .filter((key) =>
            key.includes(HERMES_ASSET_ID.slice(2, HERMES_ASSET_ID.length))
        );

    const result = new Array<{
        address: string;
        hermes_amount: number;
    }>();

    await Promise.all(
        keys.map(async (key, index) => {
            const balanceData: any = await soraAPI.rpc.state.getStorage(key);

            const balanceBN: bigint = hexToBigInt(
                balanceData.toString().replace(/0+$/, ""),
                { isLe: true }
            );
            const balanceNumber =
                parseInt(balanceBN.toString()) / Math.pow(10, 18);

            const address = keyring.encodeAddress(
                `0x${key.substring(98, 162)}`,
                69
            );

            result.push({ address: address, hermes_amount: balanceNumber });
        })
    );

    result.sort((a, b) => b.hermes_amount - a.hermes_amount);

    saveToCSVFile(result, "hermes_owners.csv");
};

const convertToCSV = (data: object[]): string => {
    const header = "address,hermes_amount\n";
    const rows = data.map((row) => Object.values(row).join(",") + "\n");

    return header + rows.join("");
};

const saveToCSVFile = (data: object[], fileName: string) => {
    const csvData = convertToCSV(data);

    writeFileSync(fileName, csvData);
};

findHermesHolders()
    .then(() => {
        return process.exit(0);
    })
    .catch((e) => {
        console.error(e);

        return process.exit(1);
    });
