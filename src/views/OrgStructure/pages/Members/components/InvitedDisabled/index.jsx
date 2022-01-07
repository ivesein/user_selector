import React, { useState } from 'react'
import { Button, Spin, message } from 'antd'
import styles from './index.module.scss'
import disableIcon from '@/asset/img/disable.png'
import { changeCodeStateApi } from '@/api/inviteApi'

const InvitedDisabled = (props) => {
  const [loading, setLoading] = useState(false)

  // 重新启用
  const openInvite = async () => {
    try {
      setLoading(true)
      let params = {
        code: props.code,
        valid: true,
      }
      let res = await changeCodeStateApi(params)
      if (!res) {
        message.error('服务器繁忙，请稍后再试...')
        return
      }
      if (res.code === 200) {
        props.setValid(true)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <div className={styles.disableMain}>
        <img src={disableIcon} alt="" />
        <span>当前部门的邀请功能已停用</span>
        <Button onClick={openInvite}>重新启用</Button>
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

export default InvitedDisabled
