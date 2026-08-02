export const confirmDelete = (message: string, onConfirm: () => void) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(
            new CustomEvent('open-confirm-modal', {
                detail: { message, onConfirm },
            }),
        );
    }
};

export const showDeleteSuccess = (message: string) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(
            new CustomEvent('show-delete-success-modal', {
                detail: { message },
            }),
        );
    }
};
