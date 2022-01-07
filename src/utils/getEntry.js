// 加载微前端子应用，用于拼接各环境微应用entryPath
const getEntry = ([onlinePort, offlinePort]) => {
	const isDEV = process.env.NODE_ENV === "development";
	return isDEV
		? "http://localhost:" + offlinePort
		: process.env.ENTRY_PATH + ":" + onlinePort;
};
export default getEntry;
