import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef
} from "react";
import { Tree } from "antd";
import styles from "./index.module.scss";
import CusSearch from "./CusSearch";
import { CaretDownOutlined, MoreOutlined } from "@ant-design/icons";
import orgIcon from "./img/tupu.png";
import delIcon from "./img/garbage2.png";
import { treeFilterToArr } from "./utils/toolfunc";

/**
 * @ref React.useRef 用于获取结果
 * @initKeys array 初始勾选数据  用于数据回填显示
 * @showType string  展示模式 "0":默认模式，内部外部组织同时展示  "1":只展示内部组织   "2":只展示外部组织
 * @exteriorType string 外部组织类型  0":默认展示外部企业协同组织   "1":外部项目协同组织
 * @single boolean 是否单选  true:单选   false:多选（默认）
 * @data object 接口数据 从范俊升接口获取的内部组织 外部企业协同组织以及外部项目协同组织数据
 **/
const UserSelect = forwardRef(
  ({ initKeys, showType, exteriorType, single, data }, ref) => {
    // const [searchText, setSearchText] = useState(null);
    // const [selectedKeys, setSelectedKeys] = useState([]);
	// debugger
    const [treeData, setTreeData] = useState([]); //内部组织树
    const [exteriorTreeData, setExteriorTreeData] = useState([]); //外部协同组织树

    const [checkedKeys, setCheckedKeys] = useState([]); //选择的节点keys
    const [checkedNodes, setCheckedNodes] = useState([]); //选择的节点nodes
	const [exteriorCheckedKeys, setExteriorCheckedKeys] = useState([]); //选择的节点keys
    const [exteriorCheckedNodes, setExteriorCheckedNodes] = useState([]); //选择的节点nodes

	const wrapRef = useRef(null) //包裹

	const orgRef = useRef(null)  //用于存储内部组织树初始数据
	const exteriorOrgRef = useRef(null) //用于存储外部组织树初始数据

	
    // useEffect(() => {
    // 	if (props.treeData && props.treeData.length > 0) {
    // 		setTreeData([...props.treeData]);
    // 	}
    // }, [props.treeData]);
    useEffect(() => {
      if (data) {
        const { orgUserList, projectUserList, coordinateUserList } = data;
        settleTreeData({
          org: orgUserList || [],
          projectOrg: projectUserList || [],
          companyOrg: coordinateUserList || [],
          exteriorType,
          showType,
        });
      }
    }, [data, exteriorType, showType]);
    const settleTreeData = ({
      org,
      projectOrg,
      companyOrg,
      exteriorType,
      showType,
    }) => {
		const orgTree=traverseTreeSetProps(
            org,
            {
              key: "id",
              title: "name",
            },
            null,
            showType
          )
		  const exteriorTree=handleExteriorData({ projectOrg, companyOrg, exteriorType })
		  console.log("exteriorTree>>>>",exteriorTree);
      if (showType === "1") {
        setTreeData([
          ...orgTree
        ]);
		orgRef.current=[...orgTree]
        setExteriorTreeData([]);
		exteriorOrgRef.current=[]
        return;
      }
      if (showType === "2") {
        setTreeData([]);
		orgRef.current=[]
        setExteriorTreeData([
          ...exteriorTree
        ]);
		exteriorOrgRef.current=[...exteriorTree]
        return;
      }
      setTreeData([
        ...orgTree,
      ]);
	  orgRef.current=[...orgTree]
      setExteriorTreeData([
        ...exteriorTree,
      ]);
	  exteriorOrgRef.current=[...exteriorTree]
    };
    // 处理内部组织数据
    // showType展示的类型 "0":默认模式，内部外部组织同时展示  "1":只展示内部组织   "2":只展示外部组织
    const traverseTreeSetProps = (
      treeData = [],
      props = {},
      icon = null,
      showType = "1"
    ) => {
      const type = Object.prototype.toString.call(treeData);
      if (type === "[object Array]" && treeData.length > 0) {
        treeData.forEach((tree, k) => {
          if (showType !== "1") {
            tree.name = "内部组织";
          }
		  tree.disableCheckbox=true
		  tree.checkable=false
          const deepTree = (item, props, index) => {
			item.disableCheckbox=true
			item.checkable=false
			if(item.type==="user"){
				item.disableCheckbox=false
				item.checkable=true
			}
            if (icon) {
              item["icon"] = icon;
            }
            Object.keys(props).forEach((key) => {
              item[key] = item[props[key]];
            });
            if (
              !item.children &&
              Object.prototype.toString.call(item.children) === "[object Array]"
            ) {
              item.children = [];
            }

            if (item.userList && item.userList.length) {
              item.children = [
                ...item.children,
                ...item.userList.map((user) => ({
					disableCheckbox:false,
					checkable:true,
                  ...user,
				  belong:item.name,
				  parentId:item.id,
				  id:item.id+"#"+user.userId,
				  name: user.userName || "",
                  title: user.userName || "",
                  type: "user",
                //   key: user.userId || "",
                })),
              ];
            }
            item.children &&
              item.children.forEach((child, j) => deepTree(child, props, j));
          };
          deepTree(tree, props, k);
        });
        return treeData;
      } else {
        return [];
      }
    };
    // 处理外部组织数据
    // exteriorType 外部组织类型  0":默认展示外部企业协同组织   "1":外部项目协同组织
    const handleExteriorData = ({ projectOrg, companyOrg, exteriorType }) => {
      let root = {
		disableCheckbox:true,
		checkable:false,
        id: "0",
        key: "0",
        name: "外部组织",
        title: "外部组织",
        children: [],
      };
      if (exteriorType === "1") {
		if (projectOrg && projectOrg.length) {
			root.children = [
			  ...projectOrg.map((item) => ({
				  disableCheckbox:true,
				  checkable:false,
				  id: item.projectId,
				  name:item.projectName,
				  key: item.projectId,
				  title: item.projectName,
				children: [
				  ...(item?.coordinatePersonVOList?.map((user) => ({
					...user,
					disableCheckbox:false,
					checkable:true,
					parentId:item.projectId,
					belong:item.projectName,
					id:item.projectId+"#"+user.userId,
					name:user.userName || "",
					title: user.userName || "",
					type: "user",
					key: item.projectId+"#"+user.userId,
					isExterior:true
				  })) ?? []),
				],
			  })),
			];
		  }
        
      } else {
		if (companyOrg && companyOrg.length) {
			root.children = [
			  ...companyOrg.map((item) => ({
				  disableCheckbox:true,
				  checkable:false,
				id: item.unitId,
				name:item.unitName,
				key: item.unitId,
				title: item.unitName,
				children: [
				  ...(item?.coordinatePersonVOList?.map((user) => ({
					...user,
					disableCheckbox:false,
					checkable:true,
					parentId:item.unitId,
					belong:item.unitName,
					id:item.unitId+"#"+user.userId,
					name:user.userName || "",
					title: user.userName || "",
					type: "user",
					key: item.unitId+"#"+user.userId,
					isExterior:true
				  })) ?? []),
				],
			  })),
			];
		  }
      }
      return [root];
    };

    // 处理搜索
    const onSearch = (value) => {
    //   if (value === "" || value === undefined || value === null) {
    //     setTreeData([...props.treeData]);
    //   } else {
    //     // 过滤树形数据
    //     let treeArr = treeFilterToArr(props.treeData, (node) =>
    //       node.name.includes(value)
    //     );
    //     setTreeData(treeArr.map((item) => ({ ...item, children: [] })));
    //   }
    };
    useImperativeHandle(ref, () => ({
      getCheckedKeys: () => {
        return checkedKeys;
      },
    }));

    // const filterFunc = useCallback(
    // 	(node) => {
    // 		console.log(node);
    // 		return false;
    // 	},
    // 	[props.filterArr]
    // );
    const renderNode = useCallback((node) => {
      return (
        <div
          className={styles.cusNode}
          // onClick={(e) => props.setCurrentOrg(node)}
        >
			{
					node.type==="user"?node.avatar?<img
					style={{marginRight:0}}
					className={styles.userAvatar}
					src={node.avatar ??orgIcon}
					alt=""
				  />: <div style={{marginRight:0}} className={styles.userName}>
					  <span style={{marginRight:0}}>{node.title?node.title[0]:""}</span>
				  </div>:<img className={styles.nodeIcon} src={node.icon || orgIcon} alt="" />
				}
          {/* <img className={styles.nodeIcon} src={node.icon || orgIcon} alt="" /> */}
          <span className={styles.nodeName}>{node.title}</span>
        </div>
      );
    }, []);
    // const onSelect = (selectedKeys) => {
    // 	// setSelectedKeys(selectedKeys);
    // };
    const onCheck = (checkedKeys, e) => {
      if (single) {
		  if(e.checked){
			setCheckedKeys([checkedKeys.checked[checkedKeys.checked.length - 1]]);
			setCheckedNodes([e.checkedNodes[e.checkedNodes.length - 1]]);
			setExteriorCheckedKeys([]);
				setExteriorCheckedNodes([]);
		  }else{
			setCheckedKeys([]);
			setCheckedNodes([]);
		  }
        
      } else {
        setCheckedKeys([...checkedKeys.checked]);
        setCheckedNodes([...e.checkedNodes]);
      }
    };

	const onExteriorCheck = (checkedKeys, e) => {
		if (single) {
			if(e.checked){
				setExteriorCheckedKeys([checkedKeys.checked[checkedKeys.checked.length - 1]]);
				setExteriorCheckedNodes([e.checkedNodes[e.checkedNodes.length - 1]]);
				setCheckedKeys([]);
			setCheckedNodes([]);
			}else{
				setExteriorCheckedKeys([]);
				setExteriorCheckedNodes([]);
			}

		  } else {
			setExteriorCheckedKeys([...checkedKeys.checked]);
			setExteriorCheckedNodes([...e.checkedNodes]);
		  }
	}
	

    const renderCheckedNodes = (nodes) => {
      return (
        nodes &&
        nodes.map((node, index) => {
          return (
            <div key={node?.id??index} className={styles.checkedNodeItem}>
				<div className={styles.userAvatarWrap}>
					{
						node.avatar?<img
						className={styles.userAvatar}
						src={node.avatar ??orgIcon}
						alt=""
					/>: <div className={styles.userName}>
						<span>{node.title?node.title[0]:""}</span>
					</div>
					}
				</div>
				
              <div className={styles.nodeName}>
			  		<span title={node?.name??""} className={styles.name}> {node?.name??""}</span>
				  <span title={node?.belong??""} className={styles.belong}>{node?.belong??""}</span>
				</div>
              <img
                onClick={(e) => delSelecedNode(node, index)}
                className={styles.delIcon}
                src={delIcon}
                alt=""
              />
            </div>
          );
        })
      );
    };
    // 删除已选组织
    const delSelecedNode = (node) => {
		// 判断要删除的人员是否为外部组织人员
		if(node.isExterior){
			let exteriorArr=[...exteriorCheckedNodes]
			let index=exteriorArr.findIndex(item=>item.key===node.key)
			if(index!==-1){
				exteriorArr.splice(index, 1);
				setExteriorCheckedNodes(exteriorArr)
				setExteriorCheckedKeys(exteriorCheckedKeys.filter((key) => key !== node.key))
			}
		}else{
			let arr = [...checkedNodes];
			let index=arr.findIndex(item=>item.key===node.key)
			arr.splice(index, 1);
			setCheckedNodes(arr);
			setCheckedKeys(checkedKeys.filter((key) => key !== node.key));
		}
      
    };
	const onExpand = (params) => {
		console.log(wrapRef.current);
		debugger
	}
	
    return (
      <div className={styles.orgSelectWrap}>
        <div className={styles.partBox}>
          <span className={styles.title}>选择</span>

          <div className={styles.content}>
            <CusSearch
              onSearch={onSearch}
              onChange={(value) => {}}
              width={"100%"}
              placeholder="请输入关键字"
            />
            <div ref={wrapRef} className={styles.cusTreeWrap}>
              <Tree
                // key={~~(Math.random() * 10)}
				key="1"
                checkStrictly={true}
                style={{ marginTop: 20 }}
                defaultExpandAll
                showLine={false}
                checkedKeys={checkedKeys}
                // selectedKeys={checkedKeys}
                titleRender={(nodeData) => renderNode(nodeData)}
                // filterTreeNode={(node) =>
                // 	node.name.includes(searchText)
                // }
                switcherIcon={
                  <CaretDownOutlined style={{ fontSize: 16, color: "#999" }} />
                }
                selectable={false}
                checkable={true}
                onCheck={onCheck}
                // onSelect={onSelect}
				onExpand={onExpand}
                treeData={treeData}
                // height={400}
              />
			  <div style={{position:"relative"}}>
			  {
				  showType!=="1"? <Tree
                // key={~~(Math.random() * 10)}
				key="2"
                checkStrictly={true}
                style={{ marginTop: 10 }}
                defaultExpandAll
                showLine={false}
                checkedKeys={exteriorCheckedKeys}
                // selectedKeys={checkedKeys}
                titleRender={(nodeData) => renderNode(nodeData)}
                // filterTreeNode={(node) =>
                // 	node.name.includes(searchText)
                // }
                switcherIcon={
                  <CaretDownOutlined style={{ fontSize: 16, color: "#999" }} />
                }
                selectable={false}
                checkable={true}
                onCheck={onExteriorCheck}
                // onSelect={onSelect}
                treeData={exteriorTreeData}
				onExpand={onExpand}
                // height={400}
              />:null
			  }
			  </div>
			  
            </div>
          </div>
        </div>
        <div className={styles.partBox}>
          <span className={styles.title}>已选</span>
          <div className={styles.contentRight}>
            {renderCheckedNodes(checkedNodes)}
			{renderCheckedNodes(exteriorCheckedNodes)}
          </div>
        </div>
      </div>
    );
  }
);

export default UserSelect;
