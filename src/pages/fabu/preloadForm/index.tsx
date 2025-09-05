// components/LongForm.jsx
import React, { useState, useEffect } from 'react';
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
} from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './index.css';
import { getFormConfig, getFormDetail } from '../../../service/api';
import useSimpleRAF from '../../../hooks/useRAFRenderer';

const { TextArea } = Input;
const { Option } = Select;

function LongForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [configData, setConfigData] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
        setDetailData(result.data);
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
      } else {
        message.error('获取表单详情失败');
      }
    } catch (error) {
      console.error('获取详情失败:', error);
      message.error('获取表单详情失败');
    }
  };

  // 渲染表单项
  const renderFormItem = (field) => {
    const {
      key, label, type, required, options,
    } = field;

    const commonProps = {
      placeholder: `请输入${label}`,
      size: 'large',
    };

    switch (type) {
      case 'input':
        return <Input {...commonProps} />;

      case 'textarea':
        return (
          <TextArea
            {...commonProps}
            rows={4}
            placeholder={`请输入${label}`}
          />
        );

      case 'select':
        return (
          <Select
            {...commonProps}
            placeholder={`请选择${label}`}
          >
            {options?.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case 'date':
        return (
          <DatePicker
            {...commonProps}
            style={{ width: '100%' }}
            placeholder={`请选择${label}`}
          />
        );

      case 'number':
        return (
          <InputNumber
            {...commonProps}
            style={{ width: '100%' }}
            placeholder={`请输入${label}`}
          />
        );

      default:
        return <Input {...commonProps} />;
    }
  };

  // 提交表单
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      // 处理日期字段
      const submitData = { ...values };
      Object.keys(submitData).forEach((key) => {
        if (dayjs.isDayjs(submitData[key])) {
          submitData[key] = submitData[key].format('YYYY-MM-DD');
        }
      });

      console.log('提交数据:', submitData);

      // 这里可以调用提交接口
      // await fetch('/api/form/submit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(submitData)
      // });

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
    if (detailData) {
      const formData = { ...detailData };
      Object.keys(formData).forEach((key) => {
        if (key.includes('date') || key.includes('Year') || key === 'birthday') {
          if (formData[key]) {
            formData[key] = dayjs(formData[key]);
          }
        }
      });
      form.setFieldsValue(formData);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (!configData) {
    return <div>暂无配置数据</div>;
  }

  return (
    <div className="long-form-container">
      <h2>长表单渲染</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        scrollToFirstError
        size="large"
      >
        {configData?.sections.map((section, sectionIndex) => (
          <Card
            key={sectionIndex}
            title={section.title}
            className="form-section"
            size="small"
          >
            <Row gutter={[24, 16]}>
              {section.fields.map((field, fieldIndex) => (
                <Col
                  key={field.key}
                  xs={24}
                  sm={24}
                  md={12}
                  lg={8}
                  xl={8}
                >
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
                    {renderFormItem(field)}
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Card>
        ))}

        {/* 固定底部操作栏 */}
        <Affix offsetBottom={0}>
          <div className="form-actions">
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={handleReset}
              size="large"
            >
              重置
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={submitting}
              size="large"
            >
              保存
            </Button>
          </div>
        </Affix>
      </Form>
    </div>
  );
}

export default LongForm;
