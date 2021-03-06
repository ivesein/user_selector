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
        // ??????????????????
        if (tableContainer.current) {
            setY(tableContainer.current.clientHeight > 430 ? 430 : tableContainer.current.clientHeight)
        }
    }, [ tableData ])

    const loadModelData = async() => {
        if(selectedKeys === '') return

        setPageLoading(true)

        //????????????
        const params = { 
            current: currentPage, 
            size: currentPageSize,
            modelName, 
            isPreset: false,
            preset: selectedKeys === '/admin/workflow/preset', 
            status: modelStatus,
        }

        //??????????????????
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

    //????????????????????????
    const handleDeleteProcess = item => {
        //??????????????????
        requestDelForm({ processDefinitionId: item.id })
    }

    //????????????????????????????????????
    const handleDeleteProcessWithInstance = item => {
        //??????????????????
        requestDelForm({ processDefinitionId: item.id, cascade: true })
    }

    //????????????????????????
    const requestDelForm = async params => {
        Modal.confirm({
            title: '??????',
            icon: <ExclamationCircleOutlined />,
            content: '???????????????????????????',
            okText: '??????',
            cancelText: '??????',
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

    //???????????????????????????
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

    // ????????????
    const tableConfig = {
        showSelection: true,
        bordered: false,
        rowKey: 'id',
        noPagination: true,
    }

    let columns = [
        {
            title: '??????',
            align: 'center',
            width: 100,
            render: (item, record, index) => (currentPage - 1) * currentPageSize + index + 1,
        },
        {
            title: '????????????',
            width: 200,
            dataIndex: 'appName',
            align: 'center',
        },
        {
            title: '????????????',
            width: 200,
            dataIndex: 'projectName',
            align: 'center',
            render: item => item || '??????',
        },
        {
            title: '??????????????????',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '????????????',
            dataIndex: 'gmtCreated',
            align: 'center',
            width: 200,
        },
        {
            title: '????????????',
            align: 'center',
            width: 200,
            render: item => (
                <>
                <span style={{ marginRight: 10 }}>
                    {
                        item.status 
                            ? <span style={{ color: '#245ff2' }}>??????</span> 
                            : <span style={{ color: '#999' }}>??????</span>
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
            title: '??????',
            width: 450,
            render: item => {
                return (
                    <>
                        <Button 
                            type="link"
                            onClick={() => handlePreview(item)}
                        >
                            ??????
                        </Button>
                        <Button 
                            type="link"
                            onClick={() => handleOpenCreatePage('handle', item)}
                        >
                            ??????
                        </Button>
                        <Button 
                            type="link" 
                            onClick={ () => handleSync(item) }
                            hidden={ item.preset }
                        >
                            ????????????
                        </Button>
                        <Button
                            type="link" 
                            danger
                            onClick={() => handleDeleteProcess(item)}
                            hidden={ item.preset }
                        >
                            ??????
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
            <div className="mainTitle">????????????</div>
            <div className="subMenuArea">
                <Menu
                    mode="horizontal"
                    selectedKeys={[ selectedKeys ]}
                >
                    <MItem key="/admin/workflow/system"> 
                        <Link to="/admin/workflow/system">????????????</Link>    
                    </MItem>
                    <MItem key="/admin/workflow/preset">
                        <Link to="/admin/workflow/preset">????????????</Link>    
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
                            ??????
                        </Button>
                    </div>
                    <div className="searchArea">
                        <Select 
                            placeholder="????????????"
                            onChange={ handleSelectSearch }
                            className="selectArea"
                            size="large"
                        >
                            <Option value={ '' }>??????</Option>
                            <Option value={ true }>??????</Option>
                            <Option value={ false }>??????</Option>
                        </Select>
                        <CusSearch
                            onSearch={ handleInputSearch }
                            width={ 288 }
                            placeholder="???????????????????????????"
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
                        >{`??? ${ total } ???????????? ${ currentPageSize } ???`}</span>
                        )}
                    />
                </div>
            </div>
            <Modal
                title="????????????"
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