import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Button,
  Spin,
  Breadcrumb,
  Checkbox,
  Pagination,
  message,
  Select,
} from 'antd'
import styles from '../InviteMembers/index.module.scss'
import styles1 from './index.module.scss'
import returnIcon from '@/asset/img/return.png'
import CusTableBasis from '@/components/CusTableBasis'
import { getApplyListApi, handleApplyApi } from '@/api/inviteApi'
import downImg from '@/asset/img/down.png'
const { Option } = Select

const ApplicantList = (props) => {
  let history = useHistory()
  const tableContainer = useRef(null)

  const [loading, setLoading] = useState(false)
  const [statusValue, setStatusValue] = useState('0') //申请状态 0-待审批，1-已审批，2-已拒绝
  const [flagValue, setFlagValue] = useState(0) //0-返回所有 1-只返回邀请人是我的申请记录
  const [tableData, setTableData] = useState([])
  const [y, setY] = useState(0)
  const [hoverRowId, setHoverRowId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1) //当前页
  const [currentPageSize, setCurrentPageSize] = useState(10) //每页条数
  const [total, setTotal] = useState(0) //总条数
  // 表格配置
  const tableConfig = {
    showSelection: false,
    bordered: false,
    rowKey: 'id',
    noPagination: true,
  }
  const columns = [
    {
      title: '申请人',
      dataIndex: 'name',
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
    },
    {
      title: '邀请人',
      dataIndex: 'inviter',
    },
    {
      title: '操作',
      width: 450,
      render: (item) => {
        return (
          <>
            <Button type="link" onClick={() => handlePassOrNo(item, 1)}>
              通过
            </Button>
            <Button type="link" danger onClick={() => handlePassOrNo(item, 2)}>
              不通过
            </Button>
          </>
        )
      },
    },
  ]

  useEffect(() => {
    // 获取表格高度
    if (tableContainer.current) {
      setY(
        tableContainer.current.clientHeight > 520
          ? 520
          : tableContainer.current.clientHeight
      )
    }
  }, [tableData])

  useEffect(() => {
    getInitData(statusValue, flagValue)
  }, [currentPage])

  // 申请人列表
  const getInitData = async (statusV, flagV) => {
    try {
      setLoading(true)
      let params = {
        current: currentPage,
        size: currentPageSize,
        status: statusV, //0-申请未处理，1-已通过，2-已拒绝
        flag: flagV, //0-返回所有 1-只返回邀请人是我的申请记录
      }
      let res = await getApplyListApi(params)
      if (!res) {
        message.error('服务器繁忙，请稍后再试...')
        return
      }
      if (res.data) {
        setTableData(res.data.records)
        setCurrentPage(res.data.current)
        setCurrentPageSize(res.data.size)
        setTotal(res.data.total)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  // 通过
  const handlePassOrNo = async (item, type) => {
    try {
      setLoading(true)
      let params = {
        id: item.id, //当前申请记录id
        name: item.name, // 申请人姓名
        phone: item.phone, //	申请人手机号
        applyId: item.applyId, //获取申请链接时返回的自增id
        status: type, // 状态：0-不处理，1-通过，2-拒绝
      }
      let res = await handleApplyApi(params)
      if (!res) {
        message.error('服务器繁忙，请稍后再试...')
        return
      }
      if (res.code === 200) {
        getInitData(statusValue, flagValue)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  // 返回成员管理
  const goMembers = () => {
    history.push('/admin/org/members')
  }

  // 返回邀请
  const goInvite = () => {
    history.push({
      pathname: '/admin/org/members/invite',
      state: {
        departmentId: props.location.state?.departmentId || '',
        manageId: props.location.state?.manageId || '',
      },
    })
  }

  // select切换
  const onSelectChange = (value) => {
    setStatusValue(value)
    getInitData(value, flagValue)
  }

  // checkBox
  const onCheckBoxChange = (e) => {
    if (e.target.checked) {
      setFlagValue(statusValue, 1)
      getInitData(1)
    } else {
      setFlagValue(0)
      getInitData(statusValue, 0)
    }
  }

  // 处理翻页
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
      <div className={styles.title}>
        <Breadcrumb>
          <Breadcrumb.Item>权限管理</Breadcrumb.Item>
          <Breadcrumb.Item onClick={goMembers}>
            <a>成员管理</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item onClick={goInvite}>
            <a>邀请成员</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>申请人列表</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.tip}>
          <div>
            <div onClick={goInvite}>
              <img src={returnIcon} alt="" />
              <span>返回</span>
            </div>
            <span>申请人列表</span>
          </div>
        </div>
      </div>

      <div className={styles1.ApplicantMain}>
        <div className={styles1.content}>
          <div className={styles1.top}>
            <div className={styles1.filterSelectWrap}>
              <span className={styles1.title}>申请状态</span>
              <Select
                bordered={false}
                value={statusValue}
                style={{ flex: 1 }}
                onChange={onSelectChange}
                suffixIcon={<img src={downImg} alt="" />}
              >
                <Option value="0">待审批</Option>
                <Option value="1">已审批</Option>
                <Option value="2">已拒绝</Option>
              </Select>
            </div>
            <Checkbox onChange={onCheckBoxChange}>仅显示我邀请的人</Checkbox>
          </div>

          <div className={styles1.tableWrap} ref={tableContainer}>
            <CusTableBasis
              config={tableConfig}
              setHoverRowId={setHoverRowId}
              columns={columns}
              dataSource={tableData}
              y={y}
            />
          </div>
          <div className={styles1.paginationWrap}>
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

export default ApplicantList
