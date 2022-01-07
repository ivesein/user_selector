import React, { Component } from 'react'
import FormBasis from '@/components/common/FormBasis'
import { addTableData, updateTableData } from '@/api/superApi'
import { NOTIC_UPDATE, NOTIC_ADD } from '@/api/urlConfig'
import { message } from 'antd'
import moment from 'moment'
import { getUserCache } from '@/utils/toolfunc'
const clUser = getUserCache('userInfo')
// console.log('clUser>>>', clUser)
export default class NoticesForm extends Component {
  state = {
    formName: 'paramsSettingForm',
    itemConfig: [
      {
        type: 'input',
        label: '通知标题',
        required: true,
        name: 'notTitle',
        placeholder: '请输入通知标题',
        style: { width: '200px' },
      },
      // {
      //   type: "select",
      //   label: "通知类型",
      //   required: true,
      //   name: "notType",
      //   option: [
      //     { label: "发布通知", value: "1" },
      //     { label: "批转通知", value: "2" },
      //     { label: "转发通知", value: "3" },
      //     { label: "指示通知", value: "4" },
      //     { label: "任免通知", value: "5" },
      //     { label: "事务通知", value: "6" },
      //   ],
      //   placeholder: "请选择通知类型",
      //   style: { width: "200px" },
      // },
      // {
      //   type: 'input',
      //   label: '通知类型',
      //   required: true,
      //   placeholder: '请输入通知类型',
      //   name: 'notType',
      //   style: { width: '200px' },
      // },
      // clUser && clUser.tenantId === '1'
      //   ? {
      //       type: 'radio',
      //       label: '通知场景',
      //       required: true,
      //       placeholder: '请选择通知场景',
      //       name: 'scene',
      //       option: [
      //         { label: '系统管理员可见', value: 0 },
      //         { label: '全用户可见', value: 1 },
      //       ],
      //       style: { width: '200px' },
      //     }
      //   : null,
      // {
      //   type: "datePicker",
      //   label: "通知日期",
      //   required: true,
      //   name: "gmtCreated",
      //   placeholder: "请输入通知日期",
      //   style: { width: "200px" },
      // },
      {
        type: 'textarea',
        label: '通知内容',
        required: true,
        name: 'notContent',
        placeholder: '请输入通知内容',
        style: { width: '200px' },
      },
    ],
    initialValues: {
      dictName: '',
      dictNum: null,
    },
    layout: {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    },
    loading: false,
  }

  getDateFormats = (time) => {
    var d = new Date(time)
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    let hour = d.getHours()
    let minut = d.getMinutes()
    let second = d.getSeconds()
    hour = hour > 10 ? 10 : '0' + hour
    minut = minut > 10 ? minut : '0' + minut
    second = second > 10 ? second : '0' + second
    month = month > 10 ? month : '0' + month
    let day = d.getDate()
    day = day > 10 ? day : '0' + day
    return (
      year + '-' + month + '-' + day + ' ' + hour + ':' + minut + ':' + second
    )
  }

  // 确定
  onFinish = (value) => {
    const { openType } = this.props
    this.setState({
      loading: true,
    })

    let params
    if (openType === 1) {
      params = {
        url: NOTIC_ADD,
        data: value,
      }
      params.data.notType = ''
      params.data.scene = 0
      params.data.origin = 1 //公司
      // 新增
      addTableData(params)
        .then((res) => {
          if (res.code === 200) {
            message.success('添加成功')
            this.props.reloadData(1)
          }
        })
        .catch((err) => {})
        .finally(() => {
          this.setState({
            loading: false,
          })
          this.props.hideModal()
        })
    } else {
      // 修改
      params = {
        url: NOTIC_UPDATE,
        data: value,
      }
      params.data.id = this.props.initValueProps.id
      updateTableData(params)
        .then((res) => {
          if (res.code === 200) {
            message.success('修改成功')
            this.props.reloadData(2)
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.setState({
            loading: false,
          })
          this.props.hideModal()
        })
    }
  }

  cancle = () => {
    this.props.hideModal()
  }

  render() {
    const { itemConfig, formName, initialValues, layout, loading } = this.state
    let { initValueProps, openType } = this.props
    // initValueProps.gmtCreated=openType === 1?"":moment(new Date(initValueProps.gmtCreated))
    return (
      <FormBasis
        openType={openType}
        initValueProps={initValueProps}
        loading={loading}
        layout={layout}
        itemConfig={itemConfig}
        onFinish={this.onFinish}
        cancle={this.cancle}
        formName={formName}
        initialValues={initValueProps ? initValueProps : initialValues}
      />
    )
  }
}
