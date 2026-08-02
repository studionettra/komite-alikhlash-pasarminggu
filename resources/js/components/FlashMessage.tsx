import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { showDeleteSuccess } from '../utils/alertManager';

export default function FlashMessage() {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.alert) {
            const { type, title, message } = flash.alert;
            const toastMessage = message ? `${title}: ${message}` : title;

            if (type === 'delete-success') {
                showDeleteSuccess(message || title);
            } else if (type === 'success') {
                toast.success(toastMessage);
            } else if (type === 'error') {
                toast.error(toastMessage);
            } else if (type === 'warning') {
                toast(toastMessage, { icon: '⚠️' });
            } else {
                toast(toastMessage);
            }
        }
    }, [flash]);

    return null;
}
