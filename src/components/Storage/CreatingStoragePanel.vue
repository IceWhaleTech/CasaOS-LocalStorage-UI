<!--
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023-09-12 18:38:34
 * @FilePath: /CasaOS-LocalStorage-UI/src/components/Storage/CreatingStoragePanel.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.

  -->
<script setup>
import LottieAnimation                                   		from "lottie-web-vue";
import {ref, defineProps, getCurrentInstance, watch} 			from "vue";
import {renderSize}                                      		from "@/composables/localstorage";
import {ValidationObserver, ValidationProvider}          		from "vee-validate";
import "@/plugins/vee-validate";

const {proxy} = getCurrentInstance()
const ob1 = ref(null)
const {unDiskData, createStorageNameDefault} = defineProps({
	unDiskData: {
		type: Array,
		default: []
	},
	createStorageNameDefault: {
		type: String,
		default: ""
	}
})
const isLoading = ref(false)
const isValidity = ref(false)
const isCreating = ref(false)
let createStorageName = ref("")
createStorageName.value = createStorageNameDefault
let createStorageType = ref("")
let selectDisk = ref(unDiskData[0])

const attentionTitle = ref("init title.")
const attentionMessage = ref(`init message.`)
const attentionType = ref("is-danger")
watch(() => selectDisk.value, (val) => {
	// attention PART!
	if(val.children.length === 0 && !val.supported){
		attentionTitle.value = "Attention"
		attentionMessage.value = `The selected disk is not supported, and the system will format the disk and create a storage.`
		attentionType.value = "is-danger"
		createStorageType.value = "format"
		return
	}else if(val.children.length === 0 && val.supported){
		attentionTitle.value = ""
		attentionMessage.value = ``
		attentionType.value = ""
		createStorageType.value = "mountable"
		return
	}
	let sign = 0;
	val.children.forEach((item, index) => {
		if (item.supported) {
			sign++;
		}
	})
	if(sign === val.children.length){
		attentionTitle.value = "Success"
		attentionMessage.value = `The selected disk can be used directly. Click 'Create' and the partitions and data will be fully retained.`
		attentionType.value = "is-success"
		createStorageType.value = "mountable"
	}else if(sign === 0){
		attentionTitle.value = "Attention"
		attentionMessage.value = `The selected disk must be formatted before it can be used, all data will be erased.`
		attentionType.value = "is-danger"
		createStorageType.value = "format"
	}else{
		attentionTitle.value = "Attention"
		attentionMessage.value = `The data in the supported partitions that are clicked to create will be retained, unsupported partitions will be ignored.`
		attentionType.value = "is-warning"
		createStorageType.value = "mountable"
	}
},{immediate: true})


const $emit = defineEmits(['refresh:DiskList', 'close:CreatingStoragePanel'])

/**
 * @description: Create a new storage
 * @return {void}
 * @param needFormat
 */
function createStorage(needFormat) {
	isValidity.value = true
	checkStep(ob1.value).then(val => {
		isValidity.value = false
		if (!val) {
			return
		}

		if(needFormat){
			proxy.$buefy.dialog.confirm({
				title: proxy.$t('Attention'),
				message: proxy.$t("The disk will be formatted as a single partition, all data will be erased."),
				type: 'is-danger',
				hasIcon: true,
				cancelText: proxy.$t('Cancel'),
				confirmText: proxy.$t("Confirm"),
				onConfirm: () => {
					submitCreate(true)
				}
			})
		}else{
			submitCreate(false)
		}
	}).catch(err => {
		isValidity.value = false
		proxy.$buefy.toast.open({
			duration: 3000,
			message: err.response.data.message,
			type: 'is-danger'
		})
		console.error(err)
	})
}

function submitCreate(format) {
	isCreating.value = true
	let data = {
		path: selectDisk.value.path,
		name: createStorageName.value,
		format: format
	}
	proxy.$api.storage.create(data).then((res) => {
		if (res.status !== 200) {
			isCreating.value = false;
			proxy.$buefy.toast.open({
				duration: 3000,
				message: res.data.message,
				type: 'is-danger'
			})
			
			attentionTitle.value = "Attention"
			if(format){
				attentionMessage.value = `Storage space creation failed. Please try manually formatting before trying again.`
			}else{
				attentionMessage.value = `Storage space creation failed. Please try formatting and creating again.`
			}
			attentionType.value = "is-danger"
			
			console.error(res.data.message)
		} else {
			$emit('refresh:DiskList', true)
		}
	}).catch(err => {
		isCreating.value = false
		proxy.$buefy.toast.open({
			duration: 3000,
			message: err.response.data.message,
			type: 'is-danger'
		})
		console.error(err)
	})
}

