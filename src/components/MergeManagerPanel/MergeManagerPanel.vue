<!--
 * @Author: zhanghengxin hengxin.zhang@icewhale.org
 * @Date:  2022-09-13 17:01:37
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023-09-15 16:18:12
 * @FilePath: /CasaOS-LocalStorage-UI/src/components/Storage/MergeManagerPanel.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
-->
<template>
	<div class="is-flex is-flex-direction-column is-flex-grow-1 is-flex-shrink-1" style="overflow-y: hidden;">
		<section v-if="currentStep === 0"
			class="is-flex-grow-1 is-flex-shrink-1 notification is-overlay mb-0 pr-0 pl-0 pt-2 pb-3 non-backgroud"
			style="overflow-y: overlay;max-height:60vh;">
			<div class="_is-normal _has-text-gray-600 mb-4">
				{{
					$t("All the checked Storage will be merged into {CasaOS} HD.", {
						CasaOS: OS,
					})
				}}
			</div>

			<div v-for="(item, index) in storageData" :key="item.path + index" class="is-flex mb-1 radius _height-40">
				<div class="ml-2 mr-1 is-flex is-align-items-center _has-color-brand-400">
					<b-icon icon="storage-other" pack="casa" size="is-20"></b-icon>
				</div>
				<div class="is-flex is-flex-grow-1 is-flex-direction-column is-justify-content-center">
					<span class="is-uppercase one-line _is-text-emphasis-03 _has-text-gray-800">{{ item.name ||
						$t("undefined") }}</span>
				</div>
				<div class="is-flex is-flex-shrink-0 is-flex-direction-column is-justify-content-center mr-2">
					<span class="is-uppercase _is-text-full-03 _has-text-gray-600">
						{{
							renderSize(item.size - item.availSize)
						}}/{{
	renderSize(item.size)
}}
					</span>
				</div>
				<b-checkbox v-model="checkBoxGroup" :disabled="item.persistedIn !== 'casaos' || item.isSystem"
					:native-value="item.uuid" class="mr-2"></b-checkbox>
			</div>

			<div v-for="(item, index) in storageMissData" :key="item.path + index" class="is-flex mb-1 radius _height-40">
				<div class="ml-2 mr-1 is-flex is-align-items-center _has-color-brand-400">
					<b-icon icon="storage-other" pack="casa" size="is-20"></b-icon>
				</div>
				<div class="is-flex is-flex-grow-1 is-flex-direction-column is-justify-content-center">
					<span class="is-uppercase one-line _is-text-emphasis-03 _has-text-gray-800">{{ item.name ||
						$t("undefined") }}</span>
				</div>
				<div class="is-flex is-flex-shrink-0 is-flex-direction-column is-justify-content-center mr-2">
					<span class="is-flex is-align-items-center has-text-danger small-font">
						<b-icon class="warn" custom-size="casa-16px" icon="warning-solid" pack="casa"></b-icon>
						{{ $t("Missing") }}
					</span>
				</div>
				<b-checkbox v-model="checkBoxMissGroup" :native-value="item.path" class="mr-2"></b-checkbox>
			</div>
		</section>

		<div v-if="currentStep === 0"
			class="is-flex-shrink-0 _has-background-red-default _has-text-white _is-normal is-flex is-align-items-center mb-4 pt-2 pb-2 _radius-line">
			<div class="is-flex left ml-3 mr-2 is-align-items-center">
				<b-icon custom-size="casa-19px" icon="warning-solid" pack="casa"></b-icon>
			</div>
			{{
				$t(`Beta Feature: Ideal for exploration and learning. Please note, it may not ensure stability for personal
			data; use only with alternative data backups in place.`)
			}}
		</div>

		<section v-if="currentStep > 0"
			class="is-flex-grow-1 is-flex-shrink-0 notification is-overlay mb-0 pr-0 pl-0 pt-5 pb-4 non-backgroud">
			<div v-if="currentStep === 1" class="is-flex is-align-items-center _is-normal">
				{{
					$t(
						"This operation may clear all personal data and destroy the installed APPs."
					)
				}}
			</div>
			<template v-if="currentStep === 2">
				<div class="font">
					{{ $t(`Enter 'I AM SURE' to proceed with the operation.`) }}
				</div>
				<b-input ref="inputPassword" v-model="inputConfirm" class="mt-4"
					@keyup.enter.native="verifyOperate(inputConfirm)"></b-input>
			</template>
			<div v-if="currentStep === 3" class="is-flex is-align-items-center font">
				<div class="message-danger left mr-2 is-flex is-align-items-center">
					<b-icon class="is-38x38" custom-size="is-size-2" icon="information-outline" pack="casa"></b-icon>
				</div>
				{{ $t("APPs is running") + ` , ` + $t("restart APPs to continue.") }}
			</div>
			<div v-if="currentStep === 4" class="is-flex is-align-items-center font">
				<div class="message-danger left mr-2 is-flex is-align-items-center">
					<b-icon class="is-38x38" custom-size="is-size-2" icon="warning-solid" pack="casa"></b-icon>
				</div>
				{{
					runName + $t(" is running, restart ") + runName + $t(" to continue.")
				}}
			</div>
		</section>

		<footer class="is-flex-grow-0 is-flex-shrink-0 is-flex is-align-items-center mb-4">
			<div class="is-flex-grow-1">
				<a v-show="currentStep === 0"
					href="https://docs.zimaboard.com/docs/Small-body-Big-applications-OMV-install.html" target="_blank">{{
						$t("Other ways to merge storages") }}</a>
			</div>
			<div class="mr-4">
				<b-button v-show="currentStep > 2 || currentStep === 1" :label="$t('Cancel')"
					class="_has-background-gray-100" expaned rounded @click="currentStep = 0" />
			</div>
			<div>
				<b-button v-show="currentStep !== 1" :disabled="disableMergeButton" :label="$t(affirm)" :loading="isLoading"
					expaned rounded type="is-primary" @click="submitProxy" />
				<b-button v-show="currentStep === 1" :label="$t(affirm)" :loading="isLoading"
					class="_has-background-red-default is-rounded _has-text-white" expaned rounded
					@click="currentStep = 2" />
			</div>
		</footer>
	</div>
