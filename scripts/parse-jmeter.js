#!/usr/bin/env node
/**
 * Parse JMeter JTL (CSV) and output a compact Markdown performance summary.
 * Usage: node scripts/parse-jmeter.js perf/jmeter-results.jtl
 */
import { readFileSync } from 'node:fs';

function percentile(arr, p) {
  if (!arr.length) return 0;
  const idx = Math.ceil((p / 100) * arr.length) - 1;
  return arr[Math.min(Math.max(idx, 0), arr.length - 1)];
}

function formatMs(ms) {
  return ms.toFixed(0) + ' ms';
}

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Missing JTL file path');
    process.exit(1);
  }
  const raw = readFileSync(file, 'utf8').trim();
  const lines = raw.split(/\r?\n/).filter(l => l && !l.startsWith('timeStamp'));
  const samples = lines.map(line => {
    const parts = line.split(',');
    return {
      time: Number(parts[1]), // elapsed
      success: parts[7] === 'true'
    };
  });
  samples.sort((a, b) => a.time - b.time);
  const times = samples.map(s => s.time);
  const ok = samples.filter(s => s.success).length;
  const fail = samples.length - ok;
  const total = samples.length;
  const avg = times.reduce((a, b) => a + b, 0) / (times.length || 1);
  const p90 = percentile(times, 90);
  const p95 = percentile(times, 95);
  const p99 = percentile(times, 99);
  const max = times[times.length - 1] || 0;
  const min = times[0] || 0;
  const successRate = total ? (ok / total) * 100 : 0;

  const md = `## JMeter Summary\n\n` +
    `Samples: ${total}\n` +
    `Success: ${ok} (${successRate.toFixed(2)}%)\n` +
    `Failures: ${fail}\n\n` +
    `Latency (elapsed):\n` +
    `- Min: ${formatMs(min)}\n` +
    `- Avg: ${formatMs(avg)}\n` +
    `- P90: ${formatMs(p90)}\n` +
    `- P95: ${formatMs(p95)}\n` +
    `- P99: ${formatMs(p99)}\n` +
    `- Max: ${formatMs(max)}\n`;

  console.log(md);
}

main();
