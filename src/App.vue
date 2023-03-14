<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useWindowSize } from '@vueuse/core';

const canvasRef = $ref<HTMLCanvasElement | null>(null);

const WIDTH = 600;
const HEIGHT = 600;
const MIN_DEPTH = 5;

interface Point {
  x: number,
  y: number
}

interface Branch {
  start: Point,
  length: number,
  theta: number
}

/**
 * 初始化canvas
 * @returns {{ctx: any}}
 */
function initCanvas() {
  const size = reactive(useWindowSize());
  const { width, height } = size;

  const ctx = canvasRef!.getContext('2d')!;

  canvasRef!.style.width = `${ width }px`;
  canvasRef!.style.height = `${ height }px`;
  canvasRef!.width = width;
  canvasRef!.height = height;

  return { ctx }
}

function init() {
  const { ctx } = initCanvas();
  ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';

  // 初始值
  const branch: Branch = {
    start: { x: WIDTH / 2, y: HEIGHT },
    length: 1,
    theta: -Math.PI / 2
  };
  step(branch);
}

// 递归 -> 堆栈
const pendingTasks: Function[] = [];

/**
 * 递归 -> 每一步
 * @param {Branch} b 树枝
 * @param depth 保底生长深度
 */
function step(b: Branch, depth = 0) {
  const end = getEndPoint(b);
  drawBranch(b);

  if (depth < MIN_DEPTH || Math.random() < 0.5) {
    const leftBranch: Branch = {
      start: end,
      length: b.length + (Math.random() * 10 - 5),
      theta: b.theta - 0.3 * Math.random()
    };
    pendingTasks.push(() => step(leftBranch, depth + 1));
  }

  if (depth < MIN_DEPTH || Math.random() < 0.5) {
    const rightBranch: Branch = {
      start: end,
      length: b.length + (Math.random() * 10 - 5),
      theta: b.theta + 0.3 * Math.random()
    };
    pendingTasks.push(() => step(rightBranch, depth + 1));
  }
}

/**
 * 遍历调用每一步
 */
function frame() {
  const tasks = [...pendingTasks];
  pendingTasks.length = 0;
  tasks.forEach(fn => fn());
}

// 计数器
let framesCount = 0;

/**
 * 动画
 */
function startFrame() {
  requestAnimationFrame(() => {
    framesCount++;
    // 10帧调一次
    if (framesCount % 10 === 0)
      frame();
    startFrame();
  });
}

startFrame();

/**
 * 连接两点成线
 * @param {Point} p1 点1
 * @param {Point} p2 点2
 */
function lineTo(p1: Point, p2: Point) {
  ctx.beginPath(); // Start a new path
  ctx.moveTo(p1.x, p1.y); // Move the pen to (30, 50)
  ctx.lineTo(p2.x, p2.y); // Draw a line to (150, 100)
  ctx.stroke(); // Render the path
}

/**
 * 根据树枝算出结束点的坐标
 * @param {Branch} b 树枝
 * @returns {{x: number, y: number}} 结束点坐标
 */
function getEndPoint(b: Branch): Point {
  return {
    x: b.start.x + b.length * Math.cos(b.theta),
    y: b.start.y + b.length * Math.sin(b.theta)
  };
}

/**
 * 根据树枝的配置开始画线
 * @param {Branch} l 树枝
 */
function drawBranch(l: Branch) {
  lineTo(l.start, getEndPoint(l));
}

onMounted(() => {
  init();
});

</script>

<template>
  <div>
    <canvas ref="canvasRef" width="600" height="600"></canvas>
    <svg-icon name="plum" size="5em" />
    <h1>梅开二度</h1>
  </div>
</template>

<style lang="scss" scoped>
div {
  display: flex;
  align-items: center;

  :deep(.svg-icon) {
    margin-right: 12px;
  }

  canvas {
    border: 2px solid rgba(128, 128, 128, 0.5);
  }
}
</style>
