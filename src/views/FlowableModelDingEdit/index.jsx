import React, { Component } from 'react'
import {
    Button,
    Popover,
    Drawer,
    Tabs,
    Radio,
    Input,
    Select,
    Checkbox,
    Tag,
    Modal,
    Row,
    Form,
    message,
    InputNumber,
    Table,
    Tooltip,
    Space,
    Avatar,
} from 'antd'
import {
    PlusCircleFilled,
    createFromIconfontCN,
    DeleteOutlined,
    RightOutlined,
    CloseOutlined,
    CopyOutlined,
    CheckOutlined,
    MinusOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    CaretLeftOutlined,
    CaretRightOutlined,
} from '@ant-design/icons'
import Sortable from 'sortablejs'
import { componentArr, componentItem } from './resources/showConfig'
import { handleComponentCreate } from './resources/jsonToForm'
import { getUserCache } from '@/utils/toolfunc'
import {
    getFlowableFormDetail,
    saveDingModelData,
    detailDingModelData,
    getMenuListByPlatformUser,
    getRoleList,
    getTreeAndUserOrgList,
} from '@/api/flowableApi'
import './index.scss'
import UserSelect from '@/components/UserSelect'
import ProcessDetail from '../Flowable/components/ProcessDetail'

const { TabPane } = Tabs
const { Option } = Select
const { Group:Cgroup } = Checkbox
const { Item:Fitem, List:Flist } = Form
const { TextArea } = Input
const { Group:Rgroup, Button:Rbutton } = Radio

export default class FlowableModelDingEdit extends Component {

    designCount = 0
    count = 0 // 计数器,用来生成组件id
    middleGroupSort = null // 中间表单分组排序节点
    formKey = this.props.location.state?.formKey // 表单key
    formName = this.props.location.state?.formName // 表单名称
    appId = this.props.location.state?.appId // 应用id
    treeDataCount = 2 // 计算树形数据数量

    basicFormRef = React.createRef()
    highFormRef = React.createRef()
    nameRef = React.createRef()
    formMakingRef = React.createRef() // 中间表单制作区域节点
    fieldRef = React.createRef() // 右侧字段表单区域节点
    propertyRef = React.createRef() // 右侧属性表单区域节点
    jsonAreaRef = React.createRef() // json文本区域节点
    importJsonRef = React.createRef() // 导入json表单节点
    previewFormRef = React.createRef() // 预览表单节点
    formGroupRef = React.createRef() // 中间表单分组节点
    formRef = React.createRef()
    selectRef = React.createRef()
    moveSelectRef = React.createRef()
    componentRefList = [] //左侧组件区域节点集合

