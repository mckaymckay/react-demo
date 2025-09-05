import React, { useState, useEffect, useMemo } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Card,
  Spin,
  message,
  Row,
  Col,
  Affix,
  Progress,
} from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './index.css';
import { getFormConfig, getFormDetail } from '../../../service/api';
import useSimpleRAF from '../../../hooks/useRAFRenderer';

const { TextArea } = Input;
const { Option } = Select;

// 简单的表单项组件
function FormItem({ field }) {
  const renderControl = () => {
    const { type, options } = field;

    switch (type) {
      case 'input':
        return <Input placeholder={`请输入${field.label}`} />;

      case 'textarea':
        return <TextArea rows={4} placeholder={`请输入${field.label}`} />;

      case 'select':
        return (
          <Select placeholder={`请选择${field.label}`}>
            {options?.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case 'date':
        return <DatePicker style={{ width: '100%' }} placeholder={`请选择${field.label}`} />;

      case 'number':
        return <InputNumber style={{ width: '100%' }} placeholder={`请输入${field.label}`} />;

      case 'switch':
        return <Switch />;

      default:
        return <Input placeholder={`请输入${field.label}`} />;
    }
  };

  // 如果是分组标题
  if (field.type === 'section-title') {
    return (
      <Col span={24} key={field.key}>
        <div style={{
          margin: '24px 0 16px 0',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#1890ff',
          borderBottom: '2px solid #f0f0f0',
          paddingBottom: '8px',
        }}
        >
          {field.title}
        </div>
      </Col>
    );
  }

  return (
    <Col xs={24} sm={12} md={8} lg={6} key={field.key}>
      <Form.Item
        name={field.key}
        label={field.label}
        rules={[
          {
            required: field.required,
            message: `请输入${field.label}`,
          },
        ]}
      >
        {renderControl()}
      </Form.Item>
    </Col>
  );
}

function SimpleLongForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [configData, setConfigData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 将配置转换为扁平数组
  const formFields = useMemo(() => {
    if (!configData) return [];

    const fields = [];
    configData.sections.forEach((section, index) => {
      // 添加分组标题
      fields.push({
        type: 'section-title',
        key: `section-${index}`,
        title: section.title,
      });

      // 添加字段
      fields.push(...section.fields);
    });

    return fields;
  }, [configData]);

  // 使用简单的 RAF 渲染
  const { renderedItems, isRendering, progress } = useSimpleRAF(formFields, 2);

  // 初始化数据
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchConfig(), fetchDetail()]);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // 获取配置数据
  const fetchConfig = async () => {
    try {
      const result = await getFormConfig();
      if (result.code === 0) {
        setConfigData(result.data);
      } else {
        message.error('获取表单配置失败');
      }
    } catch (error) {
      console.error('获取配置失败:', error);
      message.error('获取表单配置失败');
    }
  };

  // 获取详情数据
  const fetchDetail = async () => {
    try {
      const result = await getFormDetail({ formId: 1 });
      if (result.code === 0) {
        // 处理日期字段
        const formData = { ...result.data };
        Object.keys(formData).forEach((key) => {
          if (key.includes('date') || key.includes('Year') || key === 'birthday') {
            if (formData[key]) {
              formData[key] = dayjs(formData[key]);
            }
          }
        });
        form.setFieldsValue(formData);
      }
    } catch (error) {
      console.error('获取详情失败:', error);
      message.error('获取表单详情失败');
    }
  };

  // 提交表单
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const submitData = { ...values };
      Object.keys(submitData).forEach((key) => {
        if (dayjs.isDayjs(submitData[key])) {
          submitData[key] = submitData[key].format('YYYY-MM-DD');
        }
      });

      console.log('提交数据:', submitData);

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      message.success('保存成功');
    } catch (error) {
      console.error('提交失败:', error);
      message.error('保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
    message.info('表单已重置');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (!configData) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>暂无数据</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* 渲染进度 */}
      {isRendering && (
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            正在渲染表单...
            {' '}
            {progress}
            %
          </div>
          <Progress percent={progress} status="active" />
        </Card>
      )}

      {/* 表单 */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
      >
        <Card title="表单信息">
          <Row gutter={[16, 16]}>
            {renderedItems.map((field) => (
              <FormItem key={field.key} field={field} />
            ))}
          </Row>
        </Card>

        {/* 操作按钮 */}
        {!isRendering && (
        <div style={{
          textAlign: 'right',
          marginTop: '24px',
          padding: '16px',
          background: '#fff',
          borderTop: '1px solid #f0f0f0',
        }}
        >
          <Button
            style={{ marginRight: '8px' }}
            icon={<ReloadOutlined />}
            onClick={handleReset}
          >
            重置
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={submitting}
          >
            保存
          </Button>
        </div>
        )}
      </Form>
    </div>
  );
}

export default SimpleLongForm;
