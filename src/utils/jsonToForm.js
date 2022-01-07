import { 
    Input,
    Select,
    InputNumber,
    Radio,
    Checkbox,
    DatePicker,
    Form,
    Slider,
    Switch,
    Rate,
    TreeSelect,
    Cascader,
    TimePicker,
} from 'antd'
import {
    StarFilled,
} from '@ant-design/icons'
import moment from 'moment'

const { Item:Fitem } = Form
const { TextArea, Password } = Input
const { Option: Soption } = Select
const { Group: Rgroup } = Radio
const { Group: Cgroup } = Checkbox
const { RangePicker: DrangePicker } = DatePicker
const { RangePicker: TrangePicker } = TimePicker
const DATE_FORMAT = {
    dateWeek: 'YYYY-w周',
}

// 根据json数据回显真实表单
const renderActualForm = (json, params = {}) => {
    if(!json) return []

    // json转义
    const list = JSON.parse(json)
    if(!list.length) return []

    let item = {}
    let finalList = []
    list.forEach(items => {
        item = { ...items, ...params }
        if(!item.hidden) {
            finalList.push(
                <Fitem
                    label={<div style={{width: item.labelWidth}}>{item.label}{item.labelSuffix}</div>}
                    name={item.key}
                    labelAlign={item.labelAlign}
                    required={item.required}
                    key={item.id}
                    rules={[{ required: item.required, message: '该项不能为空' }]}
                >
                    {handleComponentCreate(item)}
                </Fitem>
            )
        }
    })

    return finalList
}

// 动态表单提交后的数据回显到组件上部分数据重新组装
const handleJsonFormData = variables => {
    const keyList = Object.keys(variables)
    keyList.forEach(item => {
        if(item.indexOf('date') !== -1 && item.indexOf('Range') !== -1) {
            variables[item] = variables[item].map(v => moment(v))
            return
        }
        if(item.indexOf('date') !== -1) {
            variables[item] = moment(variables[item])
        } 
    })
    return variables
}

// 创建真实表单
const handleComponentCreate = params => {
    let {
        width = 24,
        prefix,
        suffix,
        placeholder,
        type,
        maxLength,
        showCount,
        showSearch,
        min,
        max,
        step,
        optionArr,
        disabled,
        mode,
        unit,
        checkedChildren,
        unCheckedChildren,
        character,
        hoverLinkUrl,
        hoverLinkText,
        treeData,
        multiple,
    } = params

    let trueWidth = `${width / 24 * 100}%`
    if(type === 'slider') {
        trueWidth = `${(width - 1) / 24 * 100}%`
    }

    const componentReturn = {
        input: <Input style={{width: trueWidth}} placeholder={placeholder} maxLength={maxLength} addonBefore={prefix} addonAfter={suffix} disabled={disabled || false} />,
        textarea: <TextArea style={{width: trueWidth}} placeholder={placeholder} maxLength={maxLength} showCount={showCount} disabled={disabled || false} />,
        select: <Select style={{width: trueWidth}} placeholder={placeholder} showSearch={showSearch} disabled={disabled || false} >{optionArr && optionArr.map((item, index) => item && (<Soption key={index} value={item}>{item}</Soption>))}</Select>,
        selectMultiple: <Select style={{width: trueWidth}} placeholder={placeholder} showSearch={showSearch} disabled={disabled || false} mode={mode}>{optionArr && optionArr.map((item, index) => item && (<Soption key={index} value={item}>{item}</Soption>))}</Select>,
        number: <InputNumber style={{width: trueWidth}} min={min} max={max} step={step} disabled={disabled || false} />,
        radio: <Rgroup style={{width: trueWidth}} disabled={disabled || false} >{optionArr && optionArr.map((item, index) => item && (<Radio key={index} value={item}>{item}</Radio>))}</Rgroup>,
        checkbox: <Cgroup style={{width: trueWidth}} disabled={disabled || false} >{optionArr && optionArr.map((item, index) => item && (<Checkbox key={index} value={item}>{item}</Checkbox>))}</Cgroup>,
        date: <DatePicker style={{width: trueWidth}} disabled={disabled || false} placeholder={placeholder} />,
        password: <Password style={{width: trueWidth}} placeholder={placeholder} maxLength={maxLength} addonBefore={prefix} addonAfter={suffix} disabled={disabled || false} />,
        slider: <Slider style={{width: trueWidth}} disabled={disabled || false} marks={{[min]: `${min}${unit}`, [max]: `${max}${unit}`}} min={min} max={max} />,
        switchs: <Switch disabled={disabled || false} checkedChildren={checkedChildren} unCheckedChildren={unCheckedChildren} />,
        stars: <Rate disabled={disabled || false} defaultValue={5} character={character || <StarFilled />} allowHalf />,
        link: <a target="_blank" href={hoverLinkUrl} rel="noopener noreferrer">{hoverLinkText}</a>,
        mainTitle: null,
        treeSelect: <TreeSelect style={{width: trueWidth}} disabled={disabled || false} treeData={treeData} placeholder={placeholder} showSearch={showSearch} multiple={multiple} />,
        cascader: <Cascader style={{width: trueWidth}} disabled={disabled || false} options={treeData} placeholder={placeholder} showSearch={showSearch} />,
        dateYear: <DatePicker style={{width: trueWidth}} disabled={disabled || false} picker="year" placeholder={placeholder} />,
        dateMonth: <DatePicker style={{width: trueWidth}} disabled={disabled || false} picker="month" placeholder={placeholder} />,
        dateWeek: <DatePicker style={{width: trueWidth}} disabled={disabled || false} picker="week" format={DATE_FORMAT.dateWeek} placeholder={placeholder} />,
        dateTime: <TimePicker  style={{width: trueWidth}} disabled={disabled || false} placeholder={placeholder} />,
        dateAndTime: <DatePicker style={{width: trueWidth}} disabled={disabled || false} showTime placeholder={placeholder} />,
        dateRange: <DrangePicker style={{width: trueWidth}} disabled={disabled || false} />,
        dateTimeRange: <TrangePicker style={{width: trueWidth}} disabled={disabled || false} />,
        dateAndTimeRange: <DrangePicker style={{width: trueWidth}} disabled={disabled || false} showTime />,
    }
    return componentReturn[type]
}

export {
    renderActualForm,
    handleJsonFormData,
    handleComponentCreate,
}