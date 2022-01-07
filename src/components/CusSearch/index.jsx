import React, { useState } from 'react'

import { Input } from 'antd'
import styles from './index.module.scss'
import searchImg from '@/asset/img/sousuo.png'

const CusSearch = (props) => {
  const [search, setSearch] = useState(undefined)
  return (
    <div
      className={styles.cusSearchWrap}
      style={{ width: props.width || '100%' }}
    >
      <Input
        placeholder={props.placeholder || ''}
        className={styles.cusinput}
        size="large"
        onChange={(e) => {
          setSearch(e.target.value)
        }}
        allowClear={props.allowClear || false}
      />
      <div
        className={styles.searchIconwrap}
        onClick={(e) => props.onSearch(search)}
      >
        <img className={styles.searchIcon} src={searchImg} alt="" />
      </div>
    </div>
  )
}

export default CusSearch
