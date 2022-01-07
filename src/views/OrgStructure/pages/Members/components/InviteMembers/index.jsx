import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, message, Spin, Breadcrumb, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import CusFormItemSelect from '@/components/CusFormItemSelect'
import styles from './index.module.scss'
import refreshIcon from '@/asset/img/refresh.png'
import returnIcon from '@/asset/img/return.png'
import forbiddenIcon from '@/asset/img/forbidden.png'
import {
  getCodeAndUrlApi,
  refreshCodeAndUrlApi,
  changeCodeStateApi,
} from '@/api/inviteApi'
import InvitedDisabled from '../InvitedDisabled'

const InviteMembers = (props) => {
  let history = useHistory()
  const [loading, setLoading] = useState(false)
  const [periodValue, setPeriodValue] = useState('1') //有效期选项
  const [deadline, setDeadline] = useState('') //截止日期
  const [code, setCode] = useState('') //邀请码
  const [url, setUrl] = useState('') //邀请链接
  const [valid, setValid] = useState(false) //true启用 false禁用
  const [selectList, setSelectList] = useState([
    {
      id: 1,
      label: '1天后过期',
      value: '1',
    },
    {
      id: 2,
      label: '7天后过期',
      value: '7',
    },
    {
      id: 3,
      label: '30天后过期',
      value: '30',
    },
  ])

  useEffect(() => {
    getCodeAndUrl()
  }, [])

  // 获取邀请链接
  const getCodeAndUrl = async () => {
    try {
      setLoading(true)
      let params = {
        deptId: props.location.state?.departmentId || '',
        manageId: props.location.state?.manageId || '',
        deadLine: periodValue,
      }
      let res = await getCodeAndUrlApi(params)
      if (!res) {
        message.error('服务器繁忙，请稍后再试...')
        return
      }
      if (res.code === 200) {
        setDeadline(res.data.deadline)
        setCode(res.data.code)
        setUrl(res.data.link)
        setValid(res.data.valid)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  // 复制邀请码
  const handleCopy = (type) => {
    let copyDOM
    switch (type) {
      // 邀请码
      case 'code':
        copyDOM = document.getElementById('copy_invite_code')
        break

      // 链接
      case 'link':
        copyDOM = document.getElementById('copy_invite_link')
        break

      default:
        break
    }
    let code = document.createRange() //创建一个range
    window.getSelection().removeAllRanges() //清楚页面中已有的selection
    code.selectNode(copyDOM) // 选中需要复制的节点
    window.getSelection().addRange(code) // 执行选中元素
    let successful = document.execCommand('copy') // 执行 copy 操作
    if (successful) {
      message.success('复制成功！')
    } else {
      message.warning('复制失败，请手动复制！')
    }
    // 移除选中的元素
    window.getSelection().removeAllRanges()
  }

  // select切换
  const onSelectChange = (value) => {
    setPeriodValue(value)
    goRefresh(value)
  }

  // 刷新
  const goRefresh = async (val) => {
    try {
      setLoading(true)
      let params = {
        deptId: props.location.state?.departmentId || '',
        manageId: props.location.state?.manageId || '',
        deadLine: periodValue,
      }
      let res = await refreshCodeAndUrlApi(params)
      if (!res) {
        message.error('服务器繁忙，请稍后再试...')
        return
      }
      if (res.code === 200) {
        setDeadline(res.data.deadline)
        setCode(res.data.code)
        setUrl(res.data.link)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  // 禁用邀请
  const stopInvite = async () => {
    Modal.confirm({
      title: '温馨提示',
      icon: <ExclamationCircleOutlined />,
      content:
        '停用后，当前部门的邀请链接将会自动失效，后续他人无法再通过该链接加入。',
      okText: '确认停用',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true)
          let params = {
            code: code,
            valid: valid,
          }
          let res = await changeCodeStateApi(params)
          if (!res) {
            message.error('服务器繁忙，请稍后再试...')
            return
          }
          if (res.code === 200) {
            setValid(false)
          }
        } catch (error) {
        } finally {
          setLoading(false)
        }
      },
      onCancel() {},
    })
  }

  // 返回成员
  const goMembers = () => {
    history.push('/admin/org/members')
  }

  // 申请人列表
  const goApplicant = () => {
    history.push({
      pathname: '/admin/org/members/invite/list',
      state: {
        departmentId: props.location.state?.departmentId || '',
        manageId: props.location.state?.manageId || '',
      },
    })
  }

  return (
    <>
      <div className={styles.title}>
        <Breadcrumb>
          <Breadcrumb.Item>权限管理</Breadcrumb.Item>
          <Breadcrumb.Item onClick={goMembers}>
            <a>成员管理</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>邀请成员</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.tip}>
          <div>
            <div onClick={goMembers}>
              <img src={returnIcon} alt="" />
              <span>返回</span>
            </div>
            <span>邀请成员加入</span>
          </div>
          <Button onClick={goApplicant}>申请人列表</Button>
        </div>
      </div>

      <div className={styles.InviteMain}>
        {valid ? (
          <div className={styles.content}>
            <div className={styles.tip}>
              <span>
                可通过下列任意方式邀请员工加入本部门，目前的邀请有效期至
                {deadline}
              </span>

              <div
                className={styles.refresh}
                onClick={() => goRefresh(periodValue)}
              >
                <img src={refreshIcon} alt="" />
                <span>点击刷新</span>
              </div>

              <div
                className={styles.refresh}
                style={{ background: '#fff' }}
                onClick={stopInvite}
              >
                <img src={forbiddenIcon} alt="" />
                <span>停用邀请</span>
              </div>
            </div>

            <div className={styles.middle}>
              <div className={styles.methodCode}>
                <span>企业邀请码</span>
                <span>成员可输入邀请码加入团队</span>
                <span id="copy_invite_code">{code}</span>
                <Button onClick={() => handleCopy('code')}>复制邀请码</Button>
              </div>
              <div className={styles.methodCode}>
                <span>企业链接</span>
                <span>成员访问链接可申请加入团队</span>
                <div className={styles.link}>
                  <span>用这个专属链接加入我们吧！</span>
                  <span id="copy_invite_link">{url}</span>
                </div>
                <Button
                  onClick={() => handleCopy('link')}
                  style={{ marginTop: '16px' }}
                >
                  复制链接邀请
                </Button>
              </div>
            </div>

            <div className={styles.bottom}>
              <span>邀请设置</span>
              <span>设置邀请有效期</span>
              <CusFormItemSelect
                value={periodValue}
                options={selectList}
                onChange={onSelectChange}
              />
            </div>
          </div>
        ) : (
          <InvitedDisabled code={code} setValid={setValid} />
        )}
      </div>

      <div
        className="init-loading"
        style={{ display: loading ? 'block' : 'none' }}
      >
        <Spin tip={'正在加载....'}></Spin>
      </div>
    </>
  )
}

export default InviteMembers
