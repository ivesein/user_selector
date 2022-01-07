import React, { useState, useEffect } from 'react'
import { Divider, Button, Spin } from 'antd'
import { useHistory } from 'react-router-dom'
import icon1 from '@/asset/img/icon1.png'
import icon2 from '@/asset/img/icon2.png'
import person_index from '@/asset/img/person_index.png'
import role_index from '@/asset/img/role_index.png'
import notice_index from '@/asset/img/notice_index.png'
import process_index from '@/asset/img/process_index.png'
import calendar_index from '@/asset/img/calendar_index.png'
import empty_index from '@/asset/img/empty_index.png'
import * as echarts from 'echarts' // 引入echarts主模块
import styles from './index.module.scss'
import { connect } from 'react-redux'
import {
  GET_TENANT_NUMBER_API,
  GET_ACCESS_NUMBER_API,
  GET_ACCESS_CHART_API,
  GET_SERVICE_LIST_API,
  GET_DISK_SIZE_API,
  GET_HISTORY_LIST_API,
} from '@/api/homeApi'

// 首页
const IndexPage = (props) => {
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const [statisticsDataObj, setStatisticsDataObj] = useState({}) //企业统计
  const [yesterdayData, setYesterdayData] = useState('') //昨日访问数
  const [todayData, setTodayData] = useState('') //今日访问数
  const [netSize, setNetSize] = useState('') //文档中心
  const [visitList, setVisitList] = useState([]) //经常访问
  const [entryList, setEntryList] = useState([]) //快捷入口
  const [newsList, setNewsList] = useState([]) //最新动态
  const hisotry = useHistory()
  useEffect(() => {
    if (props.userInfo && props.userInfo !== 'null') {
      setUserName(props.userInfo.name || '')
      getTenant() // 企业统计
      getAssess() // 企业访问数
      getAssessChart() // 使用趋势
      getServiceList() // 经常访问菜单
      getDiskSize() // 网盘统计
      getHistory() // 最新动态
    }
  }, [props.userInfo])

  // 企业统计
  const getTenant = async () => {
    try {
      setLoading(true)
      let res = await GET_TENANT_NUMBER_API()
      if (res.code === 200) {
        setStatisticsDataObj(res.data)
        // 快捷入口
        let list = res.data.quickAccessList
        list.forEach((ele, index) => {
          switch (ele.accessName) {
            case '添加成员':
              ele.icon = person_index
              ele.accessUrlRL = '/admin/org/members'
              break
            case '添加角色':
              ele.icon = role_index
              ele.accessUrlRL = '/admin/org/roles'
              break
            case '通知通告':
              ele.icon = notice_index
              ele.accessUrlRL = '/admin/notice'
              break
            case '新建流程':
              ele.icon = process_index
              ele.accessUrlRL = '/admin/dingflow/create'
              break
            case '企业日历':
              ele.icon = calendar_index
              ele.accessUrlRL = '/admin/sys/calendar'
              break
            default:
              break
          }
        })
        setEntryList(list)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  // 企业访问数
  const getAssess = async () => {
    try {
      setLoading(true)
      let res = await GET_ACCESS_NUMBER_API()
      if (res.code === 200) {
        setYesterdayData(res.data.yesterday)
        setTodayData(res.data.today)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  // 使用趋势
  const getAssessChart = async () => {
    try {
      setLoading(true)
      let res = await GET_ACCESS_CHART_API()
      if (res.code === 200) {
        let date = []
        let num = []
        res.data.forEach((ele) => {
          date.push(ele.date)
          num.push(ele.number)
        })
        // 绘制图表
        getChart(date, num)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  // 基于准备好的dom，初始化echarts实例
  const getChart = (date, num) => {
    var myChart = echarts.init(document.getElementById('index_page_chart'))
    // 绘制图表
    myChart.setOption({
      grid: {
        left: '1.5%',
        right: '6%',
        top: '12%',
        bottom: 0,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        name: '',
        axisLabel: {
          interval: 0,
        },
        boundaryGap: false,
        data: date,
      },
      yAxis: {
        type: 'value',
        name: '',
        min: 0,
        max: function (data) {
          //取最大值向上取整为最大刻度
          return Math.ceil(data.max)
        },
        minInterval: 1, //分割刻度
        splitLine: {
          // show: true,
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      series: [
        {
          symbol: 'none',
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#245ff2',
              },
            },
          },
          areaStyle: {
            color: 'rgba(36, 95, 242, 0.5)',
          },
          data: num,
          type: 'line',
        },
      ],
    })
  }

  // 经常访问菜单
  const getServiceList = async () => {
    try {
      setLoading(true)
      let res = await GET_SERVICE_LIST_API()
      if (res.code === 200) {
        setVisitList(res.data)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  // 网盘统计
  const getDiskSize = async () => {
    try {
      setLoading(true)
      let res = await GET_DISK_SIZE_API()
      if (res.code === 200) {
        let size = bytesToSize(res.data.filesize)
        setNetSize(size)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  // 最新动态
  const getHistory = async () => {
    try {
      setLoading(true)
      let res = await GET_HISTORY_LIST_API()
      if (res.code === 200) {
        setNewsList(res.data.records)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  // 快捷入口
  const goEntry = (item) => {
    hisotry.push({ pathname: item.accessUrlRL })
  }

  // 字节转换
  const bytesToSize = (a, b) => {
    if (0 == a) return '0 B'
    var c = 1024,
      d = b || 2,
      e = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      f = Math.floor(Math.log(a) / Math.log(c))
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
  }

  // 更多
  const goMore = () => {
    hisotry.push('/admin/sys/operation_log')
  }
  // 跳转企业认证
  const goApplyCertification = () => {
    hisotry.push('/admin/sys/enterprise_info/apply_certification')
  }

  return (
    <>
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.top}>
            <span className={styles.name}>Hi~ {userName}</span>
            <span>你现在的身份是</span>
            <span className={styles.certify}>主管理员</span>
          </div>

          <div className={styles.middle}>
            <div className={styles.number}>
              <div className={styles.one}>
                <span>企业人数</span>
                <span>{statisticsDataObj.userNumber}</span>
              </div>

              <div className={styles.one}>
                <span>应用数</span>
                <span>{statisticsDataObj.appNumber}</span>
              </div>
              <div className={styles.one}>
                <span>在线用户数</span>
                <span>{statisticsDataObj.onlineUserNumber}</span>
              </div>
              <div className={styles.one}>
                <span>部门数</span>
                <span>{statisticsDataObj.orgNumber}</span>
              </div>
              <div className={styles.one}>
                <span>今日访问人数</span>
                <span>{todayData}</span>
              </div>
              <div className={styles.one}>
                <span>昨日访问人数</span>
                <span>{yesterdayData}</span>
              </div>
            </div>

            <div>
              <span>使用人数趋势</span>
              <div className={styles.personChart} id="index_page_chart"></div>
            </div>

            <div className={styles.visit}>
              <span>经常访问·一周内</span>
              {visitList.length !== 0 ? (
                <div className={styles.self}>
                  {visitList.map((item, index) => {
                    return (
                      <div key={index}>
                        <span>{item.serviceName}</span>
                        <span>{item.count}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                ''
              )}
            </div>

            <Divider />

            <div className={styles.bottom}>
              <span>企业认证获得更多权益</span>
              <div className={styles.company}>
                <div>
                  <img src={icon1} alt="" />
                  <img src={icon2} alt="" />
                </div>
                <Button onClick={(e) => goApplyCertification()}>
                  申请企业认证
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.equity}>
            <span>权益数据</span>
            <div className={styles.company}>
              <div className={styles.box}>
                <span style={{ display: 'inline-block' }}>
                  文档中心存储空间
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <p>去扩容 {'>'}</p>
                <span>{netSize}</span>
                <span>总容量{statisticsDataObj.maxNetDisk}GB</span>
              </div>

              <div className={styles.box}>
                <span>人数</span>
                <span>{statisticsDataObj.userNumber}人</span>
                <span>人数上限：{statisticsDataObj.maxUserNumber}人</span>
              </div>

              <div className={styles.box}>
                <span>已使用</span>
                <span>{statisticsDataObj.usedDays}天</span>
              </div>
            </div>
          </div>

          <div className={styles.equity}>
            <span>快捷入口</span>

            <div className={styles.entry}>
              {entryList.map((item, index) => {
                return (
                  <div
                    className={styles.card}
                    key={index}
                    onClick={() => goEntry(item)}
                  >
                    <img src={item.icon} alt="" />
                    <span>{item.accessName}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className={styles.news}>
            <div className={styles.latest}>
              <span>最新动态</span>
              <span onClick={goMore}>更多{'>'}</span>
            </div>

            <div className={styles.list}>
              {newsList.length !== 0 ? (
                <>
                  {newsList.map((item, index) => {
                    return (
                      <span
                        className={styles.operation}
                        key={index}
                        title={item}
                      >
                        {item}
                      </span>
                    )
                  })}
                </>
              ) : (
                <>
                  <img src={empty_index} alt="" />
                  <span className={styles.none}>暂无动态</span>
                </>
              )}
            </div>
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

export default connect((state) => ({
  userInfo: state.userInfo,
}))(IndexPage)
