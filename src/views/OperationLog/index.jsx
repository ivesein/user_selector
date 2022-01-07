import React, { useState, useEffect } from 'react'
import { Divider, Pagination, Spin, message } from 'antd'
import styles from './index.module.scss'
import CusSearch from '../../components/CusSearch'
import { GET_ASSESS_LIST_API } from '@/api/homeApi'

// 操作动态
const OperationLog = (props) => {
  const [loading, setLoading] = useState(false) //loading

  const [tabValue, setTabValue] = useState(1)
  const tabList = [
    {
      id: 1,
      name: '今天',
    },
    {
      id: 2,
      name: '昨天',
    },
    {
      id: 3,
      name: '本周',
    },
  ]
  const [searchText, setSearchText] = useState('') //搜索关键字
  const [logList, setLogList] = useState([])
  const [total, setTotal] = useState(0) //总条数
  const [currentPage, setCurrentPage] = useState(1) //当前页
  const [currentPageSize, setCurrentPageSize] = useState(10) //每页条数

  useEffect(() => {
    getAssessList(tabValue, searchText, currentPage)
  }, [])

  // 企业日志
  const getAssessList = async (tab, search, current) => {
    try {
      setLoading(true)
      let params = {
        type: tab,
        keyword: search,
        current: current,
        size: currentPageSize,
      }
      let res = await GET_ASSESS_LIST_API(params)
      if (!res) {
        message.error('服务器繁忙，请稍后再试...')
        return
      }
      if (res.code === 200) {
        setLogList(res.data.records)
        setTotal(res.data.total)
        setCurrentPage(res.data.current)
        setCurrentPageSize(res.data.size)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  // 搜索
  const onSearch = (params) => {
    setSearchText(params)
    getAssessList(tabValue, params, currentPage)
  }

  // 导航切换-currentPage从第一页开始
  const tabChange = (item) => {
    setTabValue(item.id)
    getAssessList(item.id, searchText, 1)
  }

  // 处理翻页
  const handlePageChange = (page) => {
    setCurrentPage(page)
    getAssessList(tabValue, searchText, page)
  }

  return (
    <>
      <span className={styles.title}>操作动态</span>
      <div className={styles.LogMain}>
        <div className={styles.top}>
          <div className={styles.tab}>
            {tabList.map((item, index) => {
              return (
                <span
                  key={index}
                  onClick={() => tabChange(item)}
                  className={item.id === tabValue ? styles.active : styles.none}
                >
                  {item.name}
                </span>
              )
            })}
          </div>

          <CusSearch
            onSearch={onSearch}
            width={288}
            placeholder="请输入搜索关键词"
          />
        </div>

        <div className={styles.content}>
          <div className={styles.log}>
            {logList.map((item, index) => {
              return <span key={index}>{item}</span>
            })}
          </div>
          <Divider />
          <div className={styles.paginationWrap}>
            <Pagination
              total={total}
              current={currentPage}
              onChange={handlePageChange}
              showQuickJumper
              showTotal={(total) => (
                <span
                  style={{ fontSize: 14, color: '#323233' }}
                >{`共 ${total} 条，每页 ${currentPageSize} 条`}</span>
              )}
            />
          </div>
        </div>
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

export default OperationLog
