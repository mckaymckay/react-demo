// useBeforeUnload.js
import { useEffect, useRef } from 'react';

const useBeforeUnload = (hasUnsavedChanges, message = '您有未保存的更改，确定要离开吗???') => {
    const messageRef = useRef(message);

    useEffect(() => {
        messageRef.current = message;
    }, [message]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (hasUnsavedChanges) {
                event.preventDefault();
                event.returnValue = messageRef.current;
                return messageRef.current;
            }
        };

        if (hasUnsavedChanges) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);
};

export default useBeforeUnload;
