import React, { Component } from "react";
import { Form, Input, Select, Button, Space, DatePicker, Radio } from "antd";
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
export default class FormBasis extends Component {
  state = {
    msgPrefix: {
      input: "请输入",
      radio: "请选择",
      select: "请选择",
      textarea: "请输入"
    },
  };
  formRef = React.createRef();
  initFormItem = () => {
    console.log(this.props);
    const { itemConfig } = this.props;
    let formItemArr = [];
    if (itemConfig && itemConfig.length > 0) {
      itemConfig.map((item) => {
        if (item === null) return null
        switch (item.type) {
          case "input":
            formItemArr.push(this.renderInputItem(item));
            break;
          case "radio":
            formItemArr.push(this.renderRadioItem(item));
            break;
          case "select":
            formItemArr.push(this.renderSelectItem(item));
            break;
          case "datePicker":
            formItemArr.push(this.renderDatePickerItem(item));
            break;
          case "textarea":
            formItemArr.push(this.renderTextAreaItem(item));
            break;
          default:
            break;
        }
        return false;
      });
    }
    return formItemArr;
  };
  setRules = (item) => {
    const { msgPrefix } = this.state;
    let relus = [];
    if (item.required) {
      let message = item.message || `${msgPrefix[item.type]}${item.label}`;
      relus.push({ required: true, message: message });
    }
    if (item.rules && item.rules.length > 0) {
      relus.concat(item.rules);
    }
    return relus;
  };
  // 渲染input formitem
  renderInputItem = (item) => {
    return (
      <Form.Item
        name={item.name}
        label={item.label}
        rules={this.setRules(item)}
        key={item.name}
      >
        <Input style={item.style || null} placeholder={item.placeholder} />
      </Form.Item>
    );
  };
  // 渲染radio formitem
  renderRadioItem = (item) => {
    return (
      <Form.Item
        name={item.name}
        label={item.label}
        rules={this.setRules(item)}
        key={item.name}
      >
        <Radio.Group>
          {
            item.option && item.option.map(op => {
              return (
                <Radio value={op.value}>{op.label}</Radio>
              )
            })
          }
        </Radio.Group>
      </Form.Item>
    );
  }
  // 渲染select formitem
  renderSelectItem = (item) => {
    return (
      <Form.Item
        name={item.name}
        label={item.label}
        rules={this.setRules(item)}
        key={item.name}
      >
        <Select style={item.style || null} placeholder={item.placeholder}>
          {item.option &&
            item.option.map((op) => {
              return (
                <Option value={op.value} key={op.value}>
                  {op.label}
                </Option>
              );
            })}
        </Select>
      </Form.Item>
    );
  };
  renderRangePickerItem = (item) => {
    return (
      <Form.Item
        name={item.name}
        label={item.label}
        rules={this.setRules(item)}
        key={item.name}
      >
        <RangePicker showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" />
      </Form.Item>
    );
  };
  renderTextAreaItem = (item) => {
    return (
      <Form.Item
        name={item.name}
        label={item.label}
        rules={this.setRules(item)}
        key={item.name}
      >
        <TextArea rows={5} />
      </Form.Item>
    );
  }
  renderDatePickerItem = (item) => {
    return (
      <Form.Item
        name={item.name}
        label={item.label}
        rules={this.setRules(item)}
        key={item.name}
      >
        <DatePicker showTime />
      </Form.Item>
    );
  };

  componentDidUpdate() {
    console.log("this.props.initValueProps>>>", this.props);
    if (this.props.openType === 1) {
      this.formRef.current.resetFields();
    } else {
      // this.props.initValueProps.gmtCreated=moment(this.props.initValueProps.gmtCreated)
      this.formRef.current.setFieldsValue(this.props.initValueProps);
    }
  }

  render() {
    const {
      formName,
      onFinish,
      initialValues,
      layout,
      loading,
      cancle,
      openType,
    } = this.props;

    return (
      <Form
        ref={this.formRef}
        {...layout}
        initialValues={openType === 1 ? null : initialValues}
        name={formName}
        onFinish={onFinish}
      >
        {this.initFormItem()}
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Space size="middle" className="margin-top">
            <Button onClick={cancle}>取消</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              确定
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  }
}
