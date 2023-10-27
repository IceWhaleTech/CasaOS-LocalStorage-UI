/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-06-02 19:48:26
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-07 22:32:04
 * @FilePath: \CasaOS-UI-0.4.2\src\store\state.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */
const state = {
	// User
	access_token: "",
	refresh_token: "",
	user: {
		avatar: "",
		created_at: "",
		description: "",
		email: "",
		id: 0,
		nickname: "",
		role: "",
		updated_at: "",
		username: ""
	},
	initKey: "", // Initialization key for reg
	operateObject: null,
	// public params
	device_id: "xxx",
	access_id: "dsdad",
	casaos_lang: "zh",
	notImportList: [],
}

export default state
