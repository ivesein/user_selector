import { useEffect, useState, useRef, useImperativeHandle } from 'react'
import { treeTransArray, arrayConvertTree } from '../../utils/common'
import styles from '../../styles/index.module.scss'
import '../../styles/index.scss'
import { Row, Col, Input, Avatar, Tree } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import org from '../../imgs/org.png'
import del from '../../imgs/delete.png'

const UserSelect = props => {

    const { orgData, hasSelectList = [], selectRef, single = false } = props
    const [ orgList, setOrgList ] = useState([])
    const [ curOrgTree, setCurOrgTree ] = useState([])
    const [ curHasSelectList, setCurHasSelectList ] = useState([])
    const [ checkedKeyList, setCheckedKeyList ] = useState([])
    const [ searchOrgList, setSearchOrgList ] = useState([])
    const [ defaultExpandedKeyList, setDefaultExpandedKeyList ] = useState([])

    const inputRef = useRef(null)

    useEffect(() => {
        if(!orgData || !orgData.length) return

        transOrgData()
    }, [ orgData ])


    useEffect(() => {
        init()
    }, [ orgList ])


    useEffect(() => {
        changeSelectMode(searchOrgList, orgList)
    }, [ curHasSelectList ])


    useImperativeHandle(selectRef, () => ({
        /**
         * 获取流程发起的参数
         * @returns 
         */
         getSelectList: () => {
            return {
                hasSelectList: curHasSelectList,
            }
        }
    }))


    /**
     * 改变选择模式（单选，多选）
     */
    const changeSelectMode = (searchList, list) => {
        if(!searchList.length) inputRef.current.state.value = ''

        let newList = searchList.length ? searchList : list
        let newOrgList = newList.map(item => 
            ({ 
                ...item, 
                disableCheckbox: single 
                                    ? item.type === 'org' 
                                        ? true 
                                        : (curHasSelectList.length) 
                                    : false,
            })
        )
        newOrgList.forEach((item, index) => {
            if(curHasSelectList.map(val => val.id).includes(item.id)) {
                newOrgList[ index ].disableCheckbox = false
            }
        })
        const orgTree = arrayConvertTree(newOrgList)
        setCurOrgTree(orgTree)
    }


    /**
     * 将数据转换成tree组件接收的格式
     */
    const transOrgData = () => {
        const list = treeTransArray(orgData)
        
        let newList = []
        list.forEach(item => {
            newList.push({
                title: item.name,
                key: item.id,
                icon: <img src={ org } width={ 18 } />,
                parentId: item.parentId,
                id: item.id,
                type: 'org',
                disableCheckbox: single,
            })

            let users = item.userList
            if(users && users.length) {
                users.forEach(val => {
                    let name = val.userName
                    newList.push({
                        title: name,
                        key: `${ item.id }-user-${ val.userId }`,
                        icon: val.userIcon ? <Avatar src={ val.userIcon } size={ 20 } /> : <Avatar style={{ background: '#5b87fd' }} size={ 20 }>{ name ? name.substr(0, 1) : '' }</Avatar>,
                        parentId: item.id,
                        id: val.userId,
                        avatar: val.userIcon,
                        type: 'user',
                    })
                })
            }
        })

        setOrgList(newList)
    }

    
    /**
     * 初始化数据
     */
    const init = () => {
        const filterHasSelectList = hasSelectList.filter(item => 
            orgList.map(v => v.id).includes(item.id)
            )
        const filterCheckedList = orgList.filter(item => 
            hasSelectList.map(v => v.id).includes(item.id)
            ).map(item => item.key)
        let expandKeyList = orgList.filter(item => item.parentId === '0').map(item => item.key)
        
        const orgTree = arrayConvertTree(orgList)
        setCurOrgTree(orgTree)
        setCurHasSelectList(filterHasSelectList)
        setCheckedKeyList(filterCheckedList)
        setDefaultExpandedKeyList(expandKeyList)
    }


    /**
     * 复选框选择事件
     * @param {array} ck 
     * @param {obj} e 
     */
    const onCheck = (ck, e) => {
        let { checkedNodes, checked, node: { id, children = [] } } = e

        if(!checked) {
            let childIdList = [ id ]
            getEachIdList(children, childIdList)
            checkedNodes = checkedNodes.filter(item => !childIdList.includes(item.id))
        }
        //已选中的人员
        const userList = checkedNodes.filter(item => 
            item.type === 'user'
        ).map(item => 
            ({ id: item.id, name: item.title, avatar: item.avatar })
        )

        //已选中的key值
        const checkedList = orgList.filter(val => 
            checkedNodes.filter(item => 
                (item.type === 'org' && !item.children) || item.type === 'user'
            ).map(item => 
                item.id
            ).includes(val.id)
        ).map(item => item.key)

        setCurHasSelectList(handleUniqueArr(userList))
        setCheckedKeyList(Array.from(new Set(checkedList)))
    }


    /**
     * 递归获取下级的id集合
     * @param {array} tree 
     * @param {array} list 
     */
    const getEachIdList = (tree, list) => {
        tree.forEach(item => {
            list.push(item.id)
            let child = item.children
            if(child && child.length) {
                getEachIdList(child, list)
            }
        })
    }


    /**
     * 对象数组去重
     * @param {array} arr [数组数据]
     */
    const handleUniqueArr = arr => {
        let arrMap = {}
        arr.forEach(item => {
            if(item.type) {
                arrMap[ `${ item.type }-${ item.id }` ] = item
            } else {
                arrMap[ item.id ] = item
            }
        })

        let finalArr = []
        new Set(arr.map(item => item.type ? `${ item.type }-${ item.id }` : item.id)).forEach(v => {
            finalArr = [ ...finalArr, arrMap[v] ] 
        })

        return finalArr
    }


    /**
     * 删除一个人员
     * @param {obj} item 
     */
    const handleDelSelectedList = item => {
        const { id } = item

        let newHasList = [ ...curHasSelectList ]
        let newCheckedList = [ ...checkedKeyList ]

        newHasList = newHasList.filter(v => v.id !== id)
        newCheckedList = newCheckedList.filter(val => !orgList.filter(v => v.id === id).map(v => v.key).includes(val))
        
        setCurHasSelectList(newHasList)
        setCheckedKeyList(newCheckedList)
    }


    /**
     * 搜索事件
     * @returns 
     */
    const handleSearchSelectUser = () => {
        if(!inputRef.current) return

        let { current: { state: { value = '' } } } = inputRef
        value = value.trim()

        if(value === '') return

        let newOrgList = orgList.filter(item => item.type === 'user' && item.title.indexOf(value) !== -1)
        newOrgList = handleUniqueArr(newOrgList)
        setSearchOrgList(newOrgList)
        changeSelectMode(newOrgList, orgList)
    }


    /**
     * 成员名称搜索框输入变动事件
     * @param {obj} e 
     */
    const onSearchChange = e => {
        let { target: { value } } = e
        if(value === '') {
            changeSelectMode([], orgList)
            setSearchOrgList([])
        }
    }

    return (
        <>
        <div className={ styles.selectUserMainArea }>
            <Row>
                <Col span={ 12 } className={ styles.selectColArea }>
                    <div className={ styles.mainTitleArea }>选择</div>
                    <div className={ styles.selectBorderOuterArea }>
                        <div className={ styles.selectBorderArea }>
                            <div className={ styles.selectUserOuterArea }>
                                <div className={ styles.searchUserArea }>
                                    <Input 
                                        className={ styles.searchInputArea } 
                                        placeholder="请输入成员名称"
                                        ref={ inputRef }
                                        onChange={ onSearchChange }
                                        suffix={ 
                                            <SearchOutlined 
                                                className={ styles.searchIcon } 
                                                onClick={ handleSearchSelectUser }
                                            />
                                        }
                                    />
                                </div>
                                <div className={ styles.orgAndUserArea }>
                                    <div className={ `${ styles.checkboxMainArea } checkboxMainArea` }>
                                        {
                                            curOrgTree && curOrgTree.length ? (
                                                <Tree 
                                                    treeData={ curOrgTree }
                                                    checkable
                                                    showIcon
                                                    defaultExpandedKeys={ defaultExpandedKeyList }
                                                    className="selectTreeArea"
                                                    selectable={ false }
                                                    onCheck={ onCheck }
                                                    checkedKeys={ checkedKeyList }
                                                />
                                            ) : (
                                                <div className={ styles.noData }>暂无数据</div>
                                            )
                                            
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={ 12 } className={ styles.selectColArea }>
                    <div className={ styles.mainTitleArea }>已选<span className={ styles.hasSelect }>{ curHasSelectList.length }人</span></div>
                    <div className={ styles.selectBorderOuterArea }>
                        <div className={ styles.selectBorderArea }>
                            { curHasSelectList.map((item, index) => (
                                <div className={ styles.hasSelectItemArea } key={ item.id }>
                                    <div className={ styles.avatarArea }>
                                        { item.avatar ? (
                                            <Avatar src={ item.avatar } size={ 36 } />
                                        ) : (
                                            <Avatar style={{ background: '#5b87fd' }} size={ 36 }>
                                                { item.name ? item.name.substr(0, 1) : '' }
                                            </Avatar>
                                        ) }
                                    </div>
                                    <div className={ styles.userArea }>{ item.name || '' }</div>
                                    <div 
                                        className={ styles.handleArea } 
                                        onClick={ () => handleDelSelectedList(item) }
                                    >
                                        <img src={ del } width={ 16 } />
                                    </div>
                                </div>
                            )) }
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
        </>
    )
}

export default UserSelect