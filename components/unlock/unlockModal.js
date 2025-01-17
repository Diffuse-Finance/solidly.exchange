import React, { Component } from "react";
import { DialogContent, Dialog, Slide } from "@material-ui/core";

import classes from './unlockModal.module.css'

import Unlock from "./unlock.js";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class UnlockModal extends Component {
  render() {
    const { closeModal, modalOpen } = this.props;

    const fullScreen = window.innerWidth < 576;

    return (
      <Dialog
        open={modalOpen}
        onClose={closeModal}
        fullWidth={true}
        maxWidth={"sm"}
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        classes={{ paper: classes.container  }}
      >
        <DialogContent style={{padding:'0'}}>
          <Unlock closeModal={closeModal} />
        </DialogContent>
      </Dialog>
    );
  }
}

export default UnlockModal;
