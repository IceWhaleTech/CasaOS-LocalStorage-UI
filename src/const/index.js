/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023-09-01 19:06:51
 * @FilePath: /CasaOS-LocalStorage-UI/src/const/index.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

export const CASAOS_ROOT_FOLDER = [
    {
      name: 'Root',
      icon: 'root-outline',
      pack: 'casa',
      color: '#0F8FFF',
      path: '/',
      visible: true,
      selected: true,
      extensions: null
    },
  ];
  
  export const CASAOS_OVERVIEW_FOLDER = [
    {
      name: 'Overview',
      icon: 'overview-outline',
      pack: 'casa',
      color: '#33CC80',
      path: 'overview',
      visible: true,
      selected: true,
      extensions: null,
      isQuickAccess: true,
    }
  ];
  
  export const CASAOS_STATIC_FOLDER = [
    {
      name: 'DATA',
      icon: 'data-outline',
      pack: 'casa',
      color: '#0F8FFF',
      path: '/DATA',
      visible: true,
      selected: true,
      extensions: null
    },
    {
      name: 'Documents',
      icon: 'files-outline',
      pack: 'casa',
      color: '#F4AF25',
      path: '/DATA/Documents',
      visible: true,
      selected: true,
      extensions: null
    },
    {
      name: 'Downloads',
      icon: 'downloads-outline',
      pack: 'casa',
      color: '#0F8FFF',
      path: '/DATA/Downloads',
      visible: true,
      selected: true,
      extensions: null
    },
    {
      name: 'Gallery',
      icon: 'gallery-outline',
      pack: 'casa',
      color: '#756CEF',
      path: '/DATA/Gallery',
      visible: true,
      selected: true,
      extensions: null
    },
    {
      name: 'Media',
      icon: 'media-outline',
      pack: 'casa',
      color: '#F48C24',
      path: '/DATA/Media',
      visible: true,
      selected: true,
      extensions: null
    },
  ];
  
  export const FILE_ACCESS_ACTION_ENUM = {
    OPEN: 'open',
    DOWNLOAD: 'download',
    COPY_PATH: 'copy_path',
    RENAME: 'rename',
    SHARE: 'share',
    UNSHARE: 'unShare',
    UPLOAD: 'upload',
    CUT: 'cut',
    COPY: 'copy',
    PASTE: 'paste',
    DELETE: 'delete',
  };
  
  export const MIRCO_APP_ACTION_ENUM = {
    OPEN: 'open',
    CLOSE: 'close',
    MOUNT: 'mount', // show storage manager panel from child app
    LOGIN: 'login', // child app 401 unauth trigger main app login
    DESTROY: 'destroy', // call child app to release its content and destroy itself
  };
  
  export const BACKUP_FOLDER_STAGE = {
    BEGIN: 'begin',
    SCAN: 'scan',
    SERVER_CHECK: 'server_check',
    TRANSFER: 'transfer',
    END: 'end',
    ERROR: 'error',
    IDLE: 'idle',
  };
  
  export const STORAGE_TYPE = {
    LOCAL: 'local',
    HOME: 'home',
    CLOUD: 'cloud',
  };
  
  export const DEVICE_BASE_INFO_LOCATION = '/var/lib/casaos/baseinfo.conf';
  
  export const CLIENT_LINK_Windows_X64 = 'https://zimaos.oss-accelerate.aliyuncs.com/client/releases/latest/squirrel.windows/x64/Zima-latest%20Setup.exe';
  
  export const CLIENT_LINK_MacOS_Arm64 = 'https://zimaos.oss-accelerate.aliyuncs.com/client/releases/latest/Zima-latest-arm64.dmg';
  
  export const CLIENT_LINK_MacOS_X64 = 'https://zimaos.oss-accelerate.aliyuncs.com/client/releases/latest/Zima-latest-x64.dmg';