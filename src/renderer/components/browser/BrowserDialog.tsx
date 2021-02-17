import * as React from "react";
import { useSelector } from "react-redux";
import { selectBrowserVisibility, setBrowserVisibility } from "./browserSlice";
import { Modal } from "semantic-ui-react";

export const BrowserDialog = () => {
  const visibility: boolean = useSelector(selectBrowserVisibility);

  return visibility ? (
    <Modal
      onClose={() => setBrowserVisibility(false)}
      onOpen={() => setBrowserVisibility(true)}
      open={visibility}
    >
      <Modal.Header>Select a Photo</Modal.Header>
      <Modal.Content image>
        Test
      </Modal.Content>
      <Modal.Actions>
      </Modal.Actions>
    </Modal>
 ) : <></>;
};
