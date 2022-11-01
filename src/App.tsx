import axios from 'axios';
import { Component, createSignal } from 'solid-js';
// 答案数据
type AnswerData = {
  question: string;
  answers: string[];
  from: string;
  title: string;
  type: 'unknown' | 'blank' | 'choice' | 'judge';
};
// 响应数据
type ResponseData = {
  data: AnswerData;
  errno: number;
  message: string;
};
// 默认值
const defaultAnswerData: AnswerData = {
  question: '暂无',
  answers: ['暂无'],
  from: '暂无',
  title: '',
  type: 'unknown',
};
// 答案数据
const [answerData, setAnswerData] = createSignal<AnswerData>(defaultAnswerData);
// 加载
const [loading, setLoading] = createSignal(false);
// 清除按钮显示
const [show, setShow] = createSignal(false);
// 输入框
let inputEle: HTMLInputElement;
// 题型
const questionTypes = {
  unknown: '未知',
  choice: '选择',
  blank: '填空',
  judge: '判断',
};
// 获取答案
const handleGetAnswer = async (question: string) => {
  // 加载中
  setLoading(true);
  const res = await axios.post<ResponseData>(
    'https://api.answer.uu988.xyz/answer/search',
    JSON.stringify({ question }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const { data, errno } = res.data;
  // 加载完成
  setLoading(false);
  if (errno !== -1) {
    return data;
  }
};
/**
 * @description 处理搜索
 */
const handleSearch = async () => {
  if (inputEle) {
    const { value } = inputEle;
    // 问题
    const question = value.trim();
    if (question) {
      const res = await handleGetAnswer(question);
      if (res) {
        setAnswerData(res);
        return;
      }
    }
    setAnswerData(defaultAnswerData);
  }
};
/**
 * @description 聚集
 */
const handleFocus = () => {
  if (inputEle) {
    const { value } = inputEle;
    setShow(!!value.length);
  }
};
/**
 * @description 输入
 */
const handleInput = () => {
  if (inputEle) {
    const { value } = inputEle;
    setShow(!!value.length);
  }
};
/**
 * @description 聚焦
 */
const handleBlur = () => {
  // setShow(false);
};
/**
 * @description 清空输入
 */
const handleClear = () => {
  if (inputEle) {
    inputEle.value = '';
    setShow(false);
  }
};
// APP
const App: Component = () => {
  return (
    <div class="bg-gradient-to-b from-blue-400 to-white text-base">
      <div class="flex flex-col items-center pt-24 md:pt-52">
        <div class="text-4xl text-white pb-4 font-light">搜题 API</div>
        <div
          class={`flex items-stretch ${
            loading() ? 'animate-pulse pointer-events-none' : ''
          }`}
        >
          <div class="bg-white text-white bg-opacity-20 rounded-tl rounded-bl backdrop-blur flex items-center md:rounded">
            <input
              class="bg-transparent pl-3 py-2 outline-none w-1/2 max-w-md placeholder-white placeholder-opacity-75 min-w-[17rem] sm:min-w-[20rem] md:min-w-[25rem] "
              type="text"
              placeholder="搜索题目"
              ref={inputEle}
              autofocus
              onFocus={handleFocus}
              onInput={handleInput}
              onBlur={handleBlur}
            />
            <button
              type="button"
              class={`text-white px-2 grid place-items-center h-full ${
                show() ? 'visible' : 'invisible'
              }`}
              onClick={handleClear}
            >
              <i class="overflow-hidden w-[1em] h-[1rem] inline-block">
                <svg
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  class="w-full h-full"
                >
                  <path d="M563.2 512l243.712-243.712a34.304 34.304 0 1 0-51.2-51.2L512 460.8 268.288 219.648a34.304 34.304 0 0 0-51.2 51.2L460.8 512l-241.152 243.712a34.304 34.304 0 0 0 51.2 51.2L512 563.2l243.712 243.712a34.304 34.304 0 1 0 51.2-51.2z"></path>
                </svg>
              </i>
            </button>
          </div>
          <div class="p-0.5 rounded-tr rounded-br bg-white bg-opacity-20 md:p-0 md:pl-2 md:bg-transparent">
            <button
              type="button"
              class="bg-blue-400 text-white grid place-items-center h-full py-0 px-2.5 rounded active:opacity-80 md:border-2 md:border-white md:border-opacity-40 outline-none"
              onClick={handleSearch}
              disabled={loading()}
            >
              <i class="overflow-hidden w-[1em] h-[1rem] inline-block">
                <svg
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  class="w-full h-full"
                >
                  <path d="M426.666667 853.333333C191.146667 853.333333 0 662.442667 0 426.666667S191.146667 0 426.666667 0s426.666667 190.890667 426.666666 426.666667-191.146667 426.666667-426.666666 426.666666z m-4.053334-89.386666a341.333333 341.333333 0 1 0 0-682.666667 341.333333 341.333333 0 0 0 0 682.666667z"></path>
                  <path d="M695.168 755.498667a42.666667 42.666667 0 0 1 60.330667-60.330667l256 256a42.666667 42.666667 0 0 1-60.330667 60.330667l-256-256z"></path>
                </svg>
              </i>
            </button>
          </div>
        </div>
      </div>
      <div
        class={`px-5 py-10 flex justify-center ${
          loading() ? 'animate-pulse' : ''
        }`}
      >
        <div class=" bg-white bg-opacity-50 rounded-md px-3 py-2 backdrop-blur max-w-xl w-4/5 min-w-[20rem]">
          <div class="text-blue-500">
            <div class="py-1 flex justify-between items-center h-8">
              <span class="text-white rounded-lg bg-blue-400 px-2 py-0.5 text-xs">
                <span class="">{questionTypes[answerData().type]}</span>
                <span class="px-1">/</span>
                <span class="capitalize opacity-70">{answerData().type}</span>
              </span>
              {loading() && (
                <svg
                  class="animate-spin h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
            </div>
            <div class="py-1">
              <span>答案：</span>
              {answerData().answers.map((answer, i, arr) => (
                <span class="font-bold">
                  <span class="underline break-all">{answer}</span>
                  {i === arr.length - 1 || <span>，</span>}
                </span>
              ))}
            </div>
            <div class="py-1">
              <span>题目：</span>
              <span class="break-all">{answerData().question}</span>
            </div>
            <div class="pt-2 text-sm sm:text-right opacity-80">
              <span>来源：</span>
              <a
                class="opacity-80 underline px-1 break-all"
                href={answerData().from}
                target="blank"
              >
                {answerData().from}
              </a>
              <span>{answerData().title}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center px-5 md:py-10">
        <div class="bg-blue-400 px-4 py-2 rounded text-white backdrop-blur max-w-xl w-4/5 min-w-[20rem] break-all text-base">
          <div class="flex items-center">
            <i class="overflow-hidden w-[1em] h-[1em] inline-block text-lg">
              <svg
                class="w-full h-full"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <path d="M512 992C246.912 992 32 777.088 32 512 32 246.912 246.912 32 512 32c265.088 0 480 214.912 480 480 0 265.088-214.912 480-480 480zM480 256v352a32 32 0 0 0 64 0V256a32 32 0 0 0-64 0z m-16 528a48 48 0 1 0 96 0 48 48 0 0 0-96 0z"></path>
              </svg>
            </i>
            <span class="pl-1 font-bold">提示</span>
          </div>
          <div class="py-2">
            答案均来自整合第三方的接口，在此仅做展示，如有侵权，请联系：
            <a href="mailto:1627295329@qq.com" class="underline">
              1627295329@qq.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
