import Swal from 'sweetalert2';

// ...

// 函數 showAlertWithAction 接受一個消息和一個將在點擊確定後執行的方法作為參數
export const showAlertWithAction = (message: string, method: () => void) => {
  Swal.fire({
    title: '提醒',
    text: message,
    icon: 'warning',
    showCancelButton: false,
    confirmButtonText: '確定',
  }).then((result) => {
    if (result.isConfirmed && method) {
      method();
    }
  });
};

// 函數 showAlertWithConfirmAndCancel 接受一個消息和一個將在點擊確定後執行的方法作為參數
export const showAlertWithConfirmAndCancel = (message: string, confirmMethod: () => void) => {
  Swal.fire({
    title: '確認操作',
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: '確定',
    cancelButtonText: '取消',
  }).then((result) => {
    if (result.isConfirmed && confirmMethod) {
      confirmMethod();
    }
  });
};

// ...
