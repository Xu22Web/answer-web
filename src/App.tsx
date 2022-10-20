import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import axios from 'axios';

// 防抖
const debounce: <T extends any[], K>(
  callback: (...args: T) => Promise<K>,
  delay: number
) => (...args: T) => Promise<K> = (callback, delay) => {
  // 定时器
  let timer: any;
  return function (this: any, ...args) {
    return new Promise((resolve) => {
      // 清除定时器
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        resolve(callback.apply(this, args));
      }, delay);
    });
  };
};

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

// 获取答案
const handleGetAnswer = debounce(async (question: string) => {
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
  if (errno !== -1) {
    return data;
  }
}, 1000);

// 处理输入
const handleInput = async (e: InputEvent) => {
  if (e.target) {
    const { value } = e.target as HTMLInputElement;
    if (value) {
      const res = await handleGetAnswer(value.trim());
      if (res) {
        setAnswerData(res);
        return;
      }
    }
    setAnswerData(defaultAnswerData);
  }
};

// 题型
const questionTypes = {
  unknown: '未知',
  choice: '选择',
  blank: '填空',
  judge: '判断',
};

const App: Component = () => {
  return (
    <div class="bg-gradient-to-b from-blue-400 h-screen">
      <div class="flex flex-col items-center pt-24 md:pt-52">
        <div class="text-4xl text-white pb-4 font-light">搜题 API</div>
        <input
          class="bg-white text-white bg-opacity-20 outline-none px-5 py-2 rounded backdrop-blur w-1/2 max-w-md min-w-[20rem] placeholder-white placeholder-opacity-75"
          type="text"
          onInput={handleInput}
          placeholder="搜索题目"
        />
      </div>
      <div class="px-5 py-10 flex justify-center">
        <div class="bg-white bg-opacity-50 rounded-md px-3 py-2 backdrop-blur max-w-xl w-4/5 min-w-[20rem]">
          <div class="text-blue-500">
            <div class="py-1">
              <span class="text-white rounded-lg bg-blue-400 px-2 py-0.5 text-xs">
                <span class="">{questionTypes[answerData().type]}</span>
                <span class="px-1">/</span>
                <span class="capitalize opacity-80">{answerData().type}</span>
              </span>
            </div>
            <div class="py-1">
              <span>答案：</span>
              {answerData().answers.map((answer, i, arr) => (
                <span class="font-bold">
                  <span class="underline">{answer}</span>
                  <span>{i === arr.length - 1 || '，'}</span>
                </span>
              ))}
            </div>
            <div class="py-1">
              <span>题目：</span>
              <span>{answerData().question}</span>
            </div>
            <div class="pt-2 text-sm sm:text-right opacity-80">
              <span>来源：</span>
              <a
                class="opacity-80 underline px-1 break-all"
                href={answerData().from}
              >
                {answerData().from}
              </a>
              <span>{answerData().title}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
