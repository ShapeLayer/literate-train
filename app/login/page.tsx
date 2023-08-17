'use strict'
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

export default function Login() {
  return (
    <main className="login flex flex-col items-center justify-between">
      <form>
        {/* hero */}
        <div className={styles.section.wrapper}>
          <h1 className={styles.title}>대회 등록 수정</h1>
          <h2 className={styles.subtitle}>'23 전남대학교 PIMM 알고리즘 파티</h2>
        </div>

        {/* login form */}
        <div className={styles.section.wrapper}>
          <div className={styles.input.wrapper}>
            <label htmlFor="boj-handle" className={styles.input.label.label}>백준 온라인 저지 아이디 (BOJ 핸들)</label>
            <div className={styles.input.input.wrapper}>
              <input id="boj-handle" type="text" className={styles.input.input.input} placeholder="boj_handle" required />
            </div>
          </div>
          <div className={styles.input.wrapper}>
            <label htmlFor="boj-handle" className={styles.input.label.label}>로그인 코드</label>
            <p className={styles.paragraph}>
              로그인 코드는 등록 시 발급되었습니다. 보관하고 있던 코드를 입력하세요.
            </p>
            <div className={styles.input.input.wrapper}>
              <input id="boj-handle" type="text" className={styles.input.input.input} placeholder="" required />
            </div>
          </div>
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">로그인</button>
      </form>
    </main>
  )
}
