import elementUI from 'element-ui'

export default {
  name : 'msg',

  success (msg,duration=3000){
    elementUI.Message({type: 'success',message: msg || '操作成功',duration:duration});
  },

  error (msg,duration=3000){
    elementUI.Message({type: 'error',message: msg || '操作失败',duration:duration});
  },

  warning (msg,duration=3000){
    elementUI.Message({type: 'warning',message: msg || '警告',duration:duration});
  },

  info (msg){
    elementUI.Message(msg);
  },

  notifySuccess (data){
    elementUI.Notification({
      title: data.title || '成功',
      message: data.msg || '操作成功',
      type: 'success'
    });
  },
  notifySuccess (msg){
    elementUI.Notification({
      title:  '成功',
      message: msg || '操作成功',
      type: 'success'
    });
  },
  notifyWarning (data){
    elementUI.Notification({
      title: data.title || '警告',
      message: data.msg || '',
      type: 'warning'
    });
  },

  notifyWarning (msg){
    elementUI.Notification({
      title: '警告',
      message: msg || '',
      type: 'warning'
    });
  },
  notifyInfo (data){
    elementUI.Notification.info({
      title: data.title || '消息',
      message: data.msg || ''
    });
  },

  notifyInfo (msg){
    elementUI.Notification.info({
      title: '消息',
      message: msg || ''
    });
  },
  notifyError (data){
    elementUI.Notification.error({
      title: data.title || '消息',
      message: data.msg || '操作失败'
    });
  },
  notifyError (msg){
    elementUI.Notification.error({
      title:  '消息',
      message: msg || '操作失败'
    });
  },

  confirm({msg, title='提示', confirmButtonText='确定', cancelButtonText='取消',
            closeOnClickModal=true, closeOnPressEscape=true,showCancelButton=true,
            type='warning', confirmFn, cancelFn} ) {
    elementUI.MessageBox.confirm(msg, title, {
      confirmButtonText,
      cancelButtonText,
      type,
      closeOnClickModal,
      closeOnPressEscape,
      showCancelButton
    }).then(() => {
      if (confirmFn) {
          confirmFn()
      }
    }).catch(() => {
      if (cancelFn) {
          cancelFn()
      }
    })
  }
}