import { useContext, useEffect, useState } from "react";

import TextLink from "../global/TextLink";
import { ethers } from "ethers";
import polygonscan from "polygonscan-api";
import { userContext } from "../../context/userContext";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const { account } = useContext(userContext);

  const loadTransactions = async () => {
    if (account === null) {
      return;
    }

    //const myAddress = account;
    const myAddress = "0x770d70Ad6694b16AfeFdb705fC4f9382A614fab7"; // TODO: get this from global stored data
    const api = polygonscan.init(
      process.env.POLYGONSCAN_API_KEY,
      "mumbai",
      "3000"
    ); // TODO: get this from ENV
    var txs = await api.account.tokentx(myAddress);
    console.log("🚀 | loadTransactions | txs", txs);

    let listTxs = [];
    for (var i = 0; i < txs.result.length; i++) {
      let tx = txs.result[i];

      let contactName = "";
      let type = "Out";
      if (tx.from.toLowerCase() !== myAddress.toLowerCase()) {
        type = "In";

        // TODO: compare to contact addresses to get name
        contactName = "Pancho";
      }

      let data = {
        user: "user.lens", // TODO: Resolve from lens
        time: new Date(parseInt(tx.timeStamp * 1000)).toLocaleString("en-US"),
        amount: ethers.utils.formatUnits(tx.value, parseInt(tx.tokenDecimal)),
        tokenSymbol: tx.tokenSymbol,
        contactName: contactName,
        type: type,
      };

      listTxs.push(data);
    }
    setTransactions((t) => {
      return listTxs;
    });
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-normal mb-8">Last Transactions</h2>
      <div className="flex flex-col items-center gap-8">
        <ul className="flex flex-col gap-8 w-full">
          {transactions.map((e, i) => (
            <li key={i}>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-white h-10 w-10" />
                  <div className="flex flex-col">
                    <span>{e.user}</span>
                    <span className="text-sm">{e.date}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-md">
                    {e.type === "In" ? "+" : "-"}${e.amount}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <TextLink>View all transactions</TextLink>
      </div>
    </>
  );
};
export default Transactions;