</template>

<script>
import { mixin } from "@/mixins/mixin";
import events from "@/events/events";
import cToolTip from "@/components/basicComponents/tooltip/tooltip.vue";
import filter from "lodash/filter";
import isEqual from "lodash/isEqual";
import { ice_i18n } from "@/mixins/base/common-i18n";

export default {
	name: "MergeStorages",
	mixins: [mixin],
	inject: ["OS"],
	components: {
		cToolTip,
	},
	async created() {
		await this.resetMergerfsInfo();
	},
	watch: {
		// 0 default show:megerStorage Settings view.
		// 1 test whether the storage is empty :: 1 is empty
		// 2 Data Protected :: input password  :: 2 is not empty
		// 3 APPs Restart
		// 4 APP Restart
		currentStep(val) {
			switch (val) {
				case 0:
					this.title = "Merge Storages";
					this.affirm = "Submit";
					break;
				case 2:
					this.title = "Data Protected";
					this.affirm = "Submit";
					this.$nextTick(() => {
						this.$refs.inputPassword.focus();
					});
					break;
				case 3:
					this.title = "APPs Restart";
					this.affirm = "Restart";
					break;
				case 4:
					this.title = "APP Restart";
					this.affirm = "Restart";
					break;
				default:
					break;
			}
		},
	},
	computed: {
		extended() {
			return this.checkBoxGroup.join(":");
		},
		disableMergeButton() {
			// the value is false while checkBox has changed.
			return isEqual(
				[...this.checkBoxGroup, ...this.checkBoxMissGroup],
				this.tempCheckBox
			);
		},
	},
	data() {
		return {
			// Exting Storage list.
			storageData: [],
			// Logic data. mergeStorageList - storageData = storageMissData
			storageMissData: [],
			// Exting disk list.
			diskData: {},
			// unDiskData: {},

			// User currently selects Storage list.
			checkBoxGroup: [],
			checkBoxMissGroup: [],
			// button status.
			isLoading: false,
			// bussiness service flow controller.
			currentStep: 0,
			title: "Merge Storages",
			affirm: "Submit",
			// mergeInfo: [],
			// Comfirm parrameter.
			inputConfirm: "",
			// APPs running name.
			runName: "",
			// TODO: Change Storage Status to the description on the business side. Eg: StorageInUse
			// Whether the storage is empty.
			emptyStorage: false,
			// Merge Storage list
			mergeStorageList: [],
			tempCheckBox: [],
		};
	},
	methods: {
		/**
		 * @description: update merge info
		 * sync function
		 */
		updateMerge(dockerInfo) {
			// update merge api
			this.$api.local_storage
				.updateMergerfsInfo({
					fstype: "fuse.mergerfs",
					mount_point: "/DATA",
					source_volume_uuids: [
						...this.checkBoxGroup,
						...this.checkBoxMissGroup,
					],
				})
				.then((res) => {
					// started all containers
					Promise.all(
						dockerInfo.map(async (item) => {
							if (item.app_type === "v2app") {
								await this.$openAPI.appCompose.setComposeAppStatus(
									item.name,
									"start"
								);
							} else {
								await this.$api.container.updateState(item.name, "start");
							}
						})
					)
						.then(() => {
							this.$buefy.toast.open({
								message: "Merge Storages Success",
								type: "is-success",
								position: "is-top",
								duration: 5000,
								queue: true,
								indefinite: false,
							});
							this.$emit("update", true);
							this.resetMergerfsInfo();
							this.$EventBus.$emit(events.RELOAD_APP_LIST);
						})
						.catch((e) => {
							this.$buefy.toast.open({
								message: e.response.data.data || e.response.data.message,
								type: "is-danger",
								position: "is-top",
								duration: 5000,
							});
							console.error(e);
						})
						.then(() => {
							// TODO : need to check the result by the states code
							switch (res.status) {
								case 200:
								case 400:
								default:
									this.isLoading = false;
									// refresh local storage
									this.$EventBus.$emit(events.RELOAD_MOUNT_LIST);
									// close the modal
									this.$emit("close");
							}
						});
				});
		},
		// get the storage list be mounted of mergerfs
		cancel() {
			this.$emit("close");
		},
		async test() {
			this.isLoading = true;
			// submit
			this.$messageBus("storagemanager_mergestorage");
			try {
				this.emptyStorage = await this.$api.disks.getSize({ path: '/DATA' }).then(res => {
					return res.data.data.used > 4 * 1024;
				})
					.finally(() => {
						this.isLoading = false;
					});
			} catch (e) {
				this.$buefy.toast.open({
					message: e.response.data.data || e.response.data.message,
					type: "is-danger",
					position: "is-top",
					duration: 5000,
				});
				console.error(e);
				return e;
			}
			// business :: If storage is empty, no reminder
			if (this.emptyStorage) {
				this.title = "Reset Warning";
				this.affirm = "Reset";
				this.currentStep = 1;
			} else {
				this.submit();
			}
		},

		async submit(e, nextStep = false) {
			// operation : split the mergerfs
			let notSplit = this.mergeStorageList.every(
				(item) =>
					this.checkBoxGroup.includes(item) ||
					this.checkBoxMissGroup.includes(item)
			);
			if (notSplit || nextStep) {
				// get docker info
				let dockerInfo = await this.$openAPI.appGrid
					.getAppGrid()
					.then((res) => res.data.data || []);
				dockerInfo = filter(dockerInfo, { status: "running" });
				if (this.emptyStorage) {
					this.restart();
					return;
				} else if (dockerInfo.length === 1) {
					this.currentStep = 4;
					this.runName = ice_i18n(dockerInfo[0].title);
					return;
				} else if (dockerInfo.length > 1) {
					this.currentStep = 3;
					this.runName = dockerInfo
						.map((item) => ice_i18n(item.title))
						.join(",");
					return;
				} else {
					this.restart();
					return;
				}
			}
			this.currentStep = 2;
		},

		async restart() {
			this.isLoading = true;
			try {
				//business :: all apps to restarted.
				// 1、 获取应用信息，主要是运行中的应用. 2、关闭应用 3、合并磁盘 4、启动应用
				let dockerInfo = await this.$openAPI.appGrid
					.getAppGrid()
					.then((res) => res.data.data || []);
				dockerInfo = filter(dockerInfo, { status: "running" });
				const container = this.$api.container;
				const compose = this.$openAPI.appCompose;
				Promise.all(
					dockerInfo.map(async (item) => {
						if (item.app_type === "v2app") {
							await compose.setComposeAppStatus(item.name, "stop");
						} else {
							await container.updateState(item.name, "stop");
						}
					})
				)
					.then(() => {
						this.$api.local_storage.getInitMergerfsStatus().then((res) => {
							if (res.data.data !== "initialized") {
								this.$api.local_storage
									.initMergerfs({ mount_point: "/DATA" })
									.then(() => {
										this.updateMerge(dockerInfo);
									})
									.catch((e) => {
										this.isLoading = false;
										this.$buefy.toast.open({
											message: e.response.data.data || e.response.data.message,
											type: "is-danger",
											position: "is-top",
											duration: 5000,
										});
										console.error(e);
									});
							} else {
								this.updateMerge(dockerInfo);
							}
						});
					})
					.catch((e) => {
						this.isLoading = false;
						this.$buefy.toast.open({
							duration: 5000,
							message: e.response.data.data || e.response.data.message,
							position: "is-top",
							type: "is-danger",
						});
						console.error(e);
					})
					.finally(() => {
						this.currentStep = 0;
					});
			} catch (e) {
				console.log(e);
			}
		},

		verifyOperate(content) {
			if (content === "I AM SURE") {
				this.submit(null, true);
				this.inputConfirm = "";
				return;
			}
			this.$buefy.toast.open({
				duration: 5000,
				message: this.$t("Incorrect input."),
				type: "is-danger",
			});
		},

		async resetMergerfsInfo() {
			try {
				this.mergeStorageList = await this.$api.local_storage
					.getMergerfsInfo()
					.then((res) => {
						return res.data.data[0]["source_volume_uuids"];
					});
			} catch (e) {
				console.log(e);
				this.mergeStorageList = [];
			}
			// Reset the checkbox.
			this.checkBoxGroup.splice(0, this.checkBoxGroup.length, ...this.mergeStorageList);
			await this.getStorageList();
			this.tempCheckBox = [...this.mergeStorageList, ...this.checkBoxMissGroup];
		},

		submitProxy() {
			if (this.currentStep === 0)
				this.test();
			if (this.currentStep === 2)
				this.verifyOperate(this.inputConfirm);
			if (this.currentStep === 3 || this.currentStep === 4)
				this.restart();
		},

		async getStorageList() {
			// const storageRes = await this.$api.storage.list({system: "show"}) // get all Storage list.
			const storageRes = await this.$api.storage.list().then(res => res?.data?.data || []);
			const storageArray = [];
			const storageMissArray = [];
			let testMergeMiss = this.mergeStorageList;
			storageRes.forEach((item) => {
				item.children.forEach((part) => {
					part.disk = item.path;
					part.diskName = item.disk_name;
					storageArray.push(part);
					testMergeMiss = testMergeMiss.filter((v) => v !== part.uuid);
				});
			});
			// Reset the Missing Storage checkbox.
			this.checkBoxMissGroup.splice(0, this.checkBoxMissGroup.length, ...testMergeMiss);
			// this.checkBoxMissGroup = [...this.checkBoxMissGroup, ...testMergeMiss];
			testMergeMiss.forEach((item) => {
				storageMissArray.push({
					uuid: "",
					mount_point: "",
					size: "",
					avail: "",
					type: "",
					path: item,
					drive_name: "",
					label: "",
					persisted_in: "",
					disk: "",
					diskName: "",
				});
			});

			this.storageData = storageArray.map((storage) => {
				// return {
				// 	uuid: storage.uuid,
				// 	name: storage.label,
				// 	isSystem: storage.diskName === "System",
				// 	fsType: storage.type,
				// 	size: storage.size,
				// 	availSize: storage.avail,
				// 	usePercent: 100 - Math.floor((storage.avail * 100) / storage.size),
				// 	diskName: storage.drive_name,
				// 	path: storage.path,
				// 	mount_point: storage.mount_point,
				// 	disk: storage.disk,
				// 	persistedIn: storage.persisted_in,
				// };

				return this.formatteStorageItemData(storage);
			});

			// this.storageMissData = storageMissArray.map((storage) => {
			// 	// return {
			// 	// 	uuid: storage.uuid,
			// 	// 	name: storage.label,
			// 	// 	isSystem: storage.diskName === "System",
			// 	// 	fsType: storage.type,
			// 	// 	size: storage.size,
			// 	// 	availSize: storage.avail,
			// 	// 	usePercent: 100 - Math.floor((storage.avail * 100) / storage.size),
			// 	// 	diskName: storage.drive_name,
			// 	// 	path: storage.path,
			// 	// 	mount_point: storage.mount_point,
			// 	// 	disk: storage.disk,
			// 	// 	persistedIn: storage.persisted_in,
			// 	// };

			// 	return this.formatteStorageItemData(storage);
			// });

			this.storageMissData = testMergeMiss.map((item) => {
				return this.formatteStorageItemData({ path: item });
			});
		},

		// public function
		formatteStorageItemData(item) {
			return {
				uuid: item?.uuid,
				name: item?.label,
				isSystem: item?.diskName === "System",
				fsType: item?.type,
				size: item?.size,
				availSize: item?.avail,
				usePercent: 100 - Math.floor((item?.avail * 100) / item?.size),
				diskName: item?.drive_name,
				path: item?.path,
				mount_point: item?.mount_point,
				disk: item?.disk,
				persistedIn: item?.persisted_in,
			};
		},
	},
};
</script>

