import React, { Component } from "react";
import { Layout } from "antd";
import SiderMenu from "@/components/SiderMenu";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import UserAvatar from "@/components/UserAvatar";
import { Switch, Route } from "react-router-dom";
// import Authority from "@/views/authority"
import ShowVersion from "@/components/ShowVersion";
import NewBreadcrumb from "@/components/NewBreadcrumb";

import { logoData } from "@/utils/logo.js";
import { start } from "qiankun";
// import webSocket from "@/utils/socket.js"
import { checkUserType } from "@/utils/toolfunc";
import "./index.scss";
const { Header, Sider, Content } = Layout;
export default class Home extends Component {
	state = {
		collapsed: false,
		superHero: null,
		unreadCount: 0,
		// sysName: checkUserType() ? "系统" : "单位",
	};
	socket = null;
	componentDidMount() {
		console.log("home-->componentDidMount>>>");
		const buildEnv = process.env.CURRENT_BUILD_ENV;
		let baseWS =
			buildEnv === "release" ? "192.168.11.121" : "192.168.11.118";
		let userInfo = JSON.parse(localStorage.getItem("userInfo"));
		console.log("home-->userInfo>>>", userInfo);
		let url = `ws://${baseWS}:30071/notification/websocket/${
			(userInfo && userInfo.id) || "1"
		}/${(userInfo && userInfo.tenantId) || "1"}`;
		this.socket = new WebSocket(url);
		this.socket.onmessage = this.onMessage;
		this.socket.onopen = (e) => {
			console.log("websocket建立连接>>", e);
		};
		this.socket.onclose = this.onClose;
		this.socket.onerror = this.onError;
		const superHero = localStorage.getItem("superHero");
		this.setState({
			superHero: superHero,
		});
		let elem = document.getElementById("container");
		console.log(elem);
		start();
		let path = this.props.history.location.pathname;
		if (path === "/index" || path === "/index/home") {
			this.props.history.push("/index/monitor/home/show_chart");
		}
	}
	onMessage = (e) => {
		console.log("onMessage>>>", e);
		let res = JSON.parse(e.data);
		if (res.code === 200) {
			this.setState({ unreadCount: res.data.unreadCount });
		}
	};
	onClose = (e) => {
		console.log("onClose>>>", e);
	};
	onError = (e) => {
		console.log("onError>>>", e);
	};
	componentWillUnmount() {
		if (this.socket) {
			this.socket.close();
		}
	}
	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	};

	goSetting = () => {
		this.props.history.push({ pathname: "/index/setting" });
	};

	// logout = () => {
	//   console.log("this.socket>>>>", this.socket);
	//   // return
	//   if (this.socket) {
	//     this.socket.close()
	//   }
	//   const isPrd = process.env.NODE_ENV === "production";
	//   const superHero = localStorage.getItem("superHero")
	//   let login = superHero === "0" ? "superLogin" : "tenantLogin"

	//   localStorage.removeItem("userInfo")
	//   localStorage.removeItem("superHero")
	//   console.log(this.props, window.location);
	//   // this.props.history.replace("/login")
	//   window.location.href = isPrd ? process.env.ENTRY_PATH + ":30200/" + login : "http://localhost:5000/" + login
	// }
	render() {
		const {
			unreadCount,
			// sysName
		} = this.state;
		return (
			<Layout className="homepage">
				<Sider
					trigger={null}
					collapsible
					collapsed={this.state.collapsed}
				>
					<div className="sider-wrap">
						<div className="logo">
							<img src={logoData} alt="" srcSet="" />
							{/* <span>{`${sysName}管理后台`}</span> */}
							<span>EIMP</span>
						</div>
						<div className="side-menu-wrap">
							<SiderMenu superHero={this.state.superHero} />
						</div>
						<div className="version-info">
							<ShowVersion />
						</div>
					</div>
				</Sider>
				<Layout className="site-layout">
					<Header
						className="site-layout-background common-header"
						style={{ padding: 0 }}
					>
						{React.createElement(
							this.state.collapsed
								? MenuUnfoldOutlined
								: MenuFoldOutlined,
							{
								className: "trigger",
								onClick: this.toggle,
							}
						)}
						<NewBreadcrumb />
						<UserAvatar
							unreadCount={unreadCount}
							goSetting={this.goSetting}
							logout={this.logout}
						/>
					</Header>
					<Content
						className="site-layout-background micro-content"
						style={{
							margin: "24px 16px",
							padding: 24,
							minHeight: 280,
						}}
					>
						<div id="container"></div>
						{/* <Switch>
              <Route exact path="/index/setting" render={() => <Setting />} />
            </Switch> */}
					</Content>
				</Layout>
			</Layout>
		);
	}
}
