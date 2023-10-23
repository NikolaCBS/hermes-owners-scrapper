import { readFileSync } from "fs";

import { hermesUserTotal } from "../util/dto";
import { saveToCSVFile } from "../util/util";

const extractUserTotal = () => {
    const hermesHolders = readFileSync("formated_hermes_owners.csv", "utf-8")
        .split("\n")
        .splice(1);

    const formatedData: hermesUserTotal[] = [];

    hermesHolders.forEach((owner) => {
        const data: string[] = owner.split(",");

        if (data[0] && data[1] && data[2] && data[3] && data[4]) {
            formatedData.push({
                user_address: data[0],
                hermes_total: data[4],
            });
        }
    });

    saveToCSVFile(
        formatedData,
        "user_address,hermes_total\n",
        "hermes_user_total.csv"
    );
};

extractUserTotal();