<style lang="scss" scoped>
.non-backgroud {
	background: none;
}

.pri-head {
	line-height: 1.875rem;
	border-bottom: rgba(0, 0, 0, 0.1) 1px solid !important;
}

.pri-margin {
	margin: 2rem;
}

.pri-mrl-2rem {
	margin-left: 2rem;
	margin-right: 2rem;

	.pri-mtr-3px {
		margin-top: 0.1875rem;
		margin-bottom: 0.1875rem;
		min-height: 2.75rem;
		border-radius: 0.25rem;
	}

	div:hover {
		background: hsla(215, 89%, 93%, 1);
	}
}

._is-normal {
	/* Text 400Regular/Text03 */

	font-family: "Roboto";
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	/* identical to box height, or 143% */

	font-feature-settings: "pnum" on, "lnum" on;
}

._is-text-emphasis-03 {
	/* Text 500Medium/Text03 */

	font-family: "Roboto";
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	line-height: 20px;
	/* identical to box height, or 143% */

	font-feature-settings: "pnum" on, "lnum" on;
}

._is-text-full-03 {
	/* Text 400Regular/Text03 */

	font-family: "Roboto";
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	/* identical to box height, or 143% */

	text-align: right;
	font-feature-settings: "pnum" on, "lnum" on;
}

