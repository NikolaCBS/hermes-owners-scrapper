import { writeFileSync } from "fs";
import { HERMES_ASSET_ID } from "./consts";
import { stakingInfo } from "./dto";

const getStakedAmount = (data: any): stakingInfo => {
    let result: stakingInfo = { stacking: "0", rewards: "0" };

    data.forEach((element: any) => {
        if (element["baseAsset"]["code"] === HERMES_ASSET_ID) {
            result = {
                stacking: BigInt(element["pooledTokens"]).toString(),
                rewards: BigInt(element["rewards"]).toString(),
            };
        }
    });

    return result;
};

const calculateTotalHermesAmount = (
    balanceAmount: string,
    stakingAmount: string,
    rewardsAmount: string
): string => {
    const total =
        BigInt(balanceAmount) + BigInt(stakingAmount) + BigInt(rewardsAmount);

    return total.toString();
};

const convertToCSV = (data: object[], fileHeader: string): string => {
    const rows = data.map((row) => Object.values(row).join(",") + "\n");

    return fileHeader + rows.join("");
};

const saveToCSVFile = (
    data: object[],
    fileHeader: string,
    fileName: string
) => {
    const csvData = convertToCSV(data, fileHeader);

    writeFileSync(fileName, csvData);
};

export { getStakedAmount, calculateTotalHermesAmount, saveToCSVFile };
