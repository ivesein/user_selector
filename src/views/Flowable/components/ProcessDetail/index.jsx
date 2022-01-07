import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import ApprovalStart from '@/workflow/components/ApprovalStart'
import { getUserCache } from '@/utils/toolfunc'
import { getUserDetailInfo, startDetailData, formProcessDefinition } from '@/api/flowableApi'
import { renderActualForm } from '@/utils/jsonToForm'

const { Item: FItem } = Form
const { Option } = Select

export default class ProcessDetail extends Component {

    state = {
        startData: {},
        optionArr: [],
        depOptionArr: [],
        formItemList: [],
        processContent: '（填写与流程条件相关的字段信息，将显示完整流程）',
        initiatorOptional: {},
        userInfo: getUserCache('userInfo'),
    }

    formRef = React.createRef()

    componentDidMount() {
        const { props: { detail } } = this
        if(!detail || !detail.processDefinitionId) return

        this.init(detail)
    }

    init = async(detail) => {
        let { data: { orgIds } } = await getUserDetailInfo({
            userid: this.state.userInfo.id,
            tenantId: this.state.userInfo.tenantId,
        })
        orgIds = orgIds || []
        let depOptionArr = []
        orgIds.forEach((item, index) => {
            depOptionArr.push(<Option key={index} value={item?.id}>{item?.name}</Option>)
        })

        this.formRef.current.setFieldsValue({ select_1: detail.processDefinitionId, name: detail.name, remark: detail.remark })

        this.setState({
            startData: {
                finalProcessData: this.getFirstStartData(),
            },
            depOptionArr,
            processId: detail.processDefinitionId,
            processInfo: detail,
        }, () => {
            if (orgIds.length === 1) {
                this.formRef.current.setFieldsValue({ department: orgIds[0].id })
                this.setState({ departmentId: orgIds[0].id }, () => {
                    this.handleProcessChange(detail.processDefinitionId)
                })
            }
        })
    }


    getFirstStartData = (params = {}) => {
        const { state: { userInfo: { realName, username, avatar, nickname } } } = this
        const curUserName = realName || username || nickname

        return [
            {
                name: '发起人',
                curUserName,
                selectedContent: [curUserName],
                desc: '1人发起',
                property: {
                    hasSelectedList: [
                        {
                            name: curUserName,
                            avatar: avatar,
                        }
                    ],
                    formFieldAuth: Object.keys(params).length ? params.property.formFieldAuth : [],
                }
            },
        ]
    }


    handleFormValuesChange = async (change, all) => {
        await this.handleShowStartProcess()
    }