._has-text-gray-800 {
	/* Gary/800 */

	color: hsla(208, 20%, 20%, 1);
}

._has-text-gray-600 {
	/* Gary/600 */
	color: hsla(208, 14%, 58%, 1);
}

._has-color-brand-400 {
	/* Brand/400 */
	color: hsla(208, 100%, 53%, 1);
}

._has-text-red-default {
	/* Red/Default */
	color: hsla(18, 98%, 55%, 1);
}

._has-text-white {
	/* White/White */
	color: hsla(0, 0%, 100%, 1);
}

._has-background-red-default {
	/* Red/Default */
	background: hsla(18, 98%, 55%, 1);
}

._has-background-yellow-default {
	/* Red/Default */
	background: hsla(44, 98%, 46%, 1);
}

._has-background-gray-100 {
	/* Gray/100 */
	background: hsla(208, 16%, 96%, 1);
}

._height-40 {
	height: 2.5rem;
}

//._is-20x20 {
//	width: 1.25rem;
//	height: 1.25rem;
//}

.small-font {
	font-family: Roboto;
	font-size: 12px;
	font-weight: 400;
	line-height: 18px;
	letter-spacing: 0;
}

.radius {
	box-sizing: border-box;
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-radius: 0.375rem;
}

._radius-line {
	border-radius: 0.375rem;
	border: 0 solid rgba(0, 0, 0, 0);
}

.pri-text-color {
	color: hsla(0, 0%, 0%, 0.4);
}

.message-danger {
	color: hsla(348, 86%, 61%, 1);
}

.message-alert {
	height: 2rem;
	margin-top: 0;
	margin-bottom: 1rem;
	margin-left: 2rem;
	margin-right: 2rem;
	border-radius: 0.25rem;
	color: hsla(40, 100%, 43%, 1);
	font-size: 0.875rem;
	font-style: normal;
	background: hsla(40, 100%, 95%, 1);
}

.pri-message-danger {
	height: 2rem;
	margin-top: 0;
	margin-bottom: 1rem;
	margin-left: 2rem;
	margin-right: 2rem;
	border-radius: 0.25rem;
	color: hsla(348, 86%, 61%, 1);
	font-size: 0.875rem;
	font-style: normal;
	background: hsla(348, 100%, 95%, 1);
}

.t-line {
	border-top: rgba(0, 0, 0, 0.1) 1px solid !important;
}

.warn {
	color: hsla(348, 86%, 61%, 1);
}

.is-38x38 {
	width: 2.375rem;
	height: 2.375rem;
}
</style>
<style lang="scss">
.pri-mtr-3px .control-label {
	display: none;
}
</style>
