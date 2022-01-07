import React from 'react'
import styles from './index.module.scss'
import { Divider } from 'antd'
const DetailInfo = (props) => {
  return (
    <div className={styles.detailInfo}>
      <div className={styles.TitleWrap}>
        <span className={styles.title}>{props?.info?.title ?? '无标题'}</span>
        <div className={styles.extraInfo}>
          <span>(发布人：{props?.info?.sender ?? 'admin'})</span>
          <span>发布时间：{props?.info?.sendTime ?? ''}</span>
        </div>
      </div>
      <Divider style={{ marginTop: 10 }} />
      <div className={styles.detailInfoContent}>
        {props?.info?.content ?? ''}
      </div>
    </div>
  )
}

export default DetailInfo
