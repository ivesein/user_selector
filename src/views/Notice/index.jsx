import React, { useState, useRef, useEffect } from 'react'
import {
  Button,
  DatePicker,
  Space,
  Pagination,
  Modal,
  Spin,
  Form,
  message,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import CusSearch from '@/components/CusSearch'
import CusTableBasis from '@/components/CusTableBasis'
import NoticesForm from './components/NoticesForm'
import DetailInfo from '@/components/common/DetailInfo'
import { NOTIC_DIC_LIST, NOTIC_DELETE, NOTIC_UPDATE } from '@/api/urlConfig'
import { nomalGet, nomalDelete, addTableData } from '@/api/superApi'
import styles from './index.module.scss'
const { RangePicker } = DatePicker
const { confirm } = Modal

// 通知公告
const Notice = (props) => {
  const tableContainer = useRef(null) // 表格容器ref
  const formRef = React.createRef()

  const [loading, setLoading] = useState(false) //loading
  const [tip, setTip] = useState('') //loading 提示
  const [searchText, setSearchText] = useState(null)
  const [hoverRowId, setHoverRowId] = useState(null) // 设置当前鼠标移入的行id
  const [y, setY] = useState(0) //表格容器高度
  const [total, setTotal] = useState(0) //总条数
  const [selectedRowKeys, setSRK] = useState([]) //勾选变更
  const [currentPage, setCP] = useState(1) //当前页
  const [currentPageSize, setCPS] = useState(10) //每页条数
  const [tableData, setTableData] = useState([]) //表格数据
  const [addModalVisible, setAMV] = useState(false) //新增
  const [currentRow, setCR] = useState(null) //当前行点击
  const [noticeContentVisible, setNCV] = useState(false) //查看
  const [viewLoading, setVL] = useState(false)

  // 表格配置
  const tableConfig = {
    showSelection: true,
    bordered: false,
    rowKey: 'id',
    noPagination: true,
  }
  // 表格列配置
  const columns = [
    {
      title: '序号',
      dataIndex: '',
      width: '100px',
      render: (text, row, index) => {
        return (currentPage - 1) * currentPageSize + index + 1
      },
    },
    {
      title: '标题',
      width: '280px',
      dataIndex: 'notTitle',
    },
    {
      title: '来源',
      width: '200px',
      dataIndex: 'origin',
      render: (text, row, index) => {
        return text === 0 ? '系统通知' : '公司通知'
      },
    },
    {
      title: '内容',
      dataIndex: 'notContent',
    },
    {
      title: '日期',
      width: '250px',
      dataIndex: 'gmtCreated',
    },
    {
      title: '状态',
      width: '200px',
      dataIndex: 'read',
      render: (text, row, index) => {
        return text ? '已读' : '未读'
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, row, index) => {
        return (
          <Space size={2}>
            <Button type="link" onClick={() => goViewMsg(row)}>
              查看
            </Button>
            <Button
              type="link"
              danger
              onClick={() => goSingleDel(row.id, '单选')}
            >
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  useEffect(() => {
    // 获取表格高度
    if (tableContainer.current) {
      setY(tableContainer.current.clientHeight)
    }
  }, [tableData])

  useEffect(() => {
    loadTableData(props.searchText)
  }, [currentPage, currentPageSize])

  useEffect(() => {
    setCP(1)
    setCPS(10)
    if (searchText && searchText.length !== 0) {
      loadTableData(searchText)
    } else {
      loadTableData()
    }
  }, [searchText])

  const loadTableData = (searchText = []) => {
    setLoading(true)
    setTip('正在加载....')
    const params = {
      url: NOTIC_DIC_LIST,
      data: {
        size: currentPageSize,
        current: currentPage,
      },
    }
    if (searchText && searchText.length !== 0) {
      searchText.forEach((v) => {
        params.data[v.key] = v.value
      })
    }
    nomalGet(params)
      .then((res) => {
        if (res.code === 200) {
          setTotal(res.data.total)
          setTableData(res.data.records)
        }
        setSRK([])
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
        setTip('')
      })
  }

  // 搜索
  const onSearch = (params) => {
    let params_key = params //关键字
    let params_value = formRef.current.getFieldValue('params_value') //日期
    if (params_key || params_value) {
      let arr = []
      if (params_key !== undefined && params_key !== '') {
        arr.push({ key: 'query', value: params_key })
      }
      if (
        params_value !== undefined &&
        params_value !== '' &&
        params_value !== null
      ) {
        let start_time = getDateFormat(params_value[0], 'start')
        let end_time = getDateFormat(params_value[1], 'end')
        arr.push({ key: 'beginTime', value: start_time })
        arr.push({ key: 'endTime', value: end_time })
      }
      setSearchText(arr)
    } else {
      setSearchText([])
    }
  }

  // 删除
  const goSingleDel = (value, flag) => {
    let params
    switch (flag) {
      case '单选':
        params = {
          url: NOTIC_DELETE,
          data: {
            id: [value],
          },
        }
        break

      case '多选':
        params = {
          url: NOTIC_DELETE,
          data: {
            id: Array.isArray(value) ? value : [value.id],
          },
        }
        break

      default:
        break
    }
    confirm({
      title: '删除',
      icon: <ExclamationCircleOutlined />,
      content: '请确认是否删除！',
      onOk() {
        setLoading(true)
        setTip('正在加载....')
        return new Promise((resolve, reject) => {
          nomalDelete(params)
            .then((res) => {
              if (res.code === 200) {
                message.success('删除成功')
                loadTableData()
                resolve(1)
              }
            })
            .catch((err) => {
              console.log(err)
              reject(err)
            })
            .finally(() => {
              setLoading(false)
              setTip('')
            })
        })
      },
      onCancel() {},
    })
  }

  // 批量删除
  const goMultipleDel = () => {
    if (selectedRowKeys.length > 0) {
      goSingleDel(selectedRowKeys, '多选')
    } else {
      message.warning('请至少选择一条')
    }
  }

  // 处理翻页
  const handlePageChange = (page) => {
    setCP(page)
  }

  // 处理勾选变更
  const onSelectChange = (selectedRowKeys) => {
    setSRK(selectedRowKeys)
  }

  // 新增
  const openNoticeModal = (data = null) => {
    setAMV(true)
  }

  // 查看
  const goViewMsg = (item) => {
    setCR(item)
    setNCV(true)
  }

  // 查看-设为已读
  const goUpdateMsg = async (bool) => {
    try {
      setVL(true)
      setLoading(true)
      setTip('正在加载....')
      let params = {
        url: NOTIC_UPDATE,
        data: {
          ids: [currentRow.id],
          read: bool,
        },
      }
      let res = await addTableData(params)
      if (res.code === 200) {
        loadTableData(searchText)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setVL(false)
      setNCV(false)
      setLoading(false)
      setTip('')
    }
  }

  // 处理日期格式
  const getDateFormat = (time, type) => {
    var d = new Date(time)
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    month = month >= 10 ? month : '0' + month
    let day = d.getDate()
    day = day >= 10 ? day : '0' + day

    switch (type) {
      case 'start':
        return year + '-' + month + '-' + day + ' 00:00:00'
        break

      case 'end':
        return year + '-' + month + '-' + day + ' 23:59:59'
        break

      default:
        break
    }
  }

  // 隐藏模态框
  const hideModal = () => {
    setAMV(false)
  }

  // 重载数据
  const reloadData = (num) => {
    //num 1新增 初始化第一页
    if (num === 1) {
      if (currentPage === 1) {
        loadTableData()
        return
      }
      setCP(1)
      loadTableData()
    } else {
      // num 2修改 重新加载当前页
      loadTableData()
    }
  }

  return (
    <>
      <span className={styles.title}>通知公告</span>
      <div className={styles.NoticeMain}>
        <div className={styles.controlBar}>
          <div>
            <Button
              className={styles.cusBtn}
              type="primary"
              icon={<PlusOutlined />}
              style={{ marginRight: '8px' }}
              onClick={openNoticeModal}
            >
              新增
            </Button>
            <Button
              className={styles.cusBtn}
              danger
              icon={<DeleteOutlined />}
              onClick={goMultipleDel}
            >
              删除
            </Button>
          </div>

          <div style={{ display: 'flex' }}>
            <Form ref={formRef} layout="inline">
              <Form.Item label="" name="params_value">
                <RangePicker
                  style={{
                    marginRight: '16px',
                    width: 290,
                    height: 40,
                  }}
                />
              </Form.Item>
            </Form>

            <CusSearch
              onSearch={onSearch}
              width={288}
              placeholder="请输入搜索关键词"
            />
          </div>
        </div>

        <div className={styles.tableWrap} ref={tableContainer}>
          <CusTableBasis
            config={tableConfig}
            setHoverRowId={setHoverRowId}
            columns={columns}
            dataSource={tableData}
            y={y}
            selectedRowKeys={selectedRowKeys}
            onSelectChange={onSelectChange}
          />
        </div>
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
      <div
        className="init-loading"
        style={{ display: loading ? 'block' : 'none' }}
      >
        <Spin tip={tip}></Spin>
      </div>

      <Modal
        title={'新增'}
        visible={addModalVisible}
        okText="确认"
        cancelText="取消"
        onCancel={hideModal}
        footer={[]}
        width={560}
        maskClosable={false}
        destroyOnClose={true}
      >
        <NoticesForm
          reloadData={reloadData}
          openType={1}
          hideModal={hideModal}
          // initValueProps={currentRow}
        />
      </Modal>

      <Modal
        title="通知内容"
        visible={noticeContentVisible}
        okText="确认"
        width={800}
        cancelText="取消"
        closable={false}
        footer={[
          <Button
            type="primary"
            key="read"
            loading={viewLoading}
            onClick={() => goUpdateMsg(true)}
          >
            确定
          </Button>,
        ]}
      >
        <DetailInfo
          info={{
            title: currentRow?.notTitle ?? '',
            sender: currentRow?.sendUserName ?? '',
            sendTime: currentRow?.gmtCreated ?? '',
            content: currentRow?.notContent ?? '',
          }}
        />
      </Modal>
    </>
  )
}

export default Notice
