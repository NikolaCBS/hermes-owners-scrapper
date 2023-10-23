import { readFileSync } from "fs";

import { hermesHolder } from "../util/dto";
import { saveToCSVFile } from "../util/util";

const formatData = () => {
    const hermesHolders = readFileSync("hermes_owners.csv", "utf-8")
        .split("\n")
        .splice(1);

    const formatedData: hermesHolder[] = [];

    hermesHolders.forEach((owner) => {
        const data: string[] = owner.split(",");

        if (data[0] && data[1] && data[2] && data[3] && data[4]) {
            formatedData.push({
                user_address: data[0],
                balance_amount: (
                    BigInt(data[1] as string) / BigInt(Math.pow(10, 18))
                ).toString(),
                staking_amount: (
                    BigInt(data[2] as string) / BigInt(Math.pow(10, 18))
                ).toString(),
                rewards_amount: (
                    BigInt(data[3] as string) / BigInt(Math.pow(10, 18))
                ).toString(),
                hermes_total: (
                    BigInt(data[4] as string) / BigInt(Math.pow(10, 18))
                ).toString(),
            });
        }
    });

    saveToCSVFile(formatedData, "formated_hermes_owners.csv");
};

formatData();