    handleShowStartProcess = async () => {
        const { select_1, department, ...rest } = this.formRef.current.getFieldsValue(true)
        let { state: { startData } } = this
        let { data } = await startDetailData({ processDefinitionId: select_1, departmentId: department })
        startData = { ...startData, ...data }
        this.setState({ startData })
        let formKeyList = Object.keys(rest).filter(item => rest[item] != null)
        formKeyList = Array.from(new Set(formKeyList))

        //获取流程条件中所有相关的表单控件
        let { processData, ccTo } = startData
        let conditionFormKeyList = []
        processData.forEach((value, index) => {
            if (value.type === 'branch-group') {
                value.children.forEach((val, ind) => {
                    val.condition.forEach((va, ia) => {
                        va.forEach((v, i) => {
                            conditionFormKeyList.push(v.checkValue)
                        })
                    })
                })
            }
        })
        conditionFormKeyList = Array.from(new Set(conditionFormKeyList))

        //处理startData
        const approvalModeMap = {
            ONE_BY_ONE: '依次审批',
            ALL: '会签',
            ONE_OF_ALL: '或签',
        }

        //获取交集
        const equalFormKeyList = formKeyList.filter(num => conditionFormKeyList.includes(num))

        if (conditionFormKeyList.length) {
            if (!conditionFormKeyList.filter(item => item !== 'start' && !equalFormKeyList.includes(item)).length) {
                let newProcessData = [ ...processData ]
                let approvalData = {}
                let branchCount = 0

                processData.forEach((value, index) => {
                    if (value.type === 'branch-group') {
                        branchCount++
                        try {
                            value.children.forEach((val, ind) => {
                                let flagOuter = false
                                val.condition.forEach((va, ia) => {
                                    let flagInner = true
                                    va.forEach((v, i) => {
                                        switch (v.itemType) {
                                            case 'start':
                                                flagInner = flagInner && (v.selectIdList.includes(this.state.userInfo.id) || v.selectIdList.filter(value => this.state.userInfo.depCus.map(item => item.departmentId).includes(value)).length)
                                                break

                                            case 'number':
                                                let result
                                                switch (v.numberType) {
                                                    case 'lt':
                                                        result = rest[v.checkValue] < v.numberValue
                                                        break

                                                    case 'le':
                                                        result = rest[v.checkValue] <= v.numberValue
                                                        break

                                                    case 'eq':
                                                        result = rest[v.checkValue] == v.numberValue
                                                        break

                                                    case 'ge':
                                                        result = rest[v.checkValue] >= v.numberValue
                                                        break

                                                    case 'gt':
                                                        result = rest[v.checkValue] > v.numberValue
                                                        break
                                                }
                                                flagInner = flagInner && result
                                                break

                                            case 'select':
                                                flagInner = flagInner && rest[v.checkValue] == v.selectValue
                                                break

                                            case 'radio':
                                                flagInner = flagInner && rest[v.checkValue] == v.radioValue
                                                break
                                        }
                                    })
                                    flagOuter = flagOuter || flagInner
                                })
                                if (flagOuter) {
                                    approvalData[index] = val.children
                                    throw new Error(false)
                                }
                            })
                        } catch (e) {

                        }

                    }
                })

                const approvalKeyList = Object.keys(approvalData)
                if (approvalKeyList.length === branchCount) {
                    let startData1 = []
                    processData.forEach((value, index) => {
                        if (!['start', 'notifier'].includes(value.type)) {
                            if (value.type === 'branch-group') {
                                approvalData[index].forEach((val, ind) => {
                                    const newHasSelectedList = val.property.hasSelectedList.filter(v => v.type !== 'org')
                                    const { property: { userType: { name: userTypeName } } } = val
                                    let selectedContent = []
                                    let desc

                                    if (userTypeName === 'assign') {
                                        if (newHasSelectedList.length) {
                                            desc = `${newHasSelectedList.length}人${newHasSelectedList.length === 1 ? '审批' : (approvalModeMap[val.property.userType.params.approvalMode] || '审批')}`
                                            selectedContent = newHasSelectedList.map(item => item.realName || item.name)
                                        } else {
                                            desc = `${val.content}${approvalModeMap[val.property.userType.params.approvalMode] || '审批'}`
                                            selectedContent = []
                                        }
                                    } else {
                                        if (newHasSelectedList.length) {
                                            desc = `${val.content}${newHasSelectedList.length}人${approvalModeMap[val.property.userType.params.approvalMode] || '审批'}`
                                            selectedContent = newHasSelectedList.map(item => item.realName || item.name)
                                        } else {
                                            desc = `${val.content}${approvalModeMap[val.property.userType.params.approvalMode] || '审批'}（暂无人员）`
                                            selectedContent = []
                                        }
                                    }


                                    startData1.push({
                                        ...val,
                                        selectedContent,
                                        desc,
                                        property: {
                                            ...val.property,
                                            hasSelectedList: newHasSelectedList,
                                        },
                                        selectable: userTypeName === 'startSelect',
                                    })

                                    if (userTypeName === 'startSelect') {
                                        let initiatorOptional = { ...this.state.initiatorOptional }
                                        initiatorOptional[val.id] = []
                                        this.setState({ initiatorOptional })
                                    }
                                })

                                newProcessData[ index ] = approvalData[index][0]
                            } else {
                                const newHasSelectedList = value.property.hasSelectedList.filter(v => v.type !== 'org')
                                const { property: { userType: { name: userTypeName } } } = value
                                let selectedContent = []
                                let desc
                                if (userTypeName === 'assign') {
                                    if (newHasSelectedList.length) {
                                        desc = `${newHasSelectedList.length}人${newHasSelectedList.length === 1 ? '审批' : (approvalModeMap[value.property.userType.params.approvalMode] || '审批')}`
                                        selectedContent = newHasSelectedList.map(item => item.realName || item.name)
                                    } else {
                                        desc = `${value.content}${approvalModeMap[value.property.userType.params.approvalMode] || '审批'}`
                                        selectedContent = []
                                    }
                                } else {
                                    if (newHasSelectedList.length) {
                                        desc = `${value.content}${newHasSelectedList.length}人${approvalModeMap[value.property.userType.params.approvalMode] || '审批'}`
                                        selectedContent = newHasSelectedList.map(item => item.realName || item.name)
                                    } else {
                                        desc = `${value.content}${approvalModeMap[value.property.userType.params.approvalMode] || '审批'}（暂无人员）`
                                        selectedContent = []
                                    }
                                }

                                startData1.push({
                                    ...value,
                                    selectedContent,
                                    desc,
                                    property: {
                                        ...value.property,
                                        hasSelectedList: newHasSelectedList,
                                    },
                                    selectable: userTypeName === 'startSelect',
                                })

                                if (userTypeName === 'startSelect') {
                                    let initiatorOptional = { ...this.state.initiatorOptional }
                                    initiatorOptional[value.id] = []
                                    this.setState({ initiatorOptional })
                                }
                            }
                        }
                    })

                    let notifierList = processData.filter(v => v.type === 'notifier')

                    const finalProcessData = [
                        ...this.getFirstStartData(processData[0]),
                        ...startData1,
                        {
                            name: '抄送人',
                            selectedContent: ccTo.length ? ccTo.map(value => value.realName) : [],
                            desc: ccTo.length ? `抄送${ccTo.length}人` : '无',
                            property: {
                                hasSelectedList: ccTo.map(value => { return { name: value.realName, avatar: value.avatar } }),
                            },
                            selectable: notifierList.length ? notifierList[0].property.allowAddNotifer : false,
                        }
                    ]

                    let copyUserModuleMap = {}
                    if (notifierList.length) {
                        notifierList[0].property.hasSelectedList.filter(v => v.type === 'user').forEach(vs => {
                            copyUserModuleMap[vs.id] = 'self'
                        })
                    }
                    this.setState({ copyUserModuleMap })
                    this.setState({ copyUser: notifierList.length ? notifierList[0].property.hasSelectedList.filter(v => v.type === 'user').map(v => { return { id: v.id, module: 'self' } }) : [] })
                    this.setState({ startData: { ...startData, finalProcessData, startParams: {
                        data: { ccTo, processData: newProcessData },
                        processDefinitionId: select_1,
                        businessKey: '',
                        processInstanceName: finalProcessData[0].curUserName + '的' + this.state.optionMap[select_1],
                     } } })
                    this.setState({ processContent: '（填写与流程条件相关的字段信息，将显示完整流程）' })

                } else {
                    this.setState({ processContent: '（未匹配到任何流程条件）' })
                    this.setState({ startData: { finalProcessData: this.getFirstStartData() } })
                }
            }
        } else {
            const startData1 = processData.filter(item => item.type === 'approval')
            const newStartData = startData1.map(item => {
                const newHasSelectedList = item.property.hasSelectedList.filter(v => v.type !== 'org')
                const { property: { userType: { name: userTypeName } } } = item
                let selectedContent = []
                let desc

                if (userTypeName === 'assign') {
                    if (newHasSelectedList.length) {
                        desc = `${newHasSelectedList.length}人${newHasSelectedList.length === 1 ? '审批' : (approvalModeMap[item.property.userType.params.approvalMode] || '审批')}`
                        selectedContent = newHasSelectedList.map(item => item.realName || item.name)
                    } else {
                        desc = `${item.content}${approvalModeMap[item.property.userType.params.approvalMode] || '审批'}`
                        selectedContent = []
                    }
                } else {
                    if (newHasSelectedList.length) {
                        desc = `${item.content}${newHasSelectedList.length}人${approvalModeMap[item.property.userType.params.approvalMode] || '审批'}`
                        selectedContent = newHasSelectedList.map(item => item.realName || item.name)
                    } else {
                        desc = `${item.content}${approvalModeMap[item.property.userType.params.approvalMode] || '审批'}（暂无人员）`
                        selectedContent = []
                    }
                }

                if (userTypeName === 'startSelect') {
                    let initiatorOptional = { ...this.state.initiatorOptional }
                    initiatorOptional[item.id] = []
                    this.setState({ initiatorOptional })
                }

                return {
                    ...item,
                    selectedContent,
                    desc,
                    property: {
                        ...item.property,
                        hasSelectedList: newHasSelectedList,
                    },
                    selectable: userTypeName === 'startSelect',
                }
            })

            let notifierList = processData.filter(v => v.type === 'notifier')

            const finalProcessData = [
                ...this.getFirstStartData(processData[0]),
                ...newStartData,
                {
                    name: '抄送人',
                    type: 'notifier',
                    selectedContent: ccTo.length ? ccTo.map(value => value.realName) : [],
                    desc: ccTo.length ? `抄送${ccTo.length}人` : '无',
                    property: {
                        hasSelectedList: ccTo.map(value => { return { name: value.realName, avatar: value.avatar } }),
                    },
                    selectable: notifierList.length ? notifierList[0].property.allowAddNotifer : false,
                }
            ]

            let copyUserModuleMap = {}
            if (notifierList.length) {
                notifierList[0].property.hasSelectedList.filter(v => v.type === 'user').forEach(vs => {
                    copyUserModuleMap[vs.id] = 'self'
                })
            }
            this.setState({ copyUserModuleMap })
            this.setState({ copyUser: notifierList.length ? notifierList[0].property.hasSelectedList.filter(v => v.type === 'user').map(v => { return { id: v.id, module: 'self' } }) : [] })
            this.setState({ startData: { ...startData, finalProcessData, startParams: {
               data,
               processDefinitionId: select_1,
               businessKey: '',
               processInstanceName: finalProcessData[0].curUserName + '的' + this.state.processInfo.name,
            } } })
        }
    }


