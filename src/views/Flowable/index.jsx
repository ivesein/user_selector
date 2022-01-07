import { useEffect, useState, useRef } from 'react'
import { Menu, Form, Select, Input, Space, Button, Pagination, message, Modal, Switch } from 'antd'
import { ReloadOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Link, useHistory, Route } from "react-router-dom"
import PrivateRouter from '@/components/PrivateRouter'
import CusTableBasis from '@/components/CusTableBasis'
import CusSearch from '@/components/CusSearch'
import ProcessDetail from './components/ProcessDetail'
import { 
    copyProcessData,
    getFlowableModelProcessList,
    syncProcessData,
    delFlowableProcessData,
    suspendFlowableProcessData,
    activeFlowableProcessData,
} from '@/api/flowableApi'
import './index.scss'

const Flowable = props => {

    const [ selectedKeys, setSelectedKeys ] = useState('')
    const [ searchText, setSearchText ] = useState(null)
    const [ modelName, setModelName ] = useState('')
    const [ modelStatus, setModelStatus ] = useState('')
    const [ hoverRowId, setHoverRowId ] = useState(null)
    const [ pageLoading, setPageLoading ] = useState(false)
    const [ y, setY ] = useState(0)
    const [ total, setTotal ] = useState(0)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ currentPageSize, setCPS ] = useState(10)
    const [ tableData, setTableData ] = useState([])
    const [ visible, setVisible ] = useState(false)
    const [ detail, setDetail ] = useState(null)
    
    const tableContainer = useRef(null)
    const history = useHistory()
    const [ searchForm ] = Form.useForm()
	let { history: { location: { pathname } } } = props

    useEffect(() => {
        if(pathname === '/admin/workflow') {
			history.push({ pathname: '/admin/workflow/system', state: { homePath: '/admin/workflow' } })
		} else {
            setSelectedKeys(pathname)
        }
    })

    useEffect(() => {
        copyProcess()
    }, [])

    useEffect(() => {
        loadModelData()
    }, [ currentPage, currentPageSize, modelStatus, modelName ])

    useEffect(() => {
		history.replace({ pathname, state: { homePath: '/admin/workflow' } })
        setCurrentPage(1)
        if(currentPage === 1) loadModelData()
    }, [ selectedKeys ])

    useEffect(() => {
        // 获取表格高度
        if (tableContainer.current) {
            setY(tableContainer.current.clientHeight > 430 ? 430 : tableContainer.current.clientHeight)
        }
    }, [ tableData ])

    const loadModelData = async() => {
        if(selectedKeys === '') return

        setPageLoading(true)

        //处理传参
        const params = { 
            current: currentPage, 
            size: currentPageSize,
            modelName, 
            isPreset: false,
            preset: selectedKeys === '/admin/workflow/preset', 
            status: modelStatus,
        }

        //请求列表接口
        const result = await getFlowableModelProcessList(params)
        const { data: { total, records: newDataSource } } = result
        
        const dataSource = newDataSource.map(item => {
            return {
                ...item,
                itemId: item.id,
                id: item.processDefinitionId,
            }
        })

        setTableData(dataSource)
        setTotal(total)
        setPageLoading(false)
    }

    const copyProcess = async() => {
        copyProcessData(localStorage.getItem('AppId') || '')
    }
    
    const handlePageChange = (page, size) => {
        setCurrentPage(page)
        setCPS(size)
    }


    const handleInputSearch = v => {
        setModelName(v)
        setCurrentPage(1)
    }

    const handleSelectSearch = v => {
        setModelStatus(v)
        setCurrentPage(1)
    }


    const handleSync = async item => {
        let newItem = { ...item, id: item.itemId }
        const { code, msg } = await syncProcessData(newItem)
        message.success(msg)
    }

    //处理单个流程删除
    const handleDeleteProcess = item => {
        //请求删除接口
        requestDelForm({ processDefinitionId: item.id })
    }

    //处理单个流程删除包含实例
    const handleDeleteProcessWithInstance = item => {
        //请求删除接口
        requestDelForm({ processDefinitionId: item.id, cascade: true })
    }

    //请求接口进行删除
    const requestDelForm = async params => {
        Modal.confirm({
            title: '删除',
            icon: <ExclamationCircleOutlined />,
            content: '是否删除该条记录？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                return new Promise(async(resolve, reject) => {
                    try {
                        const { msg } = await delFlowableProcessData(params)
                        message.success(msg)
                        if(currentPage === 1) {
                            loadModelData()
                        } else {
                            setCurrentPage(1)
                        }
                        resolve(1)
                    } catch (error) {
                        resolve(1)
                    }
                })
            },
            onCancel() {},
        })
    }

    //处理挂起或激活流程
    const handleStatus = async item => {
        const params = { processDefinitionId: item.id }
        const result = item.status ? await suspendFlowableProcessData(params) : await activeFlowableProcessData(params)
        const { code, msg } = result
        if(code === 200) {
            message.success(msg)
            if(currentPage === 1) {
                loadModelData()
            } else {
                setCurrentPage(1)
            }
        } else {
            message.error(msg)
        }
    }

    const handleOpenCreatePage = (webType, item = {}) => {
        history.push({
            pathname: '/admin/dingflow/create',
            state: {
                id: item.id || null, 
                webType, 
                talentName: item.talentName,
                talentId: item.talentId,
                itemId: item.itemId,
                isPreset: false, 
                preset: item.preset || false,
                current: currentPage,
                homePath: '/admin/workflow',
            },
        })
    }


    const handlePreview = detail => {
        setDetail(detail)
        setVisible(true)
    }

    // 表格配置
    const tableConfig = {
        showSelection: true,
        bordered: false,
        rowKey: 'id',
        noPagination: true,
    }

    let columns = [
        {
            title: '序号',
            align: 'center',
            width: 100,
            render: (item, record, index) => (currentPage - 1) * currentPageSize + index + 1,
        },
        {
            title: '应用名称',
            width: 200,
            dataIndex: 'appName',
            align: 'center',
        },
        {
            title: '项目名称',
            width: 200,
            dataIndex: 'projectName',
            align: 'center',
            render: item => item || '通用',
        },
        {
            title: '流程定义名称',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '发布时间',
            dataIndex: 'gmtCreated',
            align: 'center',
            width: 200,
        },
        {
            title: '当前状态',
            align: 'center',
            width: 200,
            render: item => (
                <>
                <span style={{ marginRight: 10 }}>
                    {
                        item.status 
                            ? <span style={{ color: '#245ff2' }}>启用</span> 
                            : <span style={{ color: '#999' }}>停用</span>
                    }
                </span>
                <Switch 
                    disabled={ item.preset }
                    checked={ item.status } 
                    onChange={null} 
                    onChange={ () => handleStatus(item) } 
                />
                </>
            ),
        },
        {
            title: '操作',
            width: 450,
            render: item => {
                return (
                    <>
                        <Button 
                            type="link"
                            onClick={() => handlePreview(item)}
                        >
                            查看
                        </Button>
                        <Button 
                            type="link"
                            onClick={() => handleOpenCreatePage('handle', item)}
                        >
                            修改
                        </Button>
                        <Button 
                            type="link" 
                            onClick={ () => handleSync(item) }
                            hidden={ item.preset }
                        >
                            恢复默认
                        </Button>
                        <Button
                            type="link" 
                            danger
                            onClick={() => handleDeleteProcess(item)}
                            hidden={ item.preset }
                        >
                            删除
                        </Button>
                    </>
                )  
            }
        },
    ]
    if(selectedKeys === '/admin/workflow/preset') {
        columns.splice(5, 1)
    }



    const handleChangeVisible = (flag) => {
        setVisible(flag)
    }
    
    const { Item: MItem } = Menu
    const { Option } = Select

    return (
        <div className="workflowArea">
            <div className="mainTitle">流程设置</div>
            <div className="subMenuArea">
                <Menu
                    mode="horizontal"
                    selectedKeys={[ selectedKeys ]}
                >
                    <MItem key="/admin/workflow/system"> 
                        <Link to="/admin/workflow/system">通用流程</Link>    
                    </MItem>
                    <MItem key="/admin/workflow/preset">
                        <Link to="/admin/workflow/preset">预制流程</Link>    
                    </MItem>
                </Menu>
            </div>
            <div className="mainContentArea">
                <div className="handleBoxArea">
                    <div className="handleArea">
                        <Button 
                            type="primary" 
                            icon={ <PlusOutlined /> }
                            onClick={ () => handleOpenCreatePage('add') }
                        >
                            新增
                        </Button>
                    </div>
                    <div className="searchArea">
                        <Select 
                            placeholder="当前状态"
                            onChange={ handleSelectSearch }
                            className="selectArea"
                            size="large"
                        >
                            <Option value={ '' }>全部</Option>
                            <Option value={ true }>启用</Option>
                            <Option value={ false }>停用</Option>
                        </Select>
                        <CusSearch
                            onSearch={ handleInputSearch }
                            width={ 288 }
                            placeholder="请输入流程定义名称"
                            onChange={ () => {} }
                        />
                    </div>
                </div>
                <div className="tableArea" ref={tableContainer}>
                    <CusTableBasis
                        config={ tableConfig }
                        loading={ pageLoading }
                        setHoverRowId={ setHoverRowId }
                        columns={ columns }
                        dataSource={ tableData }
                        y={ y }
                    />
                </div>
                <div className="paginationArea">
                    <Pagination
                        total={ total }
                        current={ currentPage }
                        onChange={ handlePageChange }
                        showQuickJumper
                        showTotal={(total) => (
                        <span
                            style={{ fontSize: 14, color: '#323233' }}
                        >{`共 ${ total } 条，每页 ${ currentPageSize } 条`}</span>
                        )}
                    />
                </div>
            </div>
            <Modal
                title="查看详情"
                visible={ visible }
                width={ 800 }
                centered
                onCancel={ () => handleChangeVisible(false) }
                footer={ null }
                destroyOnClose
            >
                <ProcessDetail detail={ detail } />
            </Modal>
        </div>
    )
}

export default Flowable