<script setup lang="ts">
import { onMounted } from 'vue';

const el = $ref<HTMLCanvasElement>();
const ctx = $computed(() => el!.getContext('2d')!);

const WIDTH = 600;
const HEIGHT = 600;

interface Point {
  x: number,
  y: number
}

interface Branch {
  start: Point,
  length: number,
  theta: number
}

function init() {
  // ctx.strokeStyle = '#fff';

  const branch: Branch = {
    start: {
      x: WIDTH / 2,
      y: HEIGHT
    },
    length: 100,
    theta: -Math.PI / 2
  };
  drawBranch(branch);
}

function lineTo(p1: Point, p2: Point) {
  ctx.beginPath(); // Start a new path
  ctx.moveTo(p1.x, p1.y); // Move the pen to (30, 50)
  ctx.lineTo(p2.x, p2.y); // Draw a line to (150, 100)
  ctx.stroke(); // Render the path
}

function getEndPoint(b: Branch) {
  return {
    x: b.start.x + length * Math.cos(b.theta),
    y: b.start.y + length * Math.sin(b.theta)
  };
}

function drawBranch(l: Branch) {
  lineTo(l.start, getEndPoint(l));
}

onMounted(() => {
  init();
});

</script>

<template>
  <div>
    <canvas ref="el" width="600" height="600"></canvas>
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
    border: 2px solid #242424;
  }
}
</style>
