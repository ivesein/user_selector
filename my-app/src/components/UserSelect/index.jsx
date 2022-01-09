import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Tree } from "antd";
import styles from "./index.module.scss";
import CusSearch from "./CusSearch";
import { CaretDownOutlined, MoreOutlined } from "@ant-design/icons";
import orgIcon from "./img/org.png";
import orgChildIcon from "./img/org_child.png";
import delIcon from "./img/garbage.png";
import { treeFilterToArr,uuid } from "./utils/toolfunc";

/**
 * @ref React.useRef 用于获取结果  ref.current.getReslut()  
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

    const wrapRef = useRef(null); //包裹

    const orgRef = useRef(null); //用于存储内部组织树初始数据
    const exteriorOrgRef = useRef(null); //用于存储外部组织树初始数据

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
    // 根据条件设置内外部树
    const settleTreeData = ({
      org,
      projectOrg,
      companyOrg,
      exteriorType,
      showType,
    }) => {
      const orgTree = traverseTreeSetProps(
        org,
        {
          // key: "id",
          title: "name",
        },
        null,
        showType
      );
      const exteriorTree = handleExteriorData({
        projectOrg,
        companyOrg,
        exteriorType,
      });
      console.log("exteriorTree>>>>", exteriorTree);
      if (showType === "1") {
        setTreeData([...orgTree]);
        orgRef.current = [...orgTree];
        setExteriorTreeData([]);
        exteriorOrgRef.current = [];
        return;
      }
      if (showType === "2") {
        setTreeData([]);
        orgRef.current = [];
        setExteriorTreeData([...exteriorTree]);
        exteriorOrgRef.current = [...exteriorTree];
        return;
      }
      setTreeData([...orgTree]);
      orgRef.current = [...orgTree];
      setExteriorTreeData([...exteriorTree]);
      exteriorOrgRef.current = [...exteriorTree];
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
        treeData.forEach((tree) => {
          const deepTree = (item, props, isRoot) => {
            item.disableCheckbox = true;
            item.checkable = false;
            if (item.type === "user") {
              item.disableCheckbox = false;
              item.checkable = true;
            }
            item.orgName=item.name
            if (isRoot) {
              if (showType !== "1") {
                item.orgName=item.name
                item.name = "内部组织";
              }
              item["icon"] = orgIcon;
            }else{
              item["icon"] = orgChildIcon;
            }
            Object.keys(props).forEach((key) => {
              item[key] = item[props[key]];
            });
            item.key=uuid()
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
                  disableCheckbox: false,
                  checkable: true,
                  ...user,
                  parentName: item.orgName,
                  parentId: item.id,
                  id:user.userId,
                  name: user.userName || "",
                  title: user.userName || "",
                  type: "user",
                    key: uuid(),
                })),
              ];
            }
            item.children &&
              item.children.forEach((child) => deepTree(child, props, false));
          };
          deepTree(tree, props, true);
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
        disableCheckbox: true,
        checkable: false,
        id: "0",
        key: "0",
        name: "外部组织",
        title: "外部组织",
        children: [],
      };
      if (exteriorType === "1") {
        // 处理项目协同组织数据为树形数据
        if (projectOrg && projectOrg.length) {
          root.children = [
            ...projectOrg.map((item) => ({
              disableCheckbox: true,
              checkable: false,
              icon:orgChildIcon,
              id: item.projectId,
              name: item.projectName,
              key: uuid(),
              title: item.projectName,
              children: [
                ...(item?.coordinatePersonVOList?.map((user) => ({
                  ...user,
                  disableCheckbox: false,
                  checkable: true,
                  parentId: item.projectId,
                  parentName: item.projectName,
                  id:  user.userId,
                  name: user.userName || "",
                  title: user.userName || "",
                  type: "user",
                  key: uuid(),
                  isExterior: true,
                })) ?? []),
              ],
            })),
          ];
        }
      } else {
        // 处理企业协同组织数据为树形数据
        if (companyOrg && companyOrg.length) {
          root.children = [
            ...companyOrg.map((item) => ({
              disableCheckbox: true,
              icon:orgChildIcon,
              checkable: false,
              id: item.unitId,
              name: item.unitName,
              key: uuid(),
              title: item.unitName,
              children: [
                ...(item?.coordinatePersonVOList?.map((user) => ({
                  ...user,
                  disableCheckbox: false,
                  checkable: true,
                  parentId: item.unitId,
                  parentName: item.unitName,
                  id: user.userId,
                  name: user.userName || "",
                  title: user.userName || "",
                  type: "user",
                  key: uuid(),
                  isExterior: true,
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
      if (value === "" || value === undefined || value === null) {
        setTreeData([...(orgRef?.current ?? [])]);
        setExteriorTreeData([...(exteriorOrgRef?.current ?? [])]);
      } else {
        // 过滤树形数据
        const orgRoot=[{...orgRef?.current[0],children:[]}]
        let treeArr = treeFilterToArr(orgRef?.current ?? [], (node) =>
          node.type==="user"&&node.name.includes(value)
        );
        orgRoot[0].children=[...treeArr]
        setTreeData(orgRoot);
        const exteriorRoot=[{...exteriorOrgRef?.current[0],children:[]}]
        let exteriorTreeArr = treeFilterToArr(
          exteriorOrgRef?.current ?? [],
          (node) => node.type==="user"&&node.name.includes(value)
        );
        exteriorRoot[0].children=[...exteriorTreeArr]
        setExteriorTreeData(exteriorRoot);
      }
    };
    // 对外暴露获取结果数据方法
    useImperativeHandle(ref, () => ({
      getResult: () => {
        return {inside:[...checkedNodes],outside:[...exteriorCheckedNodes]};
      },
    }));

    // 渲染树节点
    const renderNode = useCallback((node) => {
      return (
        <div className={styles.cusNode}>
          {node.type === "user" ? (
            node.avatar ? (
              <img
                style={{ marginRight: 0 }}
                className={styles.userAvatar}
                src={node.avatar ?? orgIcon}
                alt=""
              />
            ) : (
              <div style={{ marginRight: 0 }} className={styles.userName}>
                <span style={{ marginRight: 0 }}>
                  {node.title ? node.title[0] : ""}
                </span>
              </div>
            )
          ) : (
            <img
              className={styles.nodeIcon}
              src={node.icon || orgIcon}
              alt=""
            />
          )}
          <span className={styles.nodeName}>{node.title}</span>
        </div>
      );
    }, []);
    // 内部组织人员勾选处理
    const onCheck = (checkedKeys, e) => {
      if (single) {
        if (e.checked) {
          setCheckedKeys([checkedKeys.checked[checkedKeys.checked.length - 1]]);
          setCheckedNodes([e.checkedNodes[e.checkedNodes.length - 1]]);
          setExteriorCheckedKeys([]);
          setExteriorCheckedNodes([]);
        } else {
          setCheckedKeys([]);
          setCheckedNodes([]);
        }
      } else {
        setCheckedKeys([...checkedKeys.checked]);
        setCheckedNodes([...e.checkedNodes]);
      }
    };
    // 外部组织人员勾选处理
    const onExteriorCheck = (checkedKeys, e) => {
      if (single) {
        if (e.checked) {
          setExteriorCheckedKeys([
            checkedKeys.checked[checkedKeys.checked.length - 1],
          ]);
          setExteriorCheckedNodes([e.checkedNodes[e.checkedNodes.length - 1]]);
          setCheckedKeys([]);
          setCheckedNodes([]);
        } else {
          setExteriorCheckedKeys([]);
          setExteriorCheckedNodes([]);
        }
      } else {
        setExteriorCheckedKeys([...checkedKeys.checked]);
        setExteriorCheckedNodes([...e.checkedNodes]);
      }
    };
    // 渲染已选人员
    const renderCheckedNodes = (nodes) => {
      return (
        nodes &&
        nodes.map((node, index) => {
          return (
            <div key={node?.key ?? index} className={styles.checkedNodeItem}>
              <div className={styles.userAvatarWrap}>
                {node.avatar ? (
                  <img
                    className={styles.userAvatar}
                    src={node.avatar ?? orgIcon}
                    alt=""
                  />
                ) : (
                  <div className={styles.userName}>
                    <span>{node.title ? node.title[0] : ""}</span>
                  </div>
                )}
              </div>

              <div className={styles.nodeName}>
                <span title={node?.name ?? ""} className={styles.name}>
                  {" "}
                  {node?.name ?? ""}
                </span>
                <span title={node?.parentName ?? ""} className={styles.belong}>
                  {node?.parentName ?? ""}
                </span>
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
      if (node.isExterior) {
        let exteriorArr = [...exteriorCheckedNodes];
        let index = exteriorArr.findIndex((item) => item.key === node.key);
        if (index !== -1) {
          exteriorArr.splice(index, 1);
          setExteriorCheckedNodes(exteriorArr);
          setExteriorCheckedKeys(
            exteriorCheckedKeys.filter((key) => key !== node.key)
          );
        }
      } else {
        let arr = [...checkedNodes];
        let index = arr.findIndex((item) => item.key === node.key);
        arr.splice(index, 1);
        setCheckedNodes(arr);
        setCheckedKeys(checkedKeys.filter((key) => key !== node.key));
      }
    };
    const onExpand = (params) => {
      // const uuidstr=uuid()
      // console.log(uuidstr);
      // debugger;
    };

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
                titleRender={(nodeData) => renderNode(nodeData)}
                switcherIcon={
                  <CaretDownOutlined style={{ fontSize: 16, color: "#999" }} />
                }
                selectable={false}
                checkable={true}
                onCheck={onCheck}
                onExpand={onExpand}
                treeData={treeData}
              />
              <div style={{ position: "relative" }}>
                {showType !== "1" ? (
                  <Tree
                    // key={~~(Math.random() * 10)}
                    key="2"
                    checkStrictly={true}
                    style={{ marginTop: 10 }}
                    defaultExpandAll
                    showLine={false}
                    checkedKeys={exteriorCheckedKeys}
                    titleRender={(nodeData) => renderNode(nodeData)}
                    switcherIcon={
                      <CaretDownOutlined
                        style={{ fontSize: 16, color: "#999" }}
                      />
                    }
                    selectable={false}
                    checkable={true}
                    onCheck={onExteriorCheck}
                    treeData={exteriorTreeData}
                    onExpand={onExpand}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.partBox}>
          <span className={styles.title}>已选</span>
          <div className={styles.contentRight}>
            {renderCheckedNodes([...checkedNodes,...exteriorCheckedNodes])}
          </div>
        </div>
      </div>
    );
  }
);

export default UserSelect;
