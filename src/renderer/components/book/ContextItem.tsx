import { WordContext } from "../../../main/domain/WordContext";
import { Button, Grid, Modal } from "semantic-ui-react";
import * as React from "react";
import { useState } from "react";

export const ContextItem = (context: WordContext) => {

  const [modalVisibility, setModalVisibility] = useState(false);

  return (
    <Modal
      trigger={
        <Grid.Row
          className={"hover-link"}
          dangerouslySetInnerHTML={{
            __html: context.short.htmlContents,
          }}
        />
      }
      onClose={() => setModalVisibility(false)}
      onOpen={() => setModalVisibility(true)}
      open={modalVisibility}
    >
      <Modal.Header>Context</Modal.Header>
      <Modal.Content
        dangerouslySetInnerHTML={{
          __html: context.long.htmlContents
        }}
      />
      <Modal.Actions>
        <Button
          onClick={() => setModalVisibility(false)}
        >
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  )
}