<!--
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023-09-07 14:52:49
 * @FilePath: /CasaOS-LocalStorage-UI/src/components/Storage/StorageItem.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->

<template>
	<div class="mb-4 pb-3 background-item is-flex is-flex-direction-column">
		<div class="is-flex mt-3 mr-3 mb-3 ml-3">
			<div class="header-icon">
				<b-image :src="require('@/assets/img/storage/storage.png')" class="is-64x64"></b-image>
			</div>
			<div class="ml-3 is-flex-grow-1 is-flex is-align-items-center">
				<div>
					<h4 class="mb-0 has-text-left one-line has-text-emphasis-02 is-flex is-align-items-center">
						{{ displayStorageName(item.name) }}
						<b-tag v-if="item.isSystem" class="ml-2 has-text-full-04">OS
						</b-tag>
					</h4>

					<p class="has-text-left has-text-full-04 has-text-grey-light mt-1">{{ $t('Single Drive Storage') }},
						<span class="is-uppercase">{{ item.fsType }}</span>
						<!-- <b-tooltip :label="$t('CasaOS reserves 1% of file space when creating storage in EXT4 format.')"
								   append-to-body>
							<b-icon class="mr-2 " icon="help-circle-outline" size="is-small"></b-icon>
						</b-tooltip> -->
					</p>
					<p class="has-text-left has-text-full-04 mt-1">{{
							$t("Available Total", {
								name: item.diskName,
								avl: renderSize(item.availSize),
								total: renderSize(item.size)
							})
						}}</p>
				</div>

			</div>
			<div v-if="!item.isSystem" class="is-flex is-align-items-center b-group">
				<b-button :disabled="isRemoving" :loading="isFormating" :type="isFormating?'is-primary':''"
						  rounded size="is-small" @click="formatStorage(item.path,item.mount_point)">
					{{ $t('Format') }}
				</b-button>
				<b-button :disabled="isFormating" :loading="isRemoving" :type="isRemoving?'is-primary':''" class="ml-2"
						  rounded size="is-small" @click="removeStorage(item.disk)"> {{ $t('Remove') }}
				</b-button>
			</div>
			<p v-else-if="item.usePercent >= 80" class="has-text-right is-flex is-flex-direction-column-reverse">
				<a href="https://wiki.casaos.io/zh/guides" target="_blank">{{ $t("Optimize Storage") }}</a>
			</p>
		</div>
		<b-progress :type="item.usePercent | getProgressType" :value="item.usePercent || 0"
					class="ml-3 mr-3" size="is-small"></b-progress>
	</div>
</template>

<script>
import {mixin} from '@/mixins/mixin';
import delay   from 'lodash/delay';

export default {
	name: "storage-item",
	mixins: [mixin],
	props: {
		item: {
			type: Object,
			default: null
		},
	},
	data() {
		return {
			isFormating: false,
			isRemoving: false
		}
	},
	methods: {
		removeStorage(path) {
			this.isRemoving = true;

			this.$buefy.dialog.prompt({
				title: this.$t('Remove'),
				message: this.$t(`Please type 'I CONFIRM' to proceed with disk removal.`),
				inputAttrs: {
					type: "confirm"
				},
				trapFocus: true,
				confirmText: this.$t('OK'),
				cancelText: this.$t('Cancel'),
				closeOnConfirm: false,
				onCancel: () => {
					this.isRemoving = false;
				},
				onConfirm: (confirm,{close}) => {
					if(confirm !== `I CONFIRM`){
						this.$buefy.toast.open({
							duration: 3000,
							message: this.$t('Incorrect input.'),
							type: 'is-danger'
						})
						return;
					}
					let data = {
						path: path
					}

					this.$api.disks.umount(data).then((res) => {
						if (res.data.success !== 200) {
							this.$buefy.toast.open({
								duration: 3000,
								message: res.data.message,
								type: 'is-danger'
							})
						} else {
							this.$emit('getDiskList');
						}
					}).catch(e => {
						this.$buefy.toast.open({
							duration: 3000,
							message: e.response.data.message,
							type: 'is-danger'
						})
					}).finally(() => {
						this.isRemoving = false;
						close()
					})
				}
			})
		},

		formatStorage(path, mount_point) {
			this.isFormating = true;

			this.$buefy.dialog.prompt({
				title: this.$t('Format'),
				message: this.$t("Please type 'I CONFIRM' to proceed with formatting."),
				inputAttrs: {
					type: "confirm"
				},
				trapFocus: true,
				confirmText: this.$t('OK'),
				cancelText: this.$t('Cancel'),
				onCancel: () => {
					this.isFormating = false;
				},
				onConfirm: (value) => {
					if(value !== `I CONFIRM`){
						this.$buefy.toast.open({
							duration: 3000,
							message: this.$t('Incorrect input.'),
							type: 'is-danger'
						})
						this.isFormating = false;
						return;
					}
					let data = {
						path: path,
						volume: mount_point
					}

					this.$api.storage.format(data).then((res) => {
						if (res.data.success !== 200) {
							this.isFormating = false;
							this.$buefy.toast.open({
								duration: 3000,
								message: res.data.message,
								type: 'is-danger'
							})
							console.error(res)
						} else {
							let _this = this
							delay(() => {
								_this.isFormating = false;
								_this.$emit('getDiskList');
							}, 1000);
						}
					}).catch(e => {
						this.isFormating = false;
						this.$buefy.toast.open({
							duration: 3000,
							message: e.response.data.message,
							type: 'is-danger'
						})
						console.error(e)
					})

				}
			})
		},
		displayStorageName(name){
			return (name === "System" && this.isZIMA) ? "Zima HD" : name ?? this.$t('undefined');
		},
	},
}
</script>
<style lang="scss" scoped>
.tag {
	background-color: hsla(208, 16%, 98%, 1);
	border: 1px solid hsla(208, 100%, 45%, 1);
	color: hsla(208, 100%, 45%, 1);
	padding: 2px 6px;
	height: 1.25rem;
}

.background-item {
	background-color: hsla(208, 16%, 98%, 1);
	border-radius: 0.5rem;
}
</style>
