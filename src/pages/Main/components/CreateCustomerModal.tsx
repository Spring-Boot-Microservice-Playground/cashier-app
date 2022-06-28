import { Dialog, DialogTitle, IconButton } from "@mui/material"
import { CreateCustomerForm } from "./CreateCustomerForm"
import CloseIcon from '@mui/icons-material/Close';
import { CreateTransactionActions } from "./CreateTransactionSection";
import { Product } from "../../../TypeDeclaration";

export const CreateCustomerModal = (
    {
        open,
        setOpen,
        receiptDispatch,
    }: {
        open: boolean,
        setOpen: (open: boolean) => void,
        receiptDispatch: React.Dispatch<{
            type: CreateTransactionActions;
            item?: Product | undefined;
            amount?: number | undefined;
            cash?: number | undefined;
            customer_name?: string | undefined;
        }>,
    }
) => {
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {open ? (
                <IconButton
                    aria-label="close"
                    onClick={() => setOpen(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
            <DialogTitle id="alert-dialog-title">
                {"Create New Customer"}
            </DialogTitle>
            <CreateCustomerForm receiptDispatch={receiptDispatch} setModalOpen={setOpen} />
        </Dialog>
    )
}