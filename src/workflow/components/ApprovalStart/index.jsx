import { useEffect, useState, useImperativeHandle, useRef } from 'react'
import { Avatar, Tooltip, Modal, Space, Button, message } from 'antd'
import styles from '../../styles/index.module.scss'
import submitStart from '../../imgs/submitStart.png'
import approvalStart from '../../imgs/approvalStart.png'
import approvalDetail from '../../imgs/approvalDetail.png'
import copyStart from '../../imgs/copyStart.png'
import { getUserCache } from '../../utils/common'
import UserSelect from '../UserSelect'

const ApprovalStart = (props) => {
    let { data, startRef, processDefinitionId, businessKey, processInstanceName, orgData, readOnly = false } = props
    const [ visible, setVisible ] = useState(false)
    const [ selectVisible, setSelectVisible ] = useState(false)
    const [ processInfo, setProcessInfo ] = useState([])
    const [ processItem, setProcessItem ] = useState(null)
    const [ initiatorOptionalMap, setInitiatorOptionalMap ] = useState({})
    const [ activityCcTo, setActivityCcTo ] = useState([])
    const [ hasSelectList, setHasSelectList ] = useState({})
    const [ avatarMap, setAvatarMap ] = useState({})
    const selectRef = useRef(null)

    useEffect(() => {
        handleProcessInfo(data)
    }, [ data ])

    useImperativeHandle(startRef, () => ({
        /**
         * 获取流程发起的参数
         * @returns 
         */
        getStartParams: () => {
            for(let i in initiatorOptionalMap) {
                if(!initiatorOptionalMap[ i ].length) {
                    message.error('请选择审批人')
                    return
                }
            }

            return {
                processDefinitionId,
                businessKey,
                processInstanceName,
                initiatorOptional: renderInitiatorOptionalMap(),
                activityCcTo: renderActivityCcToMap(),
            }
        },


        /**
         * 获取暂存的详情数据
         * @returns 
         */
        getSaveData: () => {
            return JSON.stringify(data)
        }
    }))


    const renderInitiatorOptionalMap = () => {
        let list = []

        for(let i in initiatorOptionalMap) {
            list.push({
                activityId: i,
                users: initiatorOptionalMap[i],
            })
        }

        return list
    }


    const renderActivityCcToMap = () => {
        return [{
            type: 'user',
            id: activityCcTo,
        }]
    }


    /**
     * 处理流程信息（发起+审批+抄送）
     * @param {obj} data 
     * @returns 
     */
    const handleProcessInfo = data => {
        if(!data) {
            setProcessInfo([])
            return
        }

        const { ccTo, processData } = data
        const approvalModeClassMap = {
            ONE_BY_ONE: styles.groupItemAllArea,
            ALL: styles.groupItemAndArea,
            ONE_OF_ALL: styles.groupItemOrArea,
        }

        // 过滤条件分支节点
        const branchList = processData.filter(v => v.type === 'branch-group')
        if(branchList.length) return

        let info = []
        let map = {}
        let avatarMap = {}
        processData.forEach((v, k) => {
            if(['notifier'].includes(v.type)) return false

            let node = renderNodeInfo(v)
            info.push({
                nodeAvatar: k > 1 
                            ? null 
                            : v.type === 'approval' 
                                ? approvalStart 
                                : submitStart,
                nodeName: v.name,
                nodeSubTitle: node.title,
                nodeId: v.id,
                approvalModeClass: approvalModeClassMap[ v.property?.userType?.params?.approvalMode ] || styles.groupItemArea,
                userList: node.userList,
                selectable: readOnly ? false : (v.type === 'approval' && v.property?.userType?.name === 'startSelect'),
            })

            node.userList.forEach(val => {
                if(val.avatar && val.realName) {
                    avatarMap[ val.realName ] = val.avatar
                }
            })

            if(v.property?.userType?.name === 'startSelect') {
                map[ v.id ] = v.property?.hasSelectedList.map(val => val.id)
            }
        })

        const copy = processData.filter(v => v.type === 'notifier')
        if(copy.length) {
            let ccToList = copy[0]?.property?.hasSelectedList.filter(val => val.isTemp).map(val => val.id)
            ccTo.forEach(val => {
                if(val.avatar && val.realName) {
                    avatarMap[ val.realName ] = val.avatar
                }
            })

            copy[0]?.property?.hasSelectedList.forEach(val => {
                if(!val.avatar) {
                    val.avatar = avatarMap[ (val.name || val.realName) ] || ''
                }
            })

            info.push({
                nodeAvatar: copyStart,
                nodeName: copy[0]?.name || '抄送人',
                nodeSubTitle: `抄送${ copy[0]?.property?.hasSelectedList.length }人`,
                nodeId: copy[0]?.id,
                approvalModeClass: styles.groupItemArea,
                userList: [ ...copy[0]?.property?.hasSelectedList ],
                selectable: readOnly ? false : (copy[0]?.property?.allowAddNotifer || false),
                isCopy: true,
            })

            setActivityCcTo(ccToList)
        }

        setProcessInfo(info)
        setInitiatorOptionalMap(map)
        setAvatarMap(avatarMap)
    }


    /**
     * 渲染审批节点的信息
     * @param {obj} item 
     * @returns 
     */
    const renderNodeInfo = (item) => {
        const approvalModeMap = {
            ONE_BY_ONE: '依次审批',
            ALL: '会签',
            All: '会签',
            ONE_OF_ALL: '或签',
        }
        let title = ''
        let userList = []
        const userInfo = getUserCache('userInfo')

        if(item.type === 'approval' && item.property?.userType.name !== 'assign') {
            title += item.content
        }

        if(item.type === 'start' || item.property?.userType.name === 'initiatorOneself') {
            title += '1人'
            userList.push({
                realName: userInfo?.name || userInfo?.nickname,
                avatar: userInfo?.avatar || '',
            })
        }

        const length = item.property.hasSelectedList.length
        if(length) {
            title += length + '人'
            userList = [ ...item.property.hasSelectedList ]
        }

        const appModeTitle = approvalModeMap[ item.property?.userType?.params?.approvalMode ]
        if(item.type === 'start') {
            title += '发起'
        } else if(item.type === 'approval' && (length === 1) || !appModeTitle) {
            title += '审批'
        } else {
            title += appModeTitle || ''
        }

        if(item.type === 'approval' && !length && item.property?.userType.name !== 'initiatorOneself') {
            title += '（暂无人员）'
        }

        return { title, userList }
    }


    /**
     * 展示“全部人员”弹层
     * @param {obj} item 
     */
    const handleShowUser = (item) => {
        setVisible(true)
        setProcessItem(item)
    }


    /**
     * 关闭“全部人员”弹层
     */
    const handleCloseUser = () => {
        setVisible(false)
    }


    /**
     * 展示“选择人员”弹层
     * @param {obj} item 
     */
    const handleShowSelectUser = (item) => {
        setSelectVisible(true)
        setProcessItem(item)
        setHasSelectList(item.userList)
    }


    /**
     * 关闭“选择人员”弹层
     */
    const handleCloseSelectUser = () => {
        setSelectVisible(false)
    }


    const handleSubmitSelectUser = () => {
        const { hasSelectList } = selectRef.current.getSelectList()

        hasSelectList.forEach(item => {
            if(!item.avatar) item.avatar = avatarMap[ item.name ] || ''
        })

        let { ccTo } = data
        data.processData.forEach((item, index) => {
            if(item.id === processItem.nodeId) {
                data.processData[index].property.hasSelectedList = hasSelectList.map(v => ({
                    id: v.id,
                    avatar: v.avatar || '',
                    name: v.name,
                    isTemp: !ccTo.map(val => val.realName).includes(v.name),
                }))
            }
        })
        handleProcessInfo(data)

        if(processItem.isCopy) {
            let list = hasSelectList.filter(item => !ccTo.map(val => val.realName).includes(item.name)).map(item => item.id)
            setActivityCcTo(list)
        } else {
            let newMap = { ...initiatorOptionalMap }
            newMap[processItem.nodeId] = hasSelectList.map(item => item.id)
            setInitiatorOptionalMap(newMap)
        }
        
        handleCloseSelectUser()
    }

    return (
        <>
        {
            processInfo.length 
                ? (
                    <div className={ styles.startMainArea }>
                        {
                            processInfo.map((item, index) => (
                                <div className={ styles.itemArea } key={ `info-${ index }` }>
                                    <div className={ styles.avatarArea }>
                                        { item.nodeAvatar ? <Avatar src={ item.nodeAvatar } size={ 32 }/> : <div className={ styles.bgParent }></div> }
                                    </div>
                                    <div className={ styles.nodeArea }>
                                        <div className={ styles.descArea }>
                                            <Tooltip title={ item.nodeName }>
                                                <div className={ styles.nodeName }>{ item.nodeName }</div>
                                            </Tooltip>
                                            <Tooltip title={ item.nodeSubTitle }>
                                                <div className={ styles.subTitle }>{ item.nodeSubTitle }</div>
                                            </Tooltip>
                                        </div>
                                        <div className={ styles.avatarGroupArea }>
                                            {
                                                item.userList.length <= 6 ? null : (
                                                    <div 
                                                        className={ item.approvalModeClass }
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={ () => handleShowUser(item) }
                                                    >
                                                        <Avatar src={ approvalDetail } size={ 36 } />
                                                        <div className={ styles.name }>查看全部</div>
                                                    </div>
                                                )
                                            }
                                            {
                                                item.userList.slice(0, 6).map((v, k) => {
                                                    let userName = v.name || v.realName
                                                    return (
                                                        <Tooltip title={ userName } key={ `user-${ k }` }>
                                                            <div className={ item.approvalModeClass }>
                                                                { v.avatar 
                                                                    ? <Avatar src={ v.avatar } size={ 36 } /> 
                                                                    : <Avatar style={{ background: '#245ff2' }} size={ 36 }>{ userName ? userName.substr(0, 1) : '' }</Avatar>
                                                                }
                                                                <div className={ styles.name }>{ userName }</div>
                                                            </div>
                                                        </Tooltip>
                                                    )
                                                })
                                            }
                                            { item.selectable ? (
                                                <div 
                                                    className={ item.approvalModeClass }
                                                    onClick={ () => handleShowSelectUser(item) }
                                                >
                                                    <div className={ styles.selectBorderArea }>
                                                        <div className={ styles.selectBorder }>
                                                            <div className={ styles.plusArea }>+</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null }
                                        </div>
                                    </div>
                                    {
                                        index === 0 ? (
                                            <>
                                            <div className={ styles.divideLine } style={{ height: 24, top: 56 }}></div>
                                            <div className={ styles.divideLine } style={{ height: 24, top: 80 }}></div>   
                                            </>
                                        ) : index === 1 ? (    
                                            <div className={ styles.divideLine } style={{ height: 24, top: 56 }}></div>
                                        ) : index === processInfo.length - 1 ? (
                                            <div className={ styles.divideLine } style={{ height: 24, top: 0 }}></div>
                                        ) : (
                                            <div className={ styles.divideLine } style={{ height: 80, top: 0 }}></div>
                                        )
                                    }
                                </div>
                            ))
                        }
                    </div>
                ) 
                : (
                    <div className={ styles.noDataArea }>暂无匹配流程</div>
                )
        }
        
        <Modal
            centered
            destroyOnClose
            footer={ null }
            width={ 530 }
            visible={ visible }
            onCancel={ () => handleCloseUser() }
            title="审批人"
        >
            <div className={ styles.userModalArea }>
                <div className={ styles.title }>{ processItem?.nodeSubTitle }</div>
                <div className={ styles.avatarGroupArea }>
                    {
                        processItem?.userList.map((v, k) => {
                            let userName = v.name || v.realName
                            return (
                                <Tooltip title={ userName } key={ `user-modal-${ k }` }>
                                    <div className={ processItem?.approvalModeClass }>
                                        { v.avatar 
                                            ? <Avatar src={ v.avatar } size={ 36 } /> 
                                            : <Avatar style={{ background: '#245ff2' }} size={ 36 }>{ userName ? userName.substr(0, 1) : '' }</Avatar>
                                        }
                                        <div className={ styles.name }>{ userName }</div>
                                    </div>
                                </Tooltip>
                            )
                        })
                    }
                </div>
            </div>
        </Modal>
        <Modal
            centered
            destroyOnClose
            className={ styles.bottomHandleArea }
            footer={ (
                <Space>
                    <Button onClick={ () => handleCloseSelectUser() }>取消</Button>
                    <Button type="primary" onClick={ () => handleSubmitSelectUser() }>确定</Button>
                </Space>
            ) }
            width={ 850 }
            visible={ selectVisible }
            onCancel={ () => handleCloseSelectUser() }
            title="选择人员"
        >
            <UserSelect orgData={ orgData } selectRef={ selectRef } hasSelectList={ hasSelectList } />
        </Modal>
        </>
    )
}

export default ApprovalStart
