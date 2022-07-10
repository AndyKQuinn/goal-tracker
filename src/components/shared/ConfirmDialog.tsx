import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

interface IConfirmDialog {
  open: boolean
  onOpen: any
  onConfirm: any
  goal: any
}

export default function ConfirmDialog(props: IConfirmDialog) {
  const { open, onOpen, onConfirm, goal } = props
 
  return (
    <>
    <Dialog className="min-w-full" open={open} handler={onOpen}>
      <DialogHeader>Delete Goal</DialogHeader>
      <DialogBody divider>
        Delete goal *{goal.title}* and all related tasks? This action cannot be undone.
      </DialogBody>
      <DialogFooter>
        <Button
          variant="gradient"
          color="red"
          onClick={onOpen}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="green" onClick={() => onConfirm(goal.id)}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
    </>
  );
}
