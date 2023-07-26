import icblast from "@infu/icblast";
import fs from "fs";
import CRC32 from "crc-32";
import { Principal } from "@dfinity/principal";

let ic = icblast({});

const repository_canister = await ic("");

// user copys and deploys his/her wallet
export let wallet_response = await repository_canister.copy_wallet_code();
console.log(wallet_response.toString())

// check wallet address of user
export let user_wallet_address = await repository_canister.check_wallet_of("principal");
console.log(user_wallet_address);

// check the wallet address of the call
export let wallet_address = await repository_canister.check_wallet();
const wallet = await ic(wallet_address.toString());
console.log(wallet)

// check contract address of the call
export let contract_address = await wallet.mint_contract();
console.log(contract_address.toString());
export let contract = await ic(contract_address.toString());
console.log(contract);

// chunking file upload
function updateChecksum(chunk, checksum) {
    const moduloValue = 400000000; // Range: 0 to 400_000_000
    // Calculate the signed checksum for the given chunk
    const signedChecksum = CRC32.buf(Buffer.from(chunk, "binary"), 0);
    // Convert the signed checksum to an unsigned value
    const unsignedChecksum = signedChecksum >>> 0;
    // Update the checksum and apply modulo operation
    const updatedChecksum = (checksum + unsignedChecksum) % moduloValue;
    // Return the updated checksum
    return updatedChecksum;
}

var batch_id = "cargo_file";
var checksum = 0;
const file_path = "./file.pdf";
const asset_buffer = fs.readFileSync(file_path);
const asset_unit8Array = new Uint8Array(asset_buffer);
const chunkSize = 2000000;

for (
    let start = 0, index = 0;
    start < asset_unit8Array.length;
    start += chunkSize, index++
) {
    const chunk = asset_unit8Array.slice(start, start + chunkSize);

    checksum = updateChecksum(chunk, checksum);
    var response = await contract.chunk_upload(batch_id, chunk, index);
    console.log(response);
}

export const offer = await can.start_offer({
    Cargo : {
        checksum: 234,
        chunk_ids: [1, 2, 3],
        content_type: "application/pdf",
        offer_type: {
            Cargo: {
                name: "eCommerce",
                commerce_url: ["http://commerce.url"],
                commerce: false,
                counter_offers_allowed: false,
                amount: 10000,
                weight: 1000,
                product_id: 0,
                payment_method: { Escrow: null },
                currency: ["eurc", "usdc"],
                court: Principal.fromText(""),
                capr_check: false,
                crpr_check: false,
                maturity_date: "2023/08/01",
                country_of_origin: "ZIM",
                country_of_destinations: ["BOT", "SOA"],
                financer: [],
                min_order: 1000,
                min_amount_of_completed_contracts: 0,
                max_amount_of_refused_contracts: 1,
                short_description: "this is short description",
                long_description: "this is long description",
            }
        }
    }
})