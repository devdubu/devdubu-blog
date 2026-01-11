---
시작 날짜: 2025-07-07
종료 날짜: 2025-07-07
sticker: vault//이미지/개발 로고/TechIconSVG/JavaScript.svg

slug: "Composable-문법"
---


# Composable 문법 X
```ts
import Swal, { type SweetAlertResult } from 'sweetalert2'

interface ICMessagebox {
	success: (title: string, message?: string) => Promise<void>
	question: (title: string, message?: string) => Promise<SweetAlertResult<any>>
	error: (title: string, message?: string) => Promise<SweetAlertResult<any>>
	warning: (title: string, message?: string) => Promise<SweetAlertResult<any>>
	info: (title: string, message?: string) => Promise<SweetAlertResult<any>>
}

  

export const useMessagebox = async () => {
	let rtnMessagebox: ICMessagebox = {
		success: async (_title: string, _message?: string) => {},
		question: async (_title: string, _message?: string) => {
		return {
			isConfirmed: false,
			isDenied: false,
			isDismissed: false,
		}
	},

error: async (_title: string, _message?: string) => {

return {

isConfirmed: false,

isDenied: false,

isDismissed: false,

}

},

warning: async (_title: string, _message?: string) => {

return {

isConfirmed: false,

isDenied: false,

isDismissed: false,

}

},

info: async (_title: string, _message?: string) => {

return {

isConfirmed: false,

isDenied: false,

isDismissed: false,

}

},

}

  

if (import.meta.client) {

rtnMessagebox = {

success: async (title: string, message?: string) => {

Swal.fire({

title: title ?? '',

text: message ?? '',

icon: 'success',

confirmButtonText: '확인',

allowOutsideClick: false,

customClass: {

confirmButton: 'btn btn_main large',

},

heightAuto: false,

})

},

question: async (title: string, message?: string) =>

Swal.fire({

title: title ?? '',

text: message ?? '',

showCancelButton: true,

confirmButtonText: '확인',

cancelButtonText: '취소',

icon: 'question',

allowOutsideClick: false,

customClass: {

confirmButton: 'btn btn_main large',

cancelButton: 'btn btn_normal large',

},

heightAuto: false,

}),

error: async (title: string, message?: string) =>

Swal.fire({

title: title ?? '',

text: message ?? '',

confirmButtonText: '확인',

icon: 'error',

allowOutsideClick: false,

customClass: {

confirmButton: 'btn btn_main large',

},

heightAuto: false,

}),

warning: async (title: string, message?: string) =>

Swal.fire({

title: title ?? '',

text: message ?? '',

confirmButtonText: '확인',

icon: 'warning',

allowOutsideClick: false,

customClass: {

confirmButton: 'btn btn_main large',

},

heightAuto: false,

}),

info: async (title: string, message?: string) =>

Swal.fire({

title: title ?? '',

text: message ?? '',

confirmButtonText: '확인',

icon: 'info',

allowOutsideClick: false,

customClass: {

confirmButton: 'btn btn_main large',

},

heightAuto: false,

}),

}

}

  

return rtnMessagebox

}
```
# Composable 문법
```ts
import Swal, { type SweetAlertResult } from 'sweetalert2'

  

interface ICMessagebox {

success: (title: string, message?: string) => Promise<SweetAlertResult<any>>

question: (title: string, message?: string) => Promise<SweetAlertResult<any>>

error: (title: string, message?: string) => Promise<SweetAlertResult<any>>

warning: (title: string, message?: string) => Promise<SweetAlertResult<any>>

info: (title: string, message?: string) => Promise<SweetAlertResult<any>>

}

  

export const useMessageBox = (): ICMessagebox => {

// 클라이언트 환경에서만 SweetAlert2를 사용하도록 `import.meta.client`를 활용합니다.

// 서버 사이드 렌더링(SSR) 시에는 Swal 객체가 존재하지 않아 오류가 발생할 수 있습니다.

if (import.meta.client) {

return {

success: async (title: string, message?: string): Promise<SweetAlertResult> => {

return Swal.fire({

title: title ?? '',

text: message ?? '',

icon: 'success',

confirmButtonText: '확인',

allowOutsideClick: false,

customClass: {

confirmButton: 'btn btn_main large',

},

heightAuto: false,

})

},

question: async (title: string, message?: string): Promise<SweetAlertResult> => {

return Swal.fire({

title: title ?? '',

text: message ?? '',

showCancelButton: true,

confirmButtonText: '확인',

cancelButtonText: '취소',

icon: 'question',

allowOutsideClick: false,

customClass: {

confirmButton: 'btn btn_main large',

cancelButton: 'btn btn_normal large',

},

heightAuto: false,

})

},

error: async (title: string, message?: string): Promise<SweetAlertResult> => {

return Swal.fire({

title: title ?? '',

text: message ?? '',

confirmButtonText: '확인',

icon: 'error',

allowOutsideClick: false,

customClass: {

confirmButton: 'btn btn_main large',

},

heightAuto: false,

})

},

warning: async (title: string, message?: string): Promise<SweetAlertResult> => {

return Swal.fire({

title: title ?? '',

text: message ?? '',

confirmButtonText: '확인',

icon: 'warning',

allowOutsideClick: false,

customClass: {

confirmButton: 'btn btn_main large',

},

heightAuto: false,

})

},

info: async (title: string, message?: string): Promise<SweetAlertResult> => {

return Swal.fire({

title: title ?? '',

text: message ?? '',

confirmButtonText: '확인',

icon: 'info',

allowOutsideClick: false,

customClass: {

confirmButton: 'btn btn_main large',

},

heightAuto: false,

})

},

}

} else {

// SSR 환경에서는 빈 함수를 반환하여 오류를 방지합니다.

// 실제로는 클라이언트에서만 사용될 것이므로, 이 부분은 크게 중요하지 않을 수 있습니다.

// 하지만 안전을 위해 더미 함수를 제공하는 것이 좋습니다.

return {

success: async () => ({ isConfirmed: false, isDenied: false, isDismissed: true }) as SweetAlertResult,

question: async () => ({ isConfirmed: false, isDenied: false, isDismissed: true }) as SweetAlertResult,

error: async () => ({ isConfirmed: false, isDenied: false, isDismissed: true }) as SweetAlertResult,

warning: async () => ({ isConfirmed: false, isDenied: false, isDismissed: true }) as SweetAlertResult,

info: async () => ({ isConfirmed: false, isDenied: false, isDismissed: true }) as SweetAlertResult,

}

}

}
```