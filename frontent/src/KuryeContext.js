import React, { createContext, useState, useEffect, useRef } from 'react'
import { SnackbarProvider, useSnackbar } from 'notistack'
import kuryeService from '../services/kurye.service'
export const KuryeContext = createContext()

var currentUser = JSON.parse(sessionStorage.getItem('currentUser'))

const WS_BASE_URL = process.env.REACT_APP_WS_BASE_URL

const newToken = currentUser ? currentUser.r_token : ''

let wsUrl = `${WS_BASE_URL}ws/restoran/?token=${newToken}`

function AddSortKey(state) {
   if (state == 1) {
      return 1
   } else if (state == 2) {
      return 3
   } else if (state == 3) {
      return 2
   } else if (state == 4) {
      return 4
   } else if (state == 5) {
      return 5
   } else {
      return null
   }
}

function pushUniqueArray(arrr, item) {
   item['updated_at'] = item.updated_at ? new Date(item.updated_at) : new Date()
   item['sortKey'] = AddSortKey(item.state)
   var arr = [...arrr]
   var index = arr.findIndex((x) => x.pk == item.pk)
   if (index === -1) {
      arr.push(item)
   } else {
      arr[index] = item
   }
   arr = arr.filter((item) => item.state !== '0')
   // arr.sort(function(a, b){return a.sortKey - b.sortKey});

   arr.sort(function (a, b) {
      return a.sortKey - b.sortKey || a['queue'] - b['queue']
   })

   return arr
}

const KuryeProvider = (props) => {
   const { enqueueSnackbar } = useSnackbar()
   const [socket, setSocket] = useState('')
   const [errorNetwork, seterrorNetwork] = useState(true)
   const [errorMessage, seterrorMessage] = useState('')
   const [kuryeler, setKuryeler] = useState([])
   const [packageAcceptReject, setPackageAcceptReject] = useState({})
   const esaiRef = useRef([])
   const esaiAcceptRejectPackage = useRef({})

   // const notificationDenemesi = variant => () => {
   //     // variant could be success, error, warning, info, or default
   //     enqueueSnackbar('This is a success message!', { variant });
   //   };

   const runSocket = (_) => {
      console.log('runSocket')
      const sw = new WebSocket(wsUrl)
      setSocket(sw)

      sw.onopen = function () {
         console.log('ws connected')
         enqueueSnackbar('Baglantı Kuruldu (ws)', {
            variant: 'success',
            preventDuplicate: true,
         })
         //sw.send(JSON.stringify(subscribeMsg));
      }

      sw.onmessage = (msg) => {
         let msgdata = JSON.parse(msg.data)
         console.log(msgdata)
         if (msgdata.type == 'accept_reject') {
            if (msgdata.data.kabul_ettimi) {
               console.log('KURYE PAKETİ kabul ETTİ')
               enqueueSnackbar('KURYE PAKETİ kabul ETTİ', {
                  variant: 'success',
                  preventDuplicate: true,
               })
            } else {
               console.log('KURYE PAKETİ RET ETTİ')
               enqueueSnackbar('KURYE PAKETİ RET ETTİ', {
                  variant: 'error',
                  preventDuplicate: true,
               })
            }

            esaiAcceptRejectPackage.current = msgdata.data
            setPackageAcceptReject(esaiAcceptRejectPackage.current)
         } else {
            msgdata = msgdata.data
            esaiRef.current = pushUniqueArray(esaiRef.current, msgdata)
            console.log('ws onmessage', msgdata)
            setKuryeler(esaiRef.current)
         }
      }
      sw.onerror = (e) => {
         console.error('ws onerror')
         enqueueSnackbar('Baglantıda Sorun Var (wsoe)', {
            variant: 'error',
            preventDuplicate: true,
         })
         console.error(e)
         sw.close()
      }

      sw.onclose = (e) => {
         console.warn('ws onclose')
         enqueueSnackbar('İnternet Baglantısı Kesildi (wsoc)', {
            variant: 'error',
            preventDuplicate: true,
         })
         console.warn(e)
         setTimeout(runSocket, 10000)
      }
   }

   const disableSocket = (_) => {
      if (socket) {
         socket.close()
         console.log('ws disableSocket')
      }
   }

   const addKurye = (name, price) => {
      // const product = [...context,{ id:10,name:name,price:price}];
      // setContext(product);
      alert('tanımlama yapınız')
   }

   const getChain = () => {
      kuryeService.chain_get_courier_list().then((response) => {
         if (response.success) {
            esaiRef.current = []
            for (let index = 0; index < response.response.length; index++) {
               const element = response.response[index]
               esaiRef.current = pushUniqueArray(esaiRef.current, element)
            }
            //esaiRef.current = response.response
            setKuryeler(esaiRef.current)
         }
      })
   }

   useEffect(() => {
      // setInterval(() => {
      //     console.log("check internet")
      //     if(errorNetwork!=navigator.onLine){
      //         seterrorNetwork(navigator.onLine)
      //     }
      //  }, 5000);

      window.addEventListener('online', function (e) {
         console.log('online')
         seterrorNetwork(true)
      })
      window.addEventListener('offline', function (e) {
         console.log('offline')
         seterrorNetwork(false)
      })

      if (errorNetwork) {
         if (parseInt(sessionStorage.getItem('userType')) == 2) {
            getChain()
         } else {
            if (currentUser.restaurant.is_active) {
               kuryeService.list().then((response) => {
                  if (response.success) {
                     for (
                        let index = 0;
                        index < response.response.length;
                        index++
                     ) {
                        const element = response.response[index]
                        esaiRef.current = pushUniqueArray(
                           esaiRef.current,
                           element
                        )
                     }
                     //esaiRef.current = response.response
                     setKuryeler(esaiRef.current)
                  }
               })
               runSocket()
            } else {
               seterrorMessage(
                  'Restoranınız Aktif Degildir. Lütfen Yetkili Kişiler İle İletişime Geçiniz.'
               )
            }
         }
      } else {
         enqueueSnackbar('İnternet Baglantısını kontrol ediniz', {
            variant: 'error',
            preventDuplicate: true,
         })
         disableSocket()
      }

      return () => {
         window.removeEventListener('online', function (e) {
            console.log('removeEventListener online')
         })
         window.removeEventListener('offline', function (e) {
            console.log('removeEventListener offline')
         })
         disableSocket()
      }
   }, [errorNetwork])

   // setInterval(()=>{ seterrorNetwork(errorNetwork);console.log("errorNetwork") }, 5000);

   return (
      <KuryeContext.Provider
         value={{
            kuryeler,
            setKuryeler,
            addKurye,
            packageAcceptReject,
            errorNetwork,
            getChain,
            errorMessage,
         }}
      >
         {props.children}
      </KuryeContext.Provider>
   )
}

export default KuryeProvider
