import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();
import { getBaseProvider } from "@/common/provider";

const args = process.argv.splice(2);

(async () => {
  const tx = await getBaseProvider().getTransactionReceipt(args[0]);
  process.stdout.write(JSON.stringify(tx, null, 2));
})();