    handleProcessChange = async v => {
        this.setState({ processId: v, ajaxOpen: true })
        let { state: { departmentId } } = this
        if (!departmentId || !v) return

        //请求不同流程对应的表单json
        let { data: { renderedStartForm } } = await formProcessDefinition({ processDefinitionId: v })

        // 处理发起流程展示
        await this.handleShowStartProcess()

        //通过表单json渲染真实表单
        let formItemList = []
        if (renderedStartForm) {
            const { state: { startData } } = this
            let formFieldAuthMap = {}
            startData.processData[0].property.formFieldAuth.forEach(item => {
                formFieldAuthMap[item.key] = item.checkValue
            })

            renderedStartForm = JSON.parse(renderedStartForm)
            renderedStartForm = renderedStartForm.map(item => {
                const auth = formFieldAuthMap[item.key] || 'readonly'
                let params = {}
                if (auth === 'readonly') {
                    params.disabled = true
                }
                if (auth === 'hidden') {
                    params.hidden = true
                }
                return {
                    ...item,
                    ...params,
                }
            })
            renderedStartForm = JSON.stringify(renderedStartForm)
            formItemList = renderActualForm(renderedStartForm)
        }

        this.setState({
            formItemList,
            ajaxOpen: false,
        })
    }


    handleDepartmentChange = v => {
        this.setState({ departmentId: v }, () => { this.handleProcessChange(this.state.processId) })
    }

