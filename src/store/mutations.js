/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-06-02 19:49:36
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-08-24 18:47:36
 * @FilePath: \CasaOS-UI\src\store\mutations.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */
const mutations = {
	// User and tokens
	SET_ACCESS_TOKEN(state, token) {
		state.access_token = token
	},

	SET_REFRESH_TOKEN(state, token) {
		state.refresh_token = token
	},

	SET_DEVICE_ID(state, id) {
		state.device_id = id
	},

	SET_ACCESS_ID(state, id) {
		state.access_id = id
	},

	SET_OPERATE_OBJECT(state, val) {
		state.operateObject = val
	},

	// public params
	SET_LANGUAGE(state, val) {
		state.casaos_lang = val
	},

}
export default mutations