/**
 * @description: Validate form async
 * @param {Object} ref ref of component
 * @return {Boolean}
 */
function checkStep(ref) {
	return ref.validate()
}

function displayPartitionInfo(item, itemIndex){
	const wheatherSupported = item.supported ? "" : ",Not Supported"
	return `Partition ${itemIndex + 1} (${renderSize(item.size)} ${wheatherSupported})`
}

</script>

<template>
	<div>
		<template v-if="!isCreating">
			<header class="pl-5 mt-4 pt-1 b-line">
				<h3 class="title is-3 mb-3">{{ $t('Create Storage') }}</h3>
				<div class="close-container">
					<button class="delete" type="button" @click="$emit('close')"/>
				</div>
			</header>
			<section class="pr-5 pl-5 mt-4 pb-2">
				<!-- Create Storage Start -->
				<div class="is-flex-grow-1 is-relative">
					<ValidationObserver ref="ob1">
						<ValidationProvider v-slot="{ errors, valid }" name="StorageName" rules="required">
							<b-field :label="$t('Storage Name')" :message="$t(errors)"
									 :type="{ 'is-danger': errors[0], 'is-success': valid }">
								<b-input v-model="createStorageName"
										 @keyup.native="createStorageName = createStorageName.replace(/[^\w]/g, '')"
										 @paste.native="createStorageName = createStorageName.replace(/[^\w]/g, '')"></b-input>
							</b-field>
						</ValidationProvider>

						<b-field :label="$t('Choose Drive')">
							<b-dropdown v-model="selectDisk" expanded scrollable>
								<template #trigger>
									<b-button icon-pack="casa" icon-right="down-outline" expanded class="is-justify-content-space-between is-size-6">
										{{ selectDisk.name }} ({{ selectDisk.model }} - {{ renderSize(selectDisk.size) }})
									</b-button>
								</template>
								<b-dropdown-item v-for="(option, index) in unDiskData" :key="option.path" :value="option">
									<dl>
										<dt>
											{{ option.name }} ({{ option.model }} - {{ renderSize(option.size) }})
											<b-icon class="ml-1" custom-size="mdi-18px" icon="check" type="is-success" v-if="selectDisk.name === option.name"></b-icon>
										</dt>
										<dd v-for="(child, childIndex) in option.children" :key=" option.path + childIndex" :value="childIndex">
											{{displayPartitionInfo(child, childIndex)}}
										</dd>
									</dl>
								</b-dropdown-item>
							</b-dropdown>
						</b-field>

					</ValidationObserver>

					<b-message :type="attentionType" has-icon class="mt-5" v-show="attentionTitle">
						<p class="is-size-5">{{ $t(attentionTitle) }}</p>
						{{
							$t(attentionMessage)
						}}
					</b-message>

				</div>
				<b-loading v-model="isLoading" :can-cancel="false" :is-full-page="false"></b-loading>
			</section>
		</template>
		<!-- Create Storage End -->
		<section v-else class="modal-card-body ">
			<div class="installing-warpper mt-6 mb-6">
				<div class="is-flex is-align-items-center is-justify-content-center mb-5">
					<lottie-animation :animationData="require('@/assets/ani/creating.json')" :autoPlay="true"
									  :loop="true"
									  class="creating-animation"></lottie-animation>
				</div>
				<h3 class="title is-4 has-text-centered has-text-weight-light">{{ $t('Creation in progress') }}...</h3>
			</div>
		</section>
		<!-- Modal-Card Footer Start-->
		<footer v-if="!isCreating" class="modal-card-foot is-flex is-align-items-center">
			<div class="is-flex-grow-1"></div>
			<div>
				<b-button :label="$t('Cancel')" rounded @click="$emit('close:CreatingStoragePanel')"/>
				<b-button :label="$t('Format and Create')" :loading="isValidity"
						  :type="createStorageType === 'format' ? 'is-primary' : ''" rounded
						  @click="createStorage(true)"/>
				<b-button v-if="createStorageType === 'mountable'" :label="$t('Create')" :loading="isValidity" rounded type="is-primary" @click="createStorage(false)"/>
			</div>
		</footer>
		<!-- Modal-Card Footer End -->
	</div>
</template>

<style lang="scss" scoped>
// choose drive input PART!
.is-justify-content-space-between.is-size-6{
	height: 2.5rem;
	padding-right: 11px;
	padding-left: 11px;
}
// drive list ITEM PART!
dd{
	margin-left: 2rem;
	opacity: .7;
}
.dropdown-item,.dropdown-item.is-active{
	background: hsl(0, 0%, 96%);
	color: hsl(0, 0%, 4%);
}
</style>