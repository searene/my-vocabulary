import { useSelector } from "react-redux";
import { selectImportDialogVisibility, setImportDialogVisibility } from "./importSlice";
import { Button, Form, Modal, TextArea } from "semantic-ui-react";
import * as React from "react";
import { useAppDispatch } from "../../redux/store";
import { useState } from "react";
import serviceProvider from "../../ServiceProvider";
import { StringUtils } from "../../../main/utils/StringUtils";

export const ImportDialog = () => {
  const visibility: boolean = useSelector(selectImportDialogVisibility);
  const [value, setValue] = useState("");

  const dispatch = useAppDispatch();

  const handleOK = async () => {
    const words = value.split("\n")
      .map(line => StringUtils.trimEndingLineSeparatorIfExists(line));
    await serviceProvider.wordService.importKnownWords(words)
    dispatch(setImportDialogVisibility(false));
  }

  return visibility ? (
    <Modal
      size={"large"}
      onClose={() => dispatch(setImportDialogVisibility(false))}
      onOpen={() => dispatch(setImportDialogVisibility(true))}
      open={visibility}
      closeIcon
    >
      <Modal.Header>Import</Modal.Header>
      <Modal.Content>
        <Form>
          <TextArea placeholder='Input your words here, one word one line...'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}/>
        </Form>
      </Modal.Content>
      <Modal.Actions>
      <Button negative onClick={handleOK}>
        OK
      </Button>
      <Button positive onClick={() => dispatch(setImportDialogVisibility(false))}>
        Cancel
      </Button>
      </Modal.Actions>
    </Modal>
  ) : <></>
}