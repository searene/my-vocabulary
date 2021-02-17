import * as React from "react";
import { useSelector } from "react-redux";
import { selectBrowserVisibility, setBrowserVisibility } from "./browserSlice";
import { Modal } from "semantic-ui-react";
import { useAppDispatch } from "../../redux/store";

export const BrowserDialog = () => {
  const visibility: boolean = useSelector(selectBrowserVisibility);

  const dispatch = useAppDispatch();

  return visibility ? (
    <Modal
      onClose={() => dispatch(setBrowserVisibility(false))}
      onOpen={() => dispatch(setBrowserVisibility(true))}
      open={visibility}
      closeIcon
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
