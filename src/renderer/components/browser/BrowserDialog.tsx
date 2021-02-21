import * as React from "react";
import { useSelector } from "react-redux";
import { getBrowseData, selectBrowseData, selectBrowserVisibility, setBrowserVisibility } from "./browserSlice";
import { Icon, Label, Menu, Modal, Table } from "semantic-ui-react";
import { useAppDispatch } from "../../redux/store";
import { BrowseData } from "../../../main/facade/CardFacade";
import { useEffect, useState } from "react";
import { dateToYYYYMMDD } from "../../utils/DateUtils";

export const BrowserDialog = () => {
  const visibility: boolean = useSelector(selectBrowserVisibility);
  const browseDataList: BrowseData[] = useSelector(selectBrowseData);
  const [curPage, setCurPage] = useState(1);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const pageSize = 10;
    dispatch(getBrowseData({
      offset: (curPage - 1) * pageSize,
      limit: pageSize
    }));
  }, [curPage, visibility])

  return visibility ? (
    <Modal
      onClose={() => dispatch(setBrowserVisibility(false))}
      onOpen={() => dispatch(setBrowserVisibility(true))}
      open={visibility}
      closeIcon
    >
      <Modal.Header>Browser</Modal.Header>
      <Modal.Content>
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
            {browseDataList.map(browseData =>
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
              <Table.HeaderCell colSpan='3'>
                <Menu floated='right' pagination>
                  <Menu.Item as='a' icon>
                    <Icon name='chevron left' />
                  </Menu.Item>
                  <Menu.Item as='a'>1</Menu.Item>
                  <Menu.Item as='a'>2</Menu.Item>
                  <Menu.Item as='a'>3</Menu.Item>
                  <Menu.Item as='a'>4</Menu.Item>
                  <Menu.Item as='a' icon>
                    <Icon name='chevron right' />
                  </Menu.Item>
                </Menu>
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
