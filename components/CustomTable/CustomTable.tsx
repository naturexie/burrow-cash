import styled from "styled-components";
import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import CustomPagination from "./CustomPagination";

type columnType = {
  id?: string;
  header: string;
  accessorKey?: string;
  cell?: any;
  size?: number;
};

interface Props {
  columns: Array<columnType>;
  data: Array<any>;
  actionRow?: React.ReactNode;
  className?: string;
  fetchData?: () => any;
  pagination?: {
    totalItems?: number;
    totalPages?: number;
    page?: number;
    onNextClick?: () => any;
    onPrevClick?: () => any;
  };
  setPagination?: any;
  isLoading?: boolean;
}

const CustomTable = ({
  columns,
  data,
  actionRow,
  className,
  fetchData,
  pagination,
  setPagination,
  isLoading,
}: Props) => {
  const handleFirstClick = () => {
    if (setPagination) {
      setPagination((d) => ({
        ...d,
        page: 1,
      }));
    }
  };

  const handleLastClick = () => {
    if (setPagination && pagination?.totalPages) {
      setPagination((d) => ({
        ...d,
        page: pagination.totalPages,
      }));
    }
  };

  const handlePrevClick = () => {
    if (setPagination) {
      setPagination((d) => ({
        ...d,
        page: d?.page <= 1 ? 1 : d.page - 1,
      }));
    }
  };

  const handleNextClick = () => {
    if (setPagination) {
      setPagination((d) => ({
        ...d,
        page: pagination?.page ? pagination.page + 1 : 1,
      }));
    }
  };

  const headers = columns?.map((d) => ({ text: d.header, size: d.size }));
  const headerNode = (
    <div className="custom-table-thead">
      <div className="custom-table-tr">
        {headers?.map((d) => {
          const styles: { flex?: string } = {};
          if (d.size) {
            styles.flex = `0 0 ${d.size}px`;
          }
          return (
            <div key={d.text} className="custom-table-th text-gray-400" style={styles}>
              {d.text}
            </div>
          );
        })}
      </div>
    </div>
  );

  const bodyNodes = data?.map((d, i) => {
    const tdNode = columns?.map((col) => {
      let content = null;
      if (typeof col.cell === "function") {
        content = col.cell({
          originalData: d,
        });
      } else if (col.accessorKey) {
        content = d[col.accessorKey];
      }
      const styles: { flex?: string } = {};
      if (col.size) {
        styles.flex = `0 0 ${col.size}px`;
      }
      return (
        <div className="custom-table-td" key={col.id || col.header} style={styles}>
          {content}
        </div>
      );
    });
    return (
      <div className="custom-table-row" key={i}>
        <div className="custom-table-tr">{tdNode}</div>
        {actionRow && <div className="custom-table-action">{actionRow}</div>}
      </div>
    );
  });

  return (
    <StyledTable className={twMerge("custom-table", className)}>
      <StyledLoading active={isLoading}>Loading</StyledLoading>
      <div className="custom-table-thead">{headerNode}</div>
      <div className="custom-table-tbody">{bodyNodes}</div>
      {pagination?.totalPages && pagination?.page && (
        <div className="custom-table-pagination flex justify-end mt-2">
          <CustomPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            prevClick={handlePrevClick}
            nextClick={handleNextClick}
            firstClick={handleFirstClick}
            lastClick={handleLastClick}
          />
        </div>
      )}
    </StyledTable>
  );
};

const StyledLoading = styled.div<{ active: boolean | undefined }>`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: ${(p) => (p.active ? 22 : -1)};
  opacity: ${(p) => (p.active ? 1 : 0)};
  pointer-events: ${(p) => (p.active ? "all" : "none")};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledTable = styled.div`
  width: 100%;

  .custom-table-tr {
    display: flex;
  }

  .custom-table-th,
  .custom-table-td {
    flex: 1;
    word-break: break-word;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .custom-table-thead {
    border-bottom: 1px solid #31344d;

    .custom-table-th {
      text-align: left;
      padding: 10px 5px;
    }
  }

  .custom-table-tbody {
    .custom-table-td {
      padding: 15px 5px;
    }
  }

  .custom-table-action {
    display: none;
    height: 0;
    overflow: hidden;
    transition: all ease-in-out 0.3ms;
  }

  .custom-table-row {
    &:hover {
      background: #33344c;

      .custom-table-action {
        display: block;
        height: auto;
      }
    }
  }
`;
CustomTable.displayName = "CustomTable";
export default CustomTable;
