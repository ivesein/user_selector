import React from 'react'
import { useHistory } from 'react-router-dom'
import styles from './index.module.scss'
import inviteIcon from '@/asset/img/invite.png'

// 成员
const Members = (props) => {
  let history = useHistory()

  // 邀请
  const goInvite = () => {
    history.push('/admin/org/members/invite')
  }

  return (
    <div className={styles.MembersMain}>
      <div className={styles.title}>
        <span>成员管理</span>

        <div className={styles.inviteBtn} onClick={goInvite}>
          <img src={inviteIcon} alt="" />
          <span>邀请成员加入本组织</span>
        </div>
      </div>
    </div>
  )
}

export default Members
