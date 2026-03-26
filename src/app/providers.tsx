'use client'

import { Provider } from 'react-redux'
import { store } from '@/stores/store'
import { useEffect } from 'react'
import carApi from '@/services/carApi'
import brandApi from '@/services/brandApi'

function PrefetchOnMount() {
  useEffect(() => {
    // prefetch หน้าแรกของรถและแบรนด์ทันทีเมื่อแอปโหลด
    store.dispatch(
      carApi.util.prefetch('getCarAll', { pageNumber: 1, pageSize: 8 }, { force: false })
    )
    store.dispatch(
      brandApi.util.prefetch('getBrandAll', { pageNumber: 1, pageSize: 100 }, { force: false })
    )
  }, [])
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PrefetchOnMount />
      {children}
    </Provider>
  )
}