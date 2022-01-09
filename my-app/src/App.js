import logo from './logo.svg';
import './App.css';
import React,{useState,useRef} from "react"
import { Button ,Modal} from 'antd'
import UserSelect from "@/components/UserSelect"
function App() {
  const selectRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false)
  const handleClick = (params) => {
    setIsModalVisible(true)
  }
  const handleOk = (params) => {
    setIsModalVisible(false)
    const res=selectRef.current.getResult()
    console.log("res>>>>",res);
  }
  const handleCancel = (params) => {
    setIsModalVisible(false)
  }
  const data={
    "orgUserList": [
        {
            "id": "1478533404424671232",
            "name": "fanjunsheng001",
            "code": "1",
            "parentId": "0",
            "parentIds": null,
            "icon": null,
            "remark": null,
            "gmtCreated": "2022-01-05 01:06:48",
            "gmtModified": "2022-01-05 01:06:48",
            "level": null,
            "enable": true,
            "tenantId": "1478533403325632512",
            "type": 0,
            "isOriginal": 0,
            "children": [
                {
                    "id": "1478710827091234816",
                    "name": "点点滴滴",
                    "code": null,
                    "parentId": "1478533404424671232",
                    "parentIds": "1478533404424671232",
                    "icon": null,
                    "remark": null,
                    "gmtCreated": "2022-01-05 12:51:48",
                    "gmtModified": "2022-01-05 12:51:48",
                    "level": null,
                    "enable": true,
                    "tenantId": "1478533403325632512",
                    "type": 0,
                    "isOriginal": 0,
                    "children": [
                        {
                            "id": "1478710827182854144",
                            "name": "999",
                            "code": null,
                            "parentId": "1478710827091234816",
                            "parentIds": "1478533404424671232.1478710827091234816",
                            "icon": null,
                            "remark": null,
                            "gmtCreated": "2022-01-05 12:51:48",
                            "gmtModified": "2022-01-05 12:51:48",
                            "level": null,
                            "enable": true,
                            "tenantId": "1478533403325632512",
                            "type": 0,
                            "isOriginal": 0,
                            "children": [],
                            "userList": [
                                {
                                    "userId": "1478710827338829824",
                                    "userName": "3331212",
                                    "currentOrgPath": "/fanjunsheng001/点点滴滴/999",
                                    "userIcon": null,
                                    "allOrgPath": [
                                        "/fanjunsheng001/点点滴滴/999"
                                    ]
                                }
                            ],
                            "deleted": false
                        }
                    ],
                    "userList": [],
                    "deleted": false
                },
                {
                    "id": "1478710827225059328",
                    "name": "333",
                    "code": null,
                    "parentId": "1478533404424671232",
                    "parentIds": "1478533404424671232",
                    "icon": null,
                    "remark": null,
                    "gmtCreated": "2022-01-05 12:51:48",
                    "gmtModified": "2022-01-05 12:51:48",
                    "level": null,
                    "enable": true,
                    "tenantId": "1478533403325632512",
                    "type": 0,
                    "isOriginal": 0,
                    "children": [
                        {
                            "id": "1478710827251404800",
                            "name": "888",
                            "code": null,
                            "parentId": "1478710827225059328",
                            "parentIds": "1478533404424671232.1478710827225059328",
                            "icon": null,
                            "remark": null,
                            "gmtCreated": "2022-01-05 12:51:48",
                            "gmtModified": "2022-01-05 12:51:48",
                            "level": null,
                            "enable": true,
                            "tenantId": "1478533403325632512",
                            "type": 0,
                            "isOriginal": 0,
                            "children": [
                                {
                                    "id": "1478710821234123412340",
                                    "name": "888123123123123",
                                    "code": null,
                                    "parentId": "1478710827251404800",
                                    "parentIds": "1478533404424671232.1478710827225059328",
                                    "icon": null,
                                    "remark": null,
                                    "gmtCreated": "2022-01-05 12:51:48",
                                    "gmtModified": "2022-01-05 12:51:48",
                                    "level": null,
                                    "enable": true,
                                    "tenantId": "1478533403325632512",
                                    "type": 0,
                                    "isOriginal": 0,
                                    "children": [
                                        {
                                            "id": "1478710821233123123123",
                                            "name": "888123123123123",
                                            "code": null,
                                            "parentId": "1478710821234123412340",
                                            "parentIds": "1478533404424671232.1478710827225059328",
                                            "icon": null,
                                            "remark": null,
                                            "gmtCreated": "2022-01-05 12:51:48",
                                            "gmtModified": "2022-01-05 12:51:48",
                                            "level": null,
                                            "enable": true,
                                            "tenantId": "1478533403325632512",
                                            "type": 0,
                                            "isOriginal": 0,
                                            "children": [
                                                
                                            ],
                                            "userList": [
                                                {
                                                    "userId": "1478710827574628352",
                                                    "userName": "ttt11111111111111111111111111",
                                                    "currentOrgPath": "/fanjunsheng001/333/888",
                                                    "userIcon": null,
                                                    "allOrgPath": [
                                                        "/fanjunsheng001/cccc",
                                                        "/fanjunsheng001/333/888"
                                                    ]
                                                }
                                            ],
                                            "deleted": false
                                        }
                                    ],
                                    "userList": [
                                        {
                                            "userId": "1478710827574628352",
                                            "userName": "ttt",
                                            "currentOrgPath": "/fanjunsheng001/333/888",
                                            "userIcon": null,
                                            "allOrgPath": [
                                                "/fanjunsheng001/cccc",
                                                "/fanjunsheng001/333/888"
                                            ]
                                        }
                                    ],
                                    "deleted": false
                                }
                            ],
                            "userList": [
                                {
                                    "userId": "1478710827574628352",
                                    "userName": "ttt",
                                    "currentOrgPath": "/fanjunsheng001/333/888",
                                    "userIcon": null,
                                    "allOrgPath": [
                                        "/fanjunsheng001/cccc",
                                        "/fanjunsheng001/333/888"
                                    ]
                                }
                            ],
                            "deleted": false
                        }
                    ],
                    "userList": [],
                    "deleted": false
                },
                {
                    "id": "1478710827279716352",
                    "name": "cccc",
                    "code": null,
                    "parentId": "1478533404424671232",
                    "parentIds": "1478533404424671232",
                    "icon": null,
                    "remark": null,
                    "gmtCreated": "2022-01-05 12:51:48",
                    "gmtModified": "2022-01-05 12:51:48",
                    "level": null,
                    "enable": true,
                    "tenantId": "1478533403325632512",
                    "type": 0,
                    "isOriginal": 0,
                    "children": [],
                    "userList": [
                        {
                            "userId": "1478710827574628352",
                            "userName": "ttt",
                            "currentOrgPath": "/fanjunsheng001/cccc",
                            "userIcon": null,
                            "allOrgPath": [
                                "/fanjunsheng001/cccc",
                                "/fanjunsheng001/333/888"
                            ]
                        }
                    ],
                    "deleted": false
                }
            ],
            "userList": [
                {
                    "userId": "1478533403344113664",
                    "userName": "15801534954",
                    "currentOrgPath": "/fanjunsheng001",
                    "userIcon": "http://192.168.11.118:30071/file/no_token/file/preview/61d53d3f6181764df1f06aad.png",
                    "allOrgPath": [
                        "/fanjunsheng001"
                    ]
                },
                {
                    "userId": "1478710827338829824",
                    "userName": "3331212",
                    "currentOrgPath": "fanjunsheng001",
                    "userIcon": null,
                    "allOrgPath": []
                },
                {
                    "userId": "1478710827574628352",
                    "userName": "ttt",
                    "currentOrgPath": "fanjunsheng001",
                    "userIcon": null,
                    "allOrgPath": []
                }
            ],
            "deleted": false
        }
    ],
    "projectUserList": [
        {
            "projectName": "7777",
            "projectId": "1478632104697921536",
            "coordinatePersonVOList": [
                {
                    "userId": "1478533194684829696",
                    "tenantUserId": "1478533403325632512",
                    "userName": "15801534954",
                    "orgId": null,
                    "orgName": null
                },
                {
                    "userId": "1478652973982945280",
                    "tenantUserId": "1478533403325632512",
                    "userName": "3331212",
                    "orgId": null,
                    "orgName": null
                },
                {
                    "userId": "1478684146095493120",
                    "tenantUserId": "1478533403325632512",
                    "userName": "ttt",
                    "orgId": null,
                    "orgName": null
                }
            ]
        },
        {
            "projectName": "888",
            "projectId": "14786321046979212314",
            "coordinatePersonVOList": [
                {
                    "userId": "1478533194684829696",
                    "tenantUserId": "1478533403325632512",
                    "userName": "15801534954",
                    "orgId": null,
                    "orgName": null
                },
                {
                    "userId": "1478652973982945280",
                    "tenantUserId": "1478533403325632512",
                    "userName": "3331212",
                    "orgId": null,
                    "orgName": null
                },
                {
                    "userId": "1478684146095493120",
                    "tenantUserId": "1478533403325632512",
                    "userName": "ttt",
                    "orgId": null,
                    "orgName": null
                }
            ]
        },
    ],
    
    "coordinateUserList": [
        {
            "unitName": "卢峰企业一",
            "unitId": "1478551141495083008",
            "tenantId": "1478533403325632512",
            "orgId": null,
            "appId": "1372467609472663553",
            "utitTypeId": null,
            "utitTypeName": null,
            "billno": "DW-00002",
            "linkId": "1479044339471613952",
            "coordinatePersonVOList": [
                {
                    "userId": "1478652973982945280",
                    "tenantUserId": "1478533403325632512",
                    "userName": "张三",
                    "orgId": null,
                    "orgName": null
                },
                {
                    "userId": "1478684146095493120",
                    "tenantUserId": "1478533403325632512",
                    "userName": "李四",
                    "orgId": null,
                    "orgName": null
                } 
            ],
            "id": "1479044339471613952"
        },
        {
            "unitName": "卢峰企业二",
            "unitId": "1478551141495083009",
            "tenantId": "1478533403325632512",
            "orgId": null,
            "appId": "1372467609472663553",
            "utitTypeId": null,
            "utitTypeName": null,
            "billno": "DW-00002",
            "linkId": "1479044339471613952",
            "coordinatePersonVOList": [
                {
                    "userId": "1478652973982945283",
                    "tenantUserId": "1478533403325632512",
                    "userName": "王五",
                    "orgId": null,
                    "orgName": null
                },
                {
                    "userId": "1478684146095493124",
                    "tenantUserId": "1478533403325632512",
                    "userName": "马六",
                    "orgId": null,
                    "orgName": null
                } 
            ],
            "id": "1479044339471613952"
        }
    ]
}
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button style={{margin:100}} onClick={handleClick} type="primary">ok</Button>
      </header>
      <Modal
        // width={"auto"}
        bodyStyle={{padding:0}}
        width={710}
        height={720}
        title="请选择人员" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <UserSelect 
            ref={selectRef}
            showType={"0"}  //showType:展示模式   "0":默认模式，内部外部组织同时展示  "1":只展示内部组织   "2":只展示外部组织    
            exteriorType={"1"}  // exteriorType:外部组织类型    "0":默认展示外部企业协同组织   "1":外部项目协同组织  
            single={false} 
            data={data}
        />
      </Modal>
    </div>
  );
}

export default App;
