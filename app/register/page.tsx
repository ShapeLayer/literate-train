'use client'
'use strict'
import { redirect, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { setCookie } from 'cookies-next'

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

export default function Register() {
  const [handleState, setHandleState] = useState<string>('')
  const [mailState, setMailState] = useState<string>('')
  const [mailCodeState, setMailCodeState] = useState<string>('')
  const [mailInvokeState, setMailInvokeState] = useState<string>('')

  const [handleExistsState, setHandleExistsState] = useState<string>('none')
  const [mailExistsState, setMailExistsState] = useState<string>('none')

  const [failedDetailState, setFailedDetailState] = useState<string>('')

  const [handleInputBorder, setHandleInputBorder] = useState<string>('')
  const [mailInputBorder, setMailInputBorder] = useState<string>('')
  const [mailCodeInputBorder, setMailCodeInputBorder] = useState<string>('')

  const [displayLimitMailInput, setDisplayLimitMailInput] = useState<string>('block')
  const [displayUnlimitMailInput, setDisplayUnlimitMailInput] = useState<string>('none')

  const router = useRouter()

  const _requestVerifyMail = async () => {
    fetch(`/api/validate/mail?${new URLSearchParams({
      address: mailState
    })}`)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        if (data.result === 'success') {
          setMailInvokeState(`인증 코드는 ${data.EMAIL_PENDING_TIME_LIMIT}분동안 유효합니다. ${data.EMAIL_PENDING_TIME_LIMIT}분이 지나면 다시 요청하세요.`)
        } else {
          switch (data.code) {
            case 'address-required':
              setMailInvokeState('이메일을 먼저 입력하세요.')
              break
            case 'address-must-jnu':
              setMailInvokeState('이메일 주소는 전남대학교 이메일 주소 (@jnu.ac.kr)이어야합니다.')
              break
            case 'req-too-often':
              setMailInvokeState(`너무 자주 요청했습니다. ${data.EMAIL_SENDING_TIME_LIMIT}분 뒤 다시 시도하세요.`)
              break
          }
        }
      })
  }
  const invokeVerifyMail = (e: any) => {
    e.preventDefault()
    _requestVerifyMail()
  }

  const _queryHandleExists = async () => {
    if (handleState === '') return
    fetch(`/api/submission/is_registered?${new URLSearchParams({
      key: 'handle',
      value: handleState
    })}`)
    .then(res => { return res.json() })
    .then(data => {
      if (data.result === 'success') {
        if (data.detail.queried === 'found') {
          setHandleExistsState('display')
        } else {
          setHandleExistsState('none')
        }
      }
    })
  }
  const _queryMailExists = async () => {
    if (mailState === '') return
    fetch(`/api/submission/is_registered?${new URLSearchParams({
      key: 'mail',
      value: mailState
    })}`)
    .then(res => { return res.json() })
    .then(data => {
      if (data.result === 'success') {
        if (data.detail.queried === 'found') {
          setMailExistsState('display')
        } else {
          setMailExistsState('none')
        }
      }
    })
  }

  const handleOnChangeHandler = (e: any) => {
    setHandleState(e.target.value)
    _queryHandleExists()
  }
  const mailOnChangeHandler = (e: any) => {
    setMailState(e.target.value)
    _queryMailExists()
  }
  const codeOnChangeHandler = (e: any) => {
    setMailCodeState(e.target.value)
  }

  const _fetchSubmission = async () => {
    fetch('/api/submission/register', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      redirect: 'manual',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'boj-handle': handleState,
        'jnu-mail': mailState,
        'mail-code': mailCodeState
      })
    })
      .then(res => { 
        return res.json()
      })
      .then(data => {
        if (data.result === 'success') {
          setCookie('loginCode', data.loginCode)
          setCookie('handle', handleState)
          setCookie('address', mailState)
          router.replace('/registered')
        } else {
          setHandleInputBorder('')
          setMailInputBorder('')
          setMailCodeInputBorder('')
          switch (data.code) {
            case ('handle-already-submitted'):
              setHandleInputBorder('red')
              setFailedDetailState('이미 이 백준 온라인 저지 아이디는 등록되었습니다.')
              break
            case ('mail-already-submitted'):
              setMailInputBorder('red')
              setFailedDetailState('이미 이 메일 주소는 등록되었습니다.')
              break
            case ('boj-handle-required'):
              setHandleInputBorder('red')
              setFailedDetailState('백준 온라인 저지 핸들을 입력하지 않았습니다.')
              break
            case ('email-required'):
              setMailInputBorder('red')
              setFailedDetailState('이메일 주소를 입력하지 않았습니다.')
              break
            case ('code-not-issued'):
              setMailCodeInputBorder('red')
              setFailedDetailState('인증 코드가 발송되지 않은 이메일 주소입니다.')
              break
            case ('code-expired'):
              setMailCodeInputBorder('red')
              setFailedDetailState('이메일 인증 코드가 만료되었습니다.')
              break
            case ('invalid-code'):
              setMailCodeInputBorder('red')
              setFailedDetailState('유효한 이메일 인증 코드가 아닙니다.')
              break
            case ('address-required'):
              setMailCodeInputBorder('red')
              setFailedDetailState('이메일 주소가 필요합니다.')
              break
          }
        }
      })
  }
  const formOnSubmitHandler = (e: any) => {
    e.preventDefault()
    _fetchSubmission()
  }

  const _effect__isUniversityLimit = async () => {
    fetch('/api/env/is_university_limit')
    .then(res => { return res.json() })
    .then(data => {
      if (data.result === 'success') {
        setDisplayLimitMailInput(data.value ? 'block' : 'none')
        setDisplayUnlimitMailInput(data.value ? 'none' : 'block')
      }
    })
  }
  useEffect(() => {
    _effect__isUniversityLimit()
  })

  return (
    <main className="register">
      <form action="#" method="post" onSubmit={formOnSubmitHandler}>
        {/* hero */}
        <div className={styles.section.wrapper}>
          <h1 className={styles.title}>대회 재학생 순위 집계 등록</h1>
          <h2 className={styles.subtitle}>{"'"}23 전남대학교 PIMM 알고리즘 파티</h2>
          <div className={styles.section.subwrapper}>
            <p className={styles.paragraph}>
              이 폼은 백준 온라인 저지에서 진행될 {'"\''}23 전남대학교 PIMM 알고리즘 파티{'"'}의 전남대학교 재학생 참가자를 확인하기 위해 준비되었습니다.
            </p>
            <p className={styles.paragraph}>
              대회 개최자인 PIMM 알고리즘 스터디(이하 개최자)는 재학생 식별 및 대회 참여 재학생 통계, 대회 결산을 위해 {'"'}백준 온라인 저지 아이디{'"'}(이하 BOJ 핸들)와 {'"'}전남대학교 도메인 메일 주소(이하 메일 주소){'"'}를 수집합니다.
            </p>
          </div>
          <div className={styles.section.subwrapper}>
            <p className={styles.paragraph}>
              대회 결과에 따라 제공되는 상품은 메일 주소를 통해 발송됩니다.
            </p>
          </div>
          <div className={styles.section.subwrapper}>
            <p className={styles.paragraph}>
              이 폼을 제출하는 것으로 대회 진행 및 결과 통계 집계에 위 개인정보를 활용함을 동의하는 것으로 간주합니다. 개인정보는 대회 진행이 마무리되고 폐기됩니다.
            </p>
          </div>
          <div className={styles.section.subwrapper}>
            <p className={styles.paragraph}>
              등록 정보 수정, 등록 철회 및 문의 사항은 담당자(<a href="mailto:me@jonghyeon.me">me@jonghyeon.me</a>)에게 연락해주세요.
            </p>
          </div>
          {/*
          <div className={styles.section.subwrapper}>
            <p className={styles.paragraph}>
              이미 대회에 등록하신 분이라면 <Link href="/login">로그인</Link>
            </p>
          </div>*/}
        </div>

        <div className={styles.section.wrapper}>
          <h2 className={styles.section.title}>백준 온라인 저지</h2>
          <div className={styles.input.wrapper}>
            <label htmlFor="boj-handle" className={styles.input.label.label}>백준 온라인 저지 아이디 (BOJ 핸들)</label>
            <div className={styles.input.input.wrapper}>
              <input
                id="boj-handle"
                name="boj-handle"
                type="text"
                className={styles.input.input.input}
                placeholder="boj_handle"
                onChange={handleOnChangeHandler}
                style={{
                  borderColor: handleInputBorder
                }}
                required
              />
            </div>
          </div>
          <p className={styles.paragraph} style={{
            display: handleExistsState
          }}>
            이 핸들은 이미 등록된 것 같습니다. 본인이 등록한 것이 아니라면 담당자에게 메일로 문의해주세요.
          </p>
        </div>

        <div className={styles.section.wrapper}>
          <h2 className={styles.section.title}>재학생 인증</h2>
          {/* 학교 이메일로 인증 시작 */}
          <div className={styles.section.subwrapper}>
            <h3 className={styles.section.subtitle}>학교 이메일로 인증</h3>
            <div className={styles.section.subwrapper}>
              <p className={styles.paragraph}>
                메일 주소로 재학생 인증을 진행합니다. 만약 인증 메일이 오지 않는다면 정크 메일함(스팸 메일함)을 확인해보세요.
              </p>
              <p className={styles.paragraph}>
                혹은 전남대학교 이메일을 사용해 자신의 BOJ 핸들을 담당자의 이메일(<a href="mailto:me@jonghyeon.me">me@jonghyeon.me</a>)에 보내주세요.
              </p>
            </div>
            {/* 이메일 폼 */}
            <div className={styles.input.wrapper}>
              <label htmlFor="mail" className={styles.input.label.label}>학교 이메일 주소</label>
              <div className={styles.input.input.wrapper}>
                <input
                  id="mail-jnulimit"
                  name="jnu-mail"
                  type="mail"
                  className={styles.input.input.input}
                  pattern="'.*?@jnu\.ac\.kr'"
                  placeholder="name@jnu.ac.kr"
                  value={mailState}
                  onChange={mailOnChangeHandler}
                  style={{
                    borderColor: mailInputBorder,
                    display: displayLimitMailInput
                  }}
                />{/*
                <input
                  id="mail-unlimit"
                  name="jnu-mail"
                  type="mail"
                  className={styles.input.input.input}
                  placeholder="name@jnu.ac.kr"
                  value={mailState}
                  onChange={mailOnChangeHandler}
                  style={{
                    borderColor: mailInputBorder,
                    display: displayUnlimitMailInput
                  }}
                  required
                />*/}
                <button className={styles.input.sideButton} onClick={invokeVerifyMail}>인증</button>
              </div>
              <p className={styles.paragraph}>{mailInvokeState}</p>
            </div>
            <p className={styles.paragraph} style={{
              display: mailExistsState
            }}>
              이 주소는 이미 등록된 것 같습니다. 본인이 등록한 것이 아니라면 담당자에게 메일로 문의해주세요.
            </p>
            {/* 인증 코드 폼 */}
            {/*
             멘트 추가: 인증이 어려우면 메일로 재학증명서 보낼것, 정크 메일함 확인할 것
            */}
            <div className={styles.input.wrapper}>
              <label htmlFor="mail-code" className={styles.input.label.label}>인증 코드</label>
              <div className={styles.input.input.wrapper}>
                <input
                  id="mail-code"
                  name="mail-code"
                  type="text"
                  className={styles.input.input.input}
                  placeholder=""
                  onChange={codeOnChangeHandler}
                  style={{
                    borderColor: mailCodeInputBorder
                  }}
                  required
                />
              </div>
            </div>
          </div>
          {/* 학교 이메일로 인증 끝 */}
          {/* 재학 증명서로 인증 시작 */}{/*
          <div className={styles.section.subwrapper}>
            <h3 className={styles.section.subtitle}>재학증명서로 인증</h3>
            <p className={styles.paragraph}>
              이메일 인증이 어려울 경우 재학증명서를 제출하여 재학생을 인증할 수 있습니다.
            </p>
            <div className={styles.input.wrapper}>
              <div className={styles.input.input.wrapper}>
                <input
                  id="file-input"
                  type="file"
                  name="file-input"
                  className="
                    h-10
                    bg-gray-50
                    border border-gray-300
                    text-gray-900 text-sm
                    rounded-lg
                    focus:ring-blue-500 focus:border-blue-500
                    block w-full
                    p-2.5
                    dark:bg-gray-700 dark:border-gray-600
                    dark:placeholder-gray-400
                    dark:text-white
                    dark:focus:ring-blue-500 dark:focus:border-blue-500
                  "
                  placeholder=""
                />
              </div>
              <p className={styles.paragraph}>최대 10MB의 PDF, JPG, JPEG, PNG, BMP, TIF 파일 업로드 가능</p>
            </div>
          </div>*/}
          {/* 재학 증명서로 인증 끝 */}
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">제출</button>
        <p className={styles.paragraph}>
          {failedDetailState}
        </p>
      </form>
    </main>
  )
}
