import React, { useMemo, useState } from 'react';
import useBeforeUnload from '../../hooks/useBeforeUnload';
import { message } from 'antd';

const BeforeLeave = () => {
    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({ name: 'mm' });

    // 检查是否有未保存的更改
    const hasUnsavedChanges = useMemo(() => {
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    }, [formData, originalData]);

    // 使用 beforeunload hook
    // useBeforeUnload(hasUnsavedChanges, '表单数据未保存，确定要离开吗???');

    const handleSave = async () => {
        try {
            // await saveFormData(formData);
            setOriginalData({ name: 'hh' }); // 保存成功后更新原始数据
            message.success('保存成功');
        } catch (error) {
            message.error('保存失败');
        }
    };

    return (
        <button onClick={handleSave}>保存</button>
    );
};

export default BeforeLeave
