<template>
  <v-app>
    <div class="app-bg" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
html, body, #app {
  margin: 0;
  min-height: 100vh;
  background: #0a0e1a;
}

.app-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 80% 50% at 20% 40%, rgba(0, 229, 255, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 80% 60%, rgba(176, 38, 255, 0.08) 0%, transparent 50%),
    linear-gradient(180deg, #0a0e1a 0%, #0d1220 100%);
}

.v-main {
  position: relative;
  z-index: 1;
}

.glow-card {
  background: rgba(17, 24, 39, 0.85) !important;
  border: 1px solid rgba(0, 229, 255, 0.15);
  box-shadow:
    0 0 40px rgba(0, 229, 255, 0.06),
    0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
}

.neon-text {
  background: linear-gradient(90deg, #00e5ff, #b026ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mono {
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  letter-spacing: 0.05em;
}
</style>