    render() {

        const {
            formRef,
            handleFormValuesChange,
            handleDepartmentChange,

            state: {
                startData,
                depOptionArr,
                formItemList,
                processContent,
            },
        } = this

        return (
            <div className="timeline-box-area">
                <Form
                    ref={ formRef }
                    name="basic"
                    colon={ false }
                    className="flow-form start-form-area"
                    onValuesChange={ handleFormValuesChange }
                >
                    <FItem
                        label="流程定义"
                        name="select_1"
                        hidden
                    >
                        <Input />
                    </FItem>
                    <FItem
                        label="模型名称"
                        name="name"
                    >
                        <Input disabled />
                    </FItem>
                    <FItem
                        label="模型描述"
                        name="remark"
                    >
                        <Input.TextArea 
                            rows={ 4 } 
                            showCount 
                            disabled 
                            maxLength={ 200 } 
                        />
                    </FItem>
                    <FItem
                        label="所在部门"
                        name="department"
                        rules={[{ required: true, message: '该项不能为空' }]}
                    >
                        <Select
                            placeholder="请选择所在部门"
                            className="flow-select"
                            onChange={ handleDepartmentChange }
                        >
                            { depOptionArr }
                        </Select>
                    </FItem>
                    {
                        formItemList && formItemList.length ?
                            formItemList :
                            null
                    }
                </Form>
                <p className="process-title-area">流程{ processContent }</p>
                <ApprovalStart
                    data={ startData?.startParams?.data || null }
                    processDefinitionId={ startData?.startParams?.processDefinitionId }
                    businessKey={ startData?.startParams?.businessKey }
                    processInstanceName={ startData?.startParams?.processInstanceName }
                    orgData={ [] }
                    readOnly
                />
            </div>
        )
    }
}