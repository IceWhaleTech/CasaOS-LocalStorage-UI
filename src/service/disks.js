/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/8/30 下午2:38
 * @FilePath: /CasaOS-UI/main/src/service/disks.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

import {api} from "./service.js";

const PREFIX = "/disks";
const disks = {

	// get disk list
	getDiskList(data) {
		return api.get(`${PREFIX}`, data);
	},

	umount(data) {
		return api.delete(`${PREFIX}`, data);
	},

	getSize(data){
		return api.get(`${PREFIX}/size`, data);
	},
}
export default disks;