    MyIcon = createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/font_2468137_vffonbi99si.js',
    })
    detailId = this.props.location.state?.id
    detailItemId = this.props.location.state?.itemId
    webType = this.props.location.state?.webType
    flag = false
    isPreset = this.props.location.state?.isPreset
    preset = this.props.location.state?.preset
    talentName = this.props.location.state?.talentName
    talentId = this.props.location.state?.talentId

    //中间组件自定义顺序拖动配置
    middleGroupOpt = {
        animation: 150,
        sort: true,
        disabled: this.webType === 'detail',
        group: { name: 'share', pull: true, put: true }, //可拖出可拖入
        //拖动结束
        onUpdate: e => {
            
        }
    }

    state = {
        selectTenantId: getUserCache('userInfo').tenantId,
        isPlatformUser: true, //true=系统管理员 false=其他用户
        categoryOptionArr: [], //应用名称下拉列表
        formOptionArr: [], //表单名称下拉列表
        tenantOptionArr: [], //租户名称下拉列表
        roleOptionArr: [], //角色名称下拉列表
        data: [],
        saveBtnLoading: false,
        moveModalVisible: false,
        previewDetailVisible: false,

        tabActiveKey: this.preset ? 'design' : 'basic', //tab选中标签

        drawerIndex: 0, //抽屉对应的数组索引

        //缩放比例
        scale: 1,

        formTreeDataSource: [],
        formTreeAllCheckValue: false,

        //选择人员弹层
        selectUserModalVisible: false,
        startSelectAll: false,
        startHasSelectedList: [],
        startHasSelectCheckboxValue: [],
        startSelectBreadList: [
            {
                id: 0,
                name: '组织架构',
                type: 'org',
            }
        ],
        curOrgList: [],

        //审批人
        approvalUserTypeForHtml: '',

        //完整json数据
        designData: [
            {
                // 发起节点：“start”
                id: 'start-0',
                key: 0,
                type: 'start',
                name: '发起人',
                content: '全员',
                iconType: 'iconfaqi',
                level: 1,
                property: { // 属性
                    submitIdList: [], //可发起人，部门，角色集合
                    submitNameList: [], //可发起人，部门，角色集合
                    hasSelectedList: [], //已选
                    formFieldAuth: [ //表单操作权限
                        
                    ]
                }
            },
        ],

        drawerVisible: false,
        modalVisible: false,
        popVisible: false,
        popKey: 0,
        designActiveKey: 0,

        branchFormOptionList: [],
        branchFormRadioOptionMap: {},
        branchFormSelectOptionMap: {},

        nameInputKey: Date.now(),

        formItem: [], // 所有组件json
        activeId: 0, // 当前选中组件id
        activeComponent: '', // 当前选中组件名称
        curFormItem: {}, // 当前选中组件json
        jsonVisible: false, // 生成json弹层是否可见
        jsonFormItem: '', // json格式化后的组件内容
        importVisible: false, // 导入json弹层是否可见
        previewVisible: false, // 预览弹层是否可见
    }


    componentDidMount() {
        //判断当前登录用户身份
        this.setState({
            isPlatformUser: false,
        }, () => {
            this.init()
        })
    }


    /**
     * 初始化操作
     */
    init = () => {
        this.getCategoryOptionArr()
        this.getRoleOptionArr()
        this.getDetailData()
        this.getOrgData()
    } 


    handleChangeVisible = flag => {
        this.setState({
            previewDetailVisible: flag,
        })
    }


    /**
     * 获取组织树及用户
     */
    getOrgData = async() => {
        const { data: orgData } = await getTreeAndUserOrgList()
        this.setState({ orgData })
    }


    // 选择"分组"后创建排序组件
    handleComponentGroupShow = component => {
        const { formGroupRef, middleGroupOpt } = this

        if(component === 'group') {
            this.middleGroupSort = new Sortable(formGroupRef.current, middleGroupOpt)
        }
    }


    //创建不同组件表单
    handleFormComponentChange = component => {
        const curTime = new Date().getTime()
        const componentProperty = componentItem[component]
        
        //将表单固有属性与动态属性联合
        let item = {
            ...componentProperty,
            id: this.count,
            activeStatus: true,
        }
        if(component !== 'group') {
            item.key = `${component}_${curTime}`
            item.component = handleComponentCreate(componentProperty)
        }
        
        this.handleFormCreate(item)
    }


    //创建最终表单
    handleFormCreate = item => {
        const finalItem = [ ...this.state.formItem, item ]
        const activeId = item.id
        this.count++
        this.handleActiveChange(finalItem, activeId)
    }


    //打开生成json弹层
    handleShowJsonModal = () => {
        //过滤对象集合中的component属性
        const { formItem } = this.state
        const newFormItem = formItem.map(item => {
            const { component, ...rest } = item
            return rest
        })

        this.setState({
            jsonVisible: true,
            jsonFormItem: JSON.stringify(newFormItem, null, 2)
        })
    }


    //关闭生成json弹层
    handleCloseJsonModal = () => {
        this.setState({
            jsonVisible: false
        })
    }


    //复制json数据
    handleCopyJsonData = () => {
        this.jsonAreaRef.current.select() // 选中文本
        document.execCommand("copy") // 执行浏览器复制命令
        message.success('复制成功')
    }


    //清空表单
    handleClearForm = () => {
        this.setState({
            formItem: [],
        })
    }


    //切换组件活跃状态
    handleFormItemActive = activeId => {
        const formItem = [ ...this.state.formItem ]
        this.handleActiveChange(formItem, activeId)
    }


    //监听字段表单变更
    handleFormChange = all => { 
        const { state: { activeId, formItem }} = this

        //处理表单栅格
        const { width, showCountText, showSearchText, multipleText } = all

        let newWidth = 0
        if(width < 8) {
            newWidth = 8
        } else if(width > 24) {
            newWidth = 24
        } else {
            newWidth = parseInt(width) || 8
        }
        all.width = newWidth

        //处理字数提示标识
        if(showCountText && showCountText.length) {
            all.showCountText = 'true'
            all.showCount = true
        } else {
            all.showCountText = ''
            all.showCount = false
        }

        //处理可搜索标识
        if(showSearchText && showSearchText.length) {
            all.showSearchText = 'true'
            all.showSearch = true
        } else {
            all.showSearchText = ''
            all.showSearch = false
        }

        //处理可多选标识
        if(multipleText && multipleText.length) {
            all.multipleText = 'true'
            all.multiple = true
        } else {
            all.multipleText = ''
            all.multiple = false
        }

        this.handleFormChangeItemUpdate(formItem, activeId, all)
    }


    //替换属性编辑后的数据
    handleFormChangeItemUpdate = (formItem, activeId, all) => {
        const newFormItem = [ ...formItem ]
        const activeIndex = this.getActiveIndex(newFormItem, activeId)
        const formItemObj = { ...newFormItem[activeIndex], ...all }
        formItemObj.component = handleComponentCreate(formItemObj)
        newFormItem[activeIndex] = formItemObj
        this.setState({ formItem: newFormItem, curFormItem: formItemObj })
    }


    //监听属性表单变更
    handleFormProChange = all => {
        if(!formItem.length) return
        
        const { activeId, formItem } = this.state
        const { labelWidth, labelAlignText, requiredText } = all
        
        //处理标签宽度
        let newLabelWidth = 0
        if(labelWidth < 120) {
            newLabelWidth = 120
        } else if(labelWidth > 200) {
            newLabelWidth = 200
        } else {
            newLabelWidth = parseInt(labelWidth) || 120
        }
        all.labelWidth = newLabelWidth

        //处理标签对齐方式
        all.labelAlign = labelAlignText
        if(labelAlignText === 'top') {
            all.labelWidth = 'calc(100vw - 680px)'
            all.labelAlign = 'left'
        }

        //处理必填标识
        if(requiredText && requiredText.length) {
            all.requiredText = 'true'
            all.required = true
        } else {
            all.requiredText = ''
            all.required = false
        }

        this.handleFormChangeItemUpdate(formItem, activeId, all)
        this.propertyRef.current.setFieldsValue(all)
    }


    //复制表单元素
    handleCopyItem = e => {
        e.stopPropagation()

        const { activeId, formItem } = this.state
        const { count } = this
        const curTime = new Date().getTime()

        //复制数据
        const newFormItem = [ ...formItem ]
        const activeIndex = this.getActiveIndex(newFormItem, activeId)
        const newFormObj = { 
            ...newFormItem[activeIndex], 
            id: count, 
            key: `${newFormItem[activeIndex].type}_${curTime}`,
        }
        
        //从选中组件处插入新的复制数据
        newFormItem.splice(activeIndex + 1, 0, newFormObj)
        this.handleActiveChange(newFormItem, count)
        this.count++
    }


    //删除表单元素
    handleDelItem = e => {
        e.stopPropagation()

        const { activeId, formItem } = this.state

        //删除数据
        const newFormItem = [ ...formItem ]
        const activeIndex = this.getActiveIndex(newFormItem, activeId)
        newFormItem.splice(activeIndex, 1)
        
        //重置活跃组件
        const newIndex = activeIndex >= newFormItem.length ? activeIndex - 1 : activeIndex
        const newId = newFormItem[newIndex] ? newFormItem[newIndex].id : 0
        this.handleActiveChange(newFormItem, newId)
    }


    //处理组件状态变化
    handleActiveChange = (formItem, activeId) => {
        let newFormItem = []
        let activeIndex = 0
        let activeComponent
        let curFormItem = {}

        //获取活跃组件元素,重置每个组件的活跃状态
        formItem.forEach((item, index) => {
            if(item.id === activeId) {
                activeIndex = index
                activeComponent = item.type
                curFormItem = item
            }
            newFormItem.push({ ...item, activeStatus: item.id === activeId })
        })

        this.setState({
            formItem: newFormItem,
            activeId,
            activeComponent,
            curFormItem,
        }, () => {
            if(!newFormItem.length) return
            this.fieldRef.current.setFieldsValue(formItem[activeIndex])
            this.propertyRef.current.setFieldsValue(formItem[activeIndex])
            this.handleComponentGroupShow(activeComponent)
        })
    }


    //根据活跃id获取活跃索引
    getActiveIndex = (arr, id) => {
        let activeIndex = 0
        arr.forEach((item, index) => {
            if(item.id === id) activeIndex = index
        })
        return activeIndex
    }


    //打开导入json弹层
    handleImportJson = () => {
        this.importJsonRef.current.setFieldsValue({
            jsonArea: "[\n]",
        })
        this.setState({
            importVisible: true,
        })
    }


    //关闭导入json弹层
    handleCloseImportModal = () => {
        this.setState({
            importVisible: false,
        })
    }


    //处理json导入
    handleImportJsonData = async () => {
        //获取表单数据，处理错误封装
        const newFormPromise = await this.importJsonRef.current.validateFields().catch(e => new Promise((resolve, reject) => {
            resolve(false)
        }))
        const formData = await newFormPromise
        if(!formData) return

        let { jsonArea } = formData
        this.handleJsonToForm(jsonArea)
        this.setState({
            importVisible: false,
        }, () => {
            message.success('导入成功')
        })
    }


    // 处理json数据回显成表单内容
    handleJsonToForm = json => {
        if(!json) return

        // json转义
        const list = JSON.parse(json)
        if(!list.length) return

        const formItem = list.map(item => {
            return {
                ...item,
                component: handleComponentCreate(item),
            }
        })
        const { id } = formItem[0]
        this.handleActiveChange(formItem, id)
        this.count = Math.max(...list.map(item => item.id)) + 1
    }

    // 打开预览弹层
    handlePreview = () => {
        this.previewFormRef.current.resetFields()
        const { formItem } = this.state

        const previewForm = formItem.map(item => {
            item = { ...item, disabled: true }
            return (
                <Fitem
                    label={
                        <div style={{ width: item.labelWidth }}>
                            { item.label }{ item.labelSuffix }
                        </div>
                    }
                    name={ item.key }
                    className="spe-item"
                    labelAlign={ item.labelAlign }
                    required={ item.required }
                    key={ item.id }
                    rules={[{ required: item.required, message: '该项不能为空' }]}
                >
                    { handleComponentCreate(item) }
                </Fitem>
            )
        })

        this.setState({
            previewForm,
            previewVisible: true,
        })
    }


    // 关闭预览弹层
    handleClosePreviewModal = () => {
        this.setState({
            previewVisible: false,
        })
    }


    handlePreviewProcess = detail => {
        this.setState({
            previewDetailVisible: true
        })
    }


    // 获取预览数据
    handlePreviewFormData = async () => {
        // 获取表单数据，处理错误封装
        const newFormPromise = await this.previewFormRef.current.validateFields().catch(e => new Promise((resolve, reject) => {
            resolve(false)
        }))
        const formData = await newFormPromise
        if(!formData) return
        
        this.setState({
            previewFormData: JSON.stringify(formData, null, 2),
            previewFormDataVisible: true,
        })
    }


    // 关闭预览表单数据弹层
    handleClosePreviewFormDataModal = () => {
        this.setState({
            previewFormDataVisible: false,
        })
    }


    //动态添加树形结构数据
    handleAddTreeData = item => {
        const { formItem, activeId, curFormItem } = this.state
        let expandedRowKeys = []
        const treeData = this.renderTreeData(curFormItem.treeData, item.key)
        this.getTreeKeys(treeData, expandedRowKeys)
        this.handleFormChangeItemUpdate(formItem, activeId, { treeData, expandedRowKeys })
    }


    /**
     * 递归获取树形数据中所有的key
     * @param {array} treeData [树形数据]
     * @param {array} arr [key集合]
     */
    getTreeKeys = (treeData, arr) => {
        treeData.forEach(v => {
            arr.push(v.key)
            if(v.children) this.getTreeKeys(v.children, arr)
        })
    }


    renderTreeData = (data, id) => {
        const { treeDataCount } = this
        let arr = []

        data.forEach(v => {
            let item = { ...v }
            if(v.key === id) {
                const obj = {
                    title: `选项${ treeDataCount }`,
                    label: `选项${ treeDataCount }`,
                    key: treeDataCount,
                    value: treeDataCount,
                    readOnly: true,
                    level: item.level + 1,
                }
                item.children ? item.children.push(obj) : item.children = [ obj ]
                this.treeDataCount++
            } else {
                if(v.children) item.children = this.renderTreeData(v.children, id)
            }
            arr.push(item)
        })

        return arr
    }


    /**
     * 树节点数据编辑
     * @param {obj} item 
     */
    handleEditTreeData = item => {
        const { formItem, activeId, curFormItem } = this.state
        let treeData = [ ...curFormItem.treeData ]
        this.getEditTreeData(treeData, item.key, false)
        this.handleFormChangeItemUpdate(formItem, activeId, { treeData })
    }


    /**
     * 修改树元素的数据
     * @param {array} treeData 
     * @param {string} id 
     * @param {boolean} isRead 
     */
    getEditTreeData = (treeData, id, isRead) => {
        treeData.forEach(v => {
            if(v.key === id) {
                v.readOnly = isRead
            } else {
                if(v.children) this.getEditTreeData(v.children, id, isRead)
            }
        })
    }


    //树形数据输入框失去焦点后触发
    handleTreeDataChange = e => {
        this.setState({ treeDataInputValue: e.target.value })
    }


    handleSaveTreeData = item => {
        const { formItem, activeId, curFormItem, treeDataInputValue } = this.state
        let treeData = [ ...curFormItem.treeData ]
        this.getSaveTreeData(treeData, item.key, treeDataInputValue)
        this.handleFormChangeItemUpdate(formItem, activeId, { treeData })
    }


    getSaveTreeData = (treeData, id, value) => {
        treeData.forEach(v => {
            if(v.key === id) {
                v.title = value
                v.readOnly = true
            } else {
                if(v.children) this.getSaveTreeData(v.children, id, value)
            }
        })
    }


    handleBackTreeData = item => {
        const { formItem, activeId, curFormItem } = this.state
        let treeData = [ ...curFormItem.treeData ]
        this.getEditTreeData(treeData, item.key, true)
        this.handleFormChangeItemUpdate(formItem, activeId, { treeData })
    }


    handleDelTreeData = item => {
        const { formItem, activeId, curFormItem } = this.state
        let treeData = [ ...curFormItem.treeData ]
        this.getDelTreeData(treeData, item.key)
        this.handleFormChangeItemUpdate(formItem, activeId, { treeData })
    }


    getDelTreeData = (data, id) => {
        data.forEach((v, k) => {
            if(v.key === id) {  
                data.splice(k, 1)
                return
            } else {
                if(v.children) this.getDelTreeData(v.children, id)
            }
        })
    }


    /**
     * 增加树形选择器选项
     */
    handleAddTreeTopData = () => {
        const { formItem, activeId, curFormItem } = this.state
        const { treeDataCount } = this
        let treeData = [ ...curFormItem.treeData ]
        treeData.push({
            title: `选项${ treeDataCount }`,
            label: `选项${ treeDataCount }`,
            key: treeDataCount,
            value: treeDataCount,
            readOnly: true,
            level: 1,
        })
        let expandedRowKeys = [ ...curFormItem.expandedRowKeys ]
        expandedRowKeys.push(treeDataCount)
        this.treeDataCount++
        this.handleFormChangeItemUpdate(formItem, activeId, { treeData, expandedRowKeys })
    }


    /**
     * 初始化表单设计的内容
     */
    initFormInfo = () => {
        this.componentRefList = componentArr.map(item => React.createRef())

        setTimeout(() => {
            const { formMakingRef, componentRefList } = this
    
            componentArr.forEach((item, index) => {
                //左侧输入框/选择框等组件拖动配置 
                new Sortable(componentRefList[index].current, {
                    draggable: '.component-item',
                    animation: 150,
                    disabled: this.webType === 'detail',
                    group: { name: 'share', pull: 'clone', put: false }, //可克隆拖出但不能拖入
                    sort: false, // 禁止列表内拖动
                    //拖动结束
                    onEnd: e => {
                        if(e.pullMode !== 'clone') return
                        this.handleFormComponentChange(componentArr[index].children[e.oldIndex].name)
                    },
                })
            })
    
    
            //中间组件自定义顺序拖动配置
            const middleOpt = {
                animation: 150,
                draggable: '.spe-big-item',
                sort: true,
                disabled: this.webType === 'detail',
                group: { name: 'share', pull: true, put: true }, //可拖出可拖入
                //拖动结束
                onUpdate: e => {
                    const {
                        formItem,
                    } = this.state
                    
                    //让表单生成的json数据按照sortable拖拽后的顺序重新排列
                    const newArr = middleSort.toArray().map(item => parseInt(item))
                    formItem.sort((a, b) => newArr.indexOf(a.id) - newArr.indexOf(b.id))
                    
                    this.setState({ 
                        formItem,
                    })  
                }
            }
    
            const middleSort = new Sortable(formMakingRef.current, middleOpt)
        }, 1)
    }


    handleFormSelect = async v => {
        let { data: { formJson }} = await getFlowableFormDetail({ id: v })
        
        const list = JSON.parse(formJson)
        const formFieldList = list.map(item => {
            return {
                key: item.key,
                type: item.label,
                checkValue: 'edit',
            }
        })
        let branchFormOptionList = []
        let branchFormRadioOptionMap = {}
        let branchFormSelectOptionMap = {}

        list.forEach(item => {
            branchFormRadioOptionMap[ item.key ] = []
            branchFormSelectOptionMap[ item.key ] = []

            if(['radio', 'number', 'select'].includes(item.type)) {
                branchFormOptionList.push(<Option key={ item.type } value={ item.key }>{ item.label }</Option>)
            }
            if(item.type === 'radio') {
                branchFormRadioOptionMap[ item.key ] = item.optionArr.map(item => <Option key={ item } value={ item }>{ item }</Option>)
            }
            if(item.type === 'select') {
                branchFormSelectOptionMap[ item.key ] = item.optionArr.map(item => <Option key={ item } value={ item }>{ item }</Option>)
            }
        })
        const { state: { designData }} = this
        designData[0].property.formFieldAuth = formFieldList

        this.setState({ formTreeDataSource: formFieldList, designData, branchFormOptionList, branchFormRadioOptionMap, branchFormSelectOptionMap })
    }


    /**
     * 获取角色名称下拉值
     */
    getRoleOptionArr = async() => {
        let params = { current: 1, size: 10000, xTenantId: this.state.selectTenantId }
        const { data: { records }} = await getRoleList(params) 
        const roleOptionArr = records.map(item => <Option key={ item.id } value={ item.id }>{ this.isPreset ? item.roleName : item.name }</Option>)
        let roleItem = {}
        records.forEach(item => {
            roleItem[item.id] = this.isPreset ? item.roleName : item.name
        })
        this.setState({ roleOptionArr, roleItem })
    }


    /**
     * 获取详情，回显数据
     */
    getDetailData = async () => {
        const { detailItemId } = this
        let designData = []
        let detailContentData = null
        let detailProcessData = null

        if(detailItemId) {
            //请求详情接口...todo
            const { data: { processDesignVo: basicFormData, flowableForm }} = await detailDingModelData({ id: detailItemId })
            //渲染基础表单数据
            setTimeout(() => {
                this.basicFormRef.current.setFieldsValue({ ...basicFormData, type: 0, preset: this.preset, talentId: this.state.selectTenantId })
            }, 100)
            designData = JSON.parse(basicFormData.content)
            this.handleFormSelect(basicFormData.formId)
            //处理designCount
            this.designCount = designData[ designData.length - 1 ].key + 50
            this.handleJsonToForm(flowableForm.formJson)
            detailContentData = basicFormData.content
            detailProcessData = basicFormData
            sessionStorage.setItem('current', this.props.location.state?.current)
        } else {
            this.basicFormRef.current.setFieldsValue({ type: 0, preset: this.preset, talentId: this.state.selectTenantId })
            designData = this.state.designData
        }
        
        
        //渲染流程设计数据
        this.setState({
            designData,
            detailContentData,
            detailProcessData,
        })
    }


    /**
     * 切换tab标签
     * @param {string} v tab标签值
     */
    handleTabChange = v => {
        this.setState({ tabActiveKey: v })
        if(v === 'form') {
            this.initFormInfo()
        }
    }


    /**
     * 返回上个页面
     */
    handleGoBack = () => {
        if(this.webType === 'handle' && JSON.stringify(this.state.designData) !== this.state.detailContentData) {
            let _this = this
            Modal.confirm({
                title: '温馨提示',
                icon: <ExclamationCircleOutlined />,
                content: '有修改的流程未发布，确认离开？',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    _this.props.history.goBack()
                },
                onCancel() {},
            })
        } else {
            this.props.history.goBack()
        }
    }



    /**
     * 获取应用名称下拉值
     */
    getCategoryOptionArr = async() => {
        const result = await getMenuListByPlatformUser()
        
        let newData = []
        this.renderCategoryOptionArr(result.data, newData)
        this.setState({
            categoryOptionArr: newData
        })
    }

    
    /**
     * 递归拼接应用名称下拉值数据
     * @param {array} data [源数据]
     * @param {array} newData [处理后的数据]
     */
    renderCategoryOptionArr = (data,newData)  => {
        data.forEach((item, index) => {
            if(item.type === "2") {
                newData.push(<Option key={ item.id } value={ item.id }>{ item.menuName }</Option>)
            }
            if(item.children && item.children.length) {
                this.renderCategoryOptionArr(item.children, newData)
            }
        })
    }

    
    /**
     * 处理流程图缩放
     * @param {boolean} type [true=增加 false=减少] 
     */
    handleScale = type => {
        let { scale } = this.state
        type ? scale += 0.1 : scale -= 0.1
        this.setState({
            scale
        })
    }

    /**
     * 处理发起抽屉单选组全选
     * @param {object} e [节点]
     * @param {string} module [模块]
     */
    handleAllRadioChange = (e, designKey) => {
        const { target: { value }} = e
        const { state: { formTreeDataSource: treeDataSource, designData: newDesignData }} = this
        let newDataSource = treeDataSource.map(item => {
            return {
                ...item,
                checkValue: value,
            }
        })
        const drawerIndex = this.getDesignDataIndex(designKey)
        let designItem
        if(typeof(drawerIndex) === 'undefined') {
            newDesignData.forEach((value, index) => {
                if(value.children) {
                    value.children.forEach((val, ind) => {
                        if(val.children) {
                            val.children.forEach((v, i) => {
                                designItem = v
                                newDesignData[index].children[ind].children[i].property.formFieldAuth = newDataSource
                            })
                        }
                    })
                }
            })
        } else {
            designItem = newDesignData[drawerIndex]
            designItem.property.formFieldAuth = newDataSource
        }
        

        this.setState({
            formTreeDataSource: newDataSource,
            formTreeAllCheckValue: value,
            designData: newDesignData,
            drawerHtml: designItem.type === 'approval' 
                ? this.createApprovalDrawerHtml(designItem, value) 
                : this.createStartDrawerHtml(designItem, value),
        })
        
    }

    /**
     * 处理发起抽屉单选组单选
     * @param {object} e [节点]
     * @param {number} key [值]
     * @param {string} module [模块]
     */
    handleItemRadioChange = (e, key, designKey) => {
        const { target: { value }} = e
        const { state: { 
            formTreeDataSource: treeDataSource,
            designData: newDesignData, 
        }} = this
        const newDataSource = treeDataSource.map(item => {
            return key === item.key ? { ...item, checkValue: value } : item
        })
        const drawerIndex = this.getDesignDataIndex(designKey)

        let designItem
        if(typeof(drawerIndex) === 'undefined') {
            newDesignData.forEach((value, index) => {
                if(value.children) {
                    value.children.forEach((val, ind) => {
                        if(val.children) {
                            val.children.forEach((v, i) => {
                                designItem = v
                                newDesignData[index].children[ind].children[i].property.formFieldAuth = newDataSource
                            })
                        }
                    })
                }
            })
        } else {
            designItem = newDesignData[drawerIndex]
            designItem.property.formFieldAuth = newDataSource
        }

        const formTreeAllCheckValue = this.getStartTreeAllCheckValue(newDataSource)

        this.setState({
            formTreeDataSource: newDataSource,
            formTreeAllCheckValue,
            designData: newDesignData,
            drawerHtml: designItem.type === 'approval' 
                ? this.createApprovalDrawerHtml(designItem, formTreeAllCheckValue) 
                : this.createStartDrawerHtml(designItem, formTreeAllCheckValue),
        })
    }


    /**
     * 显示抽屉框
     * @param {object} designItem 
     */
    handleShowDrawer = (designItem, branchLength) => {
        const { type, key } = designItem
        let formTreeAllCheckValue
        
        if(type === 'start' || type === 'approval') {
            const { property: { formFieldAuth }} = designItem
            const { formTreeDataSource } = this.state
            let newTreeSource
            if(formFieldAuth.length) {
                newTreeSource = formFieldAuth
            } else {
                newTreeSource = formTreeDataSource.map(item => {
                    return {
                        ...item,
                        checkValue: module === 'start' ? 'edit' : 'readonly',
                    }
                })
                designItem.property.formFieldAuth = newTreeSource
            }
            formTreeAllCheckValue = this.getStartTreeAllCheckValue(newTreeSource)
            this.setState({ formTreeDataSource: newTreeSource, formTreeAllCheckValue  })
        }
        

        const drawerTitleItem = {
            start: '发起人',
            approval: '审批人',
            notifier: '抄送人',
        }
        this.setState({ nameInputKey: Date.now() })

        setTimeout(() => {
            let drawerHtml
            switch(type) {
                case 'start':
                    drawerHtml = this.createStartDrawerHtml(designItem, formTreeAllCheckValue)
                    break
                case 'approval':
                    drawerHtml = this.createApprovalDrawerHtml(designItem, formTreeAllCheckValue)
                    break
                case 'notifier': 
                    drawerHtml = this.createNotifierDrawerHtml(designItem)
                    break
                case 'branch': 
                    drawerHtml = this.createBranchDrawerHtml(designItem, branchLength)
                    break
                default:
                    break
            }
            
            this.setState({
                drawerVisible: true,
                drawerTitle: drawerTitleItem[type],
                drawerHtml,
                designActiveKey: key,
            })
        }, 100)
    }


    /**
     * 创建条件节点代码
     * @param {map} designItem 
     * @returns 
     */
    createBranchDrawerHtml = (designItem, branchLength) => {
        const { key, condition } = designItem
        const { 
            handleDelBranchGroup, 
            handleAddBranch, 
            handleDelBranch, 
            handleBranchSelectChange,
            handleAddBranchGroup,
            createBranchSelectChangeHtml,

            state: {
                branchFormOptionList,
            },
        } = this
        
        return (
            <div className="branch-group-box-area">
                <div className="branch-title-area">
                    <p>条件名称</p>
                    <div className="input-flex-area">
                        <Input 
                            value={ designItem.name } 
                            style={{ width: 450, marginRight: 10 }} 
                            onChange={ e => this.handleChangeBranchItem(e, designItem, branchLength) }
                        />
                        <Select
                            value={ designItem.priority }
                            style={{ flex: 1 }}
                            onChange={ v => this.handleChangeBranchSort(v, designItem) }
                        >
                            {
                                Array.from(Array(branchLength), (v, k) => k).map(
                                    item => (<Option key={ item + 1 } value={ item + 1 }>优先级{ item + 1 }</Option>)
                                )   
                            }
                        </Select>
                    </div>
                </div>
                { condition.map((item, index) => {
                    return (
                        <div className="branch-group-area" key={ index }>
                            <div className="title">
                                条件组
                                { index > 0 ? (
                                    <span className="del-group-icon-area">
                                        <Button 
                                            type="text" 
                                            icon={<DeleteOutlined className="del-icon-area"/>}
                                            className="" 
                                            onClick={ () => handleDelBranchGroup(key, index) }
                                        />
                                    </span>
                                ) : null }
                            </div>
                            <div className="content-area">
                                {
                                    item.map((v, k) => {
                                        return ( 
                                            <div className="content-item-area" key={ `${index}-${k}` }>
                                                <p className="start-title-area">
                                                    { k === 0 ? '当' : '且'}
                                                    { k > 0 && (
                                                        <span className="del-group-icon-area">
                                                            <Button 
                                                                type="text" 
                                                                icon={<DeleteOutlined className="del-icon-area"/>} 
                                                                className="" 
                                                                onClick={ () => handleDelBranch(key, index, k) }
                                                            />
                                                        </span>
                                                    )}
                                                </p>
                                                <Select
                                                    className="branch-select-area"
                                                    value={ v.checkValue }
                                                    onChange={ (checkValue, option) => handleBranchSelectChange(checkValue, key, index, k, 'checkValue', option) }
                                                >
                                                    <Option value="start" key="start">发起人</Option>
                                                    { branchFormOptionList }
                                                </Select>
                                                { createBranchSelectChangeHtml(v, key, index, k) }
                                            </div>
                                        )
                                    })
                                }
                                <Button
                                    type="text"
                                    icon={ <PlusOutlined /> }
                                    className="text-blue add-branch-btn-area"
                                    onClick={ () => handleAddBranch(key, index) }
                                    style={{ display: 'block', margin: '0 auto' }}
                                >
                                    添加条件
                                </Button>
                            </div>
                        </div>)
                }) }
                <Button 
                    type="primary" 
                    icon={ <PlusOutlined /> } 
                    className="text-blue add-branch-group-btn-area"
                    onClick={ () => handleAddBranchGroup(key) }
                    style={{ color: '#FFF' }}
                >
                    添加条件组
                </Button>
                <Tooltip placement="bottomLeft" title="在表单设计时选择”计数器“、”下拉单选框“、”单选框组“控件，即可作为流程条件">
                    <span style={{ color: '#848484', marginLeft: 8 }}>
                        <QuestionCircleOutlined />如何添加更多条件？
                    </span>
                </Tooltip>
            </div>
        )
    }


    createBranchSelectChangeHtml = (v, key, index, k) => {
        const { 
            handleBranchSelectChange, 
            handleBranchInputChange,
            handleShowUserModal,

            state: {
                branchFormRadioOptionMap,
                branchFormSelectOptionMap,
            },
        } = this

        switch(v.itemType) {
            case 'start':
                return (
                    <Input 
                        readOnly 
                        onClick={ () => handleShowUserModal(key, { index, k }) }
                        className="branch-user-area" 
                        placeholder="请选择人员" 
                        value={ v.selectNameList && v.selectNameList.join(',') }
                    />
                )

            case 'number':
                return (
                    <>
                        <Select
                            className="branch-select-area"
                            value={ v.numberType }
                            onChange={ checkValue => handleBranchSelectChange(checkValue, key, index, k, 'numberType') }
                        >
                            <Option value="lt">小于</Option>
                            <Option value="le">小于等于</Option>
                            <Option value="eq">等于</Option>
                            <Option value="ge">大于等于</Option>
                            <Option value="gt">大于</Option>
                        </Select>
                        <InputNumber  
                            className="branch-user-area" 
                            placeholder="请输入数字" 
                            value={ v.numberValue }
                            onChange={ e => handleBranchInputChange(e, key, index, k) }
                        />
                    </>
                )

            case 'radio':
                return (
                    <>
                        <Select
                            className="branch-select-area"
                            value={ v.radioValue }
                            onChange={ checkValue => handleBranchSelectChange(checkValue, key, index, k, 'radioValue') }
                        >
                            { branchFormRadioOptionMap[v.checkValue] }
                        </Select>
                    </>
                )

            case 'select':
                return (
                    <>
                        <Select
                            className="branch-select-area"
                            value={ v.selectValue }
                            onChange={ checkValue => handleBranchSelectChange(checkValue, key, index, k, 'selectValue') }
                        >
                            { branchFormSelectOptionMap[ v.checkValue ] }
                        </Select>
                    </>
                )
            
            default:
                return ''
        }
    }


    createNotifierDrawerHtml = designItem => {
        const { property, key, type, name } = designItem
        const { 
            handleShowUserModal, 
            handleDelSelectedTagNotifer,
            handleSelfSelectNotifier,
        } = this

        return (
            <div className="set-area">
                <div className="item-area">
                    <p className="title item">节点名称</p>
                    <Input 
                        defaultValue={ name } 
                        key={ this.state.nameInputKey }
                        ref={ this.nameRef }
                        className="input-select-user"
                    />
                </div>
                <Button 
                    type="primary" 
                    icon={ <PlusOutlined /> }
                    onClick={ () => handleShowUserModal(key) }
                >
                    添加成员
                </Button>
                <div className="copy-tag-area">
                    {
                        property.hasSelectedList.map((v, index) => 
                            <Tag 
                                onClose={ () => handleDelSelectedTagNotifer(key, index) }
                                closable 
                                key={ `${v.type}-${v.id}` }
                            >
                                {v.name}
                            </Tag>
                        )
                    }
                </div>
                <Row style={{ marginTop: 20 }}>
                    <Checkbox 
                        checked={ property.allowAddNotifer || false } 
                        onChange={ e => handleSelfSelectNotifier(e.target.checked, key, 'allowAddNotifer') }
                    >
                        允许发起人添加抄送人
                    </Checkbox>
                </Row>
            </div>
        )
    }


    handleSelfSelectNotifier = (e, key, field) => {
        let designData = [ ...this.state.designData ]
        const drawerIndex = this.getDesignDataIndex(key)
        let designItem = designData[ drawerIndex ]
        designItem.property[ field ] = e
        this.setState({ 
            designData,
            drawerHtml: this.createNotifierDrawerHtml(designItem),
        })
    }


    /**
     * 创建发起抽屉内容
     * @param {object} designItem 
     */
    createStartDrawerHtml = (designItem, formTreeAllCheckValue) => {
        const { name, property, property: { formFieldAuth }, key } = designItem
        const { 
            handleShowUserModal, 
            handleAllRadioChange,
            handleItemRadioChange,
        } = this
        if(typeof(formTreeAllCheckValue) === 'undefined') formTreeAllCheckValue = this.state.formTreeAllCheckValue

        return (
            <Tabs defaultActiveKey="set">
                <TabPane tab="设置发起人" key="set" className="set-tab-area">
                    <div className="set-area">
                        <div className="item-area">
                            <p className="title item">节点名称</p>
                            <Input 
                                defaultValue={ name } 
                                key={ this.state.nameInputKey }
                                ref={ this.nameRef }
                                className="input-select-user"
                            />
                        </div>
                        <div className="item-area">
                            <p className="title item">发起人类型</p>
                            <Radio className="item" checked>组织内成员</Radio>
                        </div>
                        <div className="item-area">
                            <p className="title item">谁可以提交</p>
                            <Input 
                                value={ 
                                    property.submitIdList && property.submitIdList.length
                                        ? property.submitNameList.join(',')
                                        : '全员'
                                } 
                                readOnly 
                                className="input-select-user"
                                onClick={ () => handleShowUserModal(key) }
                            />
                        </div>
                    </div>
                </TabPane>
                <TabPane tab="表单操作权限" key="form" className="form-tab-area">
                    <Table
                        columns={[
                            {
                                title:'表单字段',
                                dataIndex: 'type',
                                width: 250,
                            },
                            {
                                title: (
                                    <Rgroup 
                                        name="allhandleType" 
                                        value={ formTreeAllCheckValue } 
                                        onChange={ e => handleAllRadioChange(e, key) }
                                    >
                                        <Radio value="edit" className="edit-radio">可编辑</Radio>
                                        <Radio value="readonly" className="read-radio">只读</Radio>
                                        <Radio value="hidden" className="hide-radio">隐藏</Radio>
                                    </Rgroup>
                                ),
                                render: value => (
                                    <Rgroup 
                                        name="itemhandleType" 
                                        value={ value.checkValue } 
                                        onChange={ e => handleItemRadioChange(e, value.key, key) }
                                    >
                                        <Radio value="edit" className="edit-radio" />
                                        <Radio value="readonly" className="read-radio" />
                                        <Radio value="hidden" className="hide-radio" />
                                    </Rgroup>
                                )
                            }
                        ]}
                        dataSource={ formFieldAuth }
                        pagination={ false }
                        bordered={ false }
                        scroll={{
                            y: '70vh',
                        }}
                        className="form-handle-table"
                    />
                </TabPane>
            </Tabs>
        )
    }


    handleShowMoveUserModal = (item, uid) => {
        this.setState({
            moveModalVisible: true,
            hasSelectList: uid ? [
                {
                    id: uid,
                    name: item.else8,
                    avatar: item.else9,
                }
            ] : [],
        })
    }


    handleCloseMoveUserModal = () => {
        this.setState({
            moveModalVisible: false,
        })
    }


    handleSaveMoveUser = () => {
        const { hasSelectList } = this.moveSelectRef.current.getSelectList()
        if(hasSelectList.length) this.handleOverChange(hasSelectList[0].id, this.state.designActiveKey, 'userId', hasSelectList[0])
        this.handleCloseMoveUserModal()
    }


    /**
     * 创建审批抽屉内容
     * @param {object} designItem 
     */
    createApprovalDrawerHtml = (designItem, formTreeAllCheckValue) => {
        const { property, property: { formFieldAuth }, key, type, name, isOverTimeRemind, overTimeInfo } = designItem
        const userTypeName = property.userType?.name
        const { 
            handleApprovalRadioChange,
            handleCreateApprovalUserTypeHtml,
            handleAllRadioChange,
            handleItemRadioChange,
        } = this

        return (
            <Tabs defaultActiveKey="set">
                <TabPane tab="设置审批人" key="set" className="set-tab-area">
                    <div className="set-area">
                        <div className="item-area">
                            <p className="title item">节点名称</p>
                            <Input 
                                defaultValue={ name } 
                                key={ this.state.nameInputKey }
                                ref={ this.nameRef }
                                className="input-select-user"
                            />
                        </div>
                        
                        <div className="item-area approval-radio-area">
                            <p className="title item">审批类型</p>
                            <Rgroup 
                                name="auditType" 
                                value={ userTypeName } 
                                className="rgroup-area item"
                                onChange={ e => handleApprovalRadioChange(e, key) }
                            >
                                <Radio 
                                    value="assign" 
                                    className="rgroup-item"
                                >
                                    指定成员
                                </Radio>
                                {
                                    this.isPreset ? '' : (
                                        <>
                                            <Radio value="departmentDirector" className="rgroup-item">部门主管</Radio>
                                            <Radio value="immediateDirector" className="rgroup-item">直属主管</Radio>
                                        </>
                                    )
                                }
                                <Radio value="role" className="rgroup-item">角色</Radio>
                                <Radio value="startSelect" className="rgroup-item">发起人自选</Radio>
                                <Radio value="initiatorOneself" className="rgroup-item">发起人自己</Radio>
                            </Rgroup>
                        </div>
                        { handleCreateApprovalUserTypeHtml(userTypeName, key) }
                    </div>
                </TabPane>
                <TabPane tab="表单操作权限" key="form" className="form-tab-area">
                    <Table
                        columns={[
                            {
                                title:'表单字段',
                                dataIndex: 'type',
                                width: 250,
                            },
                            {
                                title: (
                                    <Rgroup 
                                        name="allhandleType" 
                                        value={ formTreeAllCheckValue } 
                                        onChange={ e => handleAllRadioChange(e, key) }
                                    >
                                        <Radio value="edit" className="edit-radio">可编辑</Radio>
                                        <Radio value="readonly" className="read-radio">只读</Radio>
                                        <Radio value="hidden" className="hide-radio">隐藏</Radio>
                                    </Rgroup>
                                ),
                                render: value => (
                                    <Rgroup 
                                        name="itemhandleType" 
                                        value={ value.checkValue } 
                                        onChange={ e => handleItemRadioChange(e, value.key, key) }
                                    >
                                        <Radio value="edit" className="edit-radio" />
                                        <Radio value="readonly" className="read-radio" />
                                        <Radio value="hidden" className="hide-radio" />
                                    </Rgroup>
                                )
                            }
                        ]}
                        dataSource={formFieldAuth}
                        pagination={false}
                        bordered={false}
                        scroll={{
                            y: '70vh',
                        }}
                        className="form-handle-table"
                    />
                </TabPane>
                <TabPane tab="超时设置" key="isOverTimeRemind" className="set-area">       
                    <div className="item-area">
                        <Checkbox 
                            checked={ isOverTimeRemind || false }
                            onChange={e => this.handleOverChange(e.target.checked, key, 'isOverTimeRemind')}
                        >
                            启用超时处理
                        </Checkbox>
                    </div>
                    { isOverTimeRemind ? (
                        <>
                            <div className="item-area">
                                <p className="title item">超时时间</p>
                                超过
                                <InputNumber 
                                    placeholder="请输入时间"
                                    min={ 1 }
                                    style={{ width: 100, margin: '0 5px 0 10px' }}
                                    value={ overTimeInfo?.overTime?.count || '' }
                                    onChange={ v => this.handleOverChange(v, key, 'count') }
                                    precision={ 0 }
                                />
                                <Select
                                    placeholder="请选择时间单位"
                                    value={ overTimeInfo?.overTime?.unit }
                                    style={{ width: 150, margin: '0 10px 0 5px' }}
                                    onChange={ v => this.handleOverChange(v, key, 'unit')}
                                >
                                    <Option value="day">天</Option>
                                    <Option value="hour">小时</Option>
                                </Select>
                                启用处理
                            </div>
                            <div className="item-area">
                                <p className="title item">超时处理</p>
                                <Rgroup 
                                    className="multiple-approval-rgroup-area item" 
                                    name="multiple-approval" 
                                    value={ overTimeInfo?.overTimeHandle?.overTimeHandlerMethod }
                                    onChange={ e => this.handleOverChange(e.target.value, key, 'overTimeHandlerMethod')}
                                >
                                    <Radio value="0" className="block-radio">等待</Radio>
                                    <Radio value="1" className="block-radio">自动通过</Radio>
                                    <Radio value="2" className="block-radio">转交其他人员审批</Radio>
                                    <Radio value="3" className="block-radio">自动拒绝</Radio>
                                </Rgroup>
                                { overTimeInfo?.overTimeHandle?.overTimeHandlerMethod === '2' ? (
                                    <Input 
                                        readOnly 
                                        value={ 
                                            overTimeInfo?.overTimeHandle?.userId 
                                                ? designItem.else8
                                                : '' 
                                        } 
                                        placeholder="请选择转交人员"
                                        onClick={ () => this.handleShowMoveUserModal(designItem, overTimeInfo?.overTimeHandle?.userId) }
                                        style={{ marginTop: 8 }}
                                    />
                                ) : null }
                            </div>
                            <div className="item-area">
                                <p className="title item">超时提醒</p>
                                <Rgroup 
                                    className="multiple-approval-rgroup-area item" 
                                    name="multiple-approval" 
                                    value={ overTimeInfo?.overTimeRemind?.remindType }
                                    onChange={ e => this.handleOverChange(e.target.value, key, 'remindType')}
                                >
                                    <Radio value="0" className="block-radio">发送消息</Radio>
                                    <Radio value="1" className="block-radio">发送短信</Radio>
                                    <Radio value="2" className="block-radio">消息和短信同时发送</Radio>
                                </Rgroup>
                                超时前
                                <InputNumber 
                                    placeholder="请输入时间"
                                    style={{ width: 100, margin: '0 5px 0 10px' }}
                                    min={ 1 }
                                    value={ overTimeInfo?.overTimeRemind?.remindCount || '' }
                                    onChange={ v => this.handleOverChange(v, key, 'remindCount') }
                                    precision={ 0 }
                                />
                                <Select
                                    placeholder="请选择时间单位"
                                    value={ overTimeInfo?.overTimeRemind?.remindUnit }
                                    style={{ width: 150, margin: '0 10px 0 5px' }}
                                    onChange={ v => this.handleOverChange(v, key, 'remindUnit')}
                                >
                                    <Option value="day">天</Option>
                                    <Option value="hour">小时</Option>
                                </Select>
                                发送提醒
                            </div>
                        </>
                    ) : null }
                    

                </TabPane>
            </Tabs>
        )
    }


    handleOverChange = (v, key, field, users = null) => {
        let designData = [ ...this.state.designData ]
        const { roleItem } = this.state
        const drawerIndex = this.getDesignDataIndex(key)
        let designItem
        if(typeof(drawerIndex) === 'undefined') {
            designItem = this.getEachApprovalItem(designData, key)
        } else {
            designItem = designData[drawerIndex]
        }

        if(field === 'isOverTimeRemind') {
            designItem[ field ] = v
            if(v) {
                designItem[ 'else1' ] = ''
                designItem[ 'else2' ] = ''
                designItem[ 'else3' ] = '0'
                designItem[ 'else4' ] = undefined
                designItem[ 'else5' ] = '0'
                designItem[ 'else6' ] = ''
                designItem[ 'else7' ] = ''
                designItem[ 'else8' ] = undefined
                designItem[ 'else9' ] = undefined

                if(!designItem.overTimeInfo) designItem.overTimeInfo = {} 
                if(!designItem.overTimeInfo.overTimeHandle) designItem.overTimeInfo.overTimeHandle = {}
                designItem.overTimeInfo.overTimeHandle.overTimeHandlerMethod = '0'
            
                if(!designItem.overTimeInfo) designItem.overTimeInfo = {} 
                if(!designItem.overTimeInfo.overTimeRemind) designItem.overTimeInfo.overTimeRemind = {}
                designItem.overTimeInfo.overTimeRemind.remindType = '0'
            } else {
                delete designItem[ 'else1' ]
                delete designItem[ 'else2' ]
                delete designItem[ 'else3' ]
                delete designItem[ 'else4' ]
                delete designItem[ 'else5' ]
                delete designItem[ 'else6' ]
                delete designItem[ 'else7' ]
                delete designItem[ 'else8' ]
                delete designItem[ 'else9' ]
                delete designItem.overTimeInfo
            }
        } else if(field === 'count') {
            if(!designItem.overTimeInfo) designItem.overTimeInfo = {} 
            if(!designItem.overTimeInfo.overTime) designItem.overTimeInfo.overTime = {} 
            designItem.overTimeInfo.overTime.count = v
            designItem.else1 = v
        } else if(field === 'unit') {
            if(!designItem.overTimeInfo) designItem.overTimeInfo = {} 
            if(!designItem.overTimeInfo.overTime) designItem.overTimeInfo.overTime = {}
            designItem.overTimeInfo.overTime.unit = v
            designItem.else2 = v
        } else if(field === 'overTimeHandlerMethod') {
            if(!designItem.overTimeInfo) designItem.overTimeInfo = {} 
            if(!designItem.overTimeInfo.overTimeHandle) designItem.overTimeInfo.overTimeHandle = {}
            designItem.overTimeInfo.overTimeHandle.overTimeHandlerMethod = v
            designItem.overTimeInfo.overTimeHandle.userId = v === '2' ? '' : undefined
            designItem.else3 = v
            designItem.else4 = v === '2' ? '' : undefined
        } else if(field === 'userId') {
            if(!designItem.overTimeInfo) designItem.overTimeInfo = {} 
            if(!designItem.overTimeInfo.overTimeHandle) designItem.overTimeInfo.overTimeHandle = {}
            designItem.overTimeInfo.overTimeHandle.userId = v
            designItem.else4 = v
            designItem.else8 = users ? users.name : ''
            designItem.else9 = users ? users.avatar : ''
        } else if(field === 'remindType') {
            if(!designItem.overTimeInfo) designItem.overTimeInfo = {} 
            if(!designItem.overTimeInfo.overTimeRemind) designItem.overTimeInfo.overTimeRemind = {}
            designItem.overTimeInfo.overTimeRemind.remindType = v
            designItem.else5 = v
        } else if(field === 'remindCount') {
            if(!designItem.overTimeInfo) designItem.overTimeInfo = {} 
            if(!designItem.overTimeInfo.overTimeRemind) designItem.overTimeInfo.overTimeRemind = {}
            designItem.overTimeInfo.overTimeRemind.remindCount = v
            designItem.else6 = v
        } else if(field === 'remindUnit') {
            if(!designItem.overTimeInfo) designItem.overTimeInfo = {} 
            if(!designItem.overTimeInfo.overTimeRemind) designItem.overTimeInfo.overTimeRemind = {}
            designItem.overTimeInfo.overTimeRemind.remindUnit = v
            designItem.else7 = v
        }
        
        
        this.setState({ 
            designData,
            drawerHtml: this.createApprovalDrawerHtml(designItem),
        })
    }



    /**
     * 关闭抽屉框
     * @param {number} key 
     */
    handleCloseDrawer = () => {
        const { designActiveKey: key, designData: oriDesignData } = this.state
        let designData = [ ...oriDesignData ]
        const drawerIndex = this.getDesignDataIndex(key)
        if(typeof(drawerIndex) === 'undefined') {
            this.handleEachCreateContent(designData, key)
            if(this.nameRef.current) this.handleEachActName(designData, key)
        } else if(designData[drawerIndex].type === 'approval'){
            designData[drawerIndex].content = this.handleCreateApprovalContent(designData[drawerIndex].property)
            if(this.nameRef.current) designData[drawerIndex].name = this.nameRef.current.state.value
        } else {
            if(this.nameRef.current) designData[drawerIndex].name = this.nameRef.current.state.value
        }

        
        this.setState({
            drawerVisible: false,
            designData,
        })
    }


    handleEachActName = (designData, activeKey) => {
        designData.forEach((value, index) => {
            if(value.children) {
                value.children.forEach((val, ind) => {
                    if(val.key === activeKey) {
                        designData[index].children[ind].name = this.nameRef.current.state.value
                        return
                    } else {
                        this.handleEachActName([val], activeKey)
                    }
                })
            }
        })

    }


    handleEachCreateContent = (designData, activeKey) => {
        designData.forEach((value, index) => {
            if(value.children) {
                value.children.forEach((val, ind) => {
                    if(val.key === activeKey) {
                        designData[index].children[ind].content = this.handleCreateEachContentHtml(designData[index].children[ind].type, designData[index].children[ind].condition, designData[index].children[ind].property)
                        return
                    } else {
                        this.handleEachCreateContent([val], activeKey)
                    }
                })
            }
        })

    }


    handleCreateEachContentHtml = (type, condition, property) => {
        if(type === 'approval') {
            return this.handleCreateApprovalContent(property)
        } else {
            return this.handleCreateBranchContent(condition)
        }
    }


    handleCreateBranchContent = condition => {
        let outerList = []
        const numberTypeMap = {
            lt: '小于',
            le: '小于等于',
            eq: '等于',
            ge: '大于等于',
            gt: '大于',
        }
        condition.forEach(value => {
            let innerList = []
            value.forEach(val => {
                if(val.itemType === 'start' && val.selectNameList.length) {
                    innerList.push(`发起人是${val.selectNameList.join(',')}`)
                } else if(val.itemType === 'number' && val.numberValue !== '') {
                    innerList.push(`${val.name}${numberTypeMap[val.numberType]}${val.numberValue}`)
                } else if(val.itemType === 'radio' && val.radioValue !== '') {
                    innerList.push(`${val.name}选择了${val.radioValue}`)
                } else if(val.itemType === 'select' && val.selectValue !== '') {
                    innerList.push(`${val.name}选择了${val.selectValue}`)
                }
            })
            if(innerList.length) {
                outerList.push(innerList.join(' 且 '))
            }
        })

        return `${outerList.length ? '当 ' : '请设置条件'}${outerList.join(' 或 ')}`
    }

    /**
     * 关闭抽屉框时动态创建审批内容
     * @param {object} property 
     */
    handleCreateApprovalContent = property => {
        const { hasSelectedList, userType: { name, params } } = property
        const defaultContent = '请选择审批人'

        const contentItem = {
            assign: hasSelectedList.length ? hasSelectedList.map(item => item.name).join(',') : defaultContent,
            continueDirector: '连续多级主管',
            departmentDirector: '部门主管',
            immediateDirector: '直属主管',
            role: params.roleNameList && params.roleNameList.length ? params.roleNameList.join(',') : defaultContent,
            initiatorOneself: '发起人自己',
            startSelect: '发起人自选',
        }

        return contentItem[name]
    }


    /**
     * 发起抽屉框切换复选框时更新状态字段
     * @param {string} v 
     */
    handleStartCheckboxChange = v => {
        
        const {
            curOrgList,
            startHasSelectedList: newStartHasSelectedList
        } = this.state

        let curOrgMap = {}
        curOrgList.forEach(item => {
            curOrgMap[`${item.type}-${item.id}`] = item
        })

        // 获取curOrgList与当前选中的值的差集
        const curOrgItem = curOrgList.map(item => `${item.type}-${item.id}`)
        const diffItem = curOrgItem.filter(item => !v.includes(item))
        
        // 从已选数组中剔除差集
        let startHasSelectedList = newStartHasSelectedList.filter(item => {
            if(!diffItem.includes(`${item.type}-${item.id}`)) {
                return item
            }
        })
        startHasSelectedList = [ ...startHasSelectedList, ...v.map(item => curOrgMap[item]) ]
        startHasSelectedList = this.handleUniqueArr(startHasSelectedList)
        
        this.setState({
            startHasSelectCheckboxValue: v,
            startHasSelectedList,
            startSelectAll: v.length === curOrgList.length,
        })
    }


    /**
     * 从已选用户中删除一个用户
     * @param {object} item [所选对象节点]
     * @param {number} index [数组下标] 
     */
    handleDelSelectedList = (item, index) => {
        //根据索引删除当前
        const {
            curOrgList,
            startHasSelectedList: newStartHasSelectedList,
        } = this.state

        let startHasSelectedList = [ ...newStartHasSelectedList ]
        startHasSelectedList.splice(index, 1)
        const startHasSelectCheckboxValue = startHasSelectedList.map(item => `${item.type}-${item.id}`)

        const startHasSelectedItem = startHasSelectedList.map(item => `${item.type}-${item.id}`)
        const checkAllList = curOrgList.filter(item => {
            if(!startHasSelectedItem.includes(`${item.type}-${item.id}`)) {
                return item
            }
        })
        this.setState({
            startHasSelectCheckboxValue,
            startHasSelectedList,
            startSelectAll: !checkAllList.length,
        })
    }


    /**
     * 发起框选择用户时点击全选处理逻辑
     * @param {object} e [节点]
     */
    handleStartAllCheckboxChange = e => {
        const checked = e.target.checked
        const {
            curOrgList,
            startHasSelectedList: newStartHasSelectedList,
        } = this.state

        let startHasSelectCheckboxValue = []
        let startHasSelectedList = []
        if(checked) {
            startHasSelectCheckboxValue = curOrgList.map(item => `${item.type}-${item.id}`)
            startHasSelectedList = [ ...newStartHasSelectedList, ...curOrgList ]
        } else {
            const curArr = curOrgList.map(v => `${v.type}-${v.id}`)
            startHasSelectedList = newStartHasSelectedList.filter(item => !curArr.includes(`${item.type}-${item.id}`))
        }
        startHasSelectedList = this.handleUniqueArr(startHasSelectedList)
        
        this.setState({
            startHasSelectCheckboxValue,
            startHasSelectedList,
            startSelectAll: checked,
        })
    }


    /**
     * 
     * @param {*} item 
     */
    handleStartCurOrgListChange = async item => {
        const curOrgList = await this.getOrgAndUserData(item.id)

        const {
            startHasSelectedList,
            startSelectBreadList: newStartSelectBreadList,
        } = this.state

        const curOrgItem = curOrgList.map(item => `${item.type}-${item.id}`)
        const startHasSelectedItem = startHasSelectedList.map(item => `${item.type}-${item.id}`)
        const startHasSelectCheckboxValue = startHasSelectedItem.filter(item => curOrgItem.includes(item))

        //判断当前选中的组织是否已经在面包屑中
        const breadIndex = newStartSelectBreadList.map(item => `${item.type}-${item.id}`).indexOf(`${item.type}-${item.id}`)
        let startSelectBreadList = []
        if(breadIndex !== -1) {
            startSelectBreadList = newStartSelectBreadList.slice(0, breadIndex + 1)
        } else {
            startSelectBreadList = this.handleUniqueArr([...newStartSelectBreadList, item])
        }

        this.setState({
            curOrgList,
            startHasSelectCheckboxValue,
            startSelectAll: startHasSelectCheckboxValue.length === curOrgList.length,
            startSelectBreadList,
        })
    }


    handleApprovalRadioChange = (e, key) => {
        //根据key值锁定索引位置
        const { target: { value } } = e
        const { createApprovalDrawerHtml } = this
        let designData = [ ...this.state.designData ]
        const drawerIndex = this.getDesignDataIndex(key)

        let designItem
        if(typeof(drawerIndex) === 'undefined') {
            designItem = this.getEachApprovalItem(designData, key)
        } else {
            designItem = designData[drawerIndex]
        }
        
        switch(value) {
            case 'assign': 
                designItem.property.userType.params = {
                    userIdList: [],
                    approvalMode: 'ONE_BY_ONE',
                }
                break
            
            case 'startSelect':
                designItem.property.userType.params = {
                    selectUserMode: 'multiple',
                    approvalMode: 'ONE_BY_ONE',
                }
                break

            case 'continueDirector':
                designItem.property.userType.params = {
                    approvalEndMode: 'role',
                    notOverDirectorLevel: 1,
                    isNotOverDirector: false,
                    approvalIsNullMode: 'autoAccess',
                    roleIdList: [],
                    roleNameList: [],
                }
                break

            case 'departmentDirector':
                designItem.property.userType.params = {
                    directorLevel: 1,
                    notFoundDirector: false,
                    approvalIsNullMode: 'autoAccess',
                    approvalMode: 'ONE_BY_ONE',
                }
                break

            case 'immediateDirector':
                designItem.property.userType.params = {
                    directorLevel: 1,
                    approvalIsNullMode: 'autoAccess',
                }
                break

            case 'role':
                designItem.property.userType.params = {
                    roleIdList: [],
                    roleNameList: [],
                    approvalMode: 'ONE_BY_ONE',
                    approvalIsNullMode: 'autoAccess',
                }
                break

            case 'initiatorOneself':
                designItem.property.userType.params = {
                }
                break
            
            default:
                break

        }

        //修改数据
        designItem.property.hasSelectedList = []
        designItem.property.userType.name = value

        this.setState({
            designData,
            drawerHtml: createApprovalDrawerHtml(designItem)
        })
    }


    handleStartSelfSelectChange = (v, module, key, field) => {
        let designData = [ ...this.state.designData ]
        const { roleItem } = this.state
        const drawerIndex = this.getDesignDataIndex(key)
        let designItem
        if(typeof(drawerIndex) === 'undefined') {
            designItem = this.getEachApprovalItem(designData, key)
        } else {
            designItem = designData[drawerIndex]
        }
        designItem.property.userType.params[field] = v
   
        if(field === 'roleIdList') {
            designItem.property.userType.params.roleNameList = v.map(val => roleItem[val])
        }
        
        this.setState({ 
            designData,
            drawerHtml: this.createApprovalDrawerHtml(designItem),
        })
    }


    handleDrawerRadioChange = (e, module, key, field) => {
        let designData = [ ...this.state.designData ]
        const drawerIndex = this.getDesignDataIndex(key)
        let designItem
        if(typeof(drawerIndex) === 'undefined') {
            designItem = this.getEachApprovalItem(designData, key)
        } else {
            designItem = designData[drawerIndex]
        }

        designItem.property.userType.params = {}
        designItem.property.userType.params[field] = e.target.value
        
        switch(field) {
            case 'approvalEndMode':
                if(e.target.value === 'role') {
                    designItem.property.userType.params.roleIdList = []
                    designItem.property.userType.params.roleNameList = []
                    designItem.property.userType.params.approvalIsNullMode = 'autoAccess'
                    designItem.property.userType.params.isNotOverDirector = false
                    designItem.property.userType.params.notOverDirectorLevel = 1
                } else {
                    designItem.property.userType.params.contactDirectorLevel = 1
                }
                break

            default:
                break
        }

        this.setState({
            designData,
            drawerHtml: this.createApprovalDrawerHtml(designItem),
        })
    }


    handleDelSelectedTag = (module, key, index) => {
        let designData = [ ...this.state.designData ]
        const drawerIndex = this.getDesignDataIndex(key)
        let designItem
        if(typeof(drawerIndex) === 'undefined') {
            designItem = this.getEachApprovalItem(designData, key)
        } else {
            designItem = designData[drawerIndex]
        }

        designItem.property.hasSelectedList.splice(index, 1)
        designItem.property.userType.params.userIdList.splice(index, 1)

        this.setState({ 
            designData,
            drawerHtml: this.createApprovalDrawerHtml(designItem),
        })
    }


    handleDelSelectedTagNotifer = (key, index) => {
        let designData = [ ...this.state.designData ]
        const drawerIndex = this.getDesignDataIndex(key)
        let designItem
        if(typeof(drawerIndex) === 'undefined') {
            designItem = this.getEachApprovalItem(designData, key)
        } else {
            designItem = designData[drawerIndex]
        }

        designItem.property.hasSelectedList.splice(index, 1)
        designItem.property.notifierIdList.splice(index, 1)

        this.setState({ 
            designData,
            drawerHtml: this.createNotifierDrawerHtml(designItem),
        })   
    }


    handleCreateApprovalUserTypeHtml = (module, key) => {
        const { designData } = this.state
        const drawerIndex = this.getDesignDataIndex(key)
        let designItem
        if(typeof(drawerIndex) === 'undefined') {
            designItem = this.getEachApprovalItem(designData, key)
        } else {
            designItem = designData[drawerIndex]
        }
        const { property: { userType: { params }, hasSelectedList } } = designItem

        const {
            handleShowUserModal,
            handleStartSelfSelectChange,
            handleDrawerRadioChange,
        } = this

        const {
            roleOptionArr,
        } = this.state

        switch(module) {
            case 'assign':
                return (
                    <>
                        <div className="item-area">
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />}
                                onClick={() => handleShowUserModal(key)}
                            >
                                添加成员
                            </Button>
                        </div>
                        <div className="item-area copy-tag-area">
                            {
                                hasSelectedList.map((item, index) => <Tag closable key={`${item.type}-${item.id}`} onClose={() => this.handleDelSelectedTag(module, key, index)}>{item.name}</Tag>)
                            }
                        </div>
                        {
                            (hasSelectedList.length && hasSelectedList.length > 1) ? (
                                <>
                                    <p className="item multiple-approval-area">多人审批时采用的审批方式</p>
                                    <Rgroup 
                                        className="multiple-approval-rgroup-area item" 
                                        name="multiple-approval" 
                                        value={params.approvalMode || 'ONE_BY_ONE'}
                                        onChange={e => handleStartSelfSelectChange(e.target.value, module, key, 'approvalMode')}
                                    >
                                        <Radio value="ONE_BY_ONE" className="block-radio">依次审批</Radio>
                                        <Radio value="ALL" className="block-radio">会签（须所有办理人处理）</Radio>
                                        <Radio value="ONE_OF_ALL" className="block-radio">或签（一名办理人处理即可）</Radio>
                                    </Rgroup>
                                </>
                            ) : null
                        }
                    </>
                )
            case 'startSelect':
                return (
                    <div className="item-area">
                        {params.selectUserMode === 'multiple' && (
                            <>
                            <p className="item multiple-approval-area">多人审批时采用的审批方式</p>
                            <Rgroup 
                                className="multiple-approval-rgroup-area item" 
                                name="multiple-approval" 
                                value={params.approvalMode || 'ONE_BY_ONE'}
                                onChange={e => handleStartSelfSelectChange(e.target.value, module, key, 'approvalMode')}
                            >
                                <Radio value="ONE_BY_ONE" className="block-radio">依次审批</Radio>
                                <Radio value="ALL" className="block-radio">会签（须所有办理人处理）</Radio>
                                <Radio value="ONE_OF_ALL" className="block-radio">或签（一名办理人处理即可）</Radio>
                            </Rgroup>
                            </>
                        )}
                    </div>
                )

            case 'initiatorOneself':
                return (
                    <div className="item-area">
                        <p className="start-self-title">发起人自己将作为审批人处理审批单</p>
                    </div>
                )
            
            case 'role':
                return (
                    <div className="item-area">
                        <Select
                            placeholder="请选择角色"
                            className="role-select item"
                            showSearch
                            onChange={v => handleStartSelfSelectChange([v], module, key, 'roleIdList')}
                        >
                            { roleOptionArr }
                        </Select>

                        <Rgroup 
                            className="multiple-approval-rgroup-area item" 
                            name="multiple-approval" 
                            value={params.approvalMode || 'ONE_BY_ONE'}
                            onChange={e => handleStartSelfSelectChange(e.target.value, module, key, 'approvalMode')}
                        >
                            <Radio value="ONE_BY_ONE" className="block-radio">依次审批</Radio>
                            <Radio value="ALL" className="block-radio">会签（须所有办理人处理）</Radio>
                            <Radio value="ONE_OF_ALL" className="block-radio">或签（一名办理人处理即可）</Radio>
                        </Rgroup>
                    </div>
                )
    
            case 'departmentDirector':
                return (
                    <div className="item-area">
                        <p className="item multiple-approval-area">多人审批时采用的审批方式</p>
                        <Rgroup 
                            className="multiple-approval-rgroup-area item" 
                            name="multiple-approval" 
                            value={params.approvalMode || 'ONE_BY_ONE'}
                            onChange={e => handleStartSelfSelectChange(e.target.value, module, key, 'approvalMode')}
                        >
                            <Radio value="ONE_BY_ONE" className="block-radio">依次审批</Radio>
                            <Radio value="ALL" className="block-radio">会签（须所有办理人处理）</Radio>
                            <Radio value="ONE_OF_ALL" className="block-radio">或签（一名办理人处理即可）</Radio>
                        </Rgroup>
                        <p className="item no-approval-area">审批人为空时</p>
                        <Rgroup 
                            className="no-approval-rgroup-area item" 
                            name="no-approval" 
                            value={params.approvalIsNullMode || 'autoAccess'}
                            onChange={e => handleStartSelfSelectChange(e.target.value, module, key, 'approvalIsNullMode')}
                        >
                            <Radio value="autoAccess" className="block-radio">自动通过</Radio>
                        </Rgroup>
                    </div>
                )
                                
            case 'immediateDirector':
                return (
                    <div className="item-area">
                        <p className="item no-approval-area">审批人为空时</p>
                        <Rgroup 
                            className="no-approval-rgroup-area item" 
                            name="no-approval" 
                            value={params.approvalIsNullMode || 'autoAccess'}
                            onChange={e => handleStartSelfSelectChange(e.target.value, module, key, 'approvalIsNullMode')}
                        >
                            <Radio value="autoAccess" className="block-radio">自动通过</Radio>
                        </Rgroup>
                    </div>
                )
                                
            case 'continueDirector':
                return (
                    <div className="item-area">
                        <p className="item">审批终点</p>
                        <Rgroup 
                            className="end-approval-rgroup-area item" 
                            name="end-approval" 
                            value={params.approvalEndMode || 'role'}
                            onChange={e => handleDrawerRadioChange(e, module, key, 'approvalEndMode')}
                        >
                            <Radio value="role" className="block-radio">
                                指定角色
                                {
                                    (params.approvalEndMode && params.approvalEndMode === 'role') && (
                                        <Select
                                            placeholder="请选择角色"
                                            className="start-role-select"
                                            style={{ marginLeft: '10px' }}
                                            showSearch
                                            onChange={v => handleStartSelfSelectChange([v], module, key, 'roleIdList')}
                                        >
                                            { roleOptionArr }
                                        </Select>
                                    )
                                }
                            </Radio>
                            {
                                (params.approvalEndMode && params.approvalEndMode === 'role') && (
                                    <div className="item select-role-checkbox-area" style={{ marginTop: '10px' }}>
                                        <Checkbox 
                                            checked={params.isNotOverDirector || false}
                                            onChange={e => handleStartSelfSelectChange(e.target.checked, module, key, 'isNotOverDirector')}
                                        >
                                            同时不超过发起人向上的
                                        </Checkbox>
                                        <Select
                                            className="top-director-select-role-area"
                                            value={params.notOverDirectorLevel || 1}
                                            onChange={v => handleStartSelfSelectChange(v, module, key, 'notOverDirectorLevel')}
                                        >
                                            {
                                                Array.from(Array(21), (v, k) => k).map(item => {
                                                    return item > 0 ? <Option key={item} value={item}>第{item}级主管</Option> : null
                                                })
                                            }
                                        </Select>
                                    </div>
                                )
                            }
                            
                            
                            <div className="select-role-area">
                                <Radio value="contact" className="block-radio">
                                    通讯录中的
                                </Radio>
                                <Select
                                    className="top-director-select"
                                    value={params.contactDirectorLevel || 1}
                                    onChange={v => handleStartSelfSelectChange(v, module, key, 'contactDirectorLevel')}
                                >
                                    <Option value={1}>最高层级主管</Option>
                                    {
                                        Array.from(Array(21), (v, k) => k).map(item => {
                                            return item > 1 ? <Option key={item} value={item}>第{item}级主管</Option> : null
                                        })
                                    }
                                </Select>
                            </div> 
                        </Rgroup>
                        <p className="item no-approval-area">审批人为空时</p>
                        <Rgroup 
                            className="no-approval-rgroup-area item" 
                            name="no-approval"
                            value={params.approvalIsNullMode || 'autoAccess'}
                            onChange={e => handleStartSelfSelectChange(e.target.value, module, key, 'approvalIsNullMode')}
                        >
                            <Radio value="autoAccess" className="block-radio">自动通过</Radio>
                        </Rgroup>
                    </div>
                )
            default:
                return ''        
        }
    }


    handleAddBranchGroup = (key) => {
        let designData = [ ...this.state.designData ]
        const item = {
            checkValue: 'start',
            hasSelectedList: [],
            selectIdList: [],
            selectNameList: [],
            itemType: 'start',
        }
        let designItem
        let length = 0
        designData.forEach((val, ind) => {
            if(val.type === 'branch-group') {
                val.children.forEach((v, i) => {
                    if(v.key === key) {
                        designData[ind].children[i].condition.push([item])
                        designItem = designData[ind].children[i]
                        length = designData[ind].children.length
                        return
                    }
                })
            }
        })

        this.setState({ designData, drawerHtml: this.createBranchDrawerHtml(designItem, length) })
    }

    handleAddBranch = (key, index) => {
        let designData = [ ...this.state.designData ]
        const item = {
            checkValue: 'start',
            hasSelectedList: [],
            selectIdList: [],
            selectNameList: [],
            itemType: 'start',
        }
        let designItem
        let length = 0
        designData.forEach((val, ind) => {
            if(val.type === 'branch-group') {
                val.children.forEach((v, i) => {
                    if(v.key === key) {
                        designData[ind].children[i].condition[index].push(item)
                        designItem = designData[ind].children[i]
                        length = designData[ind].children.length
                        return
                    }
                })
            }
        })

        this.setState({ designData, drawerHtml: this.createBranchDrawerHtml(designItem, length) })
    }


    handleDelBranchGroup = (key, index) => {
        let designData = [ ...this.state.designData ]
        let designItem
        let length = 0

        designData.forEach((val, ind) => {
            if(val.type === 'branch-group') {
                val.children.forEach((v, i) => {
                    if(v.key === key) {
                        designData[ind].children[i].condition.splice(index, 1)
                        designItem = designData[ind].children[i]
                        length = designData[ind].children.length
                        return
                    }
                })
            }
        })

        this.setState({ designData, drawerHtml: this.createBranchDrawerHtml(designItem, length) })
    }

    handleDelBranch = (key, index, k) => {
        let designData = [ ...this.state.designData ]
        let designItem
        let length = 0

        designData.forEach((val, ind) => {
            if(val.type === 'branch-group') {
                val.children.forEach((v, i) => {
                    if(v.key === key) {
                        designData[ind].children[i].condition[index].splice(k, 1)
                        designItem = designData[ind].children[i]
                        length = designData[ind].children.length
                        return
                    }
                })
            }
        })

        this.setState({ designData, drawerHtml: this.createBranchDrawerHtml(designItem, length) })
    }


    handleChangeBranchItem = (e, item, branchLength) => {
        item.name = e.target.value
        this.setState({})
        this.setState({ drawerHtml: this.createBranchDrawerHtml(item, branchLength) })
    }


    handleChangeBranchSort = (v, item) => {
        this.handleChangePriority(item, item.priority - 1, v - 1)
    }



    handleBranchSelectChange = (checkValue, key, index, k, field, option) => {
        let designData = [ ...this.state.designData ]
        const conditionMap = {
            start: {
                checkValue: checkValue,
                hasSelectedList: [],
                selectIdList: [],
                selectNameList: [],
                itemType: option?.key,
            },
            number: {
                checkValue: checkValue,
                numberType: 'lt',
                numberValue: '',
                itemType: option?.key,
                name: option?.children,
            },
            radio: {
                checkValue: checkValue,
                radioValue: '',
                itemType: option?.key,
                name: option?.children,
            },
            select: {
                checkValue: checkValue,
                selectValue: '',
                itemType: option?.key,
                name: option?.children,
            },
        }
        let designItem
        let length = 0
        designData.forEach((val, ind) => {
            if(val.type === 'branch-group') {
                val.children.forEach((v, i) => {
                    if(v.key === key) {
                        designData[ind].children[i].condition[index][k][field] = checkValue
                        if(field === 'checkValue') {
                            designData[ind].children[i].condition[index][k] = conditionMap[option.key]
                        }
                        designItem = designData[ind].children[i]
                        length = designData[ind].children.length
                        return
                    }
                })
            }
        })

        this.setState({ designData, drawerHtml: this.createBranchDrawerHtml(designItem, length) })
    }


    handleBranchInputChange = (e, key, index, k) => {
        const inputValue = parseFloat(e)
        if(Number.isNaN(inputValue)) return

        let designData = [ ...this.state.designData ]
        let designItem
        let length = 0
        designData.forEach((val, ind) => {
            if(val.type === 'branch-group') {
                val.children.forEach((v, i) => {
                    if(v.key === key) {
                        designItem = designData[ind].children[i]
                        designData[ind].children[i].condition[index][k].numberValue = inputValue
                        length = designData[ind].children.length
                        return
                    }
                })
            }
        })

        this.setState({ designData, drawerHtml: this.createBranchDrawerHtml(designItem, length) })
    }


    /**
     * 提交流程数据
     * @returns 
     */
    handleSave = async () => {
        if(this.flag) {
            message.error('请求数据中，请勿连续点击')
            return
        }

        this.flag = true
        this.setState({ saveBtnLoading: true })

        //获取基础设置表单数据
        const basicPromise = await this.basicFormRef.current.validateFields().catch(e => new Promise(resolve => {
            resolve(false)
        }))
        const basicFormData = await basicPromise
        if(!basicFormData) {
            this.setState({ tabActiveKey: 'basic' })
            this.flag = false
            this.setState({ saveBtnLoading: false })
            return
        }

        let { talentId } = basicFormData
        if(talentId) {
            talentId = talentId.split('-')[0]
            basicFormData.talentId = talentId
        }

        //过滤对象集合中的component属性
        const { formItem } = this.state
        if(!formItem.length) {
            message.error('表单控件不能为空')
            this.flag = false
            this.setState({ saveBtnLoading: false })
            return
        }
        const formJson = formItem.map(item => {
            const { component, ...rest } = item
            return rest
        })

        const { designData } = this.state
        //过滤条件节点只有1个条件的数据
        const finalData = designData.filter(item => !(item.type === 'branch-group' && item.children.length <= 1))

        //判断条件分支条件是否为空
        let branchEmpty = false
        let branchChildrenEmpty = false
        finalData.forEach((value, index) => {
            if(value.type === 'branch-group') {
                value.children.forEach((val, ind) => {
                    finalData[index].children[ind].error = false
                })
            }
        })

        finalData.forEach((value, index) => {
            if(value.type === 'branch-group') {
                value.children.forEach((val, ind) => {
                    if(!val.condition.length) {
                        branchEmpty = true
                        finalData[index].children[ind].error = true
                    } else {
                        val.condition.forEach((va, ia) => {
                            va.forEach((v, i) => {
                                if(
                                    (typeof(v.hasSelectedList) !== 'undefined' && !v.hasSelectedList.length)
                                    || (typeof(v.numberValue) !== 'undefined' && v.numberValue === '')
                                    || (typeof(v.selectValue) !== 'undefined' && v.selectValue === '')
                                    || (typeof(v.radioValue) !== 'undefined' && v.radioValue === '')
                                ) {
                                    branchEmpty = true
                                    finalData[index].children[ind].error = true
                                }
                            })
                        })
                    }
                })
            }
        })
        if(branchEmpty) {
            this.setState({ designData: finalData })
            message.error('请设置流程条件')
            this.flag = false
            this.setState({ saveBtnLoading: false })
            return
        }

        finalData.forEach((value, index) => {
            if(value.type === 'branch-group') {
                value.children.forEach((val, ind) => {
                    if(!val.children.length) {
                        branchChildrenEmpty = true
                        finalData[index].children[ind].error = true
                    }
                })
            }
        })
        if(branchChildrenEmpty) {
            this.setState({ designData: finalData })
            message.error('请设置分支下的审批人')
            this.flag = false
            this.setState({ saveBtnLoading: false })
            return
        }

        //判断超时设置
        let overEmpty = false
        finalData.forEach((value, index) => {
            if(value.type === 'approval' && value.isOverTimeRemind) {
                for(let key in finalData[index]) {
                    if(key.indexOf('else') !== -1 && finalData[index][key] === '') {
                        overEmpty = true
                        finalData[index].error = true
                    }
                }
            }

            if(value.type === 'branch-group') {
                value.children.forEach((va, ia) => {
                    va.children.forEach((vb, ib) => {
                        if(vb.type === 'approval' && vb.isOverTimeRemind) {
                            for(let key in vb) {
                                if(key.indexOf('else') !== -1 && vb[key] === '') {
                                    overEmpty = true
                                    vb.error = true
                                }
                            }
                        }
                    })
                })
            }
        })
        if(overEmpty) {
            this.setState({ designData: finalData })
            message.error('请输入超时设置信息')
            this.flag = false
            this.setState({ saveBtnLoading: false })
            return
        }

        const elseFieldList = ['else1', 'else2', 'else3', 'else4', 'else5', 'else6', 'else7']
        finalData.forEach((value, index) => {
            if(value.type === 'approval' && value.isOverTimeRemind) {
                elseFieldList.forEach(v => {
                    delete value[ v ]
                })
            }

            if(value.type === 'branch-group') {
                value.children.forEach((va, ia) => {
                    va.children.forEach((vb, ib) => {
                        if(vb.type === 'approval' && vb.isOverTimeRemind) {
                            elseFieldList.forEach(v => {
                                delete vb[ v ]
                            })
                        }
                    })
                })
            }
        })
        
        const { detailId } = this
        //取出所有抄送节点
        let ccTo = []
        let orgIdList = []
        let userIdList = []
        finalData.forEach(item => {
            if(item.type === 'notifier') {
                item.property.hasSelectedList.forEach(val => {
                    if(val.type === 'org') {
                        orgIdList.push(val.id)
                    }
                    if(val.type === 'user') {
                        userIdList.push(val.id)
                    }
                })
            }
        })
        ccTo = [ { type: 'deparment', id: orgIdList }, { type: 'user', id: userIdList } ]
        
        let params = { processDesign: { ...basicFormData, content: JSON.stringify(finalData), ccTo: JSON.stringify(ccTo) }, flowableForm: { formJson: JSON.stringify(formJson), formName: '', formKey: basicFormData.formId } }
        
        try {
            const { msg } = await saveDingModelData(params)
            message.success(msg, 1, () => this.props.history.goBack())
        } catch (error) {
            this.flag = false
            this.setState({ saveBtnLoading: false })
        }
    }

    
    /**
     * 处理气泡卡片显示隐藏
     * @param { int } key 
     */
    handlePopChange = (key = 0) => {
        this.setState({
            popVisible: !this.state.popVisible,
            popKey: key,
        })
    }


    handleShowUserModal = async (key, params = {}) => {
        let startHasSelectedList = []
        if(Object.keys(params).length) {
            startHasSelectedList = this.getBranchDesignSelect(key, params.index, params.k)
        } else {
            const { designData } = this.state
            const drawerIndex = this.getDesignDataIndex(key)
            let designItem
            if(typeof(drawerIndex) === 'undefined') {
                designItem = this.getEachApprovalItem(designData, key)
            } else {
                designItem = designData[drawerIndex]
            }
            startHasSelectedList = designItem.property.hasSelectedList
        }
        
        this.setState({
            modalVisible: true,
            hasSelectList: startHasSelectedList,
        })

        if(Object.keys(params).length) {
            this.setState({ branchGroupIndex: params.index, branchItemIndex: params.k })
        }
    }


    /**
     * 根据索引值获取条件分支中的元素集合
     * @param { string } key 
     * @param { int } index 
     * @param { int } k 
     * @returns 
     */
    getBranchDesignSelect = (key, index, k) => {
        const { state: { designData } } = this
        
        let select = []
        designData.forEach((val, ind) => {
            if(val.type === 'branch-group') {
                val.children.forEach((v, i) => {
                    if(v.key === key) {
                        select = designData[ind].children[i].condition[index][k].hasSelectedList
                    }
                })
            }
        })

        return select
    }


    /**
     * 关闭选择人员的弹层
     */
    handleCloseUserModal = () => {
        this.setState({
            modalVisible: false,
        })
    }


    /**
     * 添加流程节点
     * @param {string} module 类型
     * @param {int} key 唯一标识
     */
    handleAddNode = (module, key, level = 1) => {
        let designItem = {}
        this.designCount++
        const { designCount } = this

        switch(module) {
            case 'approval':
                designItem = {
                    id: `approval-${designCount}`,
                    type: 'approval',
                    key: designCount,
                    level: level,
                    name: '审批人',
                    content: '请选择审批人',
                    iconType: 'iconshenpi',
                    property: {
                        //审批人类型
                        userType: {
                            name: 'assign', //assign=指定成员 selfSelect=发起人自选 continueMoreDirector=连续多级主管 departmentDirector=部门主管 immediateDirector=直属主管 role=角色 self=发起人自己
                            params: {
                                userIdList: [], //成员id集合
                                approvalMode: 'ONE_BY_ONE', // 多人审批时的审批方式 continue=依次审批 oneByOne=会签 oneOfAll=或签
                            }
                        },
                        hasSelectedList: [], //已选
                        formFieldAuth: this.state.formTreeDataSource.map(item => { return { ...item, checkValue: 'readonly' } }),
                    },
                    isOverTimeRemind: false,
                }
                break

            case 'notifier':
                designItem = {
                    id: `notifier-${designCount}`,
                    type: 'notifier',
                    key: designCount,
                    level: level,
                    name: '抄送人',
                    content: '请选择抄送人',
                    iconType: 'iconxingzhuang550',
                    property: {
                        notifierIdList: [],
                        allowAddNotifer: false,
                        hasSelectedList: [], //已选
                    }
                }
                break
            
            case 'branch-group':
                designItem = {
                    id: `branch-group-${designCount}`,
                    type: 'branch-group',
                    key: designCount,
                    level: level,
                    name: '条件组',
                    children: [
                        {
                            id: `branch-${++this.designCount}`,
                            key: this.designCount,
                            type: 'branch',
                            level: level + 1,
                            name: '条件1',
                            content: '请设置条件',
                            priority: 1,
                            condition: [],
                            children: [],
                        },
                        {
                            id: `branch-${++this.designCount}`,
                            key: this.designCount,
                            type: 'branch',
                            level: level + 1,
                            name: '条件2',
                            content: '请设置条件',
                            priority: 2,
                            condition: [],
                            children: [],
                        },
                    ],
                }
                break

            default:
                break
        }

        //重新渲染流程数据
        const designData = [ ...this.state.designData ]
        this.handlePushDesignData(designData, key, designItem)
        this.setState({ designData })

        //设置气泡卡片显示隐藏
        this.handlePopChange()
    }


    /**
     * 创建流程节点数据
     * @param { array } data 
     * @param { string } key 
     * @param { map } designItem 
     */
    handlePushDesignData = (data, key, designItem) => {
        data.forEach((item, index) => {
            if(item.children) {
                this.handlePushDesignData(item.children, key, designItem)
            }
            if(item.key === key && item.level > 1) {
                data[index].children.push(designItem)
                return
            } else if(item.key === key) {
                data.splice(index + 1, 0, designItem)
                return
            }
            
        })
    }


    /**
     * 删除条件分支中的流程节点
     * @param {*} data 
     * @param {*} key 
     */
    handleEachDelNode = (data, key) => {
        data.forEach((item, index) => {
            if(item.children) {
                this.handleEachDelNode(item.children, key)
            }
            if(item.key === key) {
                data.splice(index, 1)
                return
            }
        })
    }


 
    handleChangePriority = (keys, index, next, e = null) => {
        if(e) e.stopPropagation()

        let child
        let newDesignData = [ ...this.state.designData ]
        let keyIndex = keys
        if(isNaN(keys)) {
            newDesignData.forEach((item, ins) => {
                if(item.type === 'branch-group') {
                    item.children.forEach((v, k) => {
                        if(v.id === keys.id) keyIndex = ins
                    })
                }
            })
        } 

        child = newDesignData[keyIndex].children
        console.log(1, child);

        [ child[ index ], child[ next ] ] = [ child[ next ], child[ index ] ]
        let tempPriority = child[next].priority
        child[next].priority = child[index].priority
        child[index].priority = tempPriority

        this.setState({})
    }

    
    /**
     * 删除流程节点
     * @param {string} key 
     * @param {map} e 
     */
    handleDelNode = (key, e) => {
        e.stopPropagation()

        const designData = [ ...this.state.designData ]
        const drawerIndex = this.getDesignDataIndex(key)
        if(typeof(drawerIndex) === 'undefined') {
            this.handleEachDelNode(designData, key)
        } else {
            designData.splice(drawerIndex, 1)
        }

        this.setState({ 
            designData,
        })
    }


    /**
     * 选择人员后保存数据
     */
    handleSaveUser = () => {
        const { hasSelectList } = this.selectRef.current.getSelectList()

        const {
            designActiveKey: key,
            designData: newDesignData,
            branchGroupIndex, 
            branchItemIndex,
        } = this.state
        
        const newList = hasSelectList.map(item => {
            return {
                ...item,
                avatar: '',
                type: 'user',
            }
        })  
        let designData = [ ...newDesignData ]
        let params = { branchGroupIndex, branchItemIndex, newList, drawerHtml: '' }
        this.handleEachSaveUser(designData, key, params)

        this.setState({ designData, drawerHtml: params.drawerHtml }) 
        this.handleCloseUserModal()
    }


    /**
     * 保存所选人员时根据流程类型创建不同抽屉内容
     * @param { array } data 
     * @param { string } key 
     * @param { map } params 
     */
    handleEachSaveUser = (data, key, params) => {
        let { 
            branchGroupIndex,
            branchItemIndex,
            newList,
        } = params

        data.forEach((item, index) => {
            if(item.children) {
                this.handleEachSaveUser(item.children, key, params)
            }
            if(item.key === key && item.level > 1) {
                if(item.type === 'branch') {
                    data[index].condition[branchGroupIndex][branchItemIndex].hasSelectedList = newList
                    data[index].condition[branchGroupIndex][branchItemIndex].selectIdList = newList.map(item => item.id)
                    data[index].condition[branchGroupIndex][branchItemIndex].selectNameList = newList.map(item => item.name)
                    params.drawerHtml = this.createBranchDrawerHtml(data[index], data.length)
                } else {
                    this.handleCreateCommonUserSelectData(data, index, params)
                }
                return
            } else if(item.key === key) {
                this.handleCreateCommonUserSelectData(data, index, params)
                return
            }
            
        })
    }


    /**
     * 选择人员后创建条件分支内的抽屉内容
     * @param { array } designData 
     * @param { index } drawerIndex 
     * @param { map } params 
     */
    handleCreateCommonUserSelectData = (designData, drawerIndex, params) => {
        let { newList } = params
        designData[drawerIndex].property.hasSelectedList = newList
        designData[drawerIndex].content = newList.map(item => item.name).join(',')
        switch(designData[drawerIndex].type) {
            case 'start':
                designData[drawerIndex].property.submitIdList = newList.map(item => item.id)
                designData[drawerIndex].property.submitNameList = newList.map(item => item.name)
                params.drawerHtml = this.createStartDrawerHtml(designData[drawerIndex])
                break

            case 'approval':
                designData[drawerIndex].property.userType.params.userIdList = newList.map(item => item.id)
                params.drawerHtml = this.createApprovalDrawerHtml(designData[drawerIndex])
                break

            case 'notifier':
                designData[drawerIndex].property.notifierIdList = newList.map(item => item.id)
                params.drawerHtml = this.createNotifierDrawerHtml(designData[drawerIndex])
                break

            default:
                break 
        }
    }


    /**
     * 渲染流程设计的html文本
     * @param { array } data 
     * @returns 
     */
    handleRenderDesignHtml = data => {
        const {
            handleRenderDesignHtml,
            handleShowDrawer,
            MyIcon,
            handleDelNode,
            handleAddNode,
            handlePopChange,
            handleAddBranchItem,
            webType,

            state: {
                popVisible,
                popKey,
                designData,
            }
        } = this

        return data.map((item, keys) => {
            if(item.type !== 'branch-group') {
                return (
                    <div className="node-area" key={`node${item.key}`}>
                        <div className={`${item.type} item-area ${item.error ? 'common-judge-error-area' : ''}`} onClick={() => handleShowDrawer(item)}>
                            <header>
                                <MyIcon type={item.iconType} className="icon" />
                                <span className="title">{item.name}</span>
                                {item.type !== 'start' && <CloseOutlined className="close" onClick={e => handleDelNode(item.key, e)} hidden={ this.webType === 'detail' } />}
                            </header>
                            <div className="content-area">
                                {item.content}
                                <RightOutlined className="icon" />
                            </div>
                        </div>
                        <div className="add-node-area">
                            <div className="add-node-btn-area">
                            {
                                item.level === 1 ? (
                                    
                                    <Popover
                                                title=""
                                                // placement="rightTop"
                                                placement="rightBottom"
                                                trigger="click"
                                                visible={popKey === item.key && popVisible}
                                                content={
                                                    <div className="pop-area">
                                                        <div className="pop-item-area">
                                                            <Button 
                                                                type="text" 
                                                                className="pop-btn" 
                                                                icon={
                                                                    <Avatar 
                                                                        src={ <MyIcon type="iconshenpi" /> } 
                                                                        size={ 30 } 
                                                                        style={{ background: '#957aff', color: '#FFF', marginRight: 8 }}
                                                                    />
                                                                }
                                                                onClick={() => handleAddNode('approval', item.key, item.level)}
                                                            >
                                                                审批人
                                                            </Button>
                                                            {designData.filter(item => item.type === 'notifier').length ? '' : (
                                                                <Button 
                                                                    type="text" 
                                                                    className="pop-btn" 
                                                                    icon={
                                                                        <Avatar 
                                                                            src={ <MyIcon type="iconxingzhuang550" /> } 
                                                                            size={ 30 } 
                                                                            style={{ background: '#5b87fd', color: '#FFF', marginRight: 8 }}
                                                                        />
                                                                    }
                                                                    onClick={() => handleAddNode('notifier', item.key, item.level)}
                                                                >
                                                                    抄送人
                                                                </Button>
                                                            )}
                                                            <Button 
                                                                type="text" 
                                                                className="pop-btn" 
                                                                icon={
                                                                    <Avatar 
                                                                        src={ <MyIcon type="icontiaojianfenzhi" /> } 
                                                                        size={ 30 } 
                                                                        style={{ background: '#ffca33', color: '#FFF', marginRight: 8 }}
                                                                    />
                                                                }
                                                                onClick={() => handleAddNode('branch-group', item.key)}
                                                            >
                                                                条件分支
                                                            </Button>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                {
                                                    (webType !== 'detail' && item.type !== 'notifier') ? (
                                                        <Button 
                                                            type="text" 
                                                            className="text-blue add-node-btn" 
                                                            icon={<PlusCircleFilled className="add-node-icon"/>} 
                                                            onClick={() => handlePopChange(item.key)}
                                                        />
                                                    ) : null
                                                }
                                            </Popover>
                                        
                                ) : null
                            }
                            </div>
                        </div>
                    </div>
                )
            } else {
                return item.children.length > 1 ? (
                    <div className="branch-wrap-area" key={`branch${ item.key }`}>
                        <div className="branch-box-wrap-area">  
                            <div className="branch-box-area">
                                {
                                    webType !== 'detail' ? (
                                        <Button style={{ background: '#FFF', color: '#245FF2' }} className="add-branch-btn" onClick={() => handleAddBranchItem(item.key)}>添加条件</Button>
                                    ) : null
                                }
                                {
                                    item.children.map((v, k) => {
                                        return (
                                            <div className="col-box-area" key={`branch${ v.key }`}>
                                                { k === 0 && <div className="top-left-cover-line"></div> }
                                                { k === 0 && <div className="bottom-left-cover-line"></div> }
                                                <div className="condition-node-area">
                                                    <div className="condition-node-box-area">
                                                        <div className={ `auto-judge-area ${ v.error ? 'auto-judge-error-area' : '' }` } onClick={() => handleShowDrawer(v, item.children.length)}>
                                                            <header>
                                                                <span className="title">{v.name}</span>
                                                                <span className="priority">优先级{v.priority}</span>
                                                                <CloseOutlined className="close handle-icon" onClick={e => handleDelNode(v.key, e)} hidden={ this.webType === 'detail' }/>
                                                            </header>
                                                            <div className="content-area" title={v.content}>
                                                                {v.content}
                                                                {
                                                                    k === 0 ? null : (
                                                                        <div 
                                                                            className="left-arrow-area judge-arrow-area"
                                                                            onClick={ e => this.handleChangePriority(keys, k, k - 1, e) }
                                                                        >
                                                                            <CaretLeftOutlined />
                                                                        </div>
                                                                    )
                                                                }
                                                                {
                                                                    k === (item.children.length - 1) ? null : (
                                                                        <div 
                                                                            className="right-arrow-area judge-arrow-area"
                                                                            onClick={ e => this.handleChangePriority(keys, k, k + 1, e) }
                                                                        >
                                                                            <CaretRightOutlined />
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="add-node-btn-area">
                                                            <Popover
                                                                title=""
                                                                placement="rightBottom"
                                                                trigger="click"
                                                                visible={ popKey === v.key && popVisible }
                                                                content={
                                                                    <div className="pop-area">
                                                                        <div className="pop-item-area">
                                                                            <Button 
                                                                                type="text" 
                                                                                className="pop-btn" 
                                                                                icon={
                                                                                    <Avatar 
                                                                                        src={ <MyIcon type="iconshenpi" /> } 
                                                                                        size={ 30 } 
                                                                                        style={{ background: '#957aff', color: '#FFF', marginRight: 8 }}
                                                                                    />
                                                                                }
                                                                                onClick={() => handleAddNode('approval', v.key, v.level + 1)}
                                                                            >
                                                                                审批人
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                }
                                                            >
                                                                {
                                                                    webType !== 'detail' ? (
                                                                        <Button 
                                                                            type="text" 
                                                                            className="text-blue add-node-btn" 
                                                                            icon={ <PlusCircleFilled className="add-node-icon"/> } 
                                                                            onClick={ () => handlePopChange(v.key) }
                                                                        />
                                                                    ) : null
                                                                }
                                                            </Popover>
                                                        </div>
                                                    </div>
                                                </div>
                                                { k === item.children.length - 1 && <div className="top-right-cover-line"></div> }
                                                { k === item.children.length - 1 && <div className="bottom-right-cover-line"></div> }
                                                { handleRenderDesignHtml(v.children) }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="add-node-btn-box-area">
                                <div className="add-node-btn-area">
                                    <Popover
                                        title=""
                                        placement="rightBottom"
                                        trigger="click"
                                        visible={ popKey === item.key && popVisible }
                                        content={
                                            <div className="pop-area">
                                                <div className="pop-item-area">
                                                    <Button 
                                                        type="text" 
                                                        className="pop-btn" 
                                                        icon={
                                                            <Avatar 
                                                                src={ <MyIcon type="iconshenpi" /> } 
                                                                size={ 30 } 
                                                                style={{ background: '#957aff', color: '#FFF', marginRight: 8 }}
                                                            />
                                                        }
                                                        onClick={() => handleAddNode('approval', item.key, 1)}
                                                    >
                                                        审批人
                                                    </Button>
                                                    {designData.filter(item => item.type === 'notifier').length ? '' : (
                                                        <Button 
                                                            type="text" 
                                                            className="pop-btn" 
                                                            icon={
                                                                <Avatar 
                                                                    src={ <MyIcon type="iconxingzhuang550" /> } 
                                                                    size={ 30 } 
                                                                    style={{ background: '#5b87fd', color: '#FFF', marginRight: 8 }}
                                                                />
                                                            }
                                                            onClick={() => handleAddNode('notifier', item.key, 1)}
                                                        >
                                                            抄送人
                                                        </Button>
                                                    )}
                                                    <Button 
                                                        type="text" 
                                                        className="pop-btn" 
                                                        icon={
                                                            <Avatar 
                                                                src={ <MyIcon type="icontiaojianfenzhi" /> } 
                                                                size={ 30 } 
                                                                style={{ background: '#ffca33', color: '#FFF', marginRight: 8 }}
                                                            />
                                                        }
                                                        onClick={() => handleAddNode('branch-group', item.key, 1)}
                                                    >
                                                        条件分支
                                                    </Button>
                                                </div>
                                            </div>
                                        }
                                    >
                                        {
                                            (webType !== 'detail' && item.type !== 'notifier') ? (
                                                <Button 
                                                    type="text" 
                                                    className="text-blue add-node-btn" 
                                                    icon={<PlusCircleFilled className="add-node-icon"/>} 
                                                    onClick={() => handlePopChange(item.key)}
                                                />
                                            ) : null
                                        }
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : ''
            }
        })
    }


    /**
     * 添加条件元素
     * @param {string} key 
     */
    handleAddBranchItem = key => {
        let designData = [ ...this.state.designData ]
        const drawerIndex = this.getDesignDataIndex(key)

        designData[drawerIndex].children.push({
            id: `branch-${++this.designCount}`,
            key: this.designCount,
            type: 'branch',
            name: `条件${designData[drawerIndex].children.length + 1}`,
            content: '请设置条件',
            priority: designData[drawerIndex].children.length + 1,
            condition: [],
            children: [],
            level: 2,
        })
        
        this.setState({ designData })
    }


    /**
     * 判断数组内元素是否全部相同 如果是返回该元素
     * @param {array} arr [数组]
     */
    getStartTreeAllCheckValue = arr => {
        const checkValueArr = arr.map(item => item.checkValue)
        return new Set(checkValueArr).size === 1 && arr[0].checkValue
    }


    /**
     * 对象数组去重
     * @param {array} arr [数组数据]
     */
    handleUniqueArr = arr => {
        let arrMap = {}
        arr.forEach(item => {
            arrMap[`${item.type}-${item.id}`] = item
        })

        let finalArr = []
        new Set(arr.map(item => `${item.type}-${item.id}`)).forEach(v => {
            finalArr = [...finalArr, arrMap[v]]
        })

        return finalArr
    }


    /**
     * 通过唯一标识获取对应数组中的索引
     * @param {int} key [唯一标识]
     */
    getDesignDataIndex = key => {
        const { designData } = this.state
        let drawerIndex

        designData.forEach((item, index) => {
            if(item.key === key) {
                drawerIndex = index
                return
            }
        })

        return drawerIndex
    }


    /**
     * 从树形数据中根据key值获取元素
     * @param {array} data 
     * @param {string} activeKey 
     * @returns 
     */
    getEachApprovalItem = (data, activeKey) => {
        let item
        data.forEach((value, index) => {
            if(value.children) {
                value.children.forEach((val, ind) => {
                    if(val.children) {
                        val.children.forEach((v, i) => {
                            if(v.key === activeKey) {
                                item = v
                            }
                        })
                    }
                })
            }
        })

        return item
    }


    render() {

        const {
            handleScale,
            handleCloseDrawer,
            handleGoBack,
            handleSave,
            handleTabChange,
            handleCloseUserModal,
            handleSaveUser,
            handleRenderDesignHtml,		
            basicFormRef,
            webType,

            formMakingRef,
            fieldRef,
            propertyRef,
            jsonAreaRef,
            importJsonRef,
            previewFormRef,
            formGroupRef,
            handleFormItemActive,
            handleFormChange,
            handleCopyItem,
            handleDelItem,
            handleFormProChange,
            handleCloseJsonModal,
            handleCopyJsonData,
            handleCloseImportModal,
            handleImportJsonData,
            handleClosePreviewModal,
            handleClosePreviewFormDataModal,
            componentRefList,
            handleAddTreeData,
            handleDelTreeData,
            handleTreeDataChange,
            handleEditTreeData,
            handleSaveTreeData,
            handleBackTreeData,
            handleAddTreeTopData,
        } = this

        const {
            tabActiveKey,

            scale,

            curOrgList,
            startHasSelectCheckboxValue,
            startHasSelectedList,
            startSelectAll,
            startSelectBreadList,
                        
            categoryOptionArr,
            designData,

            drawerVisible,
            drawerTitle,
            drawerHtml,

            modalVisible,

            formItem,
            activeComponent,
            curFormItem,
            jsonVisible,
            jsonFormItem,
            importVisible,
            previewVisible,
            previewForm,
            previewFormDataVisible,
            previewFormData,
        } = this.state
        
        const MyIcon = createFromIconfontCN({
            scriptUrl: '//at.alicdn.com/t/font_2468137_vu3e3r2ukyp.js',
        })

        const componentProperty = componentItem[activeComponent]
        
        return (
            <div className="main-box-area">
                <Tabs 
                    activeKey={tabActiveKey} 
                    className={`main-tab-box-area ${ this.preset ? 'main-tab-box-hidden-area' : '' }`}
                    onChange={handleTabChange}
                >
                    <TabPane tab="基础设置" key="basic" className="basic-tab-area" style={{ opacity: this.preset ? 0 : 1 }} forceRender>
                        <Form
                            ref={basicFormRef}
                            layout="vertical"
                            colon={false}
                            className="basic-form-area"
                            >

                            <Fitem
                                label="分组"
                                name="serviceModular"
                                hidden
                            >
                                <Input />
                            </Fitem>

                            <Fitem
                                label="分组"
                                name="type"
                                hidden
                            >
                                <Input />
                            </Fitem>

                            <Fitem
                                label="分组"
                                name="preset"
                                hidden
                            >
                                <Input />
                            </Fitem>

                            <Fitem
                                label="模型名称"
                                name="name"
                                rules={[{ required: true, message: '该项不能为空' }]}
                            >
                                <Input disabled={webType === 'detail'} />
                            </Fitem>

                            <Fitem
                                label="应用名称"
                                name="appId"
                                rules={[{ required: true, message: '该项不能为空' }]}
                            >
                                <Select
                                    placeholder="应用名称"
                                    disabled={webType === 'detail'}
                                    optionFilterProp="children"
                                    showSearch
                                >
                                    { categoryOptionArr }
                                </Select>
                            </Fitem>
                            <Fitem
                                label="租户名称"
                                name="talentId"
                                hidden
                            >
                                <Input />
                            </Fitem>
                            <Fitem
                                label="表单名称"
                                name="formId"
                                hidden
                            >
                                <Input />
                            </Fitem>

                            <Fitem
                                label="模型描述"
                                name="remark"
                            >
                                <Input disabled={webType === 'detail'} />
                            </Fitem>
                        </Form>
                    </TabPane>
                    <TabPane tab="表单设计" key="form" className="form-edit-container" forceRender style={{ opacity: this.preset ? 0 : 1 }}>
                        {/* <header className="edit-header">
                            <Button className="filter-item" icon={<EyeOutlined />} onClick={this.handlePreview}>预览</Button>
                            <Button className="filter-item" icon={<SnippetsOutlined />} onClick={this.handleShowJsonModal}>生成JSON</Button>
                            <Button className="filter-item" icon={<DeleteOutlined />} onClick={this.handleClearForm} hidden={ this.webType === 'detail' }>清空</Button>
                            <Button className="filter-item" icon={<ImportOutlined />} onClick={this.handleImportJson} hidden={ this.webType === 'detail' }>导入JSON</Button>
                        </header> */}
                        <main className="edit-form-container-main">
                            <div className="component-container">
                                <div className="component-area">
                                    {
                                        componentArr.map((value, indexs) => {
                                            return (
                                                <div className="component-area-item" key={indexs}>
                                                    <header>{value.name}</header>
                                                    <div className="component-item-container" ref={componentRefList[indexs]}>
                                                        {
                                                            value.children.map((item, index) => {
                                                                return (
                                                                    <Button 
                                                                        className="component-item"
                                                                        key={index}
                                                                        icon={<MyIcon type={item.iconType} className="icon" />}
                                                                    >
                                                                        {item.text}
                                                                    </Button>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="middle-container">
                                <div className="btn-handle-area">
                                    <Space>
                                        <Button type="text" className="filter-item"  onClick={this.handlePreview}>预览</Button>
                                        <Button type="text" className="filter-item"  onClick={this.handleShowJsonModal}>生成JSON</Button>
                                        <Button type="text" className="filter-item"  onClick={this.handleClearForm} hidden={ this.webType === 'detail' }>清空</Button>
                                        <Button type="text" className="filter-item"  onClick={this.handleImportJson} hidden={ this.webType === 'detail' }>导入JSON</Button>
                                    </Space>
                                </div>
                                <Form
                                    name="middle"
                                    colon={ false }
                                    className=""
                                >
                                    <div ref={ formMakingRef } className="middle-form-container">
                                    {
                                        formItem.map(item => {
                                            return (
                                            <div 
                                                className={ item.activeStatus ? "spe-big-item active" : "spe-big-item" } 
                                                key={ item.id }
                                                data-id={ item.id }
                                                style={ item.type === 'textarea' ? {padding: '40px 25px'} : {} }
                                                onClick={ () => handleFormItemActive(item.id) }
                                            >
                                                {
                                                    item.type === 'group' ? (
                                                        <>
                                                        <header>分组</header>
                                                        <div ref={ formGroupRef } style={{ minHeight: '100px', border: '1px dashed #999' }}></div>
                                                        </>
                                                    ) : (
                                                        <>
                                                        <Fitem
                                                            label={
                                                                <div style={{ width: item.labelWidth }}>
                                                                    { item.label }{ item.labelSuffix }
                                                                </div>
                                                            }
                                                            name={ item.key }
                                                            className="spe-item"
                                                            labelAlign={ item.labelAlign }
                                                            required={ item.required }
                                                        >
                                                            { item.component } 
                                                        </Fitem>
                                                        <div className="icon-bg-area">
                                                            <Tooltip title="删除">
                                                                <DeleteOutlined className="icon-item del-item" onClick={handleDelItem} hidden={ this.webType === 'detail' } />
                                                            </Tooltip>
                                                            <Tooltip title="复制">
                                                                <CopyOutlined className="icon-item copy-item" onClick={handleCopyItem} hidden={ this.webType === 'detail' } />
                                                            </Tooltip>
                                                        </div>
                                                        <div className="mask-area"></div>
                                                        </>
                                                    )
                                                }
                                                
                                            </div>
                                            )
                                        })
                                    }
                                    </div>
                                </Form>
                            </div>
                            <div className="properties-container">
                            <Tabs 
                                    className="properties-tab" 
                                    defaultActiveKey="1" 
                                    onChange={null}
                                >
                                    <TabPane 
                                        tab="字段属性"
                                        key="field"
                                    >
                                    {
                                            formItem.length ? (
                                            <Form
                                                name="field"
                                                ref={fieldRef}
                                                colon={false}
                                                layout="vertical"
                                                onValuesChange={(change, all) => handleFormChange(all)}
                                            >
                                                <Fitem
                                                    label="标题"
                                                    name="label"
                                                >
                                                    <Input disabled={ this.webType === 'detail' } />
                                                </Fitem>
                                                {
                                                    typeof componentProperty.placeholder === 'undefined' || (
                                                        <Fitem
                                                            label="占位内容"
                                                            name="placeholder"
                                                        >
                                                            <Input  disabled={ this.webType === 'detail' }/>
                                                        </Fitem>)
                                                }
                                                {
                                                    typeof componentProperty.width === 'undefined' || (
                                                        <Fitem
                                                            label="表单栅格"
                                                            name="width"
                                                        >
                                                            <InputNumber min={8} max={24} disabled={ this.webType === 'detail' } />
                                                        </Fitem>)
                                                }
                                                {
                                                    typeof componentProperty.prefix === 'undefined' || (
                                                        <Fitem
                                                            label="前缀"
                                                            name="prefix"
                                                        >
                                                            <Input disabled={ this.webType === 'detail' }  />
                                                        </Fitem>)
                                                }
                                                {
                                                    typeof componentProperty.suffix === 'undefined' || (
                                                        <Fitem
                                                            label="后缀"
                                                            name="suffix"
                                                        >
                                                            <Input disabled={ this.webType === 'detail' }  />
                                                        </Fitem>)
                                                }
                                                {
                                                    typeof componentProperty.maxLength === 'undefined' || (
                                                        <Fitem
                                                            label="最大长度"
                                                            name="maxLength"
                                                        >
                                                            <InputNumber 
                                                                min={ 1 } 
                                                                max={ 1000 } 
                                                                disabled={ this.webType === 'detail' } 
                                                            />
                                                        </Fitem>)
                                                }
                                                {
                                                    typeof componentProperty.showCount === 'undefined' || (
                                                        <Fitem
                                                            label="是否显示字数提示"
                                                            name="showCountText"
                                                        >
                                                            <Cgroup disabled={ this.webType === 'detail' }>
                                                                <Checkbox value="true">是</Checkbox>
                                                            </Cgroup>
                                                        </Fitem>)
                                                }
                                                {
                                                    typeof componentProperty.showSearch === 'undefined' || (
                                                        <Fitem
                                                            label="是否可搜索"
                                                            name="showSearchText"
                                                        >
                                                            <Cgroup disabled={ this.webType === 'detail' }>
                                                                <Checkbox value="true">是</Checkbox>
                                                            </Cgroup>
                                                        </Fitem>)
                                                }
                                                {
                                                    typeof componentProperty.optionArr === 'undefined' || (
                                                        <Fitem
                                                            label="选项数据"
                                                        >
                                                            <Flist
                                                                name="optionArr"
                                                            >
                                                                {(fields, { add, remove }, { errors }) => (
                                                                    <>
                                                                    {fields.map((field, index) => (
                                                                        <Fitem
                                                                        key={field.key}
                                                                        >
                                                                        <Fitem
                                                                            {...field}
                                                                            noStyle
                                                                        >
                                                                            <Input placeholder="请输入选项数据" style={{width: '70%'}} disabled={ this.webType === 'detail' } />
                                                                        </Fitem>
                                                                        {fields.length > 1 ? (
                                                                            <MinusCircleOutlined
                                                                            className="delete-button"
                                                                            onClick={() => remove(field.name)}
                                                                            hidden={ this.webType === 'detail' }
                                                                            />
                                                                        ) : null}
                                                                        </Fitem>
                                                                    ))}
                                                                    <Fitem>
                                                                        <Button
                                                                        type="primary"
                                                                        size="small"
                                                                        onClick={() => add()}
                                                                        icon={<PlusOutlined />}
                                                                        hidden={ this.webType === 'detail' }
                                                                        >
                                                                            添加选项
                                                                        </Button>
                                                                    </Fitem>
                                                                    </>
                                                                )}
                                                                </Flist>
                                                        </Fitem>
                                                        )
                                                }
                                                {
                                                    typeof componentProperty.treeData === 'undefined' || (
                                                        <Fitem
                                                            label="选项数据"
                                                        >
                                                            <Table
                                                                columns={[
                                                                    {
                                                                        title:'值',
                                                                        render: item => {
                                                                            return item.readOnly ? <span className="tree-table-text" style={{ textIndent: `${20 * (item.level - 1)}px` }}>{item.title}</span> : (
                                                                                <Input defaultValue={item.title} onChange={handleTreeDataChange}/>
                                                                            )
                                                                        }
                                                                    },
                                                                    {
                                                                        title: '操作',
                                                                        width: 80,
                                                                        render: item => {
                                                                            return (
                                                                                <>
                                                                                    { item.readOnly ? (
                                                                                        <>
                                                                                        { item.level <= 4 && <Button type="text" className="btn-area text-blue" icon={<PlusOutlined />} onClick={() => handleAddTreeData(item)} hidden={ this.webType === 'detail' }/> }
                                                                                        <Button type="text" className="btn-area text-blue" icon={<EditOutlined />} onClick={() => handleEditTreeData(item)} hidden={ this.webType === 'detail' } />
                                                                                        <Button type="text" className="btn-area" danger icon={<DeleteOutlined />} onClick={() => handleDelTreeData(item)} hidden={ this.webType === 'detail' } />
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                        <Button type="text" className="btn-area text-blue" icon={<CheckOutlined />} onClick={() => handleSaveTreeData(item)} hidden={ this.webType === 'detail' } />
                                                                                        <Button type="text" className="btn-area" danger icon={<CloseOutlined />} onClick={() => handleBackTreeData(item)} hidden={ this.webType === 'detail' } /> 
                                                                                        </>
                                                                                    ) }
                                                                                    
                                                                                </>
                                                                            )
                                                                        }
                                                                    }
                                                                ]}
                                                                dataSource={curFormItem.treeData}
                                                                pagination={false}
                                                                bordered={false}
                                                                showHeader={false}
                                                                expandable={{
                                                                    expandedRowKeys: curFormItem.expandedRowKeys,
                                                                    expandIcon: props => null,
                                                                }}
                                                                className="properties-tree-table"
                                                            />
                                                            <Button type="text" size="small" className="btn-area add-top-level text-blue" icon={<PlusOutlined />} onClick={handleAddTreeTopData} hidden={ this.webType === 'detail' }>添加父级</Button>
                                                        </Fitem>
                                                    )
                                                }
                                                {
                                                    typeof componentProperty.min === 'undefined' || (
                                                        <Fitem
                                                            label="最小值"
                                                            name="min"
                                                        >
                                                            <InputNumber min={0} disabled={ this.webType === 'detail' } />
                                                        </Fitem>)
                                                }
                                                {
                                                    typeof componentProperty.max === 'undefined' || (
                                                        <Fitem
                                                            label="最大值"
                                                            name="max"
                                                        >
                                                            <InputNumber min={0} disabled={ this.webType === 'detail' } />
                                                        </Fitem>)
                                                }
                                                {
                                                    typeof componentProperty.step === 'undefined' || (
                                                        <Fitem
                                                            label="步长"
                                                            name="step"
                                                        >
                                                            <InputNumber min={1} disabled={ this.webType === 'detail' } />
                                                        </Fitem>)
                                                }
                                                {
                                                    typeof componentProperty.unit === 'undefined' || (
                                                        <Fitem
                                                            label="单位"
                                                            name="unit"
                                                        >
                                                            <Input disabled={ this.webType === 'detail' } />
                                                        </Fitem>)
                                                }
                                                {
                                                    typeof componentProperty.checkedChildren === 'undefined' || (
                                                        <Fitem
                                                            label="开启时文字描述"
                                                            name="checkedChildren"
                                                        >
                                                            <Input disabled={ this.webType === 'detail' } />
                                                        </Fitem>)
                                                }
                                                {
                                                    typeof componentProperty.unCheckedChildren === 'undefined' || (
                                                        <Fitem
                                                            label="关闭时文字描述"
                                                            name="unCheckedChildren"
                                                        >
                                                            <Input disabled={ this.webType === 'detail' } />
                                                        </Fitem>)
                                                }
                                                {
                                                    typeof componentProperty.character === 'undefined' || (
                                                        <Fitem
                                                            label="替换文本"
                                                            name="character"
                                                        >
                                                            <Input disabled={ this.webType === 'detail' } />
                                                        </Fitem>)
                                                }
                                                {
                                                    typeof componentProperty.hoverLinkUrl === 'undefined' || (
                                                        <Fitem
                                                            label="链接跳转地址"
                                                            name="hoverLinkUrl"
                                                        >
                                                            <Input disabled={ this.webType === 'detail' } />
                                                        </Fitem>)
                                                }
                                                {
                                                    typeof componentProperty.hoverLinkText === 'undefined' || (
                                                        <Fitem
                                                            label="链接跳转显示文本"
                                                            name="hoverLinkText"
                                                        >
                                                            <Input disabled={ this.webType === 'detail' } />
                                                        </Fitem>)
                                                }
                                                {
                                                    typeof componentProperty.multiple === 'undefined' || (
                                                        <Fitem
                                                            label="是否支持多选"
                                                            name="multipleText"
                                                        >
                                                            <Cgroup disabled={ this.webType === 'detail' }>
                                                                <Checkbox value="true">是</Checkbox>
                                                            </Cgroup>
                                                        </Fitem>)
                                                }
                                            </Form>) : (
                                            <div className="no-data">
                                                <MyIcon type="iconzanwushuju1" className="icons" />
                                                <p>请拖拽组件进行属性配置</p>
                                            </div>)
                                        }    
                                    </TabPane>
                                    <TabPane 
                                        tab="表单属性" 
                                        key="form"
                                        forceRender
                                    >
                                        <Form
                                            name="form"
                                            ref={propertyRef}
                                            colon={false}
                                            layout="vertical"
                                            onValuesChange={(change, all) => handleFormProChange(all)}
                                        >
                                            <Fitem
                                                label="标签对齐方式"
                                                name="labelAlignText"
                                            >
                                                <Rgroup buttonStyle="solid" disabled={ this.webType === 'detail' }>
                                                    <Rbutton value="left">左对齐</Rbutton>
                                                    <Rbutton value="right">右对齐</Rbutton>
                                                    <Rbutton value="top">顶部对齐</Rbutton>
                                                </Rgroup>
                                            </Fitem>
                                            {
                                                (curFormItem && curFormItem.labelAlignText === 'top') || (
                                                    <Fitem
                                                        label="标签宽度"
                                                        name="labelWidth"
                                                    >
                                                        <InputNumber min={120} max={200} disabled={ this.webType === 'detail' } />
                                                    </Fitem>)
                                            }
                                            <Fitem
                                                label="标签后缀"
                                                name="labelSuffix"
                                            >
                                                <Input disabled={ this.webType === 'detail' }  />
                                            </Fitem>
                                            {
                                                ((componentProperty && typeof componentProperty.requiredText === 'undefined') || (componentProperty && ['number', 'radio', 'select'].includes(componentProperty.type))) || (
                                                    <Fitem
                                                        label="是否必填"
                                                        name="requiredText"
                                                    >
                                                        <Cgroup disabled={ this.webType === 'detail' }>
                                                            <Checkbox value="true">是</Checkbox>
                                                        </Cgroup>
                                                    </Fitem>
                                                )
                                            }
                                        </Form>
                                    </TabPane>
                                </Tabs> 
                            </div>
                        </main>
                    </TabPane>
                    <TabPane tab="流程设计" key="design" className="design-tab-area">
                        <div className="box-outer-area">
                            <div className="scale-box-area">
                                <span className="number-area">
                                    <Button 
                                        className="number-btn" 
                                        icon={<MinusOutlined className="number-icon"/>} 
                                        disabled={scale < 0.6}
                                        onClick={() => handleScale(false)}
                                    />
                                    <span className="number-text">{Math.round(scale * 100)}%</span>
                                    <Button 
                                        className="number-btn" 
                                        icon={<PlusOutlined className="number-icon"/>} 
                                        disabled={scale >= 2}
                                        onClick={() => handleScale(true)}
                                    />
                                </span>
                            </div>
                            <div className="box-area">
                                <div className="box-scale-area" style={{transform:`scale(${scale})`, transformOrigin: '50% 0px 0px'}}>
                                    {
                                        handleRenderDesignHtml(designData) 
                                    }
                                    <div className="end-node-area">
                                        流程结束
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
                <div className="main-handle-area">
                    {
                        webType !== 'add' ? (
                            <Button
                                className="preview-btn-area"
                                onClick={ this.handlePreviewProcess }
                            >
                                预览
                            </Button> 
                        ) : null
                    }
                    {
                        (webType !== 'detail' && tabActiveKey === 'design') ? (
                            <Button 
                                type="primary" 
                                className="save-btn-area"
                                onClick={ handleSave }
                                loading={ this.state.saveBtnLoading }
                            >
                                发布
                            </Button> 
                        ) : null
                    }
                        
                </div>  
                <Button
                    className="handle-back-btn-area"
                    icon={ <MyIcon style={{ color: '#245ff2' }} type={ 'iconffanhui-' } className="icon" /> }
                    onClick={ handleGoBack }
                >
                    返回
                </Button>   
                <Modal
                    centered
                    title="选择人员"
                    visible={modalVisible}
                    width={720}
                    className="select-user-modal-area"
                    onCancel={() => handleCloseUserModal()}
                    destroyOnClose
                    footer={
                        <div className="foot-area">
                            <Button 
                                icon={<CloseOutlined />} 
                                className="flow-button filter-item"
                                onClick={() => handleCloseUserModal()}
                            >
                                取消
                            </Button> 
                            <Button 
                                type="primary" 
                                icon={<CheckOutlined />} 
                                className="flow-button"
                                onClick={() => handleSaveUser()}
                            >
                                保存
                            </Button>
                        </div>
                    }
                >
                    { modalVisible ? (
                        <UserSelect 
                            orgData={ this.state.orgData } 
                            hasSelectList={ this.state.hasSelectList || [] } 
                            selectRef={ this.selectRef } 
                        />
                    ) : null }
                </Modal>

                <Modal
                    centered
                    title="选择人员"
                    visible={this.state.moveModalVisible}
                    width={720}
                    className="select-user-modal-area"
                    onCancel={() => this.handleCloseMoveUserModal()}
                    destroyOnClose
                    footer={
                        <div className="foot-area">
                            <Button 
                                icon={<CloseOutlined />} 
                                className="flow-button filter-item"
                                onClick={() => this.handleCloseMoveUserModal()}
                            >
                                取消
                            </Button> 
                            <Button 
                                type="primary" 
                                icon={<CheckOutlined />} 
                                className="flow-button"
                                onClick={() => this.handleSaveMoveUser()}
                            >
                                保存
                            </Button>
                        </div>
                    }
                >
                    { this.state.moveModalVisible ? (
                        <UserSelect 
                            orgData={ this.state.orgData } 
                            selectRef={ this.moveSelectRef } 
                            hasSelectList={ this.state.hasSelectList || [] } 
                            single
                        />
                    ) : null }
                </Modal>

                <Drawer 
                    title={drawerTitle}
                    visible={drawerVisible}
                    width={700}
                    className="start-drawer-area approval-drawer-area copy-drawer-area branch-drawer-area"
                    onClose={() => handleCloseDrawer()}
                    footer={null}
                >
                    { drawerHtml }
                </Drawer>

                <Modal
                    title="生成JSON"
                    visible={jsonVisible}
                    width={800}
                    centered
                    onCancel={handleCloseJsonModal}
                    footer={
                        <>
                            <Button 
                                icon={<CloseOutlined />} 
                                className="flow-button search-button"
                                onClick={handleCloseJsonModal}
                            >
                                取消
                            </Button>
                            <Button 
                                type="primary"
                                icon={<CopyOutlined />} 
                                className="flow-button"
                                onClick={handleCopyJsonData}
                            >
                                复制数据
                            </Button>
                        </>
                    }
                >
                    <p style={{height: '50vh', overflowY: 'auto'}}>{jsonFormItem}</p>
                    <Input value={jsonFormItem} ref={jsonAreaRef} style={{opacity: 0}} />
                </Modal>
                <Modal
                    title="导入JSON"
                    visible={importVisible}
                    width={800}
                    centered
                    forceRender
                    onCancel={handleCloseImportModal}
                    footer={
                        <>
                            <Button 
                                icon={<CloseOutlined />} 
                                className="flow-button search-button"
                                onClick={handleCloseImportModal}
                            >
                                取消
                            </Button>
                            <Button 
                                type="primary"
                                icon={<CheckOutlined />} 
                                className="flow-button"
                                onClick={handleImportJsonData}
                            >
                                导入
                            </Button>
                        </>
                    }
                >
                    <Form
                        ref={importJsonRef}
                        name="basic"
                        colon={false}
                        >
                        <Fitem
                            label=""
                            name="jsonArea"
                        >
                            <TextArea 
                                bordered={false} 
                                rows="20" 
                            />
                        </Fitem>
                    </Form>
                </Modal>
                <Modal
                    title="预览"
                    visible={previewVisible}
                    width={800}
                    bodyStyle={{ height: '60vh', overflowY: 'auto' }}
                    centered
                    forceRender
                    onCancel={handleClosePreviewModal}
                    footer={
                        <>
                            <Button 
                                icon={<CloseOutlined />} 
                                className="flow-button search-button"
                                onClick={handleClosePreviewModal}
                            >
                                取消
                            </Button>
                        </>
                    }
                >
                    <Form
                        name="previewForm"
                        ref={previewFormRef}
                        colon={false}
                    >
                        { previewForm }
                    </Form>
                </Modal>
                <Modal
                    title=""
                    visible={previewFormDataVisible}
                    width={600}
                    centered
                    onCancel={handleClosePreviewFormDataModal}
                    footer={null}
                >
                    <p style={{maxHeight: '50vh', overflowY: 'auto'}}>{previewFormData}</p>
                </Modal>
                <Modal
                    title="查看详情"
                    visible={ this.state.previewDetailVisible }
                    width={ 800 }
                    centered
                    onCancel={ () => this.handleChangeVisible(false) }
                    footer={ null }
                    destroyOnClose
                >
                    <ProcessDetail detail={ this.state.detailProcessData } />
                </Modal>

            </div>
            
        )
    }
}
