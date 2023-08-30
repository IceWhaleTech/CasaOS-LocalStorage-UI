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

	// Site
	// SET_SITE_LOADING(state, loading) {
	// 	state.siteLoading = loading
	// },

	// SET_NEED_INITIALIZATION(state, need) {
	// 	state.needInitialization = need
	// },

	// SET_WALLPAPER(state, wallpaper) {
	// 	localStorage.setItem('wallpaper', wallpaper.path)
	// 	state.wallpaperObject = wallpaper
	// },

	// SET_DEFAULT_WALLPAPER(state) {
	// 	state.wallpaperObject = {
	// 		path: require('@/assets/background/default_wallpaper1.jpg'),
	// 		from: "Built-in" //Built-in, Upload, Files
	// 	}
	// },

	// SET_IS_MOBILE(state, val) {
	// 	state.isMobile = val
	// },

	// SET_EXISTING_APPS_SWITCH(state, val) {
	// 	state.existingAppsSwitch = val
	// },

	// SET_HARDWARE_INFO(state, val) {
	// 	state.hardwareInfo = val
	// },

	// SET_CURRENT_PATH(state, val) {
	// 	state.currentPath = val
	// },

	// SET_IS_VIEW_GRID(state, val) {
	// 	state.isViewGird = val
	// },

	SET_OPERATE_OBJECT(state, val) {
		state.operateObject = val
	},

	// SET_NETWORK_STORAGE(state, val) {
	// 	localStorage.setItem('networkStorage', JSON.stringify(val))
	// 	state.networkStorage = val
	// },

	// shortcut data mutations
	// SET_SHORTCUT_DATA(state, val) {
	// 	state.shortcutData = val
	// },
	// public params
	SET_LANGUAGE(state, val) {
		state.casaos_lang = val
	},

	// TODO v2 does not have.
	// SET_NOTIMPORT_LIST(state, val) {
	// 	state.notImportList = val
	// },

}
export default mutations