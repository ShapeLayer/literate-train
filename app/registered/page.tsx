'use client'
'use strict'
import { getCookie } from 'cookies-next'
import { useState, useEffect } from 'react'

const styles = {
  title: 'mb-3 text-2xl font-bold',
  subtitle: 'mb-2 text-1.5xl font-semibold',
  section: {
    wrapper: 'mb-6',
    subwrapper: 'mb-4',
    title: 'mb-2 text-2xl font-semibold',
    subtitle: 'mb-2 text-1.5xl font-semibold',
  },
  input: {
    wrapper: 'mb-2 relative',
    label: {
      label: 'blockmb-2 text-sm font-medium text-gray-900 dark:text-white'
    },
    input: {
      input: `
        block
        bg-gray-50
        border border-gray-300
        text-gray-900 text-sm
        rounded-lg
        focus:ring-blue-500 focus:border-blue-500 
        w-full p-2.5
        dark:bg-gray-700
        dark:border-gray-600
        dark:placeholder-gray-400 dark:text-white
        dark:focus:ring-blue-500 dark:focus:border-blue-500
      `,
      wrapper: 'flex gap-2'
    },
    sideButton: `
      rounded-lg
      bg-blue-700
      w-20
      p-2.5
      text-center text-sm font-medium text-white
      hover:bg-blue-800
      focus:outline-none
      focus:ring-4 focus:ring-blue-300
      dark:bg-blue-600
      dark:hover:bg-blue-700 dark:focus:ring-blue-800
    `
  },
  paragraph: `m-0 max-w-[50ch] text-sm opacity-80 mb-2`
}

export default function Registered() {
  const [handleState, setHandleState] = useState<string>('')
  const [addressState, setAddressState] = useState<string>('')
  const [codeState, setCodeState] = useState<string>('')

  useEffect(() => {
    const handle = getCookie('handle')
    const address = getCookie('address')
    const loginCode = getCookie('loginCode')
    setHandleState(typeof handle === 'string' ? handle : '로드 중')
    setAddressState(typeof address === 'string' ? address : '로드 중')
    setCodeState(typeof loginCode === 'string' ? loginCode : '로드 중')
  })
  return (
    <main className="registered flex flex-col items-center justify-between">
      {/* hero */}
      <div className={styles.section.wrapper}>
        <h1 className={styles.title}>대회 등록 완료</h1>
        <h2 className={styles.subtitle}>'23 전남대학교 PIMM 알고리즘 파티</h2>
        <p className={styles.paragraph}>대회 교내 순위 집계 등록이 완료되었습니다.</p>
        {/*<p className={styles.paragraph}>아래 로그인 코드를 꼭 기억하세요! 등록 정보 수정, 등록 철회에 사용됩니다.</p>*/}
        <p className={styles.paragraph}>등록 정보 수정, 등록 철회, 문의 사항은 <a href="mailto:me@jonghyeon.me">me@jonghyeon.me</a>에 메일을 보내주세요.</p>      </div>

      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">대회 등록 정보</h3>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">백준 온라인 저지 아이디</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{handleState}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">학교 이메일</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{addressState}</dd>
          </div>
          {/*
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">로그인 코드</dt>
            <dd className="mt-1 text-sm font-medium leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{codeState}</dd>
          </div>
          */}
        </dl>
      </div>
    </main>
  )
}
