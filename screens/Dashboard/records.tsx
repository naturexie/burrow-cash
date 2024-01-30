import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import CustomModal from "../../components/CustomModal/CustomModal";
import CustomTable from "../../components/CustomTable/CustomTable";
import Datasource from "../../data/datasource";
import { useAccountId, useToastMessage } from "../../hooks/hooks";
import { shrinkToken, TOKEN_FORMAT } from "../../store";
import { useAppSelector } from "../../redux/hooks";
import { getAssets } from "../../redux/assetsSelectors";
import { getDateString, maskMiddleString } from "../../helpers/helpers";
import { nearNativeTokens, nearTokenId, standardizeAsset } from "../../utils";
import { CopyIcon } from "../../components/Icons/Icons";

const Records = ({ isShow }) => {
  const accountId = useAccountId();
  const { toastMessage, showToast } = useToastMessage();
  const assets = useAppSelector(getAssets);
  const [isLoading, setIsLoading] = useState(false);
  const [docs, setDocs] = useState([]);
  const [pagination, setPagination] = useState<{
    page?: number;
    totalPages?: number;
    totalItems?: number;
  }>({
    page: 1,
  });

  useEffect(() => {
    if (isShow) {
      fetchData({
        page: pagination?.page,
      }).then();
    }
  }, [isShow, pagination?.page]);

  const fetchData = async ({ page }) => {
    try {
      setIsLoading(true);
      const response = await Datasource.shared.getRecords(accountId, page, 10);
      const list = response?.record_list?.map((d) => {
        let tokenId = d.token_id;
        if (nearNativeTokens.includes(tokenId)) {
          tokenId = nearTokenId;
        }
        d.data = assets?.data[tokenId];
        const cloned = { ...d.data };
        cloned.metadata = standardizeAsset({ ...cloned.metadata });
        d.data = cloned;
        return d;
      });
      setDocs(list);
      setPagination((d) => {
        return {
          ...d,
          totalPages: response?.total_page,
          totalItems: response?.total_size,
        };
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTxClick = (tx) => {
    window.open(`https://nearblocks.io/txns/${tx}`);
  };

  const columns = getColumns({ showToast, handleTxClick });
  return (
    <CustomTable
      data={docs}
      columns={columns}
      pagination={pagination}
      setPagination={setPagination}
      isLoading={isLoading}
    />
  );
};

const getColumns = ({ showToast, handleTxClick }) => [
  {
    header: "Assets",
    minSize: 220,
    cell: ({ originalData }) => {
      const { data } = originalData || {};
      const { metadata } = data || {};
      const { icon, tokens, symbol } = metadata || {};
      let iconImg;
      let symbolNode = symbol;
      if (icon) {
        iconImg = (
          <img
            src={icon}
            width={26}
            height={26}
            alt="token"
            className="rounded-full w-[26px] h-[26px]"
            style={{ marginRight: 6, marginLeft: 3 }}
          />
        );
      } else if (tokens?.length) {
        symbolNode = "";
        iconImg = (
          <div
            className="grid"
            style={{ marginRight: 2, gridTemplateColumns: "15px 12px", paddingLeft: 5 }}
          >
            {tokens?.map((d, i) => {
              const isLast = i === tokens.length - 1;
              symbolNode += `${d.metadata.symbol}${!isLast ? "-" : ""}`;
              return (
                <img
                  key={d.metadata.symbol}
                  src={d.metadata?.icon}
                  width={20}
                  height={20}
                  alt="token"
                  className="rounded-full w-[20px] h-[20px] -m-1"
                  style={{ maxWidth: "none" }}
                />
              );
            })}
          </div>
        );
      }

      return (
        <div className="flex">
          <div style={{ flex: "0 0 26px" }} className="mr-2">
            {iconImg}
          </div>
          <div
            title={symbolNode}
            style={{
              whiteSpace: "normal",
            }}
          >
            {symbolNode}
          </div>
        </div>
      );
    },
  },
  {
    header: "Type",
    accessorKey: "event",
    maxSize: 180,
  },
  {
    header: "Amount",
    maxSize: 180,
    cell: ({ originalData }) => {
      const { amount, data } = originalData || {};
      const { metadata, config } = data || {};
      const { extra_decimals } = config || {};
      const tokenAmount = Number(
        shrinkToken(amount, (metadata?.decimals || 0) + (extra_decimals || 0)),
      );
      return <div>{tokenAmount.toLocaleString(undefined, TOKEN_FORMAT)}</div>;
    },
  },
  {
    header: "Time",
    maxSize: 180,
    cell: ({ originalData }) => {
      const { timestamp } = originalData || {};
      return <div className="text-gray-300 truncate">{getDateString(timestamp / 1000000)}</div>;
    },
  },
  {
    header: () => <div className="text-right">View in NEAR explorer</div>,
    cell: ({ originalData }) => {
      const { tx_id } = originalData || {};
      if (!tx_id) {
        return null;
      }
      return (
        <div className="flex items-center gap-2 justify-end">
          <div
            className="text-gray-300 text-right cursor-pointer hover:underline transform hover:opacity-80"
            onClick={() => handleTxClick(tx_id)}
          >
            {maskMiddleString(tx_id, 4, 34)}
          </div>

          <CopyToClipboard text={tx_id} onCopy={() => showToast("Copied")}>
            <div className="cursor-pointer">
              <CopyIcon />
            </div>
          </CopyToClipboard>
        </div>
      );
    },
    size: 180,
  },
];

export default Records;
