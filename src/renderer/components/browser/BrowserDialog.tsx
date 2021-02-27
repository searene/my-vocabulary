import * as React from "react";
import { useSelector } from "react-redux";
import { getBrowseData, selectBrowseData, selectBrowserVisibility, setBrowserVisibility } from "./browserSlice";
import { Modal, Pagination, Table } from "semantic-ui-react";
import { useAppDispatch } from "../../redux/store";
import { BrowseData } from "../../../main/facade/CardFacade";
import { useEffect, useState } from "react";
import { dateToYYYYMMDD } from "../../utils/DateUtils";
import { PaginationProps } from "semantic-ui-react/dist/commonjs/addons/Pagination/Pagination";
import { BrowserDialogSearchInput } from "./BrowserDialogSearchInput";

export const BrowserDialog = () => {
  const visibility: boolean = useSelector(selectBrowserVisibility);
  const browseData: BrowseData = useSelector(selectBrowseData);
  const [curPage, setCurPage] = useState(1);
  const [inputValue, setInputValue] = useState("");

  const pageSize = 10;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (visibility) {
      dispatch(getBrowseData({
        offset: (curPage - 1) * pageSize,
        limit: pageSize
      }));
    }
  }, [curPage, visibility])

  const handlePageChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
    setCurPage(data.activePage as number);
    dispatch(getBrowseData({
      offset: (data.activePage as number - 1) * pageSize,
      limit: pageSize
    }));
  }

  const handleSearch = (searchContents: string) => {
    setCurPage(1);
    dispatch(getBrowseData({
      searchContents,
      offset: 0,
      limit: pageSize
    }));
  }

  return visibility ? (
    <Modal
      onClose={() => dispatch(setBrowserVisibility(false))}
      onOpen={() => dispatch(setBrowserVisibility(true))}
      open={visibility}
      closeIcon
    >
      <Modal.Header>Browser</Modal.Header>
      <Modal.Content>
        <BrowserDialogSearchInput onStartSearching={handleSearch} />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Field</Table.HeaderCell>
              <Table.HeaderCell>Word</Table.HeaderCell>
              <Table.HeaderCell>Due Time</Table.HeaderCell>
              <Table.HeaderCell>Book</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {browseData.reviewItems.map(browseData =>
              <Table.Row key={browseData.cardInstanceId}>
                <Table.Cell>{browseData.firstFieldContents}</Table.Cell>
                <Table.Cell>{browseData.word}</Table.Cell>
                <Table.Cell>{dateToYYYYMMDD(new Date(browseData.dueTime))}</Table.Cell>
                <Table.Cell>{browseData.bookName}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='4'>
                <Pagination defaultActivePage={curPage}
                            totalPages={Math.ceil(browseData.totalCount / pageSize)}
                            onPageChange={handlePageChange}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Modal.Content>
      <Modal.Actions>
      </Modal.Actions>
    </Modal>
 ) : <></>;
};
